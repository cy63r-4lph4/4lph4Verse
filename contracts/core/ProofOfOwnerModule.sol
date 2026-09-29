// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/*
 ProofOfOwnerModule.sol  (replaces selfRecoveryModule.sol)

 ---------------------------------------------------------------------------
 ARCHITECTURE NOTE (v2): two independent factors, one narrow door
 ---------------------------------------------------------------------------
 The old selfRecoveryModule accepted a Self proof alone and called
 VerseProfile.recoverySetOwner directly -- instant, single-factor, and blind
 to guardian freeze state. This version requires TWO independent factors to
 agree before doing anything:

   1. A Self proof (document authenticity + demographic attributes),
      recomputed into a salted commitment and compared against the
      profile's stored commitment.
   2. A liveness/face-match attestation (via ILivenessVerifier) binding a
      live, present human to the same verification session -- proving
      whoever is here now is not just someone holding a stolen document.

 Even with both factors satisfied, this module NEVER calls
 VerseProfile.recoverySetOwner. It calls
 GuardianRecoveryModule.initiateRecoveryViaProof, which only OPENS a
 delayed, freeze-aware, cancelable case in the single shared recovery state
 machine (see GuardianRecoveryModule and the design doc, Sections 3-4). This
 is deliberate: no single verification method, however strong, should be
 able to finalize an irreversible ownership change instantly. The delay and
 cancel rights are what protect against coercion and vendor-level spoofing
 that neither factor alone can rule out.
 ---------------------------------------------------------------------------
*/

import "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {SelfUtils} from "@selfxyz/contracts/contracts/libraries/SelfUtils.sol";
import {SelfStructs} from "@selfxyz/contracts/contracts/libraries/SelfStructs.sol";
import {IIdentityVerificationHubV2} from "@selfxyz/contracts/contracts/interfaces/IIdentityVerificationHubV2.sol";
import {IVerseProfile} from "../interfaces/IVerseProfile.sol";
import {IGuardianRecoveryModuleMinimal} from "../interfaces/IGuardianRecoveryModuleMinimal.sol";
import {ILivenessVerifier} from "../interfaces/ILivenessVerifier.sol";

