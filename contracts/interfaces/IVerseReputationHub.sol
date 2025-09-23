// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title IVerseReputationHub
/// @notice Minimal interface for logging reputation-related events in the Verse.
interface IVerseReputationHub {
    /// @notice Log that a profile has completed an action in an app.
    /// @param verseId The Verse profile ID of the user.
    /// @param token   The payment/reward token (0 = native).
    /// @param amount  Amount earned (can be 0 if not relevant).
    function logCompleted(uint256 verseId, address token, uint256 amount) external;

    /// @notice Log that a profile has cancelled an action in an app.
    /// @param verseId The Verse profile ID of the user.
    function logCancelled(uint256 verseId) external;

    /// @notice Get detailed activity for a profile in a given app.
    /// @param verseId The Verse profile ID.
    /// @param appId   The app’s identifier (keccak256("HireCore"), etc.).
    /// @param token   Token address to check earned amounts.
    /// @return completed Count of completed actions.
    /// @return cancelled Count of cancelled actions.
    /// @return earned    Total tokens earned for this token.
    function getActivity(
        uint256 verseId,
        bytes32 appId,
        address token
    ) external view returns (uint64 completed, uint64 cancelled, uint256 earned);

    /// @notice Get just the raw counts (no token info).
    function getRawCounts(uint256 verseId, bytes32 appId)
        external
        view
        returns (uint64 completed, uint64 cancelled);
}
