// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/*
 HumanVerificationModule.sol

 - Inherits SelfVerificationRoot from @selfxyz/contracts (your installed package)
 - Upgradeable (UUPS) + AccessControl
 - On successful Self verification, marks subject as human-verified and
   writes result back to a VerseProfile contract via a minimal interface.

 Notes:
 - Your Self package only had `contracts/abstract/SelfVerificationRoot.sol`
   so we import that path.
 - If the Self root uses a different `GenericDiscloseOutput` type name,
   compile errors will point to the exact type name; paste them and I'll update.
*/

import "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

/// @notice Minimal interface your VerseProfile contract must expose for this module to write verification status.
/// Adjust the function signature to match your real VerseProfile contract.
interface IVerseProfile {
    function setHumanVerified(address subject, bool verified) external;
}

contract HumanVerificationModule is
    AccessControlUpgradeable,
    SelfVerificationRoot
{
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    /// @notice reference to VerseProfile contract (single source of truth)
    address public verseProfile;

    /// @notice config id returned by getConfigId (optional)
    bytes32 public verificationConfigId;

    /// @notice optional scope seed recorded locally (for SDK/frontend)
    bytes32 public scopeSeed;

    /// @notice mapping to track when an address was verified
    mapping(address => uint256) public verifiedAt;

    /// @notice events
    event HumanVerified(
        address indexed subject,
        address operator,
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
    event ScopeSeedUpdated(bytes32 scopeSeed);

    error ZeroAddress();
    error AlreadyVerified(address who);
    error NotVerified(address who);

     constructor(address identityVerificationHub)
        SelfVerificationRoot(identityVerificationHub, "")
    {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    // -------------------------
    // SELF HOOK - called by the Self verification flow
    // -------------------------
    //
    // NOTE: many Self examples use:
    //   function customVerificationHook(ISelfVerificationRoot.GenericDiscloseOutputV2 memory output, bytes memory userData) internal override
    // Adjust the input type name if your installed Self contract exposes another name.
    //
    function customVerificationHook(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
        bytes memory userData
    ) internal override {
        // decode subject address from userData (support packed or ABI-encoded)
        address subject;
        if (userData.length == 20) {
            // packed 20-byte address from abi.encodePacked(address)
            subject = address(uint160(bytes20(userData)));
        } else {
            // standard abi.encode(address)
            subject = abi.decode(userData, (address));
        }

        // optional: basic guard - don't set twice
        if (verifiedAt[subject] != 0) {
            // If you prefer to update timestamp on re-verify, remove this check.
            revert AlreadyVerified(subject);
        }

        // mark verified in this module
        verifiedAt[subject] = block.timestamp;

        // write-back to VerseProfile (single source of truth)
        // We call the external contract; ensure VerseProfile permits this module (access control).
        IVerseProfile vp = IVerseProfile(verseProfile);
        vp.setHumanVerified(subject, true);

        emit HumanVerified(subject, msg.sender, block.timestamp, userData);
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

    function setScopeSeed(bytes32 newScope) external onlyRole(ADMIN_ROLE) {
        scopeSeed = newScope;
        emit ScopeSeedUpdated(newScope);
    }

    /// Admin-revoke verification and sync back to VerseProfile
    function revokeVerification(address subject) external onlyRole(ADMIN_ROLE) {
        if (verifiedAt[subject] == 0) revert NotVerified(subject);
        verifiedAt[subject] = 0;
        IVerseProfile(verseProfile).setHumanVerified(subject, false);
        emit HumanRevoked(subject, msg.sender, block.timestamp);
    }

    // -------------------------
    // Self override to provide config id for verification
    // -------------------------
    // This returns the config id to the hub when requested. Frontend and contract config must match.
    function getConfigId(
        bytes32 /* destinationChainId */,
        bytes32 /* userIdentifier */,
        bytes memory /* userDefinedData */
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
