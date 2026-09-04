// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/*
 ProofOfOwner.sol

 - Inherits SelfVerificationRoot from @selfxyz/contracts 
 - On successful Self verification, recovers the profile of a user
   writes result back to a VerseProfile contract via a minimal interface.

*/

import "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {SelfUtils} from "@selfxyz/contracts/contracts/libraries/SelfUtils.sol";
import {SelfStructs} from "@selfxyz/contracts/contracts/libraries/SelfStructs.sol";
import {IIdentityVerificationHubV2} from "@selfxyz/contracts/contracts/interfaces/IIdentityVerificationHubV2.sol";
import {IVerseProfile} from "../interfaces/IVerseProfile.sol";

contract selfRecoveryModule is AccessControl, SelfVerificationRoot {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    /// @notice reference to VerseProfile contract (single source of truth)
    address public verseProfile;

    /// @notice config id returned by getConfigId (optional)
    bytes32 public verificationConfigId;

    /// @notice  scope seed recorded locally (for SDK/frontend)
    string public scopeSeed = "proof-of-owner";

    /// @notice events
    event HumanVerified(
        ISelfVerificationRoot.GenericDiscloseOutputV2 output,
        uint256 timestamp,
        bytes userData
    );

    event VerificationConfigIdUpdated(bytes32 configId);
    event VerseProfileUpdated(address indexed verseProfile);

    error ZeroAddress();
    error NotVerified(address who);

    constructor(
        address identityVerificationHub
    ) SelfVerificationRoot(identityVerificationHub, scopeSeed) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);

        // -----------------------------------------
        // Build  verification config
        // -----------------------------------------
        SelfUtils.UnformattedVerificationConfigV2 memory rawCfg = SelfUtils
            .UnformattedVerificationConfigV2({
                olderThan: 0, // No age restriction
                forbiddenCountries: new string[](0), // Allow all countries
                ofacEnabled: false // No sanctions screening
            });

        // -----------------------------------------
        // Format config for the Hub
        // -----------------------------------------
        SelfStructs.VerificationConfigV2 memory formatted = SelfUtils
            .formatVerificationConfigV2(rawCfg);

        // -----------------------------------------
        // Register with the Identity Hub (Self)
        // -----------------------------------------
        verificationConfigId = IIdentityVerificationHubV2(
            identityVerificationHub
        ).setVerificationConfigV2(formatted);
    }

    function customVerificationHook(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
        bytes memory userData
    ) internal override {
        address subject = abi.decode(userData, (address));
        address verifier = address(uint160(output.userIdentifier));
        require(verifier != address(0), "INVALID_VERIFIER");
        bytes32 dochash;

        dochash = keccak256(
            abi.encode(
                keccak256("alpha:human:v1"),
                output.name,
                output.nationality,
                output.dateOfBirth,
                output.gender,
                output.issuingState
            )
        );

        if (verseProfile == address(0)) revert ZeroAddress();
        IVerseProfile vp = IVerseProfile(verseProfile);
        uint256 verseId = vp.verseIdOfOwner(subject);
        require(verseId != 0, "NO_PROFILE_FOR_SUBJECT");

        bytes32 verifiedHash = vp.getDochash(verseId);
        require(verifiedHash != bytes32(""), "PROFILE_NOT_VERIFIED");

        require(verifiedHash == dochash, "DOCHASH_MISMATCH");

        vp.recoverySetOwner(verseId, verifier);
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
}
