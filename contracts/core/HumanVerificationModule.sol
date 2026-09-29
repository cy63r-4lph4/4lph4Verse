// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/*
 HumanVerificationModule.sol

 - Inherits SelfVerificationRoot from @selfxyz/contracts
 - On successful Self verification, marks subject as human-verified and
   writes a SALTED COMMITMENT back to VerseProfile (see design doc Section 6;
   this replaces the old bare `dochash`).

 ---------------------------------------------------------------------------
 ARCHITECTURE NOTE (v2): first verification vs. renewal are different trust levels
 ---------------------------------------------------------------------------
 - FIRST-TIME verification (verifiedAt[subject] == 0): no prior key needed --
   there's nothing to protect yet. A valid Self proof alone is sufficient to
   set the initial commitment.
 - RENEWAL (verifiedAt[subject] != 0, e.g. after a passport renewal): this
   now REQUIRES a fresh EIP-712 signature from the profile's CURRENT owner,
   carried inside the Self `userData` field and checked in this hook. This
   closes the gap where a stable, renewal-friendly hash was also treated as
   a passive bearer credential -- renewal is now an authenticated owner
   action ("I still have my key, I'm just refreshing my document"), not
   something a bare matching proof can trigger by itself.
 - Passive, non-owner-signed proofs (i.e. genuine key-loss recovery) are
   handled exclusively by ProofOfOwnerModule, which never calls this
   contract's write path -- it goes through GuardianRecoveryModule's delayed,
   cancelable pipeline instead. This module and that module intentionally do
   not share a write path.
 ---------------------------------------------------------------------------
*/

import "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {SelfUtils} from "@selfxyz/contracts/contracts/libraries/SelfUtils.sol";
import {SelfStructs} from "@selfxyz/contracts/contracts/libraries/SelfStructs.sol";
import {IIdentityVerificationHubV2} from "@selfxyz/contracts/contracts/interfaces/IIdentityVerificationHubV2.sol";
import {IVerseProfile} from "../interfaces/IVerseProfile.sol";

contract HumanVerificationModule is AccessControl, EIP712, SelfVerificationRoot {
    using ECDSA for bytes32;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    /// @notice reference to VerseProfile contract (single source of truth)
    address public verseProfile;

    /// @notice config id returned by getConfigId (optional)
    bytes32 public verificationConfigId;

    /// @notice scope seed recorded locally (for SDK/frontend)
    string public scopeSeed = "proof-of-alpha";

    /// @notice mapping to track when an address was first verified
    mapping(address => uint256) public verifiedAt;

    /// @notice nonces for owner-signed renewal authorizations
    mapping(address => uint256) public renewNonces;

    bytes32 private constant _RENEW_TYPEHASH =
        keccak256(
            "RenewHumanVerification(address subject,uint256 nonce,uint256 deadline)"
        );

    /// @dev Passed through Self's `userData` field. `ownerSignature` is
    ///      required (and checked) only when the subject has already been
    ///      verified before; ignored on first-time verification.
    struct RenewalAuth {
        address subject;
        uint256 nonce;
        uint256 deadline;
        bytes ownerSignature;
    }

    event HumanVerified(
        address indexed subject,
        bytes32 commitment,
        uint256 timestamp,
        bool wasRenewal
    );
    event HumanRevoked(
        address indexed subject,
        address operator,
        uint256 timestamp
    );
    event VerificationConfigIdUpdated(bytes32 configId);
    event VerseProfileUpdated(address indexed verseProfile);

    error ZeroAddress();
    error NotVerified(address who);
    error RenewalAuthExpired();
    error RenewalBadNonce();
    error RenewalNotOwner(address signer, address expectedOwner);

    constructor(
        address identityVerificationHub
    )
        EIP712("HumanVerificationModule", "1")
        SelfVerificationRoot(identityVerificationHub, scopeSeed)
    {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);

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
        RenewalAuth memory auth = abi.decode(userData, (RenewalAuth));
        address subject = auth.subject;
        require(subject != address(0), "HumanVerification: zero subject");

        // Sanity: the Self proof's own identifier should agree with the
        // subject the caller claims this is for.
        address proofSubject = address(uint160(output.userIdentifier));
        require(
            proofSubject == subject,
            "HumanVerification: subject mismatch"
        );

        bool wasRenewal = verifiedAt[subject] != 0;

        if (wasRenewal) {
            // Renewal: require a fresh signature from the CURRENT profile
            // owner authorizing this specific renewal. This is the piece
            // that makes renewal an authenticated owner action rather than
            // a passive hash-match anyone holding a proof can trigger.
            if (block.timestamp > auth.deadline) revert RenewalAuthExpired();
            if (auth.nonce != renewNonces[subject]) revert RenewalBadNonce();
            renewNonces[subject]++;

            if (verseProfile == address(0)) revert ZeroAddress();
            IVerseProfile vp = IVerseProfile(verseProfile);
            uint256 verseId = vp.verseIdOfOwner(subject);
            require(verseId != 0, "HumanVerification: no profile");
            address currentOwner = vp.ownerOf(verseId);

            bytes32 digest = _hashTypedDataV4(
                keccak256(
                    abi.encode(
                        _RENEW_TYPEHASH,
                        subject,
                        auth.nonce,
                        auth.deadline
                    )
                )
            );
            address signer = digest.recover(auth.ownerSignature);
            if (signer != currentOwner) {
                revert RenewalNotOwner(signer, currentOwner);
            }
        } else {
            verifiedAt[subject] = block.timestamp;
        }

        if (verseProfile == address(0)) revert ZeroAddress();
        IVerseProfile vp = IVerseProfile(verseProfile);
        uint256 verseId = vp.verseIdOfOwner(subject);
        require(verseId != 0, "HumanVerification: no profile");

        bytes32 salt = vp.getRecoverySalt(verseId);
        bytes32 commitment = keccak256(
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

        vp.setHumanVerifiedCommitment(subject, commitment);
        emit HumanVerified(subject, commitment, block.timestamp, wasRenewal);
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
    function revokeVerification(
        address subject
    ) external onlyRole(ADMIN_ROLE) {
        if (verifiedAt[subject] == 0) revert NotVerified(subject);
        verifiedAt[subject] = 0;
        if (verseProfile == address(0)) revert ZeroAddress();
        IVerseProfile(verseProfile).setHumanVerifiedCommitment(
            subject,
            bytes32(0)
        );
        emit HumanRevoked(subject, msg.sender, block.timestamp);
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

    // -------------------------
    // View helpers
    // -------------------------
    function isHuman(address who) external view returns (bool) {
        return verifiedAt[who] != 0;
    }

    function domainSeparator() external view returns (bytes32) {
        return _domainSeparatorV4();
    }
}
