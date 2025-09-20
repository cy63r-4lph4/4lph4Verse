// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * BadgeRegistry (UUPS, ERC1155 Upgradeable)
 *
 * - Issue badges (ERC1155) to users with optional expiry per user
 * - Per-badge soulbound flag (non-transferable) for reputation-style badges
 * - App-gated minting/renewal/revocation via roles
 * - Simple gating helpers: hasBadge, hasAny, tierOf
 * - Tier model: badgeId -> tier (0..255); user tier = max active tier across held badges
 *
 * Notes:
 * - Amount is expected to be 1 for badges; contract supports 1155 semantics anyway
 * - If you want fully non-transferable registry, set all badgeIds to soulbound = true
 * - Metadata served via baseURI (E.g., ipfs://.../{id}.json)
 */

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract BadgeRegistry is
    ERC1155Upgradeable,
    UUPSUpgradeable,
    PausableUpgradeable,
    AccessControlUpgradeable
{
    // ---- Roles ----
    bytes32 public constant ADMIN_ROLE   = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE  = keccak256("MINTER_ROLE");   // Verse apps allowed to mint/renew
    bytes32 public constant REVOKER_ROLE = keccak256("REVOKER_ROLE");  // Can revoke (burn) badges

    // ---- Storage ----
    // badgeId => isSoulbound
    mapping(uint256 => bool) public soulbound;

    // badgeId => tier (0..255). 0 can mean "no tier"/decorative
    mapping(uint256 => uint8) public badgeTier;

    // user => badgeId => expiry timestamp (0 = no expiry)
    mapping(address => mapping(uint256 => uint256)) public expiryOf;

    // ---- Events ----
    event BadgeMinted(address indexed user, uint256 indexed badgeId, uint256 expiry);
    event BadgeRenewed(address indexed user, uint256 indexed badgeId, uint256 newExpiry);
    event BadgeRevoked(address indexed user, uint256 indexed badgeId);
    event SoulboundSet(uint256 indexed badgeId, bool isSoulbound);
    event TierSet(uint256 indexed badgeId, uint8 tier);

    // ---- Init / Upgrade ----
    function initialize(address admin, string memory baseURI) external initializer {
        __ERC1155_init(baseURI);
        __UUPSUpgradeable_init();
        __Pausable_init();
        __AccessControl_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
    }

    function _authorizeUpgrade(address) internal override onlyRole(ADMIN_ROLE) {}

    // ---- Admin ----
    function setURI(string memory newuri) external onlyRole(ADMIN_ROLE) {
        _setURI(newuri);
        // (Optional) EIP-4906 metadata update event can be emitted by offchain indexers if needed
    }

    function setSoulbound(uint256 badgeId, bool isSoulbound) external onlyRole(ADMIN_ROLE) {
        soulbound[badgeId] = isSoulbound;
        emit SoulboundSet(badgeId, isSoulbound);
    }

    function setBadgeTier(uint256 badgeId, uint8 tier) external onlyRole(ADMIN_ROLE) {
        badgeTier[badgeId] = tier;
        emit TierSet(badgeId, tier);
    }

    function pause() external onlyRole(ADMIN_ROLE) { _pause(); }
    function unpause() external onlyRole(ADMIN_ROLE) { _unpause(); }

    // ---- Mint / Renew / Revoke (Apps) ----
    /// @notice Mint a badge to a user, optionally with expiry (0 = no expiry). Amount defaults to 1.
    function mintBadge(address user, uint256 badgeId, uint256 expiry)
        external
        whenNotPaused
        onlyRole(MINTER_ROLE)
    {
        require(user != address(0), "zero user");
        // If user already holds the badge, treat as renew if expiry extends
        if (balanceOf(user, badgeId) == 0) {
            _mint(user, badgeId, 1, "");
        }
        // set/extend expiry (0 keeps it perpetual)
        if (expiry != 0) {
            require(expiry > block.timestamp, "bad expiry");
            expiryOf[user][badgeId] = expiry;
        } else {
            expiryOf[user][badgeId] = 0;
        }
        emit BadgeMinted(user, badgeId, expiryOf[user][badgeId]);
    }

    /// @notice Renew or set a later expiry for an existing badge.
    function renewBadge(address user, uint256 badgeId, uint256 newExpiry)
        external
        whenNotPaused
        onlyRole(MINTER_ROLE)
    {
        require(balanceOf(user, badgeId) > 0, "not holder");
        require(newExpiry == 0 || newExpiry > block.timestamp, "bad expiry");
        expiryOf[user][badgeId] = newExpiry; // 0 = perpetual
        emit BadgeRenewed(user, badgeId, newExpiry);
    }

    /// @notice Revoke (burn) a user's badge.
    function revokeBadge(address user, uint256 badgeId)
        external
        whenNotPaused
        onlyRole(REVOKER_ROLE)
    {
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
    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data)
        public
        override
    {
        require(!soulbound[id], "soulbound");
        require(_isActive(from, id), "expired");
        super.safeTransferFrom(from, to, id, amount, data);
        // transfer doesn't carry expiry; recipient gets no expiry by default (0 = perpetual)
        // If you want to copy expiry on transfer for transferable types, you can set it here.
    }

    function safeBatchTransferFrom(address from, address[] calldata tos, uint256 id) external {
        // gas-friendly batch for a single id; still respects soulbound/expiry
        require(!soulbound[id], "soulbound");
        require(_isActive(from, id), "expired");
        for (uint256 i = 0; i < tos.length; i++) {
            super.safeTransferFrom(from, tos[i], id, 1, "");
        }
    }

    // ---- Gating Helpers ----
    /// @notice Whether a user currently holds an active (non-expired or perpetual) badge.
    function hasBadge(address user, uint256 badgeId) public view returns (bool) {
        if (balanceOf(user, badgeId) == 0) return false;
        return _isActive(user, badgeId);
    }

    /// @notice True if user has any active badge among the provided ids.
    function hasAny(address user, uint256[] calldata badgeIds) external view returns (bool) {
        for (uint256 i = 0; i < badgeIds.length; i++) {
            if (hasBadge(user, badgeIds[i])) return true;
        }
        return false;
    }

    /// @notice Compute user's tier as the max tier across active badges.
    function tierOf(address user, uint256[] calldata considerIds) external view returns (uint8 tier) {
        for (uint256 i = 0; i < considerIds.length; i++) {
            uint256 id = considerIds[i];
            if (hasBadge(user, id)) {
                uint8 t = badgeTier[id];
                if (t > tier) tier = t;
            }
        }
    }

    // ---- Internal ----
    function _isActive(address user, uint256 badgeId) internal view returns (bool) {
        uint256 exp = expiryOf[user][badgeId];
        return exp == 0 || exp > block.timestamp;
    }

    // ---- Hooks ----
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
        // block transfers for soulbound badges (mints/burns still allowed)
        if (from != address(0) && to != address(0)) {
            for (uint256 i = 0; i < ids.length; i++) {
                require(!soulbound[ids[i]], "soulbound");
                require(_isActive(from, ids[i]), "expired");
            }
        }
    }

    // ---- Storage gap ----
    uint256[41] private __gap;
}
