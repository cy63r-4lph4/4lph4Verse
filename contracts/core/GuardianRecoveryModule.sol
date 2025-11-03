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
 * Design:
 * - Upgradeable via UUPS
 * - Governed via AccessControl (same pattern as VerseProfile)
 * - Meta-tx compatibility achieved via EIP-712 signatures (no ERC2771 here)
 */

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

interface IVerseProfileMinimal {
    function ownerOf(uint256 verseId) external view returns (address);
    function hasProfile(address user) external view returns (bool);
    // Later we will add a restricted function on VerseProfile like:
    // function recoverySetOwner(uint256 verseId, address newOwner) external;
}

contract GuardianRecoveryModule is
    Initializable,
    UUPSUpgradeable,
    PausableUpgradeable,
    AccessControlUpgradeable
{
    // ------------------------------------------------------------------------
    // Roles
    // ------------------------------------------------------------------------

    bytes32 public constant MODULE_ADMIN_ROLE =
        keccak256("MODULE_ADMIN_ROLE");
    bytes32 public constant UPGRADER_ROLE =
        keccak256("UPGRADER_ROLE");

    // ------------------------------------------------------------------------
    // Constants
    // ------------------------------------------------------------------------

    // How long before guardian add/remove proposals can be applied (e.g. 7 days)
    uint64 public constant GUARDIAN_DELAY = 7 days;

    // How long between recovery initiation and execution (e.g. 72 hours)
    uint64 public constant RECOVERY_DELAY = 72 hours;

    // Soft freeze duration (e.g. 24 hours)
    uint64 public constant SOFT_FREEZE_DURATION = 24 hours;

    // Minimum number of active guardians required (quorum floor)
    uint8 public constant MIN_GUARDIANS = 2;

    // ------------------------------------------------------------------------
    // Structs
    // ------------------------------------------------------------------------

    struct GuardianSet {
        address[] active;   // current guardians
        uint8 threshold;    // signatures required for actions (>= 1, <= active.length)
        uint64 epoch;       // incremented when guardian set changes (for signature domains)
    }

    struct GuardianChange {
        address[] pending;  // proposed full new set
        uint8 newThreshold; // proposed threshold
        uint64 applyAfter;  // timestamp when change can be applied
        uint64 expiresAt;   // optional expiry for the proposal
    }

    struct RecoveryState {
        address pendingNewOwner; // proposed new owner
        uint64 eta;              // earliest time when executeRecovery is allowed
        uint256 nonce;           // incremented for each new recovery attempt
        bool active;             // whether a recovery is currently in progress
    }

    // ------------------------------------------------------------------------
    // Storage
    // ------------------------------------------------------------------------

    // VerseProfile contract
    IVerseProfileMinimal public verseProfile;

    // Per-verseId guardian data
    mapping(uint256 => GuardianSet) public guardians;      // verseId => guardian set
    mapping(uint256 => GuardianChange) public guardianOps; // verseId => pending change

    // Freeze state
    mapping(uint256 => uint64) public softFreezeUntil;     // verseId => timestamp
    mapping(uint256 => bool)   public hardFrozen;          // verseId => hard freeze flag

    // Recovery state
    mapping(uint256 => RecoveryState) public recovery;     // verseId => recovery info

    // Meta-tx safety: epoch per verseId (for EIP-712 domain separation / invalidation)
    mapping(uint256 => uint64) public metaNonceEpoch;      // verseId => epoch

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
        uint256 recoveryNonce
    );
    event RecoveryCanceled(uint256 indexed verseId, uint256 recoveryNonce);
    event RecoveryExecuted(
        uint256 indexed verseId,
        address indexed oldOwner,
        address indexed newOwner,
        uint256 recoveryNonce
    );

    // Meta nonce epoch
    event MetaNonceEpochBumped(uint256 indexed verseId, uint64 newEpoch);

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
        require(verseProfileAddress != address(0), "GuardianModule: zero verseProfile");

        __UUPSUpgradeable_init();
        __Pausable_init();
        __AccessControl_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MODULE_ADMIN_ROLE, admin);
        _grantRole(UPGRADER_ROLE, admin);

        verseProfile = IVerseProfileMinimal(verseProfileAddress);
    }

    // ------------------------------------------------------------------------
    // Modifiers
    // ------------------------------------------------------------------------

    modifier onlyProfileOwner(uint256 verseId) {
        require(verseProfile.ownerOf(verseId) == _msgSender(), "GuardianModule: not owner");
        _;
    }

    modifier notHardFrozen(uint256 verseId) {
        require(!hardFrozen[verseId], "GuardianModule: profile hard frozen");
        _;
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

    function _authorizeUpgrade(address) internal override onlyRole(UPGRADER_ROLE) {}

    // ------------------------------------------------------------------------
    // STEP 1C COMPLETE: upgradeable, role-based, Verse-style skeleton.
    // ------------------------------------------------------------------------
    // Next steps (we'll add incrementally):
    // - Functions to propose/apply guardian sets (with delays + epoch bumps)
    // - Functions to soft/hard freeze and unfreeze
    // - Functions to initiate/cancel/execute recovery
    // - Functions to bump metaNonceEpoch
    // - Signature verification (EIP-712) for guardian approvals
    // - Restricted call into VerseProfile to change owner on successful recovery

    // ------------------------------------------------------------------------
    // Storage gap for future upgrades
    // ------------------------------------------------------------------------
    uint256[44] private __gap;
}
