// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/*
 HumanVerificationModule.sol

 - Inherits SelfVerificationRoot from @selfxyz/contracts (your installed package)
 - On successful Self verification, marks subject as human-verified and
   writes result back to a VerseProfile contract via a minimal interface.

*/

import "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

interface IVerseProfile {
    function setHumanVerified(address subject, bytes32 dochash) external;
}

contract HumanVerificationModule is AccessControl, SelfVerificationRoot {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    /// @notice reference to VerseProfile contract (single source of truth)
    address public verseProfile;

    /// @notice config id returned by getConfigId (optional)
    bytes32 public verificationConfigId;

    /// @notice  scope seed recorded locally (for SDK/frontend)
    string public scopeSeed = "proof-of-alpha";

    /// @notice mapping to track when an address was verified
    mapping(address => uint256) public verifiedAt;

    /// @notice events
    event HumanVerified(
        ISelfVerificationRoot.GenericDiscloseOutputV2 output,
        uint256 timestamp,
        bytes userData
    );
    event HumanRevoked(
        address indexed subject,
        address operator,
        uint256 timestamp
    );
    event VerificationConfigIdUpdated(bytes32 configId);
    event VerseProfileUpdated(address indexed verseProfile);

    error ZeroAddress();
    error AlreadyVerified(address who);
    error NotVerified(address who);

    constructor(
        address identityVerificationHub
    ) SelfVerificationRoot(identityVerificationHub, scopeSeed) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    function customVerificationHook(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
        bytes memory userData
    ) internal override {
        address subject;
        bytes32 dochash;
        if (userData.length == 20) {
            // packed 20-byte address from abi.encodePacked(address)
            subject = address(uint160(bytes20(userData)));
        } else {
            // standard abi.encode(address)
            subject = abi.decode(userData, (address));
        }

        if (verifiedAt[subject] != 0) {
            revert AlreadyVerified(subject);
        }
        dochash = keccak256(
            abi.encode(
                output.name,
                output.idNumber,
                output.nationality,
                output.dateOfBirth,
                output.gender
            )
        );

        // mark verified in this module
        verifiedAt[subject] = block.timestamp;

        // write-back to VerseProfile (single source of truth)
        // We call the external contract; ensure VerseProfile permits this module (access control).
        if (verseProfile == address(0)) revert ZeroAddress();
        IVerseProfile vp = IVerseProfile(verseProfile);

        vp.setHumanVerified(subject, dochash);

        emit HumanVerified(output, block.timestamp, userData);
    }

    // -------------------------
    // Admin utilities
    // -------------------------
    function setVerseProfile(
        address _verseProfile
    ) external onlyRole(ADMIN_ROLE) {
        if (_verseProfile == address(0)) revert ZeroAddress();
        verseProfile = _verseProfile;
        emit VerseProfileUpdated(_verseProfile);
    }

    function setConfigId(bytes32 configId_) external onlyRole(ADMIN_ROLE) {
        verificationConfigId = configId_;
        emit VerificationConfigIdUpdated(configId_);
    }

    /// Admin-revoke verification and sync back to VerseProfile
    function revokeVerification(address subject) external onlyRole(ADMIN_ROLE) {
        if (verifiedAt[subject] == 0) revert NotVerified(subject);
        verifiedAt[subject] = 0;
        if (verseProfile == address(0)) revert ZeroAddress();
        IVerseProfile(verseProfile).setHumanVerified(subject, bytes32(""));
        emit HumanRevoked(subject, msg.sender, block.timestamp);
    }

    // -------------------------
    // Self override to provide config id for verification
    // -------------------------
    // This returns the config id to the hub when requested. Frontend and contract config must match.
    function getConfigId(
        bytes32,
        bytes32,
        bytes memory
    ) public view override returns (bytes32) {
        return verificationConfigId;
    }

    // -------------------------
    // View helpers
    // -------------------------
    function isHuman(address who) external view returns (bool) {
        return verifiedAt[who] != 0;
    }
}
