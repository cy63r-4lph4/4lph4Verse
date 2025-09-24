// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@verse/contracts/interfaces/IScoreModel.sol";
import "@verse/contracts/interfaces/IVerseReputationHub.sol";

// ---------- External Interfaces ----------

/// @title ScoreModelBase
/// @notice Abstract base for app-specific scoring models in the 4lph4Verse.
/// @dev Each app should deploy its own score model extending this base and override `_computeScore`.
abstract contract ScoreModelBase is IScoreModel {
    /// @notice The fixed appId this model scores (e.g., keccak256("HireCore")).
    bytes32 public immutable appId;

    /// @notice Reputation hub address (read-only).
    IVerseReputationHub public immutable reputationHub;

    constructor(bytes32 _appId, address _hub) {
        require(_appId != 0, "bad appId");
        require(_hub != address(0), "bad hub");
        appId = _appId;
        reputationHub = IVerseReputationHub(_hub);
    }

    /// @inheritdoc IScoreModel
    function scoreOf(uint256 verseId) external view override returns (uint256) {
        return _computeScore(verseId);
    }

    /// @notice Hook for child contracts: implement app-specific scoring logic.
    /// @param verseId The Verse profile ID to score.
    /// @return score Computed score.
    function _computeScore(
        uint256 verseId
    ) internal view virtual returns (uint256 score);
}
