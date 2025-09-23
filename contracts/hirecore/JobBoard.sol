// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title HireCoreJobBoard
 * @notice Decentralized job posting and application board for HireCore.
 *
 * @dev
 * - Built with UUPSUpgradeable for safe upgrades.
 * - Posts require a CORE token deposit to mitigate spam.
 * - Workers can apply with bids + proposals.
 * - Hirers can accept applications → spawns an onchain Job via JobManager.
 * - Deposits are refunded when a post is closed/accepted; slashed to treasury if expired.
 *
 * ### Future-Proof:
 * - All critical params (treasury, jobManager, coreToken, minDeposit) are admin-upgradable.
 * - Storage gap reserved at end for new variables.
 * - Compact and indexer-friendly event design.
 */

import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @dev Minimal interface to JobManager (which manages lifecycle & funds).
interface IJobManager {
    enum JobType {
        Simple,
        Milestone,
        Streaming
    }

    struct Milestone {
        uint256 amount;
        uint64 dueDate;
        bool requiresDeliverable;
        string note;
        string deliverableURI;
    }

    struct CreateJobParams {
        address worker;
        JobType jobType;
        address paymentToken;
        uint64 deadline;
        string metadataURI;
        Milestone[] milestones;
    }

    function createJob(
        CreateJobParams calldata p,
        string calldata profileURIIfNew
    ) external returns (uint256 jobId);
}

