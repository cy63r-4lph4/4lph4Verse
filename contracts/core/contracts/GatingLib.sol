// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./BadgeRegistry.sol";

library GatingLib {
    /// @notice Returns true if user has an active badge
    function hasBadge(
        BadgeRegistry reg,
        address user,
        uint256 badgeId
    ) internal view returns (bool) {
        if (address(reg) == address(0)) return false; // gracefully handle missing registry
        return reg.hasBadge(user, badgeId);
    }

    /// @notice Returns true if user has any badge among given ids
    function hasAny(
        BadgeRegistry reg,
        address user,
        uint256[] memory badgeIds
    ) internal view returns (bool) {
        if (address(reg) == address(0)) return false;
        return reg.hasAny(user, badgeIds);
    }

    /// @notice Returns user's tier (0 if no active badges)
    function tierOf(
        BadgeRegistry reg,
        address user,
        uint256[] memory considerIds
    ) internal view returns (uint8) {
        if (address(reg) == address(0)) return 0;
        return reg.tierOf(user, considerIds);
    }

    /// @notice Quick helper: check if user meets at least `minTier`
    function meetsTier(
        BadgeRegistry reg,
        address user,
        uint256[] memory considerIds,
        uint8 minTier
    ) internal view returns (bool) {
        if (address(reg) == address(0)) return false;
        return reg.tierOf(user, considerIds) >= minTier;
    }
}
