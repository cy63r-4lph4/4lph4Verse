// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VerseProfile
 * @notice Universal identity layer for the 4lph4Verse
 *
 * Phase 1 design (direct interactions):
 * - No ERC2771 / relayer plumbing.
 * - Plain _msgSender() usage (EOA or AA smart account will call directly).
 * - Upgradeable via UUPS.
 *
 * Features:
 * - One profile (VerseID) per wallet
 * - Global unique handle (e.g., @cy63r_4lph4)
 * - Per-app nicknames (scoped to appId)
 * - ENS link (optional)
 * - Minimal onchain state (rich metadata offchain)
 *
 * Reputation & scoring live outside this contract (ReputationHub, ScoreModels).
 */

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract VerseProfile is
    Initializable,
    UUPSUpgradeable,
    PausableUpgradeable,
    AccessControlUpgradeable
{
    // -------- Roles --------
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // -------- Types --------
    struct Profile {
        address owner;
        string verseHandle; // unique across Verse
        string metadataURI; // ipfs://... JSON
        bytes32 ensNamehash; // optional
        uint64 createdAt;
    }

    // -------- Storage --------
    uint256 public nextProfileId;
    mapping(uint256 => Profile) private profiles; // verseId => Profile
    mapping(address => uint256) public profileOf; // wallet => verseId
    mapping(bytes32 => uint256) private handleToId; // keccak(lowercase(handle)) => verseId

    // per-app nicknames
    mapping(bytes32 => mapping(bytes32 => uint256)) private appNickToId; // appId => keccak(nick) => verseId
    mapping(uint256 => mapping(bytes32 => string)) private appNickOf; // verseId => appId => nickname

    // -------- Events --------
    event ProfileCreated(
        uint256 indexed verseId,
        address indexed owner,
        string metadataURI
    );
    event OwnerChanged(
        uint256 indexed verseId,
        address indexed oldOwner,
        address indexed newOwner
    );
    event VerseHandleSet(uint256 indexed verseId, string handle);
    event MetadataURISet(uint256 indexed verseId, string uri);
    event ENSLinked(uint256 indexed verseId, bytes32 namehash);
    event AppNicknameSet(
        uint256 indexed verseId,
        bytes32 indexed appId,
        string nickname
    );

    // -------- UUPS pattern: disable impl init --------
    constructor() {
        _disableInitializers();
    }

    // -------- Init / Upgrade --------
    function initialize(address admin) external initializer {
        require(admin != address(0), "bad admin");

        __UUPSUpgradeable_init();
        __Pausable_init();
        __AccessControl_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);

        nextProfileId = 1;
    }

    function _authorizeUpgrade(
        address
    ) internal override onlyRole(ADMIN_ROLE) {}

    // -------- Helpers --------
    function _key(string memory s) internal pure returns (bytes32) {
        // Frontend should pre-lowercase; contract stays simple.
        return keccak256(bytes(s));
    }

    function _requireOwner(uint256 verseId) internal view {
        require(profiles[verseId].owner == _msgSender(), "not owner");
    }

    // -------- Views --------
    function getProfile(
        uint256 verseId
    )
        external
        view
        returns (
            address owner,
            string memory verseHandle,
            string memory metadataURI,
            bytes32 ensNamehash,
            uint64 createdAt
        )
    {
        Profile storage p = profiles[verseId];
        return (
            p.owner,
            p.verseHandle,
            p.metadataURI,
            p.ensNamehash,
            p.createdAt
        );
    }

    function verseIdByHandle(
        string calldata handle
    ) external view returns (uint256) {
        return handleToId[_key(handle)];
    }

    function getAppNickname(
        uint256 verseId,
        bytes32 appId
    ) external view returns (string memory) {
        return appNickOf[verseId][appId];
    }

    function verseIdByAppNickname(
        bytes32 appId,
        string calldata nickname
    ) external view returns (uint256) {
        return appNickToId[appId][_key(nickname)];
    }

    /// @notice Returns true if a wallet already has a VerseProfile
    function hasProfile(address user) external view returns (bool) {
        return profileOf[user] != 0;
    }

    /// Best display handle for an app context (nickname -> verseHandle -> fallback offchain)
    function getDisplayHandle(
        uint256 verseId,
        bytes32 appId
    ) external view returns (string memory) {
        string memory appNick = appNickOf[verseId][appId];
        if (bytes(appNick).length != 0) return appNick;
        return profiles[verseId].verseHandle;
    }

    // -------- Core: Create / Ensure --------
    function createProfile(
        string calldata verseHandle,
        string calldata metadataURI,
        bytes32 ensNamehash
    ) external whenNotPaused returns (uint256 verseId) {
        address sender = _msgSender();
        require(profileOf[sender] == 0, "already have profile");

        verseId = nextProfileId++;
        profiles[verseId] = Profile({
            owner: sender,
            verseHandle: "",
            metadataURI: metadataURI,
            ensNamehash: ensNamehash,
            createdAt: uint64(block.timestamp)
        });
        profileOf[sender] = verseId;

        emit ProfileCreated(verseId, sender, metadataURI);

        if (bytes(verseHandle).length != 0)
            _setVerseHandle(verseId, verseHandle);
        if (ensNamehash != bytes32(0)) emit ENSLinked(verseId, ensNamehash);
    }

    // -------- Owner actions --------
    function setVerseHandle(
        uint256 verseId,
        string calldata newHandle
    ) external whenNotPaused {
        _requireOwner(verseId);
        _setVerseHandle(verseId, newHandle);
    }

    function _setVerseHandle(
        uint256 verseId,
        string calldata newHandle
    ) internal {
        require(bytes(newHandle).length != 0, "empty handle");
        bytes32 key = _key(newHandle);

        uint256 existing = handleToId[key];
        require(existing == 0 || existing == verseId, "handle taken");

        string memory old = profiles[verseId].verseHandle;
        if (bytes(old).length != 0) handleToId[_key(old)] = 0;

        handleToId[key] = verseId;
        profiles[verseId].verseHandle = newHandle;
        emit VerseHandleSet(verseId, newHandle);
    }

    function setMetadataURI(
        uint256 verseId,
        string calldata newURI
    ) external whenNotPaused {
        _requireOwner(verseId);
        profiles[verseId].metadataURI = newURI;
        emit MetadataURISet(verseId, newURI);
    }

    function linkENS(uint256 verseId, bytes32 namehash) external whenNotPaused {
        _requireOwner(verseId);
        profiles[verseId].ensNamehash = namehash;
        emit ENSLinked(verseId, namehash);
    }

    function transferOwnershipOfProfile(
        uint256 verseId,
        address newOwner
    ) external whenNotPaused {
        _requireOwner(verseId);
        require(newOwner != address(0), "zero");
        require(profileOf[newOwner] == 0, "new owner already has profile");

        address old = profiles[verseId].owner;
        profiles[verseId].owner = newOwner;
        profileOf[old] = 0;
        profileOf[newOwner] = verseId;

        emit OwnerChanged(verseId, old, newOwner);
    }

    // -------- Per-App Nicknames --------
    function setAppNickname(
        uint256 verseId,
        bytes32 appId,
        string calldata nickname
    ) external whenNotPaused {
        _requireOwner(verseId);

        // empty nickname clears value
        bytes32 key = _key(nickname);
        uint256 existing = appNickToId[appId][key];
        require(existing == 0 || existing == verseId, "app nickname taken");

        // clear previous if set
        string memory old = appNickOf[verseId][appId];
        if (bytes(old).length != 0) {
            appNickToId[appId][_key(old)] = 0;
        }

        if (bytes(nickname).length != 0) {
            appNickToId[appId][key] = verseId;
            appNickOf[verseId][appId] = nickname;
        } else {
            appNickOf[verseId][appId] = "";
        }

        emit AppNicknameSet(verseId, appId, nickname);
    }

    // -------- Pause controls --------
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    // -------- Upgrade gap --------
    uint256[41] private __gap;
}
