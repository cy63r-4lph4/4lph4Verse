// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title VerseProfile v2 (Core)
 * @notice Root identity for the 4lph4Verse. Soulbound VerseID per wallet.
 *         Minimal on-chain state; rich off-chain metadata. Modules extend behavior.
 *
 * ---------------------------------------------------------------------------
 * ARCHITECTURE NOTE (v2): commitment replaces dochash
 * ---------------------------------------------------------------------------
 * The old `dochash` was a bare hash of demographic facts (name, nationality,
 * DOB, gender, issuing state). Those facts are not secret, so the hash was
 * precomputable off-chain by anyone who knew them -- and because it was also
 * used as a bearer credential for recovery, that made it a permanent,
 * non-expiring attack surface.
 *
 * `commitment` fixes this by folding in a per-profile `recoverySalt`,
 * generated once at profile creation from unpredictable on-chain entropy.
 * The salt is not itself secret (knowing it doesn't let anyone forge a
 * matching Self proof), but it removes the ability to precompute a matching
 * commitment purely from public biographical facts. See the recovery design
 * doc, Section 6.
 * ---------------------------------------------------------------------------
 *
 * Key features:
 *  - One profile per wallet (soulbound; no transfers)
 *  - Global unique handle (case-insensitive via normalization)
 *  - Purpose tag (why this profile exists in the Verse)
 *  - Metadata URI (ipfs:// or https://)
 *  - Delegate/guardian for management
 *  - UUPS upgradeability + roles + pausable
 *  - EIP-712 meta-transactions for gasless updates
 *  - Module system with per-hook subscriptions and cheap dispatch
 */

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {EIP712Upgradeable} from "@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {IERC1271} from "@openzeppelin/contracts/interfaces/IERC1271.sol";

interface IVerseModule {
    function onVerseEvent(
        bytes32 hook,
        uint256 verseId,
        bytes calldata data
    ) external;
}

contract VerseProfile is
    Initializable,
    UUPSUpgradeable,
    PausableUpgradeable,
    AccessControlUpgradeable,
    EIP712Upgradeable
{
    using ECDSA for bytes32;

    // -------------------- Roles --------------------
    bytes32 public constant PROFILE_ADMIN_ROLE =
        keccak256("PROFILE_ADMIN_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    /// @dev Granted to recovery modules (e.g. GuardianRecoveryModule) that
    ///      are allowed to call `recoverySetOwner`. Never granted to a
    ///      proof-of-owner module directly -- see design doc Section 3.
    bytes32 public constant RECOVERY_ROLE = keccak256("RECOVERY_ROLE");
    /// @dev Granted to verification modules (e.g. HumanVerificationModule)
    ///      that are allowed to write a new commitment.
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    // -------------------- Hook IDs --------------------
    bytes32 public constant HOOK_ON_PROFILE_CREATED =
        keccak256("onProfileCreated");
    bytes32 public constant HOOK_ON_HANDLE_CHANGED =
        keccak256("onHandleChanged");
    bytes32 public constant HOOK_ON_PURPOSE_UPDATED =
        keccak256("onPurposeUpdated");
    bytes32 public constant HOOK_ON_METADATA_SET = keccak256("onMetadataSet");
    bytes32 public constant HOOK_ON_DELEGATE_SET = keccak256("onDelegateSet");

    // -------------------- Types & Storage --------------------
    struct Profile {
        address owner; // wallet or smart account
        string handle; // globally unique, normalized lowercase
        string metadataURI; // ipfs://... or https://...
        string purpose; // human-readable purpose
        address delegate; // optional manager/guardian
        uint64 createdAt; // block.timestamp
        uint8 version; // schema version
        bytes32 commitment; // salted proof-of-verification commitment (was `dochash`)
    }
    struct ProfileSum {
        address owner;
        string handle;
        string metadataURI;
        string purpose;
        address delegate;
        uint64 createdAt;
        uint8 version;
        bool verified;
    }

    uint256 public nextVerseId; // starts at 1

    mapping(uint256 => Profile) private _profiles; // verseId => Profile
    mapping(address => uint256) public profileOf; // wallet  => verseId
    mapping(bytes32 => uint256) private _handleToId; // keccak256(handleLower) => verseId

    /// @notice Per-profile salt, set once at creation. Folded into
    ///         `commitment` so it can never be precomputed from public
    ///         biographical facts alone.
    mapping(uint256 => bytes32) private _recoverySalt; // verseId => salt

    // EIP-712 nonces (per verseId)
    mapping(uint256 => uint256) public nonces;
    mapping(address => uint256) public createNonces;

    // Module registry
    mapping(bytes32 => address) public modules; // key => module address

    // Per-hook subscriptions (cheap dispatch)
    mapping(bytes32 => address[]) private _hookSubs; // hook => subscribers

    // -------------------- Constants --------------------

    bytes4 constant _ERC1271_MAGIC = 0x1626ba7e;

    // -------------------- Events --------------------
    event ProfileCreated(
        uint256 indexed verseId,
        address indexed owner,
        string handle,
        string purpose,
        string metadataURI
    );
    event HandleChanged(
        uint256 indexed verseId,
        string oldHandle,
        string newHandle
    );
    event MetadataURISet(uint256 indexed verseId, string newURI);
    event PurposeUpdated(uint256 indexed verseId, string newPurpose);
    event DelegateSet(uint256 indexed verseId, address indexed delegate);
    event ModuleRegistered(bytes32 indexed key, address indexed module);
    event ModuleRemoved(bytes32 indexed key, address indexed module);
    event HookSubscribed(bytes32 indexed hook, address indexed module);
    event HookUnsubscribed(bytes32 indexed hook, address indexed module);
    event ModuleCallFailed(
        bytes32 indexed hook,
        uint256 indexed verseId,
        address indexed module
    );
    event OwnerRecovered(
        uint256 indexed verseId,
        address indexed oldOwner,
        address indexed newOwner
    );
    event DelegateResetByRecovery(
        uint256 indexed verseId,
        address indexed oldDelegate
    );
    event HumanVerified(uint256 indexed verseId);
    event HumanVerificationRevoked(uint256 indexed verseId);

    // -------------------- UUPS: disable impl init --------------------
    constructor() {
        _disableInitializers();
    }

    // -------------------- Initialize --------------------
    function initialize(address admin) external initializer {
        require(admin != address(0), "bad admin");

        __UUPSUpgradeable_init();
        __Pausable_init();
        __AccessControl_init();
        __EIP712_init("VerseProfile", "0.2"); // bumped: EIP-712 struct set unchanged, but commitment scheme changed

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(PROFILE_ADMIN_ROLE, admin);
        _grantRole(UPGRADER_ROLE, admin);

        nextVerseId = 1;
    }

    // -------------------- Access / Upgrade --------------------
    function _authorizeUpgrade(
        address
    ) internal override onlyRole(UPGRADER_ROLE) {}

    // -------------------- Views --------------------
    function getProfile(
        uint256 verseId
    ) external view returns (Profile memory) {
        require(_profiles[verseId].owner != address(0), "Invalid profile");
        return _profiles[verseId];
    }

    function getProfileByHandle(
        string calldata handle
    ) external view returns (Profile memory) {
        uint256 verseId = _handleToId[_handleKey(_normalize(handle))];
        require(verseId != 0, "Handle not found");
        return _profiles[verseId];
    }

    /// @notice Salted commitment for a profile's human-verification proof.
    ///         Replaces the old `getDochash`. Not sensitive by itself --
    ///         recovering ownership still requires an actual verified proof,
    ///         not just knowledge of the commitment or salt -- but modules
    ///         should treat it as internal plumbing, not a public credential.
    function getCommitment(uint256 verseId) external view returns (bytes32) {
        return _profiles[verseId].commitment;
    }

    /// @notice Per-profile salt used to compute `commitment`. Exposed so
    ///         authorized verification modules can recompute the commitment
    ///         to compare against a fresh proof.
    function getRecoverySalt(uint256 verseId) external view returns (bytes32) {
        require(_profiles[verseId].owner != address(0), "Invalid profile");
        return _recoverySalt[verseId];
    }

    function verseIdByHandle(
        string calldata handle
    ) external view returns (uint256) {
        return _handleToId[_handleKey(_normalize(handle))];
    }

    function verseIdOfOwner(address owner) external view returns (uint256) {
        return profileOf[owner];
    }

    function ownerOf(uint256 verseId) external view returns (address) {
        require(_profiles[verseId].owner != address(0), "Invalid profile");
        return _profiles[verseId].owner;
    }

    function hasProfile(address user) external view returns (bool) {
        return profileOf[user] != 0;
    }

    function getProfileSummary(
        uint256 verseId
    ) external view returns (ProfileSum memory) {
        require(_profiles[verseId].owner != address(0), "Invalid profile");

        Profile memory p = _profiles[verseId];

        return
            ProfileSum({
                owner: p.owner,
                handle: p.handle,
                metadataURI: p.metadataURI,
                purpose: p.purpose,
                delegate: p.delegate,
                createdAt: p.createdAt,
                version: p.version,
                verified: p.commitment != bytes32(0)
            });
    }

    function profileExists(uint256 verseId) external view returns (bool) {
        return _profiles[verseId].owner != address(0);
    }

    function getProfileByOwner(
        address owner
    ) external view returns (Profile memory p, uint256 verseId) {
        verseId = profileOf[owner];
        require(verseId != 0, "VerseProfile: no profile");
        p = _profiles[verseId];
    }

    function isHandleAvailable(
        string calldata handle
    ) external view returns (bool) {
        string memory norm = _normalize(handle);
        if (bytes(norm).length == 0) return false;
        return _handleToId[_handleKey(norm)] == 0;
    }

    function isOwnerOrDelegate(
        uint256 verseId,
        address account
    ) external view returns (bool) {
        Profile storage p = _profiles[verseId];
        if (p.owner == address(0)) return false;
        return account == p.owner || account == p.delegate;
    }

    function domainSeparator() external view returns (bytes32) {
        return _domainSeparatorV4();
    }

    // -------------------- Core: Create --------------------
    function createProfile(
        string calldata handle,
        string calldata metadataURI,
        string calldata purpose
    ) external whenNotPaused returns (uint256 verseId) {
        address sender = _msgSender();
        require(profileOf[sender] == 0, "already have profile");

        string memory norm = _normalize(handle);
        require(bytes(norm).length != 0, "empty handle");

        bytes32 key = _handleKey(norm);
        uint256 existing = _handleToId[key];
        require(existing == 0, "handle taken");

        verseId = nextVerseId++;
        _profiles[verseId] = Profile({
            owner: sender,
            handle: norm,
            metadataURI: metadataURI,
            purpose: purpose,
            delegate: address(0),
            createdAt: uint64(block.timestamp),
            version: 2,
            commitment: bytes32(0)
        });
        profileOf[sender] = verseId;
        _handleToId[key] = verseId;

        _recoverySalt[verseId] = _generateSalt(verseId, sender);

        emit ProfileCreated(verseId, sender, norm, purpose, metadataURI);

        _trigger(
            HOOK_ON_PROFILE_CREATED,
            verseId,
            abi.encode(sender, norm, purpose)
        );
    }

    // -------------------- Owner/Delegate actions --------------------
    function setHandle(
        uint256 verseId,
        string calldata newHandle
    ) external whenNotPaused {
        _requireOwnerOrDelegate(verseId);

        string memory norm = _normalize(newHandle);
        require(bytes(norm).length != 0, "empty handle");
        bytes32 key = _handleKey(norm);

        uint256 existing = _handleToId[key];
        require(existing == 0 || existing == verseId, "handle taken");

        string memory old = _profiles[verseId].handle;
        if (bytes(old).length != 0) {
            _handleToId[_handleKey(old)] = 0;
        }

        _profiles[verseId].handle = norm;
        _handleToId[key] = verseId;
        emit HandleChanged(verseId, old, norm);

        _trigger(HOOK_ON_HANDLE_CHANGED, verseId, abi.encode(old, norm));
    }

    function setMetadataURI(
        uint256 verseId,
        string calldata newURI
    ) external whenNotPaused {
        _requireOwnerOrDelegate(verseId);
        _profiles[verseId].metadataURI = newURI;
        emit MetadataURISet(verseId, newURI);
        _trigger(HOOK_ON_METADATA_SET, verseId, abi.encode(newURI));
    }

    function setPurpose(
        uint256 verseId,
        string calldata newPurpose
    ) external whenNotPaused {
        _requireOwnerOrDelegate(verseId);
        _profiles[verseId].purpose = newPurpose;
        emit PurposeUpdated(verseId, newPurpose);
        _trigger(HOOK_ON_PURPOSE_UPDATED, verseId, abi.encode(newPurpose));
    }

    function setDelegate(
        uint256 verseId,
        address newDelegate
    ) external whenNotPaused {
        _requireOwnerOrDelegate(verseId);
        _profiles[verseId].delegate = newDelegate;
        emit DelegateSet(verseId, newDelegate);
        _trigger(HOOK_ON_DELEGATE_SET, verseId, abi.encode(newDelegate));
    }

    // -------------------- Gasless: EIP-712 meta-ops --------------------
    struct CreateProfileWithSig {
        address owner;
        string handle;
        string metadataURI;
        string purpose;
        uint256 nonce;
        uint256 deadline;
    }

    bytes32 private constant _CREATE_PROFILE_TYPEHASH =
        keccak256(
            "CreateProfileWithSig(address owner,string handle,string metadataURI,string purpose,uint256 nonce,uint256 deadline)"
        );

    function createProfileWithSig(
        CreateProfileWithSig calldata op,
        bytes calldata sig
    ) external whenNotPaused returns (uint256 verseId) {
        require(block.timestamp <= op.deadline, "expired");
        require(op.nonce == createNonces[op.owner], "bad nonce");
        createNonces[op.owner]++;
        require(profileOf[op.owner] == 0, "already have profile");

        string memory norm = _normalize(op.handle);
        require(bytes(norm).length != 0, "empty handle");

        bytes32 key = _handleKey(norm);
        uint256 existing = _handleToId[key];
        require(existing == 0, "handle taken");

        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    _CREATE_PROFILE_TYPEHASH,
                    op.owner,
                    keccak256(bytes(norm)),
                    keccak256(bytes(op.metadataURI)),
                    keccak256(bytes(op.purpose)),
                    op.nonce,
                    op.deadline
                )
            )
        );

        address signer = _resolveSigner(op.owner, digest, sig);
        require(signer == op.owner, "not owner");

        verseId = nextVerseId++;
        _profiles[verseId] = Profile({
            owner: op.owner,
            handle: norm,
            metadataURI: op.metadataURI,
            purpose: op.purpose,
            delegate: address(0),
            createdAt: uint64(block.timestamp),
            version: 2,
            commitment: bytes32(0)
        });

        profileOf[op.owner] = verseId;
        _handleToId[key] = verseId;
        _recoverySalt[verseId] = _generateSalt(verseId, op.owner);

        emit ProfileCreated(
            verseId,
            op.owner,
            norm,
            op.purpose,
            op.metadataURI
        );
        _trigger(
            HOOK_ON_PROFILE_CREATED,
            verseId,
            abi.encode(op.owner, norm, op.purpose)
        );
    }

    /**
     * @notice Set (or update) the human-verification commitment for a
     *         subject's profile. Callable only by VERIFIER_ROLE holders
     *         (e.g. HumanVerificationModule), which are responsible for
     *         deciding whether this is a first-time verification or an
     *         owner-authenticated renewal before calling this.
     */
    function setHumanVerifiedCommitment(
        address subject,
        bytes32 commitment
    ) external onlyRole(VERIFIER_ROLE) {
        uint256 verseId = profileOf[subject];
        require(verseId != 0, "VerseProfile: no profile");
        Profile storage p = _profiles[verseId];
        p.commitment = commitment;
        if (commitment == bytes32(0)) {
            emit HumanVerificationRevoked(verseId);
        } else {
            emit HumanVerified(verseId);
        }
    }

    struct SetURIWithSig {
        uint256 verseId;
        string newURI;
        uint256 nonce;
        uint256 deadline;
    }
    bytes32 private constant _SET_URI_TYPEHASH =
        keccak256(
            "SetURIWithSig(uint256 verseId,string newURI,uint256 nonce,uint256 deadline)"
        );

    function setMetadataWithSig(
        SetURIWithSig calldata op,
        bytes calldata sig
    ) external whenNotPaused {
        require(block.timestamp <= op.deadline, "expired");
        require(op.nonce == nonces[op.verseId]++, "bad nonce");

        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    _SET_URI_TYPEHASH,
                    op.verseId,
                    keccak256(bytes(op.newURI)),
                    op.nonce,
                    op.deadline
                )
            )
        );
        Profile storage p = _profiles[op.verseId];
        require(p.owner != address(0), "VerseProfile: no profile");

        address signer = _resolveSigner(p.owner, digest, sig);
        require(signer == p.owner, "not owner");

        p.metadataURI = op.newURI;
        emit MetadataURISet(op.verseId, op.newURI);
        _trigger(HOOK_ON_METADATA_SET, op.verseId, abi.encode(op.newURI));
    }

    struct SetDelegateWithSig {
        uint256 verseId;
        address newDelegate;
        uint256 nonce;
        uint256 deadline;
    }

    bytes32 private constant _SET_DELEGATE_TYPEHASH =
        keccak256(
            "SetDelegateWithSig(uint256 verseId,address newDelegate,uint256 nonce,uint256 deadline)"
        );

    function setDelegateWithSig(
        SetDelegateWithSig calldata op,
        bytes calldata sig
    ) external whenNotPaused {
        require(block.timestamp <= op.deadline, "expired");
        require(op.nonce == nonces[op.verseId]++, "bad nonce");

        Profile storage p = _profiles[op.verseId];
        require(p.owner != address(0), "VerseProfile: no profile");

        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    _SET_DELEGATE_TYPEHASH,
                    op.verseId,
                    op.newDelegate,
                    op.nonce,
                    op.deadline
                )
            )
        );

        address signer = _resolveSigner(p.owner, digest, sig);
        require(signer == p.owner, "not owner");

        p.delegate = op.newDelegate;
        emit DelegateSet(op.verseId, op.newDelegate);
        _trigger(HOOK_ON_DELEGATE_SET, op.verseId, abi.encode(op.newDelegate));
    }

    struct SetPurposeWithSig {
        uint256 verseId;
        string newPurpose;
        uint256 nonce;
        uint256 deadline;
    }

    bytes32 private constant _SET_PURPOSE_TYPEHASH =
        keccak256(
            "SetPurposeWithSig(uint256 verseId,string newPurpose,uint256 nonce,uint256 deadline)"
        );

    function setPurposeWithSig(
        SetPurposeWithSig calldata op,
        bytes calldata sig
    ) external whenNotPaused {
        require(block.timestamp <= op.deadline, "expired");
        require(op.nonce == nonces[op.verseId]++, "bad nonce");

        Profile storage p = _profiles[op.verseId];
        require(p.owner != address(0), "VerseProfile: no profile");

        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    _SET_PURPOSE_TYPEHASH,
                    op.verseId,
                    keccak256(bytes(op.newPurpose)),
                    op.nonce,
                    op.deadline
                )
            )
        );

        address signer = _resolveSigner(p.owner, digest, sig);
        require(signer == p.owner, "not owner");

        p.purpose = op.newPurpose;
        emit PurposeUpdated(op.verseId, op.newPurpose);
        _trigger(
            HOOK_ON_PURPOSE_UPDATED,
            op.verseId,
            abi.encode(op.newPurpose)
        );
    }

    struct SetHandleWithSig {
        uint256 verseId;
        string newHandle;
        uint256 nonce;
        uint256 deadline;
    }

    bytes32 private constant _SET_HANDLE_TYPEHASH =
        keccak256(
            "SetHandleWithSig(uint256 verseId,string newHandle,uint256 nonce,uint256 deadline)"
        );

    function setHandleWithSig(
        SetHandleWithSig calldata op,
        bytes calldata sig
    ) external whenNotPaused {
        require(block.timestamp <= op.deadline, "expired");
        require(op.nonce == nonces[op.verseId]++, "bad nonce");

        Profile storage p = _profiles[op.verseId];
        require(p.owner != address(0), "VerseProfile: no profile");

        string memory norm = _normalize(op.newHandle);
        require(bytes(norm).length != 0, "empty handle");
        bytes32 key = _handleKey(norm);

        uint256 existing = _handleToId[key];
        require(existing == 0 || existing == op.verseId, "handle taken");

        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    _SET_HANDLE_TYPEHASH,
                    op.verseId,
                    keccak256(bytes(norm)),
                    op.nonce,
                    op.deadline
                )
            )
        );

        address signer = _resolveSigner(p.owner, digest, sig);
        require(signer == p.owner, "not owner");

        string memory old = p.handle;
        if (bytes(old).length != 0) {
            _handleToId[_handleKey(old)] = 0;
        }

        p.handle = norm;
        _handleToId[key] = op.verseId;

        emit HandleChanged(op.verseId, old, norm);
        _trigger(HOOK_ON_HANDLE_CHANGED, op.verseId, abi.encode(old, norm));
    }

    // -------------------- Module Registry --------------------
    function registerModule(
        bytes32 key,
        address module
    ) external onlyRole(PROFILE_ADMIN_ROLE) {
        require(module != address(0), "zero module");
        modules[key] = module;
        emit ModuleRegistered(key, module);
    }

    function removeModule(bytes32 key) external onlyRole(PROFILE_ADMIN_ROLE) {
        address old = modules[key];
        modules[key] = address(0);
        emit ModuleRemoved(key, old);
    }

    /**
     * @notice Grant RECOVERY_ROLE to a GuardianRecoveryModule (or similar).
     * @dev Callable by PROFILE_ADMIN_ROLE. You can call this multiple times
     *      for new modules. NEVER grant this to a proof-of-owner module
     *      directly -- only to the module that enforces the delayed,
     *      cancelable recovery state machine.
     */
    function grantRecoveryModule(
        address module
    ) external onlyRole(PROFILE_ADMIN_ROLE) {
        require(module != address(0), "VerseProfile: zero module");
        _grantRole(RECOVERY_ROLE, module);
    }

    /**
     * @notice Grant VERIFIER_ROLE to a HumanVerificationModule (or similar).
     */
    function grantVerifierModule(
        address module
    ) external onlyRole(PROFILE_ADMIN_ROLE) {
        require(module != address(0), "VerseProfile: zero module");
        _grantRole(VERIFIER_ROLE, module);
    }

    function subscribeHook(
        bytes32 hook,
        address module
    ) external onlyRole(PROFILE_ADMIN_ROLE) {
        require(module != address(0), "zero module");
        address[] storage arr = _hookSubs[hook];
        for (uint i = 0; i < arr.length; i++)
            require(arr[i] != module, "already subscribed");
        arr.push(module);
        emit HookSubscribed(hook, module);
    }

    function unsubscribeHook(
        bytes32 hook,
        address module
    ) external onlyRole(PROFILE_ADMIN_ROLE) {
        address[] storage arr = _hookSubs[hook];
        uint256 n = arr.length;
        for (uint256 i; i < n; ++i) {
            if (arr[i] == module) {
                arr[i] = arr[n - 1];
                arr.pop();
                emit HookUnsubscribed(hook, module);
                break;
            }
        }
    }

    function getHookSubscribers(
        bytes32 hook
    ) external view returns (address[] memory) {
        return _hookSubs[hook];
    }

    /**
     * @notice Set a new owner for a VerseID during recovery.
     * @dev Only callable by an address with RECOVERY_ROLE (the
     *      GuardianRecoveryModule -- and ONLY that module; proof-of-owner
     *      modules must never hold this role, see design doc Section 3).
     */
    function recoverySetOwner(
        uint256 verseId,
        address newOwner
    ) external onlyRole(RECOVERY_ROLE) {
        require(newOwner != address(0), "VerseProfile: zero new owner");

        Profile storage p = _profiles[verseId];
        address oldOwner = p.owner;
        require(oldOwner != address(0), "VerseProfile: no profile");
        require(
            profileOf[newOwner] == 0,
            "VerseProfile: new owner already has profile"
        );

        profileOf[oldOwner] = 0;
        profileOf[newOwner] = verseId;
        p.owner = newOwner;

        if (p.delegate != address(0)) {
            address oldDelegate = p.delegate;
            p.delegate = address(0);
            emit DelegateResetByRecovery(verseId, oldDelegate);
        }

        emit OwnerRecovered(verseId, oldOwner, newOwner);
    }

    // -------------------- Pause controls --------------------
    function pause() external onlyRole(PROFILE_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PROFILE_ADMIN_ROLE) {
        _unpause();
    }

    // -------------------- Internal: Hook Dispatch (cheap) --------------------
    function _trigger(
        bytes32 hook,
        uint256 verseId,
        bytes memory data
    ) internal {
        address[] memory subs = _hookSubs[hook];
        uint256 len = subs.length;
        for (uint256 i; i < len; ++i) {
            address m = subs[i];
            if (m == address(0)) continue;

            (bool success, ) = m.call{gas: 50_000}(
                abi.encodeWithSelector(
                    IVerseModule.onVerseEvent.selector,
                    hook,
                    verseId,
                    data
                )
            );

            if (!success) emit ModuleCallFailed(hook, verseId, m);
        }
    }

    // -------------------- Internal: Utils --------------------
    function _requireOwnerOrDelegate(uint256 verseId) internal view {
        Profile storage p = _profiles[verseId];
        address s = _msgSender();
        require(s == p.owner || s == p.delegate, "no auth");
    }

    function _handleKey(string memory lower) internal pure returns (bytes32) {
        return keccak256(bytes(lower));
    }

    function _normalize(string memory s) internal pure returns (string memory) {
        bytes memory b = bytes(s);
        for (uint256 i; i < b.length; ++i) {
            uint8 c = uint8(b[i]);
            if (c >= 65 && c <= 90) {
                b[i] = bytes1(c + 32);
            }
        }
        return string(b);
    }

    /// @dev Salt source uses prevrandao + timestamp + verseId + owner. Not
    ///      adversarially unpredictable against a validator-level attacker,
    ///      but that's fine here: the salt's job is only to prevent
    ///      *offline precomputation from public biographical facts*, not to
    ///      resist a miner/validator targeting one specific profile. If a
    ///      stronger guarantee is later required, swap in a VRF.
    function _generateSalt(
        uint256 verseId,
        address owner_
    ) internal view returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    verseId,
                    owner_,
                    block.prevrandao,
                    block.timestamp,
                    address(this)
                )
            );
    }

    // Resolve EOA vs Smart Account (EIP-1271)
    function _resolveSigner(
        address owner_,
        bytes32 digest,
        bytes calldata sig
    ) internal view returns (address) {
        if (owner_.code.length == 0) {
            return ECDSA.recover(digest, sig);
        } else {
            bytes4 ok = IERC1271(owner_).isValidSignature(digest, sig);
            require(ok == _ERC1271_MAGIC, "bad 1271 sig");
            return owner_;
        }
    }

    // -------------------- ERC165 --------------------
    function supportsInterface(
        bytes4 iid
    ) public view override(AccessControlUpgradeable) returns (bool) {
        return super.supportsInterface(iid);
    }

    // -------------------- Storage gap --------------------
    uint256[43] private __gap;
}
