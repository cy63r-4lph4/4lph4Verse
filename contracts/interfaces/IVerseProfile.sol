// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title IVerseProfile
/// @notice Interface for interacting with the VerseProfile identity contract.
interface IVerseProfile {
    struct Profile {
        address owner; // wallet or smart account
        string handle; // globally unique, normalized lowercase
        string metadataURI; // ipfs://... or https://...
        string purpose; // human-readable purpose
        address delegate; // optional manager/guardian
        uint64 createdAt; // block.timestamp
        uint8 version; // schema version
        bytes32 dochash; // proof of verification
    }
    struct ProfileSum {
        address owner;
        string handle;
        string metadataURI;
        string purpose;
        address delegate;
        uint64 createdAt;
        uint8 version;
        bool verified;
    }

    // -------- Views --------
    function getProfile(uint256 verseId) external view returns (Profile memory);

    function getDochash(uint256 verseId) external view returns (bytes32);

    function verseIdByHandle(
        string calldata handle
    ) external view returns (uint256);

    function verseIdOfOwner(address owner) external view returns (uint256);

    function getAppNickname(
        uint256 verseId,
        bytes32 appId
    ) external view returns (string memory);

    function verseIdByAppNickname(
        bytes32 appId,
        string calldata nickname
    ) external view returns (uint256);

    function hasProfile(address user) external view returns (bool);

    function getDisplayHandle(
        uint256 verseId,
        bytes32 appId
    ) external view returns (string memory);

    function profileOf(address user) external view returns (uint256);

    // -------- Mutative --------
    function createProfile(
        string calldata verseHandle,
        string calldata metadataURI,
        bytes32 ensNamehash
    ) external returns (uint256 verseId);

    function setVerseHandle(
        uint256 verseId,
        string calldata newHandle
    ) external;

    function recoverySetOwner(uint256 verseId, address newOwner) external;

    function setHumanVerified(address subject, bytes32 dochash) external;

    function setMetadataURI(uint256 verseId, string calldata newURI) external;

    function transferOwnershipOfProfile(
        uint256 verseId,
        address newOwner
    ) external;

    function setAppNickname(
        uint256 verseId,
        bytes32 appId,
        string calldata nickname
    ) external;
}
