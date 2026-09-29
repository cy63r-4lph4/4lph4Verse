// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IGuardianRecoveryModuleMinimal
 * @notice The only surface a proof-of-owner module is allowed to touch.
 *         Crucially, there is no function here that sets ownership directly
 *         -- initiating a proof-sourced recovery only opens a delayed,
 *         freeze-aware, cancelable case in GuardianRecoveryModule's single
 *         recovery state machine. See recovery design doc, Sections 3-4.
 */
interface IGuardianRecoveryModuleMinimal {
    /// @notice Open a proof-sourced recovery case. Reverts if the profile is
    ///         hard frozen, already has an active recovery, or is within a
    ///         post-cancellation / post-unfreeze cooldown (see the concrete
    ///         GuardianRecoveryModule implementation for the exact rules).
    /// @dev Caller must hold PROOF_INITIATOR_ROLE on GuardianRecoveryModule.
    function initiateRecoveryViaProof(uint256 verseId, address newOwner) external;

    function isFrozen(uint256 verseId) external view returns (bool);

    function hardFrozen(uint256 verseId) external view returns (bool);
}