contract HireCoreJobBoard is
    UUPSUpgradeable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable
{
    using SafeERC20 for IERC20;

    // ---------- Roles ----------
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // ---------- Config ----------
    IERC20 public coreToken;       // anti-spam deposit token
    address public treasury;       // slashed deposits go here
    uint256 public minDeposit;     // minimum deposit per post
    IJobManager public jobManager; // JobManager contract (spawn jobs)

    // ---------- Types ----------
    struct JobPost {
        address hirer;
        address paymentToken;
        uint256 budgetMax;
        uint64 expiry;
        uint256 deposit;
        string metadataURI;
        bool open;
    }

    struct Application {
        address worker;
        uint256 bidAmount;
        string proposalURI;
        bool withdrawn;
    }

    // ---------- Storage ----------
    uint256 public nextPostId;
    mapping(uint256 => JobPost) public posts;
    mapping(uint256 => Application[]) public applications;

    // ---------- Events ----------
    event PostCreated(
        uint256 indexed postId,
        address indexed hirer,
        address token,
        uint256 budgetMax,
        uint64 expiry,
        uint256 deposit,
        string metadataURI
    );
    event PostClosed(uint256 indexed postId, address indexed hirer);
    event PostExpired(uint256 indexed postId, address indexed hirer);
    event PostDepositSlashed(
        uint256 indexed postId,
        address indexed hirer,
        uint256 amount
    );

    event Applied(
        uint256 indexed postId,
        uint256 indexed appIndex,
        address indexed worker,
        uint256 bid,
        string proposalURI
    );
    event ApplicationWithdrawn(
        uint256 indexed postId,
        uint256 indexed appIndex,
        address indexed worker
    );
    event ApplicationAccepted(
        uint256 indexed postId,
        uint256 indexed appIndex,
        uint256 jobId
    );

    // ---------- Constructor ----------
    constructor() {
        _disableInitializers();
    }

    // ---------- Init ----------
    function initialize(
        address admin,
        address jobManager_,
        address coreToken_,
        address treasury_,
        uint256 minDeposit_
    ) external initializer {
        require(admin != address(0), "bad admin");
        require(jobManager_ != address(0), "bad jobManager");
        require(coreToken_ != address(0), "bad coreToken");
        require(treasury_ != address(0), "bad treasury");

        __UUPSUpgradeable_init();
        __AccessControl_init();
        __ReentrancyGuard_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);

        jobManager = IJobManager(jobManager_);
        coreToken = IERC20(coreToken_);
        treasury = treasury_;
        minDeposit = minDeposit_;
        nextPostId = 1;
    }

    function _authorizeUpgrade(address) internal override onlyRole(ADMIN_ROLE) {}

    // ---------- Hirer: Create Post ----------
    /**
     * @notice Create a new job post.
     * @param paymentToken ERC20 token for payment.
     * @param budgetMax Maximum budget for this job.
     * @param duration Duration (seconds) until expiry (min 1 day, max 30 days).
     * @param metadataURI IPFS/Arweave JSON with job description.
     */
    function createPost(
        address paymentToken,
        uint256 budgetMax,
        uint64 duration,
        string calldata metadataURI
    ) external nonReentrant returns (uint256 postId) {
        require(budgetMax > 0, "budget required");
        require(duration >= 1 days && duration <= 30 days, "invalid duration");

        // lock CORE deposit
        coreToken.safeTransferFrom(msg.sender, address(this), minDeposit);

        postId = nextPostId++;
        posts[postId] = JobPost({
            hirer: msg.sender,
            paymentToken: paymentToken,
            budgetMax: budgetMax,
            expiry: uint64(block.timestamp + duration),
            deposit: minDeposit,
            metadataURI: metadataURI,
            open: true
        });

        emit PostCreated(
            postId,
            msg.sender,
            paymentToken,
            budgetMax,
            uint64(block.timestamp + duration),
            minDeposit,
            metadataURI
        );
    }

    // ---------- Worker: Apply ----------
    /**
     * @notice Apply to a job post with a bid and proposal.
     * @param postId Target post.
     * @param bidAmount Bid amount (must be <= budgetMax).
     * @param proposalURI Proposal IPFS/Arweave URI.
     */
    function applyNow(
        uint256 postId,
        uint256 bidAmount,
        string calldata proposalURI
    ) external returns (uint256 appIndex) {
        JobPost storage p = posts[postId];
        require(p.open, "closed");
        require(block.timestamp < p.expiry, "expired");
        require(bidAmount > 0 && bidAmount <= p.budgetMax, "bad bid");

        applications[postId].push(
            Application({
                worker: msg.sender,
                bidAmount: bidAmount,
                proposalURI: proposalURI,
                withdrawn: false
            })
        );
        appIndex = applications[postId].length - 1;

        emit Applied(postId, appIndex, msg.sender, bidAmount, proposalURI);
    }

    /**
     * @notice Worker can withdraw their application.
     */
    function withdraw(uint256 postId, uint256 appIndex) external {
        Application storage a = applications[postId][appIndex];
        require(a.worker == msg.sender, "not yours");
        require(!a.withdrawn, "already");
        a.withdrawn = true;
        emit ApplicationWithdrawn(postId, appIndex, msg.sender);
    }

    // ---------- Hirer: Accept ----------
    /**
     * @notice Accept a worker's application, closes the post, spawns a Job in JobManager.
     * @param postId Post ID.
     * @param appIndex Index of application to accept.
     * @param agreement Full job agreement for JobManager.
     * @param profileURIIfNew URI for profile bootstrap if worker has no profile.
     */
    function accept(
        uint256 postId,
        uint256 appIndex,
        IJobManager.CreateJobParams calldata agreement,
        string calldata profileURIIfNew
    ) external nonReentrant returns (uint256 jobId) {
        JobPost storage p = posts[postId];
        require(p.hirer == msg.sender, "only hirer");
        require(p.open, "closed");
        require(block.timestamp < p.expiry, "expired");

        Application storage a = applications[postId][appIndex];
        require(!a.withdrawn, "withdrawn");
        require(agreement.worker == a.worker, "worker mismatch");
        require(agreement.paymentToken == p.paymentToken, "token mismatch");
        require(agreement.milestones.length > 0, "milestones required");

        p.open = false;

        // refund deposit
        if (p.deposit > 0) {
            coreToken.safeTransfer(p.hirer, p.deposit);
            p.deposit = 0;
        }

        jobId = jobManager.createJob(agreement, profileURIIfNew);

        emit ApplicationAccepted(postId, appIndex, jobId);
        emit PostClosed(postId, msg.sender);
    }

    // ---------- Hirer: Close ----------
    /**
     * @notice Manually close a post and refund deposit.
     */
    function close(uint256 postId) external nonReentrant {
        JobPost storage p = posts[postId];
        require(p.hirer == msg.sender, "only hirer");
        require(p.open, "already closed");
        p.open = false;

        if (p.deposit > 0) {
            coreToken.safeTransfer(p.hirer, p.deposit);
            p.deposit = 0;
        }

        emit PostClosed(postId, p.hirer);
    }

    // ---------- Anyone: Expire ----------
    /**
     * @notice Expire a post after deadline, slash deposit to treasury.
     */
    function expire(uint256 postId) external nonReentrant {
        JobPost storage p = posts[postId];
        require(p.open, "already closed");
        require(block.timestamp >= p.expiry, "not expired");

        p.open = false;

        if (p.deposit > 0) {
            coreToken.safeTransfer(treasury, p.deposit);
            emit PostDepositSlashed(postId, p.hirer, p.deposit);
            p.deposit = 0;
        }

        emit PostExpired(postId, p.hirer);
    }

    // ---------- Admin: Update params ----------
    function setMinDeposit(uint256 newDeposit) external onlyRole(ADMIN_ROLE) {
        minDeposit = newDeposit;
    }

    function setTreasury(address newTreasury) external onlyRole(ADMIN_ROLE) {
        require(newTreasury != address(0), "zero");
        treasury = newTreasury;
    }

    function setCoreToken(address newCoreToken) external onlyRole(ADMIN_ROLE) {
        require(newCoreToken != address(0), "zero");
        coreToken = IERC20(newCoreToken);
    }

    function setJobManager(address newJobManager) external onlyRole(ADMIN_ROLE) {
        require(newJobManager != address(0), "zero");
        jobManager = IJobManager(newJobManager);
    }

    // ---------- Views ----------
    function getApplicationsCount(uint256 postId) external view returns (uint256) {
        return applications[postId].length;
    }

    function getApplication(uint256 postId, uint256 appIndex)
        external
        view
        returns (address worker, uint256 bidAmount, string memory proposalURI, bool withdrawn)
    {
        Application storage a = applications[postId][appIndex];
        return (a.worker, a.bidAmount, a.proposalURI, a.withdrawn);
    }

    // ---------- Storage gap ----------
    uint256[45] private __gap;
}
//