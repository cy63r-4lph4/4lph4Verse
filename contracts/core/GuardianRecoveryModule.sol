// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title GuardianRecoveryModule
 * @notice Handles guardians, freezes, and recovery flows for VerseProfile identities.
 *
 * This is a MODULE, not the core VerseProfile contract.
 * - VerseProfile remains the root identity registry.
 * - GuardianRecoveryModule manages:
 *   - Guardian sets (active + pending, with delays)
 *   - Freezing (soft/hard)
 *   - Recovery proposals and execution
 *   - Meta nonce epoch bumps (for invalidating signed meta tx)
 *
 * ---------------------------------------------------------------------------
 * ARCHITECTURE NOTE (v2): unified recovery pipeline
 * ---------------------------------------------------------------------------
 * There is exactly ONE state machine that can change profile ownership:
 * `RecoveryState`. Guardian-quorum recovery and proof-of-owner (biometric)
 * recovery are two different ENTRY POINTS into that same state machine --
 * neither one calls VerseProfile.recoverySetOwner directly, and both are
 * subject to the same freeze checks, the same cancellation rights, and the
 * same execution path. This is deliberate: a system is only as strong as its
 * weakest door, so there must only ever be one door, with multiple locks.
 *
 * See the recovery design doc for the full threat model and rationale.
 * ---------------------------------------------------------------------------
 *
 * Design:
 * - Upgradeable via UUPS
 * - Governed via AccessControl (same pattern as VerseProfile)
 * - Meta-tx compatibility achieved via EIP-712 signatures (no ERC2771 here)
 */

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {EIP712Upgradeable} from "@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

interface IVerseProfileMinimal {
    function ownerOf(uint256 verseId) external view returns (address);

    function hasProfile(address user) external view returns (bool);

    function recoverySetOwner(uint256 verseId, address newOwner) external;
}

