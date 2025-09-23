// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title IVerseAppRegistry
/// @notice Read-only interface for VerseAppRegistry.
interface IVerseAppRegistry {
    struct App {
        string name;
        address writer;
        address scoreModel;
        uint16 weightBps;   // 0..10000
        bool active;
    }

    // Views
    function getApp(bytes32 appId) external view returns (App memory);
    function allAppIds() external view returns (bytes32[] memory);
    function appConfigOf(bytes32 appId) external view returns (
        address writer,
        address scoreModel,
        uint16 weightBps,
        bool active
    );
    function isActive(bytes32 appId) external view returns (bool);
    function isWriter(bytes32 appId, address candidate) external view returns (bool);
    function computeAppScore(bytes32 appId, uint256 verseId) external view returns (uint256 rawScore, uint16 weightBps);
}
