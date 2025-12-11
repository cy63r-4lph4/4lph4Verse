// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/*
 HumanVerificationModule.sol

 - Inherits SelfVerificationRoot from @selfxyz/contracts 
 - On successful Self verification, marks subject as human-verified by verification time and
   writes result back to a VerseProfile contract via a minimal interface.
   When a user is verified, His or her profile can be recovered during compromise by 
   re-verifying in the selfRecovery module without needing a guardian

*/

import "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import {SelfUtils} from "@selfxyz/contracts/contracts/libraries/SelfUtils.sol";
import {SelfStructs} from "@selfxyz/contracts/contracts/libraries/SelfStructs.sol";
import {IIdentityVerificationHubV2} from "@selfxyz/contracts/contracts/interfaces/IIdentityVerificationHubV2.sol";
import {IVerseProfile} from "../interfaces/IVerseProfile.sol";

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
        address indexed subject,
        bytes32 dochash,
        uint256 timestamp
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

        // -----------------------------------------
        // 1. Build minimal verification config
        // -----------------------------------------
        SelfUtils.UnformattedVerificationConfigV2 memory rawCfg = SelfUtils
            .UnformattedVerificationConfigV2({
                olderThan: 0, // No age restriction
                forbiddenCountries: new string[](0), // Allow all countries
                ofacEnabled: false // No sanctions screening
            });

        // -----------------------------------------
        // 2. Format config for the Hub
        // -----------------------------------------
        SelfStructs.VerificationConfigV2 memory formatted = SelfUtils
            .formatVerificationConfigV2(rawCfg);

        // -----------------------------------------
        // 3. Register with the Identity Hub (Self)
        // -----------------------------------------
        verificationConfigId = IIdentityVerificationHubV2(
            identityVerificationHub
        ).setVerificationConfigV2(formatted);
    }

    function customVerificationHook(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
        bytes memory
    ) internal override {
        address subject = address(uint160(output.userIdentifier));
        if (verifiedAt[subject] != 0) revert AlreadyVerified(subject);

        // domain separated human fingerprint v1
        bytes32 dochash = keccak256(
            abi.encode(
                keccak256("alpha:human:v1"),
                output.name,
                output.nationality,
                output.dateOfBirth,
                output.gender,
                output.issuingState
            )
        );

        // mark verified in this module (state before external call)
        verifiedAt[subject] = block.timestamp;

        // write-back to VerseProfile (ensure vp authorizes this module)
        if (verseProfile == address(0)) revert ZeroAddress();
        IVerseProfile vp = IVerseProfile(verseProfile);
        vp.setHumanVerified(subject, dochash);

        emit HumanVerified(subject, dochash, block.timestamp);
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
