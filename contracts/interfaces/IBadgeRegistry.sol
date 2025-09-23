// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title IBadgeRegistry
/// @notice Interface for interacting with the BadgeRegistry contract.
interface IBadgeRegistry {
    // -------- Views --------
    function soulbound(uint256 badgeId) external view returns (bool);

    function badgeTier(uint256 badgeId) external view returns (uint8);

    function expiryOf(
        address user,
        uint256 badgeId
    ) external view returns (uint256);

    function hasBadge(
        address user,
        uint256 badgeId
    ) external view returns (bool);

    function hasAny(
        address user,
        uint256[] calldata badgeIds
    ) external view returns (bool);

    function tierOf(
        address user,
        uint256[] calldata considerIds
    ) external view returns (uint8);

    // -------- Mutative (apps/admins) --------
    function mintBadge(address user, uint256 badgeId, uint256 expiry) external;

    function renewBadge(
        address user,
        uint256 badgeId,
        uint256 newExpiry
    ) external;

    function revokeBadge(address user, uint256 badgeId) external;

    function selfBurn(uint256 badgeId) external;

    // -------- ERC1155 compatibility --------
    function balanceOf(
        address account,
        uint256 id
    ) external view returns (uint256);

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes calldata data
    ) external;

    function safeBatchTransferFrom(
        address from,
        address[] calldata tos,
        uint256 id
    ) external;
}
