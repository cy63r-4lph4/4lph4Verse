// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title HireCoreJobManager
 * @notice Core onchain contract for managing jobs inside HireCore (Phase 1: direct interactions, no relayer).
 *
 * Features
 * - Job lifecycle: create, fund (ERC20/native/permit), deliver milestones, release payments, dispute/resolve, cancel.
 * - Job types: Simple (one milestone) and Milestone (multiple). (Streaming reserved)
 * - Fees: Protocol fee (bps) snapshotted at creation; discounts via badge tiers.
 * - Integrations: VerseProfile.ensureProfile(), ReputationHub logging.
 * - Safety: UUPS upgradeable, Pausable, ReentrancyGuard, token allowlist, native toggle.
 */

import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// ---------- External Interfaces ----------
import "../interfaces/IVerseProfile.sol";
import "../interfaces/IVerseReputationHub.sol";
import "../interfaces/IBadgeRegistry.sol";

interface IERC20PermitMinimal {
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;
}

contract HireCoreJobManager is
    UUPSUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable,
    AccessControlUpgradeable
{
    using SafeERC20 for IERC20;

    // ---------- Roles ----------
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant RESOLVER_ROLE = keccak256("RESOLVER_ROLE");

    // ---------- Types ----------
    enum JobStatus {
        Created,
        Funded,
        InProgress,
        Disputed,
        Completed,
        Released,
        Cancelled
    }
    enum JobType {
        Simple,
        Milestone,
        Streaming
    } // Streaming reserved (not enabled in v1)

    struct Milestone {
        uint256 amount;
        uint64 dueDate;
        bool delivered;
        bool released;
        bool requiresDeliverable;
        string deliverableURI;
        string note;
    }

    struct Job {
        address hirer;
        address worker;
        address paymentToken; // address(0) = native
        uint256 totalAmount; // agreed budget
        uint256 fundedAmount; // escrowed funds (not yet released)
        uint16 feeBpsAtCreation; // effective fee bps snapshot
        JobStatus status;
        JobType jobType;
        uint64 createdAt;
        uint64 deadline;
        string metadataURI;
        Milestone[] milestones;
    }

    struct CreateJobParams {
        address worker;
        address paymentToken;
        uint64 deadline;
        string metadataURI;
        JobType jobType;
        uint256[] amounts;
        uint64[] dueDates;
        bool[] requiresDeliverable;
    }

    // ---------- Storage ----------
    uint256 public nextJobId;
    mapping(uint256 => Job) private jobs;

    // Protocol config
    address public treasury;
    uint16 public baseFeeBps; // e.g., 300 = 3%
    uint16 public maxFeeBps; // hard cap for baseFeeBps
    // Premium fee discount (applied to snapshot at creation based on tiers)
    IBadgeRegistry public badgeRegistry;
    uint8 public minTierForDiscount;
    uint16 public workerDiscountBps; // subtract from base if worker >= minTier
    uint16 public hirerDiscountBps; // subtract from base if hirer  >= minTier
    uint256[] public tierBadgeIds;

    // Integrations
    IVerseProfile public verseProfile;
    IVerseReputationHub public reputationHub;

    // Token allowlist + native toggle
    mapping(address => bool) public allowedPaymentToken; // ERC20 allowlist
    bool public nativePaymentsEnabled;

    // ---------- Events ----------
    event JobCreated(
        uint256 indexed jobId,
        address indexed hirer,
        address indexed worker,
        JobType jobType,
        address paymentToken,
        uint256 totalAmount,
        uint16 feeBps
    );
    event JobFunded(
        uint256 indexed jobId,
        address indexed from,
        uint256 amount,
        uint256 fundedTotal
    );
    event MetadataURIUpdated(uint256 indexed jobId, string newURI);
    event MilestoneDelivered(
        uint256 indexed jobId,
        uint256 indexed milestoneIndex,
        string deliverableURI,
        string note
    );
    event MilestoneReleased(
        uint256 indexed jobId,
        uint256 indexed milestoneIndex,
        uint256 netToWorker,
        uint256 feeToTreasury
    );
    event JobDisputed(uint256 indexed jobId, string reason);
    event JobResolved(
        uint256 indexed jobId,
        uint256 workerPayout,
        uint256 hirerRefund,
        uint256 feeTaken
    );
    event JobCancelled(uint256 indexed jobId, uint256 refund);
    event TreasuryUpdated(address newTreasury);
    event FeesUpdated(
        uint16 baseFeeBps,
        uint16 workerDiscountBps,
        uint16 hirerDiscountBps,
        uint8 minTier
    );
    event BadgeRegistryUpdated(address badgeRegistry, uint256[] tierBadgeIds);
    event TokenAllowed(address token, bool allowed);
    event NativeToggle(bool enabled);
    event VerseProfileSet(address verseProfile);
    event ReputationHubSet(address hub);

    // ---------- Constructor (upgrade-safe) ----------
    constructor() {
        _disableInitializers();
    }

    // ---------- Init / Upgrade ----------
    function initialize(
        address admin,
        address treasury_,
        address verseProfile_,
        address reputationHub_,
        uint16 baseFeeBps_,
        uint16 maxFeeBps_
    ) external initializer {
        require(admin != address(0) && treasury_ != address(0), "bad init");
        __UUPSUpgradeable_init();
        __Pausable_init();
        __ReentrancyGuard_init();
        __AccessControl_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);

        treasury = treasury_;
        baseFeeBps = baseFeeBps_;
        maxFeeBps = maxFeeBps_;
        verseProfile = IVerseProfile(verseProfile_);
        reputationHub = IVerseReputationHub(reputationHub_);
        nativePaymentsEnabled = true;
        nextJobId = 1;

        emit TreasuryUpdated(treasury_);
        emit FeesUpdated(baseFeeBps_, 0, 0, 0);
        emit VerseProfileSet(verseProfile_);
        emit ReputationHubSet(reputationHub_);
    }

    function _authorizeUpgrade(
        address
    ) internal override onlyRole(ADMIN_ROLE) {}

    // Accept native funds if needed
    receive() external payable {}

    // ======================================================
    //                       Admin
    // ======================================================

    function setTreasury(address newTreasury) external onlyRole(ADMIN_ROLE) {
        require(newTreasury != address(0), "zero");
        treasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }

    function setFees(
        uint16 baseFeeBps_,
        uint16 workerDiscountBps_,
        uint16 hirerDiscountBps_,
        uint8 minTier_
    ) external onlyRole(ADMIN_ROLE) {
        require(baseFeeBps_ <= maxFeeBps, "fee>max");
        baseFeeBps = baseFeeBps_;
        workerDiscountBps = workerDiscountBps_;
        hirerDiscountBps = hirerDiscountBps_;
        minTierForDiscount = minTier_;
        emit FeesUpdated(
            baseFeeBps_,
            workerDiscountBps_,
            hirerDiscountBps_,
            minTier_
        );
    }

    function setMaxFeeBps(uint16 maxFeeBps_) external onlyRole(ADMIN_ROLE) {
        require(maxFeeBps_ >= baseFeeBps, "max<base");
        maxFeeBps = maxFeeBps_;
        // no event; max cap only guards baseFeeBps
    }

    function setBadgeRegistry(
        address reg,
        uint256[] calldata ids
    ) external onlyRole(ADMIN_ROLE) {
        badgeRegistry = IBadgeRegistry(reg);
        tierBadgeIds = ids;
        emit BadgeRegistryUpdated(reg, ids);
    }

    function allowPaymentToken(
        address token,
        bool allowed
    ) external onlyRole(ADMIN_ROLE) {
        require(token != address(0), "zero");
        allowedPaymentToken[token] = allowed;
        emit TokenAllowed(token, allowed);
    }

    function toggleNative(bool enabled) external onlyRole(ADMIN_ROLE) {
        nativePaymentsEnabled = enabled;
        emit NativeToggle(enabled);
    }

    function setVerseProfile(address vp) external onlyRole(ADMIN_ROLE) {
        verseProfile = IVerseProfile(vp);
        emit VerseProfileSet(vp);
    }

    function setReputationHub(address hub) external onlyRole(ADMIN_ROLE) {
        reputationHub = IVerseReputationHub(hub);
        emit ReputationHubSet(hub);
    }

    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    // ======================================================
    //                 Job Creation & Metadata
    // ======================================================

    /**
     * @notice Create a job. For JobType.Simple pass a single milestone via arrays len=1.
     *         For JobType.Milestone, arrays must be same length (>1).
     *
     * @param p createjobparams
     */
    function createJob(
        CreateJobParams calldata p
    ) external whenNotPaused returns (uint256 jobId) {
        _validateJob(
            p.worker,
            p.paymentToken,
            p.deadline,
            p.jobType,
            p.amounts,
            p.dueDates,
            p.requiresDeliverable
        );

        // ensure Verse profiles
        uint256 hirerVerseId = verseProfile.profileOf(_msgSender());
        require(hirerVerseId != 0, "hirer: no profile");

        uint256 workerVerseId = verseProfile.profileOf(p.worker);
        require(workerVerseId != 0, "worker: no profile");
        uint256 total = _sumAmounts(p.amounts);
        uint16 effFee = _effectiveFeeBps(_msgSender(), p.worker);

        jobId = nextJobId++;
        _initJob(
            jobId,
            p.worker,
            p.paymentToken,
            p.deadline,
            p.metadataURI,
            p.jobType,
            total,
            effFee
        );

        _addMilestones(jobId, p.amounts, p.dueDates, p.requiresDeliverable);

        emit JobCreated(
            jobId,
            _msgSender(),
            p.worker,
            p.jobType,
            p.paymentToken,
            total,
            effFee
        );
    }

    function _validateJob(
        address worker,
        address paymentToken,
        uint64 deadline,
        JobType jobType,
        uint256[] calldata amounts,
        uint64[] calldata dueDates,
        bool[] calldata requiresDeliverable
    ) internal view {
        require(worker != address(0), "bad worker");
        require(deadline > block.timestamp, "bad deadline");
        require(
            amounts.length == dueDates.length &&
                amounts.length == requiresDeliverable.length,
            "array len"
        );
        require(amounts.length > 0, "no milestones");
        if (jobType == JobType.Simple) require(amounts.length == 1, "simple=1");

        if (paymentToken == address(0)) {
            require(nativePaymentsEnabled, "native off");
        } else {
            require(allowedPaymentToken[paymentToken], "token not allowed");
        }
    }

    function _sumAmounts(
        uint256[] calldata amounts
    ) internal pure returns (uint256 total) {
        for (uint256 i = 0; i < amounts.length; i++) {
            total += amounts[i];
        }
        require(total > 0, "zero total");
    }

    function _initJob(
        uint256 jobId,
        address worker,
        address paymentToken,
        uint64 deadline,
        string calldata metadataURI,
        JobType jobType,
        uint256 total,
        uint16 effFee
    ) internal {
        Job storage j = jobs[jobId];
        j.hirer = _msgSender();
        j.worker = worker;
        j.paymentToken = paymentToken;
        j.totalAmount = total;
        j.fundedAmount = 0;
        j.feeBpsAtCreation = effFee;
        j.status = JobStatus.Created;
        j.jobType = jobType;
        j.createdAt = uint64(block.timestamp);
        j.deadline = deadline;
        j.metadataURI = metadataURI;
    }

    function _addMilestones(
        uint256 jobId,
        uint256[] calldata amounts,
        uint64[] calldata dueDates,
        bool[] calldata requiresDeliverable
    ) internal {
        Job storage j = jobs[jobId];
        for (uint256 i = 0; i < amounts.length; i++) {
            j.milestones.push(
                Milestone({
                    amount: amounts[i],
                    dueDate: dueDates[i],
                    delivered: false,
                    released: false,
                    requiresDeliverable: requiresDeliverable[i],
                    deliverableURI: "",
                    note: ""
                })
            );
        }
    }

    function updateJobMetadataURI(
        uint256 jobId,
        string calldata newURI
    ) external whenNotPaused {
        Job storage j = jobs[jobId];
        require(_msgSender() == j.hirer, "only hirer");
        j.metadataURI = newURI;
        emit MetadataURIUpdated(jobId, newURI);
    }

    // ======================================================
    //                        Funding
    // ======================================================

    function fundJob(
        uint256 jobId,
        uint256 amount
    ) external nonReentrant whenNotPaused {
        Job storage j = jobs[jobId];
        require(j.hirer != address(0), "no job");
        require(j.paymentToken != address(0), "native job");
        require(allowedPaymentToken[j.paymentToken], "token not allowed");
        require(amount > 0, "zero");
        uint256 remain = j.totalAmount - j.fundedAmount;
        require(remain > 0, "fully funded");
        if (amount > remain) amount = remain;

        IERC20(j.paymentToken).safeTransferFrom(
            _msgSender(),
            address(this),
            amount
        );
        j.fundedAmount += amount;

        _afterFundStatusTransition(j);

        emit JobFunded(jobId, _msgSender(), amount, j.fundedAmount);
    }

    function fundJobWithPermit(
        uint256 jobId,
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external nonReentrant whenNotPaused {
        Job storage j = jobs[jobId];
        require(j.hirer != address(0), "no job");
        require(j.paymentToken != address(0), "native job");
        require(allowedPaymentToken[j.paymentToken], "token not allowed");
        require(amount > 0, "zero");
        uint256 remain = j.totalAmount - j.fundedAmount;
        require(remain > 0, "fully funded");
        if (amount > remain) amount = remain;

        IERC20PermitMinimal(j.paymentToken).permit(
            _msgSender(),
            address(this),
            amount,
            deadline,
            v,
            r,
            s
        );
        IERC20(j.paymentToken).safeTransferFrom(
            _msgSender(),
            address(this),
            amount
        );
        j.fundedAmount += amount;

        _afterFundStatusTransition(j);

        emit JobFunded(jobId, _msgSender(), amount, j.fundedAmount);
    }

    function fundJobNative(
        uint256 jobId
    ) external payable nonReentrant whenNotPaused {
        Job storage j = jobs[jobId];
        require(j.hirer != address(0), "no job");
        require(j.paymentToken == address(0), "erc20 job");
        require(nativePaymentsEnabled, "native off");
        require(msg.value > 0, "zero");
        uint256 remain = j.totalAmount - j.fundedAmount;
        require(remain > 0, "fully funded");
        uint256 amount = msg.value;
        require(amount <= remain, "excess value");

        j.fundedAmount += amount;

        _afterFundStatusTransition(j);

        emit JobFunded(jobId, _msgSender(), amount, j.fundedAmount);
    }

    function _afterFundStatusTransition(Job storage j) internal {
        if (j.status == JobStatus.Created) j.status = JobStatus.Funded;
        else if (
            j.status == JobStatus.InProgress ||
            j.status == JobStatus.Disputed ||
            j.status == JobStatus.Completed
        ) {
            // keep state as-is in these cases
        }
    }

    // ======================================================
    //                Delivery / Release / Dispute
    // ======================================================

    function deliverMilestone(
        uint256 jobId,
        uint256 milestoneIndex,
        string calldata deliverableURI,
        string calldata note
    ) external whenNotPaused {
        Job storage j = jobs[jobId];
        require(_msgSender() == j.worker, "only worker");
        require(
            j.status == JobStatus.Funded || j.status == JobStatus.InProgress,
            "state"
        );
        require(milestoneIndex < j.milestones.length, "idx");

        Milestone storage m = j.milestones[milestoneIndex];
        require(!m.delivered, "already delivered");
        if (m.requiresDeliverable) {
            require(bytes(deliverableURI).length != 0, "need URI");
        }

        m.delivered = true;
        m.deliverableURI = deliverableURI;
        m.note = note;

        if (j.status == JobStatus.Funded) j.status = JobStatus.InProgress;

        emit MilestoneDelivered(jobId, milestoneIndex, deliverableURI, note);
    }

    function releaseMilestone(
        uint256 jobId,
        uint256 milestoneIndex
    ) external nonReentrant whenNotPaused {
        Job storage j = jobs[jobId];
        require(_msgSender() == j.hirer, "only hirer");
        require(
            j.status == JobStatus.InProgress ||
                j.status == JobStatus.Funded ||
                j.status == JobStatus.Completed,
            "state"
        );
        require(milestoneIndex < j.milestones.length, "idx");

        Milestone storage m = j.milestones[milestoneIndex];
        require(m.delivered && !m.released, "not deliverable");

        uint256 amt = m.amount;
        require(j.fundedAmount >= amt, "insufficient funded");
        j.fundedAmount -= amt;
        m.released = true;

        // split fee + pay out
        (uint256 fee, uint256 net) = _splitFee(j.feeBpsAtCreation, amt);
        _payout(j.paymentToken, j.worker, net);
        _payout(j.paymentToken, treasury, fee);

        emit MilestoneReleased(jobId, milestoneIndex, net, fee);

        if (address(reputationHub) != address(0)) {
            uint256 workerVerseId = verseProfile.profileOf(j.worker);
            reputationHub.logCompleted(workerVerseId, j.paymentToken, net);
        }

        // update job status
        bool allReleased = true;
        for (uint256 i = 0; i < j.milestones.length; i++) {
            if (!j.milestones[i].released) {
                allReleased = false;
                break;
            }
        }
        if (allReleased) {
            j.status = JobStatus.Released;
        } else if (j.status == JobStatus.Funded) {
            j.status = JobStatus.InProgress;
        }
    }

    function disputeJob(
        uint256 jobId,
        string calldata reason
    ) external whenNotPaused {
        Job storage j = jobs[jobId];
        require(
            _msgSender() == j.hirer || _msgSender() == j.worker,
            "only parties"
        );
        require(
            j.status == JobStatus.InProgress || j.status == JobStatus.Funded,
            "state"
        );
        j.status = JobStatus.Disputed;
        emit JobDisputed(jobId, reason);
    }

    /**
     * @notice Resolver splits currently funded escrow between worker and hirer; fee taken from worker payout.
     * @param workerPayout gross amount from funded escrow allocated to worker (fee is deducted from this)
     * @param hirerRefund  amount refunded to hirer
     */
    function resolveDispute(
        uint256 jobId,
        uint256 workerPayout,
        uint256 hirerRefund
    ) external nonReentrant whenNotPaused onlyRole(RESOLVER_ROLE) {
        Job storage j = jobs[jobId];
        require(j.status == JobStatus.Disputed, "not disputed");
        require(workerPayout + hirerRefund <= j.fundedAmount, "exceeds escrow");

        j.fundedAmount -= (workerPayout + hirerRefund);

        (uint256 fee, uint256 netToWorker) = _splitFee(
            j.feeBpsAtCreation,
            workerPayout
        );
        _payout(j.paymentToken, j.worker, netToWorker);
        _payout(j.paymentToken, treasury, fee);
        _payout(j.paymentToken, j.hirer, hirerRefund);

        j.status = JobStatus.Released; // terminal state after resolution
        emit JobResolved(jobId, netToWorker, hirerRefund, fee);

        if (address(reputationHub) != address(0)) {
            uint256 workerVerseId = verseProfile.profileOf(j.worker);
            if (netToWorker > 0) {
                reputationHub.logCompleted(
                    workerVerseId,
                    j.paymentToken,
                    netToWorker
                );
            } else {
                reputationHub.logCancelled(workerVerseId);
            }
        }
    }

    /**
     * @notice Hirer cancels the job (no dispute). Refunds remaining funded escrow to hirer.
     *         Can be used when no milestones are delivered or parties agree offchain.
     */
    function cancelJob(uint256 jobId) external nonReentrant whenNotPaused {
        Job storage j = jobs[jobId];
        require(_msgSender() == j.hirer, "only hirer");
        require(
            j.status == JobStatus.Created ||
                j.status == JobStatus.Funded ||
                j.status == JobStatus.InProgress,
            "state"
        );

        uint256 refund = j.fundedAmount;
        j.fundedAmount = 0;
        j.status = JobStatus.Cancelled;

        if (refund > 0) {
            _payout(j.paymentToken, j.hirer, refund);
        }

        emit JobCancelled(jobId, refund);

        if (address(reputationHub) != address(0)) {
            uint256 workerVerseId = verseProfile.profileOf(j.worker);
            reputationHub.logCancelled(workerVerseId);
        }
    }

    // ======================================================
    //                        Views
    // ======================================================

    function getJobCore(
        uint256 jobId
    )
        external
        view
        returns (
            address hirer,
            address worker,
            address paymentToken,
            uint256 totalAmount,
            uint256 fundedAmount,
            uint16 feeBpsAtCreation,
            JobStatus status,
            JobType jobType,
            uint64 createdAt,
            uint64 deadline,
            string memory metadataURI,
            uint256 milestonesCount
        )
    {
        Job storage j = jobs[jobId];
        return (
            j.hirer,
            j.worker,
            j.paymentToken,
            j.totalAmount,
            j.fundedAmount,
            j.feeBpsAtCreation,
            j.status,
            j.jobType,
            j.createdAt,
            j.deadline,
            j.metadataURI,
            j.milestones.length
        );
    }

    function getMilestone(
        uint256 jobId,
        uint256 index
    )
        external
        view
        returns (
            uint256 amount,
            uint64 dueDate,
            bool delivered,
            bool released,
            bool requiresDeliverable,
            string memory deliverableURI,
            string memory note
        )
    {
        Milestone storage m = jobs[jobId].milestones[index];
        return (
            m.amount,
            m.dueDate,
            m.delivered,
            m.released,
            m.requiresDeliverable,
            m.deliverableURI,
            m.note
        );
    }

    // ======================================================
    //                      Internals
    // ======================================================

    function _payout(address token, address to, uint256 amount) internal {
        if (amount == 0) return;
        if (token == address(0)) {
            (bool ok, ) = to.call{value: amount}("");
            require(ok, "native send fail");
        } else {
            IERC20(token).safeTransfer(to, amount);
        }
    }

    function _splitFee(
        uint16 bps,
        uint256 amount
    ) internal pure returns (uint256 fee, uint256 net) {
        fee = (amount * bps) / 10_000;
        net = amount - fee;
    }

    function _effectiveFeeBps(
        address hirer,
        address worker
    ) internal view returns (uint16) {
        uint16 fee = baseFeeBps;
        if (
            address(badgeRegistry) != address(0) &&
            tierBadgeIds.length > 0 &&
            minTierForDiscount > 0
        ) {
            uint8 tWorker = badgeRegistry.tierOf(worker, tierBadgeIds);
            uint8 tHirer = badgeRegistry.tierOf(hirer, tierBadgeIds);
            if (tWorker >= minTierForDiscount && workerDiscountBps > 0) {
                if (fee > workerDiscountBps) fee -= workerDiscountBps;
                else fee = 0;
            }
            if (tHirer >= minTierForDiscount && hirerDiscountBps > 0) {
                if (fee > hirerDiscountBps) fee -= hirerDiscountBps;
                else fee = 0;
            }
        }
        // cap to max
        if (fee > maxFeeBps) fee = maxFeeBps;
        return fee;
    }

    // ---------- Storage gap ----------
    uint256[42] private __gap;
}
