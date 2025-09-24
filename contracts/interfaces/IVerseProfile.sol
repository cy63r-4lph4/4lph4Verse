// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title IVerseProfile
/// @notice Interface for interacting with the VerseProfile identity contract.
interface IVerseProfile {
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
        );

    function verseIdByHandle(string calldata handle) external view returns (uint256);

    function getAppNickname(uint256 verseId, bytes32 appId) external view returns (string memory);

    function verseIdByAppNickname(bytes32 appId, string calldata nickname) external view returns (uint256);

    function hasProfile(address user) external view returns (bool);

    function getDisplayHandle(uint256 verseId, bytes32 appId) external view returns (string memory);

    function profileOf(address user) external view returns (uint256);

    // -------- Mutative --------
    function createProfile(
        string calldata verseHandle,
        string calldata metadataURI,
        bytes32 ensNamehash
    ) external returns (uint256 verseId);

    function setVerseHandle(uint256 verseId, string calldata newHandle) external;

    function setMetadataURI(uint256 verseId, string calldata newURI) external;

    function linkENS(uint256 verseId, bytes32 namehash) external;

    function transferOwnershipOfProfile(uint256 verseId, address newOwner) external;

    function setAppNickname(uint256 verseId, bytes32 appId, string calldata nickname) external;
}
