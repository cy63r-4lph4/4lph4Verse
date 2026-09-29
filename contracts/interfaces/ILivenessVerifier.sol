// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ILivenessVerifier
 * @notice Generic interface for a liveness / face-match vendor. Decouples
 *         ProofOfOwnerModule from any specific vendor's integration pattern:
 *         swap the concrete implementation (or point at a vendor's own
 *         on-chain verifier that implements this interface) without touching
 *         ProofOfOwnerModule at all.
 *
 * Design intent (see recovery design doc, Section 7):
 *  - `verifyLiveness` proves a live human, face-matched against the ID
 *    document photo, was present for this specific verification session.
 *  - It says nothing about document authenticity (that's Self's job) or
 *    about who the human's wallet is (that's the commitment-matching job in
 *    ProofOfOwnerModule) -- it only proves "a real, present, face-matched
 *    human completed this session."
 *  - Sessions are single-use (see `isSessionConsumed`) to prevent replay.
 */
interface ILivenessVerifier {
    /**
     * @notice Verify a vendor attestation binding `subject` to a live,
     *         face-matched verification session. Consumes the session
     *         (marks it used) on success.
     * @param subject          Wallet address the attestation is bound to.
     * @param sessionId        Vendor's unique session identifier (single-use).
     * @param issuedAt         Timestamp the vendor issued the attestation.
     * @param expiresAt        Timestamp after which the attestation is invalid.
     * @param docPortraitHash  Vendor's hash of the ID-document portrait used
     *                         for the face match (binds this liveness check
     *                         to the same document Self read, if the vendor
     *                         supports that binding; pass bytes32(0) if not).
     * @param signature        Vendor's signature/proof over the above fields.
     * @return valid           True if well-formed, vendor-signed, unexpired,
     *                         and not already consumed.
     */
    function verifyLiveness(
        address subject,
        bytes32 sessionId,
        uint64 issuedAt,
        uint64 expiresAt,
        bytes32 docPortraitHash,
        bytes calldata signature
    ) external returns (bool valid);

    /// @notice Whether a given session has already been consumed (replay check).
    function isSessionConsumed(bytes32 sessionId) external view returns (bool);
}