contract GuardianRecoveryModule is
    Initializable,
    UUPSUpgradeable,
    PausableUpgradeable,
    AccessControlUpgradeable,
    EIP712Upgradeable
{
    using ECDSA for bytes32;

    // ------------------------------------------------------------------------
    // Roles
    // ------------------------------------------------------------------------

    bytes32 public constant MODULE_ADMIN_ROLE = keccak256("MODULE_ADMIN_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    /// @notice Granted only to a trusted ProofOfOwnerModule contract address.
    ///         Holding this role permits ONLY `initiateRecoveryViaProof` --
    ///         it never grants the ability to execute or bypass freeze/delay.
    bytes32 public constant PROOF_INITIATOR_ROLE = keccak256("PROOF_INITIATOR_ROLE");

    // ------------------------------------------------------------------------
    // EIP-712: guardian approvals
    // ------------------------------------------------------------------------

    struct GuardianSignature {
        address guardian;
        bytes signature;
    }

    // action labels so guardians know exactly what they are signing
    bytes32 private constant ACTION_HARD_FREEZE = keccak256("HARD_FREEZE");
    bytes32 private constant ACTION_UNFREEZE = keccak256("UNFREEZE");
    bytes32 private constant ACTION_RECOVERY_INIT = keccak256("RECOVERY_INIT");
    bytes32 private constant ACTION_RECOVERY_EXEC =
        keccak256("RECOVERY_EXECUTE");
    bytes32 private constant ACTION_RECOVERY_CANCEL =
        keccak256("RECOVERY_CANCEL");

    bytes32 private constant _GUARDIAN_APPROVAL_TYPEHASH =
        keccak256(
            "GuardianApproval(uint256 verseId,bytes32 action,bytes32 paramsHash,uint64 guardianEpoch,uint256 recoveryNonce,uint256 deadline)"
        );

    // ------------------------------------------------------------------------
    // Constants
    // ------------------------------------------------------------------------

    // How long before guardian add/remove proposals can be applied (e.g. 7 days)
    uint64 public constant GUARDIAN_DELAY = 7 days;

    // How long between guardian-quorum recovery initiation and execution.
    uint64 public constant RECOVERY_DELAY = 72 hours;

    // How long between proof-of-owner (biometric) recovery initiation and
    // execution, when the profile is not in a recently-suspicious state.
    // Shorter than RECOVERY_DELAY because this path targets the common
    // "lost my key, no adversary present" case -- but never zero.
    uint64 public constant PROOF_RECOVERY_DELAY = 36 hours;

    // Soft freeze duration (e.g. 24 hours)
    uint64 public constant SOFT_FREEZE_DURATION = 24 hours;

    // Minimum number of active guardians required (quorum floor)
    uint8 public constant MIN_GUARDIANS = 2;

    // After a proof-sourced recovery is canceled (by owner or guardians),
    // block re-initiation via the proof path for this long -- anti-retry
    // against a probabilistic liveness/face-match check.
    uint64 public constant PROOF_COOLDOWN_AFTER_CANCEL = 7 days;

    // After a hard freeze is lifted, disable the FAST proof-recovery lane
    // for this long; proof-initiated recovery during this window falls back
    // to the slower RECOVERY_DELAY. A recently-frozen profile was recently
    // suspected of compromise.
    uint64 public constant POST_UNFREEZE_PROOF_COOLDOWN = 14 days;

    // ------------------------------------------------------------------------
    // Structs
    // ------------------------------------------------------------------------

    struct GuardianSet {
        address[] active; // current guardians
        uint8 threshold; // signatures required for actions (>= 1, <= active.length)
        uint64 epoch; // incremented when guardian set changes (for signature domains)
    }

    struct GuardianChange {
        address[] pending; // proposed full new set
        uint8 newThreshold; // proposed threshold
        uint64 applyAfter; // timestamp when change can be applied
        uint64 expiresAt; // optional expiry for the proposal
    }

    enum RecoverySource {
        GUARDIAN_QUORUM,
        PROOF_OF_OWNER
    }

    struct RecoveryState {
        address pendingNewOwner; // proposed new owner
        uint64 eta; // earliest time when executeRecovery is allowed
        uint256 nonce; // incremented for each new recovery attempt
        bool active; // whether a recovery is currently in progress
        RecoverySource source; // which door opened this case
    }

    // ------------------------------------------------------------------------
    // Storage
    // ------------------------------------------------------------------------

    // VerseProfile contract
    IVerseProfileMinimal public verseProfile;

    // Per-verseId guardian data
    mapping(uint256 => GuardianSet) public guardians; // verseId => guardian set
    mapping(uint256 => GuardianChange) public guardianOps; // verseId => pending change

    // Freeze state
    mapping(uint256 => uint64) public softFreezeUntil; // verseId => timestamp
    mapping(uint256 => bool) public hardFrozen; // verseId => hard freeze flag

    // Recovery state
    mapping(uint256 => RecoveryState) public recovery; // verseId => recovery info

    // Meta-tx safety: epoch per verseId (for EIP-712 domain separation / invalidation)
    mapping(uint256 => uint64) public metaNonceEpoch; // verseId => epoch

    // Anti-grief cooldowns for the proof-of-owner recovery path
    mapping(uint256 => uint64) public proofCooldownUntil; // verseId => timestamp before which proof-path initiation is blocked
    mapping(uint256 => uint64) public lastUnfrozenAt; // verseId => timestamp hard freeze was last lifted

    // ------------------------------------------------------------------------
    // Events
    // ------------------------------------------------------------------------

    // Guardians
    event GuardiansProposed(
        uint256 indexed verseId,
        address[] newGuardians,
        uint8 newThreshold,
        uint64 applyAfter,
        uint64 expiresAt
    );

    event GuardiansApplied(
        uint256 indexed verseId,
        address[] guardians,
        uint8 threshold,
        uint64 newEpoch
    );

    // Freezes
    event SoftFrozen(uint256 indexed verseId, uint64 until);
    event HardFrozen(uint256 indexed verseId);
    event Unfrozen(uint256 indexed verseId);

    // Recovery
    event RecoveryInitiated(
        uint256 indexed verseId,
        address indexed pendingNewOwner,
        uint64 eta,
        uint256 recoveryNonce,
        RecoverySource source
    );
    event RecoveryCanceled(
        uint256 indexed verseId,
        uint256 recoveryNonce,
        address indexed canceledBy
    );
    event RecoveryExecuted(
        uint256 indexed verseId,
        address indexed oldOwner,
        address indexed newOwner,
        uint256 recoveryNonce,
        RecoverySource source
    );

    // Meta nonce epoch
    event MetaNonceEpochBumped(uint256 indexed verseId, uint64 newEpoch);

    // ------------------------------------------------------------------------
    // Views
    // ------------------------------------------------------------------------

    function getGuardians(
        uint256 verseId
    )
        external
        view
        returns (address[] memory active, uint8 threshold, uint64 epoch)
    {
        GuardianSet storage set = guardians[verseId];
        return (set.active, set.threshold, set.epoch);
    }

    function getRecovery(
        uint256 verseId
    ) external view returns (RecoveryState memory) {
        return recovery[verseId];
    }

    // ------------------------------------------------------------------------
    // Freeze views
    // ------------------------------------------------------------------------

    function isFrozen(uint256 verseId) public view returns (bool) {
        // soft freeze active?
        if (softFreezeUntil[verseId] > block.timestamp) {
            return true;
        }
        // hard freeze flag
        if (hardFrozen[verseId]) {
            return true;
        }
        return false;
    }

    // ------------------------------------------------------------------------
    // Constructor (implementation) + Initialize (proxy)
    // ------------------------------------------------------------------------

    /// @dev Disable initializers on the implementation contract.
    constructor() {
        _disableInitializers();
    }

    /**
     * @notice Initialize the module behind a UUPS proxy.
     * @param admin Address that receives DEFAULT_ADMIN_ROLE, MODULE_ADMIN_ROLE, and UPGRADER_ROLE
     * @param verseProfileAddress Address of the VerseProfile core contract
     */
    function initialize(
        address admin,
        address verseProfileAddress
    ) external initializer {
        require(admin != address(0), "GuardianModule: bad admin");
        require(
            verseProfileAddress != address(0),
            "GuardianModule: zero verseProfile"
        );

        __UUPSUpgradeable_init();
        __Pausable_init();
        __AccessControl_init();
        __EIP712_init("GuardianRecoveryModule", "0.1");

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MODULE_ADMIN_ROLE, admin);
        _grantRole(UPGRADER_ROLE, admin);

        verseProfile = IVerseProfileMinimal(verseProfileAddress);
    }

    // ------------------------------------------------------------------------
    // Modifiers
    // ------------------------------------------------------------------------

    modifier onlyProfileOwner(uint256 verseId) {
        require(
            verseProfile.ownerOf(verseId) == _msgSender(),
            "GuardianModule: not owner"
        );
        _;
    }

    modifier notHardFrozen(uint256 verseId) {
        require(!hardFrozen[verseId], "GuardianModule: profile hard frozen");
        _;
    }

    modifier notFrozen(uint256 verseId) {
        // soft or hard freeze both block this
        if (softFreezeUntil[verseId] > block.timestamp) {
            revert("GuardianModule: soft frozen");
        }
        if (hardFrozen[verseId]) {
            revert("GuardianModule: hard frozen");
        }
        _;
    }

    /// @dev Guardian-set changes must never happen while a recovery is in
    ///      flight -- otherwise whoever controls (or has compromised) the
    ///      owner key could swap out the guardians who'd cancel a malicious
    ///      recovery, mid-window.
    modifier notDuringRecovery(uint256 verseId) {
        require(
            !recovery[verseId].active,
            "GuardianModule: recovery in progress"
        );
        _;
    }

    // ------------------------------------------------------------------------
    // Guardian configuration: propose + apply
    // ------------------------------------------------------------------------

    /**
     * @notice Propose a new full guardian set for a VerseID.
     *         Does NOT take effect immediately. Must be applied after GUARDIAN_DELAY.
     *
     * @dev Only the current VerseProfile owner can propose a change. Blocked
     *      entirely while a recovery is active (see `notDuringRecovery`).
     */
    function proposeGuardians(
        uint256 verseId,
        address[] calldata newGuardians,
        uint8 newThreshold
    )
        external
        onlyProfileOwner(verseId)
        notHardFrozen(verseId)
        notDuringRecovery(verseId)
        whenNotPaused
    {
        uint256 len = newGuardians.length;
        require(len >= MIN_GUARDIANS, "GuardianModule: too few guardians");
        require(
            newThreshold > 0 && newThreshold <= len,
            "GuardianModule: bad threshold"
        );

        // Validate non-zero & no duplicates (O(n^2), but guardian sets are small)
        for (uint256 i; i < len; ++i) {
            address g = newGuardians[i];
            require(g != address(0), "GuardianModule: zero guardian");
            for (uint256 j = i + 1; j < len; ++j) {
                require(
                    newGuardians[j] != g,
                    "GuardianModule: duplicate guardian"
                );
            }
        }

        uint64 applyAfter = uint64(block.timestamp + GUARDIAN_DELAY);
        // Optional expiry: proposal is only valid for another GUARDIAN_DELAY after it becomes applyable
        uint64 expiresAt = applyAfter + GUARDIAN_DELAY;

        GuardianChange storage op = guardianOps[verseId];

        // Reset and store the new proposal
        delete op.pending;
        for (uint256 i; i < len; ++i) {
            op.pending.push(newGuardians[i]);
        }

        op.newThreshold = newThreshold;
        op.applyAfter = applyAfter;
        op.expiresAt = expiresAt;

        emit GuardiansProposed(
            verseId,
            newGuardians,
            newThreshold,
            applyAfter,
            expiresAt
        );
    }

    /**
     * @notice Apply a previously proposed guardian set after the delay has passed.
     * @dev Anyone can call this once the proposal is mature and not expired.
     *      Blocked entirely while a recovery is active.
     */
    function applyGuardians(
        uint256 verseId
    ) external notHardFrozen(verseId) notDuringRecovery(verseId) whenNotPaused {
        GuardianChange storage op = guardianOps[verseId];
        require(op.applyAfter != 0, "GuardianModule: no pending change");
        require(block.timestamp >= op.applyAfter, "GuardianModule: too early");
        require(
            op.expiresAt == 0 || block.timestamp <= op.expiresAt,
            "GuardianModule: proposal expired"
        );

        uint256 len = op.pending.length;
        require(len >= MIN_GUARDIANS, "GuardianModule: too few guardians");
        require(
            op.newThreshold > 0 && op.newThreshold <= len,
            "GuardianModule: bad threshold"
        );

        GuardianSet storage set = guardians[verseId];

        // Replace active set
        delete set.active;
        for (uint256 i; i < len; ++i) {
            set.active.push(op.pending[i]);
        }
        set.threshold = op.newThreshold;
        set.epoch += 1; // bump epoch so old guardian signatures can't be replayed

        // Keep metaNonceEpoch in sync with guardian epoch (optional, but nice)
        metaNonceEpoch[verseId] = set.epoch;

        uint64 newEpoch = set.epoch;

        // Clear pending proposal
        delete guardianOps[verseId];

        emit GuardiansApplied(verseId, set.active, set.threshold, newEpoch);
    }

    // ------------------------------------------------------------------------
    // Pause Controls (optional, module-level)
    // ------------------------------------------------------------------------

    function pause() external onlyRole(MODULE_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(MODULE_ADMIN_ROLE) {
        _unpause();
    }

    // ------------------------------------------------------------------------
    // UUPS upgrade authorization
    // ------------------------------------------------------------------------

    function _authorizeUpgrade(
        address
    ) internal override onlyRole(UPGRADER_ROLE) {}

    // ------------------------------------------------------------------------
    // Internal: guardian helpers
    // ------------------------------------------------------------------------

    function _isGuardian(
        uint256 verseId,
        address account
    ) internal view returns (bool) {
        GuardianSet storage set = guardians[verseId];
        uint256 len = set.active.length;
        for (uint256 i; i < len; ++i) {
            if (set.active[i] == account) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Verify guardian EIP-712 signatures for a specific action.
     * @return validCount  Number of valid, unique guardian approvals
     */
    function _verifyGuardianApprovalsTyped(
        uint256 verseId,
        bytes32 action,
        bytes32 paramsHash,
        uint256 recoveryNonce,
        uint256 deadline,
        GuardianSignature[] calldata approvals
    ) internal view returns (uint256 validCount) {
        require(
            block.timestamp <= deadline,
            "GuardianModule: approvals expired"
        );

        GuardianSet storage set = guardians[verseId];
        uint256 lenSet = set.active.length;
        require(
            lenSet >= MIN_GUARDIANS,
            "GuardianModule: no guardians configured"
        );

        // Common digest all guardians sign
        bytes32 structHash = keccak256(
            abi.encode(
                _GUARDIAN_APPROVAL_TYPEHASH,
                verseId,
                action,
                paramsHash,
                set.epoch,
                recoveryNonce,
                deadline
            )
        );
        bytes32 digest = _hashTypedDataV4(structHash);

        // Track which guardians we've already counted to avoid double-count
        bool[] memory seen = new bool[](lenSet);

        for (uint256 i; i < approvals.length; ++i) {
            address claimedGuardian = approvals[i].guardian;
            address signer = digest.recover(approvals[i].signature);
            if (signer != claimedGuardian) continue;

            for (uint256 j; j < lenSet; ++j) {
                if (set.active[j] == claimedGuardian && !seen[j]) {
                    seen[j] = true;
                    ++validCount;
                    break;
                }
            }
        }
    }

    function _requireGuardianThreshold(
        uint256 verseId,
        bytes32 action,
        bytes32 paramsHash,
        uint256 recoveryNonce,
        uint256 deadline,
        GuardianSignature[] calldata approvals
    ) internal view {
        uint256 count = _verifyGuardianApprovalsTyped(
            verseId,
            action,
            paramsHash,
            recoveryNonce,
            deadline,
            approvals
        );
        require(
            count >= guardians[verseId].threshold,
            "GuardianModule: insufficient guardian approvals"
        );
    }

    modifier onlyGuardian(uint256 verseId) {
        require(
            _isGuardian(verseId, _msgSender()),
            "GuardianModule: not guardian"
        );
        _;
    }

    // ------------------------------------------------------------------------
    // Recovery: entry point A -- guardian quorum
    // ------------------------------------------------------------------------

    /**
     * @notice Start a recovery flow proposing a new owner, via guardian quorum.
     * @dev Requires guardian quorum approval. Starts RECOVERY_DELAY timer.
     */
    function initiateRecovery(
        uint256 verseId,
        address newOwner,
        uint256 deadline,
        GuardianSignature[] calldata approvals
    ) external whenNotPaused notHardFrozen(verseId) {
        require(newOwner != address(0), "GuardianModule: zero new owner");

        RecoveryState storage r = recovery[verseId];
        require(!r.active, "GuardianModule: recovery already active");

        uint256 nextNonce = r.nonce + 1;
        bytes32 paramsHash = keccak256(abi.encodePacked(newOwner));

        _requireGuardianThreshold(
            verseId,
            ACTION_RECOVERY_INIT,
            paramsHash,
            nextNonce,
            deadline,
            approvals
        );

        // Freeze during recovery for the full RECOVERY_DELAY
        softFreezeUntil[verseId] = uint64(block.timestamp + RECOVERY_DELAY);

        uint64 eta = uint64(block.timestamp + RECOVERY_DELAY);

        r.pendingNewOwner = newOwner;
        r.eta = eta;
        r.nonce = nextNonce;
        r.active = true;
        r.source = RecoverySource.GUARDIAN_QUORUM;

        emit RecoveryInitiated(
            verseId,
            newOwner,
            eta,
            r.nonce,
            RecoverySource.GUARDIAN_QUORUM
        );
    }

    // ------------------------------------------------------------------------
    // Recovery: entry point B -- proof of owner (biometric)
    // ------------------------------------------------------------------------

    /**
     * @notice Open a proof-sourced recovery case. Callable only by the
     *         trusted ProofOfOwnerModule (holds PROOF_INITIATOR_ROLE), which
     *         must already have verified a matching Self proof AND a
     *         liveness/face-match attestation before calling this.
     * @dev This function NEVER sets ownership -- it only opens the same
     *      delayed, cancelable window guardian-initiated recovery uses. The
     *      delay is shorter (PROOF_RECOVERY_DELAY) unless the profile was
     *      recently unfrozen, in which case it falls back to the slower
     *      RECOVERY_DELAY, because a recently-frozen profile was recently
     *      under suspicion.
     */
    function initiateRecoveryViaProof(
        uint256 verseId,
        address newOwner
    )
        external
        onlyRole(PROOF_INITIATOR_ROLE)
        whenNotPaused
        notHardFrozen(verseId)
    {
        require(newOwner != address(0), "GuardianModule: zero new owner");
        require(
            verseProfile.hasProfile(newOwner) == false,
            "GuardianModule: newOwner already has profile"
        );

        RecoveryState storage r = recovery[verseId];
        require(!r.active, "GuardianModule: recovery already active");
        require(
            block.timestamp >= proofCooldownUntil[verseId],
            "GuardianModule: proof recovery in cooldown"
        );

        uint64 delay = PROOF_RECOVERY_DELAY;
        if (block.timestamp < lastUnfrozenAt[verseId] + POST_UNFREEZE_PROOF_COOLDOWN) {
            // Recently under suspicion -- fall back to the slow lane instead
            // of refusing outright, so a genuinely locked-out owner still has
            // a path back in.
            delay = RECOVERY_DELAY;
        }

        uint64 eta = uint64(block.timestamp + delay);
        uint256 nextNonce = r.nonce + 1;

        r.pendingNewOwner = newOwner;
        r.eta = eta;
        r.nonce = nextNonce;
        r.active = true;
        r.source = RecoverySource.PROOF_OF_OWNER;

        emit RecoveryInitiated(
            verseId,
            newOwner,
            eta,
            nextNonce,
            RecoverySource.PROOF_OF_OWNER
        );
    }

    // ------------------------------------------------------------------------
    // Recovery: shared execution path
    // ------------------------------------------------------------------------

    /**
     * @notice Complete a recovery after its delay has passed, regardless of
     *         which door opened it.
     * @dev Freeze state is re-checked HERE, not just at initiation, so
     *      guardians can block an in-flight recovery by hard-freezing after
     *      seeing the RecoveryInitiated event. Guardian-quorum-sourced
     *      recoveries additionally require a second round of threshold
     *      signatures over ACTION_RECOVERY_EXEC; proof-sourced recoveries do
     *      not, since their authorization was already fully established at
     *      initiation and their safety comes from the delay + cancel rights,
     *      not from a second signature round.
     */
    function executeRecovery(
        uint256 verseId,
        uint256 deadline,
        GuardianSignature[] calldata approvals
    ) external whenNotPaused notFrozen(verseId) {
        RecoveryState storage r = recovery[verseId];
        require(r.active, "GuardianModule: no active recovery");
        require(
            block.timestamp >= r.eta,
            "GuardianModule: recovery delay not over"
        );

        if (r.source == RecoverySource.GUARDIAN_QUORUM) {
            bytes32 paramsHash = keccak256(
                abi.encodePacked(r.pendingNewOwner)
            );
            _requireGuardianThreshold(
                verseId,
                ACTION_RECOVERY_EXEC,
                paramsHash,
                r.nonce,
                deadline,
                approvals
            );
        }
        // PROOF_OF_OWNER source: no additional signature required here --
        // permissionless "anyone can trigger execution" once eta has passed
        // and the profile is still unfrozen, mirroring applyGuardians.

        address oldOwner = verseProfile.ownerOf(verseId);
        address newOwner = r.pendingNewOwner;
        require(newOwner != address(0), "GuardianModule: no pending owner");

        RecoverySource source = r.source;
        uint256 nonce = r.nonce;

        // Effects before the external call (checks-effects-interactions).
        r.active = false;
        r.pendingNewOwner = address(0);

        verseProfile.recoverySetOwner(verseId, newOwner);

        emit RecoveryExecuted(verseId, oldOwner, newOwner, nonce, source);

        // Unfreeze after successful recovery
        hardFrozen[verseId] = false;
        softFreezeUntil[verseId] = 0;
        emit Unfrozen(verseId);
    }

    // ------------------------------------------------------------------------
    // Recovery: cancellation (three independent kill switches)
    // ------------------------------------------------------------------------

    /**
     * @notice The current profile owner can instantly cancel any in-flight
     *         recovery -- no guardian quorum needed. This is the primary
     *         defense against a stolen-document / proof-of-owner attack when
     *         the legitimate owner is still reachable: presence of the real
     *         owner always wins.
     */
    function ownerCancelRecovery(uint256 verseId) external {
        require(
            verseProfile.ownerOf(verseId) == _msgSender(),
            "GuardianModule: not owner"
        );
        RecoveryState storage r = recovery[verseId];
        require(r.active, "GuardianModule: no active recovery");

        RecoverySource source = r.source;
        uint256 nonce = r.nonce;
        r.active = false;

        if (source == RecoverySource.PROOF_OF_OWNER) {
            proofCooldownUntil[verseId] = uint64(
                block.timestamp + PROOF_COOLDOWN_AFTER_CANCEL
            );
        }

        emit RecoveryCanceled(verseId, nonce, _msgSender());
    }

    /**
     * @notice Guardian-quorum cancellation. Works regardless of which door
     *         opened the recovery (guardian-quorum or proof-of-owner).
     * @dev We do not allow unilateral owner cancellation to be the ONLY
     *      cancellation path (a compromised owner key could otherwise be
     *      used to indefinitely block a legitimate guardian-driven recovery)
     *      -- this function is the guardians' independent kill switch.
     */
    function cancelRecovery(
        uint256 verseId,
        uint256 deadline,
        GuardianSignature[] calldata approvals
    ) external whenNotPaused {
        RecoveryState storage r = recovery[verseId];
        require(r.active, "GuardianModule: no active recovery");

        bytes32 paramsHash = keccak256(abi.encodePacked(r.pendingNewOwner));
        _requireGuardianThreshold(
            verseId,
            ACTION_RECOVERY_CANCEL,
            paramsHash,
            r.nonce,
            deadline,
            approvals
        );

        RecoverySource source = r.source;
        uint256 nonce = r.nonce;
        r.active = false;

        if (source == RecoverySource.PROOF_OF_OWNER) {
            proofCooldownUntil[verseId] = uint64(
                block.timestamp + PROOF_COOLDOWN_AFTER_CANCEL
            );
        }

        emit RecoveryCanceled(verseId, nonce, _msgSender());
    }

    // ------------------------------------------------------------------------
    // Misc
    // ------------------------------------------------------------------------

    function bumpMetaNonceEpoch(
        uint256 verseId
    ) external onlyProfileOwner(verseId) {
        metaNonceEpoch[verseId]++;
        emit MetaNonceEpochBumped(verseId, metaNonceEpoch[verseId]);
    }

    // ------------------------------------------------------------------------
    // Freeze controls
    // ------------------------------------------------------------------------

    /**
     * @notice Soft-freeze a profile for a limited time.
     * @dev Any single active guardian can call this -- a fast, unilateral
     *      "something's wrong, pause things" button. To prevent one bad or
     *      compromised guardian from griefing recovery indefinitely, a lone
     *      guardian may trigger this ONCE; it cannot be renewed or extended
     *      by a single guardian while already active. Extending protection
     *      beyond SOFT_FREEZE_DURATION requires escalating to hardFreeze,
     *      which needs threshold signatures.
     */
    function softFreeze(
        uint256 verseId
    ) external onlyGuardian(verseId) whenNotPaused {
        require(!hardFrozen[verseId], "GuardianModule: already hard frozen");
        require(
            softFreezeUntil[verseId] <= block.timestamp,
            "GuardianModule: soft freeze already active"
        );

        uint64 until = uint64(block.timestamp + SOFT_FREEZE_DURATION);
        softFreezeUntil[verseId] = until;
        emit SoftFrozen(verseId, until);
    }

    /**
     * @notice Permanently freeze a profile until unfrozen by guardian quorum.
     * @dev Requires threshold approval. Emits HardFrozen event.
     */
    function hardFreeze(
        uint256 verseId,
        uint256 deadline,
        GuardianSignature[] calldata approvals
    ) external whenNotPaused {
        require(!hardFrozen[verseId], "GuardianModule: already hard frozen");
        _requireGuardianThreshold(
            verseId,
            ACTION_HARD_FREEZE,
            bytes32(0),
            0,
            deadline,
            approvals
        );

        hardFrozen[verseId] = true;
        emit HardFrozen(verseId);
    }

    /**
     * @notice Lift a hard freeze after investigation.
     * @dev Requires guardian threshold approvals. Starts the
     *      POST_UNFREEZE_PROOF_COOLDOWN window during which proof-of-owner
     *      recovery falls back to the slow lane.
     */
    function unfreeze(
        uint256 verseId,
        uint256 deadline,
        GuardianSignature[] calldata approvals
    ) external whenNotPaused {
        require(hardFrozen[verseId], "GuardianModule: not hard frozen");

        _requireGuardianThreshold(
            verseId,
            ACTION_UNFREEZE,
            bytes32(0),
            0,
            deadline,
            approvals
        );

        hardFrozen[verseId] = false;
        softFreezeUntil[verseId] = 0;
        lastUnfrozenAt[verseId] = uint64(block.timestamp);
        emit Unfrozen(verseId);
    }

    /**
     * @notice Clear both soft and hard freeze state for a profile.
     * @dev Callable by module admin. Use with care -- ideally this role sits
     *      behind a multisig/timelock, not a single EOA (see design doc,
     *      residual risks).
     */
    function forceUnfreeze(
        uint256 verseId
    ) external onlyRole(MODULE_ADMIN_ROLE) {
        softFreezeUntil[verseId] = 0;
        hardFrozen[verseId] = false;
        lastUnfrozenAt[verseId] = uint64(block.timestamp);
        emit Unfrozen(verseId);
    }

    function supportsInterface(
        bytes4 iid
    ) public view override(AccessControlUpgradeable) returns (bool) {
        return super.supportsInterface(iid);
    }

    // ------------------------------------------------------------------------
    // Storage gap for future upgrades
    // ------------------------------------------------------------------------
    uint256[40] private __gap;
}
