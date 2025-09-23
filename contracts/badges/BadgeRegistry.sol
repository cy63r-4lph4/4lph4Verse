// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title BadgeRegistry
 * @notice ERC1155-based badge system for 4lph4Verse (UUPS upgradeable).
 *
 * Features
 * - Issue badges (ERC1155) with optional per-user expiry.
 * - Per-badge soulbound flag (non-transferable).
 * - App-gated mint/renew/revoke via roles (MINTER_ROLE / REVOKER_ROLE).
 * - Gating helpers: hasBadge, hasAny, tierOf.
 * - Tier model: badgeId -> tier (0..255); user tier = max active tier among held badges.
 *
 * Notes
 * - Amount is expected to be 1 per badge; ERC1155 semantics still supported.
 * - Set all badges soulbound=true to make registry fully non-transferable.
 * - Metadata: baseURI like ipfs://.../{id}.json (set via setURI).
 */

import {ERC1155Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract BadgeRegistry is
    ERC1155Upgradeable,
    UUPSUpgradeable,
    PausableUpgradeable,
    AccessControlUpgradeable
{
    // ---- Roles ----
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE"); // Verse apps allowed to mint/renew
    bytes32 public constant REVOKER_ROLE = keccak256("REVOKER_ROLE"); // Can revoke (burn) badges

    // ---- Storage ----
    // badgeId => isSoulbound
    mapping(uint256 => bool) public soulbound;

    // badgeId => tier (0..255). 0 can mean "no tier"/decorative
    mapping(uint256 => uint8) public badgeTier;

    // user => badgeId => expiry timestamp (0 = no expiry)
    mapping(address => mapping(uint256 => uint256)) public expiryOf;

    // ---- Events ----
    event BadgeMinted(
        address indexed user,
        uint256 indexed badgeId,
        uint256 expiry
    );
    event BadgeRenewed(
        address indexed user,
        uint256 indexed badgeId,
        uint256 newExpiry
    );
    event BadgeRevoked(address indexed user, uint256 indexed badgeId);
    event SoulboundSet(uint256 indexed badgeId, bool isSoulbound);
    event TierSet(uint256 indexed badgeId, uint8 tier);

    // ---- Constructor (upgrade-safe) ----
    constructor() {
        _disableInitializers();
    }

    // ---- Init / Upgrade ----
    function initialize(
        address admin,
        string memory baseURI
    ) external initializer {
        __ERC1155_init(baseURI);
        __UUPSUpgradeable_init();
        __Pausable_init();
        __AccessControl_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
    }

    function _authorizeUpgrade(
        address
    ) internal override onlyRole(ADMIN_ROLE) {}

    // ---- Admin ----
    function setURI(string memory newuri) external onlyRole(ADMIN_ROLE) {
        _setURI(newuri);
        // Optional: emit EIP-4906 events offchain if needed
    }

    function setSoulbound(
        uint256 badgeId,
        bool isSoulbound
    ) external onlyRole(ADMIN_ROLE) {
        soulbound[badgeId] = isSoulbound;
        emit SoulboundSet(badgeId, isSoulbound);
    }

    function setBadgeTier(
        uint256 badgeId,
        uint8 tier
    ) external onlyRole(ADMIN_ROLE) {
        badgeTier[badgeId] = tier;
        emit TierSet(badgeId, tier);
    }

    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    // ---- Mint / Renew / Revoke (Apps) ----
    /// @notice Mint a badge to a user, optionally with expiry (0 = no expiry). Amount defaults to 1.
    function mintBadge(
        address user,
        uint256 badgeId,
        uint256 expiry
    ) external whenNotPaused onlyRole(MINTER_ROLE) {
        require(user != address(0), "zero user");
        if (balanceOf(user, badgeId) == 0) {
            _mint(user, badgeId, 1, "");
        }
        if (expiry != 0) {
            require(expiry > block.timestamp, "bad expiry");
            expiryOf[user][badgeId] = expiry;
        } else {
            expiryOf[user][badgeId] = 0; // perpetual
        }
        emit BadgeMinted(user, badgeId, expiryOf[user][badgeId]);
    }

    /// @notice Renew or set a new expiry for an existing badge (0 = perpetual).
    function renewBadge(
        address user,
        uint256 badgeId,
        uint256 newExpiry
    ) external whenNotPaused onlyRole(MINTER_ROLE) {
        require(balanceOf(user, badgeId) > 0, "not holder");
        require(newExpiry == 0 || newExpiry > block.timestamp, "bad expiry");
        expiryOf[user][badgeId] = newExpiry;
        emit BadgeRenewed(user, badgeId, newExpiry);
    }

    /// @notice Revoke (burn) a user's badge.
    function revokeBadge(
        address user,
        uint256 badgeId
    ) external whenNotPaused onlyRole(REVOKER_ROLE) {
        require(balanceOf(user, badgeId) > 0, "not holder");
        expiryOf[user][badgeId] = 0;
        _burn(user, badgeId, 1);
        emit BadgeRevoked(user, badgeId);
    }

    /// @notice Users can self-burn their badge.
    function selfBurn(uint256 badgeId) external whenNotPaused {
        require(balanceOf(msg.sender, badgeId) > 0, "not holder");
        expiryOf[msg.sender][badgeId] = 0;
        _burn(msg.sender, badgeId, 1);
        emit BadgeRevoked(msg.sender, badgeId);
    }

    // ---- Transfers (respect soulbound + expiry) ----
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override {
        require(!soulbound[id], "soulbound");
        require(_isActive(from, id), "expired");
        super.safeTransferFrom(from, to, id, amount, data);
        // Note: expiry not propagated; recipient gets no expiry by default (0 = perpetual).
    }

    /// @notice One-to-many convenience for a single badge id (1 unit each).
    function safeBatchTransferFrom(
        address from,
        address[] calldata tos,
        uint256 id
    ) external {
        require(!soulbound[id], "soulbound");
        require(_isActive(from, id), "expired");
        for (uint256 i = 0; i < tos.length; i++) {
            super.safeTransferFrom(from, tos[i], id, 1, "");
        }
    }

    // ---- Gating Helpers ----
    /// @notice Whether a user currently holds an active (non-expired or perpetual) badge.
    function hasBadge(
        address user,
        uint256 badgeId
    ) public view returns (bool) {
        if (balanceOf(user, badgeId) == 0) return false;
        return _isActive(user, badgeId);
    }

    /// @notice True if user has any active badge among the provided ids.
    function hasAny(
        address user,
        uint256[] calldata badgeIds
    ) external view returns (bool) {
        for (uint256 i = 0; i < badgeIds.length; i++) {
            if (hasBadge(user, badgeIds[i])) return true;
        }
        return false;
    }

    /// @notice Compute user's tier as the max tier across active badges.
    function tierOf(
        address user,
        uint256[] calldata considerIds
    ) external view returns (uint8 tier) {
        for (uint256 i = 0; i < considerIds.length; i++) {
            uint256 id = considerIds[i];
            if (hasBadge(user, id)) {
                uint8 t = badgeTier[id];
                if (t > tier) tier = t;
            }
        }
    }

    // ---- Internal ----
    function _isActive(
        address user,
        uint256 badgeId
    ) internal view returns (bool) {
        uint256 exp = expiryOf[user][badgeId];
        return exp == 0 || exp > block.timestamp;
    }

    // ---- Hooks ----
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override whenNotPaused {
        super._update(from, to, ids, values);

        // block transfers for soulbound badges (mints/burns still allowed)
        if (from != address(0) && to != address(0)) {
            for (uint256 i = 0; i < ids.length; i++) {
                require(!soulbound[ids[i]], "soulbound");
                require(_isActive(from, ids[i]), "expired");
            }
        }
    }

    /// @inheritdoc ERC1155Upgradeable
    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(AccessControlUpgradeable, ERC1155Upgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // ---- Storage gap ----
    uint256[41] private __gap;
}
