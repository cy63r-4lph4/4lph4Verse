// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title IScoreModel
/// @notice Standard interface for per-app scoring models in the Verse.
interface IScoreModel {
    /// @notice Returns the computed score of a given verseId.
    /// @param verseId The Verse profile ID of the user.
    /// @return score The computed score (app-specific units, 0 if none).
    function scoreOf(uint256 verseId) external view returns (uint256 score);
}
