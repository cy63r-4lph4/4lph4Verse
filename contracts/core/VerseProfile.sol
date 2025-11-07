// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title VerseProfile v2 (Core)
 * @notice Root identity for the 4lph4Verse. Soulbound VerseID per wallet.
 *         Minimal on-chain state; rich off-chain metadata. Modules extend behavior.
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
 *
 * Notes:
 *  - ENS linkage intentionally removed (can live in metadata or a module)
 *  - App-specific nicknames moved to a module to keep core slim
 */

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {EIP712Upgradeable} from "@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {IERC1271} from "@openzeppelin/contracts/interfaces/IERC1271.sol";

interface IVerseModule {
    /**
     * @dev Generic hook for Verse lifecycle events.
     * @param hook   keccak256("onProfileCreated"), keccak256("onHandleChanged"), etc.
     * @param verseId The VerseID the event pertains to
     * @param data   ABI-encoded aux data, schema per hook
     *
     * Expected signatures (examples):
     *   - onProfileCreated: abi.encode(address owner, string handle, string purpose)
     *   - onHandleChanged:  abi.encode(string oldHandle, string newHandle)
     *   - onPurposeUpdated: abi.encode(string newPurpose)
     *   - onMetadataSet:    abi.encode(string newURI)
     *   - onDelegateSet:    abi.encode(address newDelegate)
     */
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
    bytes32 public constant RECOVERY_ROLE = keccak256("RECOVERY_ROLE");

    // -------------------- Hook IDs --------------------
    // (pre-computed constants to save a tiny bit of gas vs keccak at runtime)
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
    }

    uint256 public nextVerseId; // starts at 1

    mapping(uint256 => Profile) private _profiles; // verseId => Profile
    mapping(address => uint256) public profileOf; // wallet  => verseId
    mapping(bytes32 => uint256) private _handleToId; // keccak256(handleLower) => verseId

    // EIP-712 nonces (per verseId)
    mapping(uint256 => uint256) public nonces;

    // Module registry
    mapping(bytes32 => address) public modules; // key => module address

    // Per-hook subscriptions (cheap dispatch)
    mapping(bytes32 => address[]) private _hookSubs; // hook => subscribers

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
        __EIP712_init("VerseProfile", "0.1"); // bump if EIP-712 structs change

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
        return _profiles[verseId];
    }

    function verseIdByHandle(
        string calldata handle
    ) external view returns (uint256) {
        return _handleToId[_handleKey(_normalize(handle))];
    }

    function ownerOf(uint256 verseId) external view returns (address) {
        return _profiles[verseId].owner;
    }

    function hasProfile(address user) external view returns (bool) {
        return profileOf[user] != 0;
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

        // Normalize & claim handle (optional empty handle allowed at creation, but recommended to set)
        string memory norm = _normalize(handle);
        if (bytes(norm).length != 0) {
            bytes32 key = _handleKey(norm);
            uint256 existing = _handleToId[key];
            require(existing == 0, "handle taken");
        }

        verseId = nextVerseId++;
        _profiles[verseId] = Profile({
            owner: sender,
            handle: norm,
            metadataURI: metadataURI,
            purpose: purpose,
            delegate: address(0),
            createdAt: uint64(block.timestamp),
            version: 2
        });
        profileOf[sender] = verseId;

        // Claim handle if provided
        if (bytes(norm).length != 0) {
            _handleToId[_handleKey(norm)] = verseId;
        }

        emit ProfileCreated(verseId, sender, norm, purpose, metadataURI);

        // Minimal synchronous hooks (keep subscriber list short)
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

        // free old
        string memory old = _profiles[verseId].handle;
        if (bytes(old).length != 0) {
            _handleToId[_handleKey(old)] = 0;
        }

        _profiles[verseId].handle = norm;
        _handleToId[key] = verseId;
        emit HandleChanged(verseId, old, norm);

        _trigger(HOOK_ON_HANDLE_CHANGED, verseId, abi.encode(old, norm));
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

        // free old
        string memory old = p.handle;
        if (bytes(old).length != 0) {
            _handleToId[_handleKey(old)] = 0;
        }

        p.handle = norm;
        _handleToId[key] = op.verseId;

        emit HandleChanged(op.verseId, old, norm);
        _trigger(HOOK_ON_HANDLE_CHANGED, op.verseId, abi.encode(old, norm));
    }

    function setMetadataURI(
        uint256 verseId,
        string calldata newURI
    ) external whenNotPaused {
        _requireOwnerOrDelegate(verseId);
        _profiles[verseId].metadataURI = newURI;
        emit MetadataURISet(verseId, newURI);

        // Prefer event-only for most modules; still provide hook for those that opt-in.
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
    // struct for setMetadataWithSig
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

    // (Extend similarly for setPurposeWithSig, setHandleWithSig if desired)

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
     * @notice Grant recovery permissions to a GuardianRecoveryModule (or similar).
     * @dev Callable by PROFILE_ADMIN_ROLE. You can call this multiple times for new modules.
     */
    function grantRecoveryModule(
        address module
    ) external onlyRole(PROFILE_ADMIN_ROLE) {
        require(module != address(0), "VerseProfile: zero module");
        _grantRole(RECOVERY_ROLE, module);
    }

    function subscribeHook(
        bytes32 hook,
        address module
    ) external onlyRole(PROFILE_ADMIN_ROLE) {
        require(module != address(0), "zero module");
        _hookSubs[hook].push(module);
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
     * @dev Only callable by an address with RECOVERY_ROLE (typically GuardianRecoveryModule).
     *
     * Requirements:
     * - verseId must exist
     * - newOwner must be non-zero
     * - newOwner must not already have a profile
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

        // clear old mapping
        profileOf[oldOwner] = 0;
        // set new
        profileOf[newOwner] = verseId;
        p.owner = newOwner;

        if (p.delegate != address(0)) {
            p.delegate = address(0);
            emit DelegateSet(verseId, address(0));
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
    /**
     * @dev Cheap dispatch: only call subscribed modules for this hook.
     * Uses a small gas stipend to avoid griefing; ignore failures.
     */
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
        // ASCII lowercase normalization; extendable to full unicode if needed.
        bytes memory b = bytes(s);
        for (uint256 i; i < b.length; ++i) {
            uint8 c = uint8(b[i]);
            if (c >= 65 && c <= 90) {
                // 'A'..'Z'
                b[i] = bytes1(c + 32);
            }
        }
        return string(b);
    }

    // Resolve EOA vs Smart Account (EIP-1271)
    function _resolveSigner(
        address owner,
        bytes32 digest,
        bytes calldata sig
    ) internal view returns (address) {
        if (owner.code.length == 0) {
            return ECDSA.recover(digest, sig);
        } else {
            bytes4 ok = IERC1271(owner).isValidSignature(digest, sig);
            require(ok == 0x1626ba7e, "bad 1271 sig");
            return owner;
        }
    }

    // -------------------- ERC165 --------------------
    function supportsInterface(
        bytes4 iid
    ) public view override(AccessControlUpgradeable) returns (bool) {
        return super.supportsInterface(iid);
    }

    // -------------------- Storage gap --------------------
    uint256[44] private __gap;
}
