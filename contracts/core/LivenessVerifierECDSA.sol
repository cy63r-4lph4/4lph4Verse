// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title LivenessVerifierECDSA
 * @notice Vendor-agnostic default implementation of ILivenessVerifier.
 *
 * Integration pattern: the liveness vendor performs the face-match/liveness
 * check off-chain and returns a signed EIP-712 attestation to the app, which
 * relays it on-chain in the same transaction as the Self proof. This
 * contract only checks: (a) the signature comes from a registered vendor
 * signer, (b) the attestation hasn't expired, (c) the session hasn't
 * already been consumed.
 *
 * This is intentionally the generic placeholder described as "Option C" in
 * the recovery design doc. Replace VENDOR_SIGNER_ROLE holders with a real
 * vendor's signing key once one is chosen, or swap this whole contract for
 * a vendor-provided on-chain verifier -- ProofOfOwnerModule only depends on
 * ILivenessVerifier, so neither change requires touching that module.
 */

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ILivenessVerifier} from "../interfaces/ILivenessVerifier.sol";

contract LivenessVerifierECDSA is AccessControl, EIP712, ILivenessVerifier {
    using ECDSA for bytes32;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VENDOR_SIGNER_ROLE = keccak256("VENDOR_SIGNER_ROLE");

    bytes32 private constant _LIVENESS_TYPEHASH =
        keccak256(
            "LivenessAttestation(address subject,bytes32 sessionId,uint64 issuedAt,uint64 expiresAt,bytes32 docPortraitHash)"
        );

    mapping(bytes32 => bool) private _consumedSessions;

    event LivenessVerified(
        address indexed subject,
        bytes32 indexed sessionId,
        bytes32 docPortraitHash
    );
    event VendorSignerUpdated(address indexed signer, bool enabled);

    error SessionAlreadyConsumed(bytes32 sessionId);
    error AttestationExpired(bytes32 sessionId);
    error InvalidSigner(address signer);

    constructor(address admin) EIP712("LivenessVerifierECDSA", "1") {
        require(admin != address(0), "Liveness: bad admin");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
    }

    /// @notice Add or remove a trusted vendor signing key.
    /// @dev In production this should be behind a multisig/timelock admin,
    ///      not a single EOA -- see design doc Section 9 (residual risks).
    function setVendorSigner(
        address signer,
        bool enabled
    ) external onlyRole(ADMIN_ROLE) {
        require(signer != address(0), "Liveness: zero signer");
        if (enabled) {
            _grantRole(VENDOR_SIGNER_ROLE, signer);
        } else {
            _revokeRole(VENDOR_SIGNER_ROLE, signer);
        }
        emit VendorSignerUpdated(signer, enabled);
    }

    function isSessionConsumed(bytes32 sessionId) external view returns (bool) {
        return _consumedSessions[sessionId];
    }

    /// @inheritdoc ILivenessVerifier
    function verifyLiveness(
        address subject,
        bytes32 sessionId,
        uint64 issuedAt,
        uint64 expiresAt,
        bytes32 docPortraitHash,
        bytes calldata signature
    ) external returns (bool valid) {
        if (_consumedSessions[sessionId]) revert SessionAlreadyConsumed(sessionId);
        if (block.timestamp > expiresAt) revert AttestationExpired(sessionId);

        bytes32 structHash = keccak256(
            abi.encode(
                _LIVENESS_TYPEHASH,
                subject,
                sessionId,
                issuedAt,
                expiresAt,
                docPortraitHash
            )
        );
        bytes32 digest = _hashTypedDataV4(structHash);
        address signer = digest.recover(signature);

        if (!hasRole(VENDOR_SIGNER_ROLE, signer)) revert InvalidSigner(signer);

        // Effects before returning: mark consumed so this attestation can
        // never be replayed, even across different callers.
        _consumedSessions[sessionId] = true;
        emit LivenessVerified(subject, sessionId, docPortraitHash);
        return true;
    }
}
