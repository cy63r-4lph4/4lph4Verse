// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IVerseProfile
 * @notice Minimal interface consumed by external modules (guardian recovery,
 *         human verification, proof-of-owner). `commitment` replaces the old
 *         `dochash`: it is salted per-profile so it can no longer be
 *         precomputed offline from public biographical facts (see recovery
 *         design doc, Section 6).
 */
interface IVerseProfile {
    function ownerOf(uint256 verseId) external view returns (address);

    function hasProfile(address user) external view returns (bool);

    function verseIdOfOwner(address owner) external view returns (uint256);

    /// @dev Restricted to RECOVERY_ROLE holders (e.g. GuardianRecoveryModule).
    function recoverySetOwner(uint256 verseId, address newOwner) external;

    /// @notice Salted commitment of the subject's verified demographic proof.
    function getCommitment(uint256 verseId) external view returns (bytes32);

    /// @notice Per-profile salt used to compute `commitment`. Not itself a
    ///         secret -- knowing it does not let anyone forge a matching
    ///         Self proof -- but keeping it non-trivial to enumerate is
    ///         still good hygiene.
    function getRecoverySalt(uint256 verseId) external view returns (bytes32);

    /// @dev Restricted to VERIFIER_ROLE holders (e.g. HumanVerificationModule).
    function setHumanVerifiedCommitment(
        address subject,
        bytes32 commitment
    ) external;
}
