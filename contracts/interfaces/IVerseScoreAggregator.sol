// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title IVerseScoreAggregator
/// @notice Interface for reading global and per-app scores from the VerseScoreAggregator.
interface IVerseScoreAggregator {
    struct AppPart {
        bytes32 appId;
        uint256 rawScore;      // score from the app's model
        uint16  weightBps;     // weighting from registry
        uint256 weightedScore; // rawScore * weightBps / 10000
        bool    active;        // registry flag
        address scoreModel;    // model used (0 if none)
    }

    /// @notice Registry contract that manages apps
    function registry() external view returns (address);

    /// @notice Returns total weighted score + per-app breakdown for a verseId
    function fullScore(uint256 verseId) external view returns (uint256 total, AppPart[] memory parts);

    /// @notice Convenience: just the summed global score
    function globalScore(uint256 verseId) external view returns (uint256 total);

    /// @notice Per-app score preview (raw + weighted) for one appId
    function appScore(
        bytes32 appId,
        uint256 verseId
    )
        external
        view
        returns (
            uint256 raw,
            uint256 weighted,
            uint16 weightBps,
            bool active,
            address scoreModel
        );
}