contract ProofOfOwnerModule is AccessControl, SelfVerificationRoot {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    /// @notice reference to VerseProfile contract (single source of truth)
    address public verseProfile;

    /// @notice reference to GuardianRecoveryModule -- the ONLY contract this
    ///         module is permitted to call to affect ownership, and even
    ///         then only via `initiateRecoveryViaProof`, never directly.
    IGuardianRecoveryModuleMinimal public guardianModule;

    /// @notice reference to the liveness/face-match vendor. Swappable by
    ///         admin without touching this contract's logic -- see
    ///         ILivenessVerifier and LivenessVerifierECDSA.
    ILivenessVerifier public livenessVerifier;

    /// @notice config id returned by getConfigId (optional)
    bytes32 public verificationConfigId;

    /// @notice scope seed recorded locally (for SDK/frontend)
    string public scopeSeed = "proof-of-owner";

    /// @dev Passed through Self's `userData` field. Carries everything
    ///      needed to also check liveness in the same transaction.
    struct RecoveryProofData {
        address subject; // profile whose ownership is being reclaimed
        bytes32 sessionId; // liveness vendor's session id (single-use)
        uint64 issuedAt; // liveness attestation issuance time
        uint64 expiresAt; // liveness attestation expiry
        bytes32 docPortraitHash; // optional: binds liveness check to the same document
        bytes livenessSignature; // vendor attestation signature
    }

    event ProofOfOwnerRecoveryInitiated(
        uint256 indexed verseId,
        address indexed newOwner,
        bytes32 sessionId,
        uint256 timestamp
    );
    event VerificationConfigIdUpdated(bytes32 configId);
    event VerseProfileUpdated(address indexed verseProfile);
    event GuardianModuleUpdated(address indexed guardianModule);
    event LivenessVerifierUpdated(address indexed livenessVerifier);

    error ZeroAddress();
    error DocHashMismatch();
    error ProfileNotVerified();
    error NoProfileForSubject();
    error LivenessCheckFailed();

    constructor(
        address identityVerificationHub,
        address guardianModuleAddress,
        address livenessVerifierAddress
    ) SelfVerificationRoot(identityVerificationHub, scopeSeed) {
        require(guardianModuleAddress != address(0), "ProofOfOwner: zero guardian module");
        require(livenessVerifierAddress != address(0), "ProofOfOwner: zero liveness verifier");

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);

        guardianModule = IGuardianRecoveryModuleMinimal(guardianModuleAddress);
        livenessVerifier = ILivenessVerifier(livenessVerifierAddress);

        SelfUtils.UnformattedVerificationConfigV2 memory rawCfg = SelfUtils
            .UnformattedVerificationConfigV2({
                olderThan: 0,
                forbiddenCountries: new string[](0),
                ofacEnabled: false
            });

        SelfStructs.VerificationConfigV2 memory formatted = SelfUtils
            .formatVerificationConfigV2(rawCfg);

        verificationConfigId = IIdentityVerificationHubV2(
            identityVerificationHub
        ).setVerificationConfigV2(formatted);
    }

    function customVerificationHook(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
        bytes memory userData
    ) internal override {
        RecoveryProofData memory data = abi.decode(userData, (RecoveryProofData));
        address subject = data.subject;

        address verifier = address(uint160(output.userIdentifier));
        require(verifier != address(0), "ProofOfOwner: invalid verifier");

        if (verseProfile == address(0)) revert ZeroAddress();
        IVerseProfile vp = IVerseProfile(verseProfile);

        uint256 verseId = vp.verseIdOfOwner(subject);
        if (verseId == 0) revert NoProfileForSubject();

        bytes32 storedCommitment = vp.getCommitment(verseId);
        if (storedCommitment == bytes32(0)) revert ProfileNotVerified();

        // -----------------------------------------------------------
        // Factor 1: recompute the salted commitment and compare.
        // -----------------------------------------------------------
        bytes32 salt = vp.getRecoverySalt(verseId);
        bytes32 computedCommitment = keccak256(
            abi.encode(
                keccak256("alpha:human:v2"),
                salt,
                output.name,
                output.nationality,
                output.dateOfBirth,
                output.gender,
                output.issuingState
            )
        );
        if (computedCommitment != storedCommitment) revert DocHashMismatch();

        // -----------------------------------------------------------
        // Factor 2: liveness / face-match, independent of the document
        // proof above. This is the check that rules out "attacker holds
        // subject's stolen physical document" -- a valid Self proof alone
        // is NOT sufficient past this point.
        // -----------------------------------------------------------
        bool live = livenessVerifier.verifyLiveness(
            verifier,
            data.sessionId,
            data.issuedAt,
            data.expiresAt,
            data.docPortraitHash,
            data.livenessSignature
        );
        if (!live) revert LivenessCheckFailed();

        // -----------------------------------------------------------
        // Both factors satisfied: OPEN a case in the shared recovery
        // pipeline. This call can still revert (hard frozen, cooldown
        // active, recovery already in progress) -- that's intentional;
        // this module has no authority to override those conditions.
        // -----------------------------------------------------------
        guardianModule.initiateRecoveryViaProof(verseId, verifier);

        emit ProofOfOwnerRecoveryInitiated(
            verseId,
            verifier,
            data.sessionId,
            block.timestamp
        );
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

    function setGuardianModule(
        address _guardianModule
    ) external onlyRole(ADMIN_ROLE) {
        if (_guardianModule == address(0)) revert ZeroAddress();
        guardianModule = IGuardianRecoveryModuleMinimal(_guardianModule);
        emit GuardianModuleUpdated(_guardianModule);
    }

    /// @notice Swap the liveness vendor without touching verification logic.
    function setLivenessVerifier(
        address _livenessVerifier
    ) external onlyRole(ADMIN_ROLE) {
        if (_livenessVerifier == address(0)) revert ZeroAddress();
        livenessVerifier = ILivenessVerifier(_livenessVerifier);
        emit LivenessVerifierUpdated(_livenessVerifier);
    }

    function setConfigId(bytes32 configId_) external onlyRole(ADMIN_ROLE) {
        verificationConfigId = configId_;
        emit VerificationConfigIdUpdated(configId_);
    }

    // -------------------------
    // Self override to provide config id for verification
    // -------------------------
    function getConfigId(
        bytes32,
        bytes32,
        bytes memory
    ) public view override returns (bytes32) {
        return verificationConfigId;
    }
}
