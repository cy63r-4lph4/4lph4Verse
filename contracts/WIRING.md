# Deployment wiring guide

Get any of these role grants wrong and the security properties in the
design doc silently don't hold, with no compile-time or obvious runtime
signal that something's off. Follow this order.

## 1. Deploy core + modules (proxies where applicable)

1. `VerseProfile` (UUPS proxy, `initialize(admin)`)
2. `GuardianRecoveryModule` (UUPS proxy, `initialize(admin, verseProfileAddress)`)
3. `LivenessVerifierECDSA(admin)` — or your chosen vendor's real verifier contract
4. `HumanVerificationModule(identityVerificationHub)`
5. `ProofOfOwnerModule(identityVerificationHub, guardianModuleAddress, livenessVerifierAddress)`

## 2. Wire roles — VerseProfile

```solidity
verseProfile.grantRecoveryModule(address(guardianRecoveryModule));
// ^ RECOVERY_ROLE. Grant ONLY to GuardianRecoveryModule. Never grant this
//   to ProofOfOwnerModule -- if you ever find yourself wanting to, that's a
//   sign the unified-pipeline design has been bypassed somewhere.

verseProfile.grantVerifierModule(address(humanVerificationModule));
// ^ VERIFIER_ROLE. This is the only contract allowed to write commitments.
```

## 3. Wire roles — GuardianRecoveryModule

```solidity
guardianRecoveryModule.grantRole(
    guardianRecoveryModule.PROOF_INITIATOR_ROLE(),
    address(proofOfOwnerModule)
);
// ^ Grant to ProofOfOwnerModule ONLY. Holding this role permits calling
//   initiateRecoveryViaProof and nothing else -- it cannot set ownership,
//   cannot bypass freeze, cannot skip the delay.
```

## 4. Wire the liveness vendor (if using LivenessVerifierECDSA)

```solidity
livenessVerifierECDSA.setVendorSigner(vendorSigningKeyAddress, true);
```

If/when you integrate a real vendor with its own on-chain verifier, skip
`LivenessVerifierECDSA` entirely and point `ProofOfOwnerModule.livenessVerifier`
at the vendor's contract instead — it only needs to implement
`ILivenessVerifier`.

## 5. Sanity checks before going live

- [ ] `verseProfile.hasRole(RECOVERY_ROLE, guardianRecoveryModule)` is `true`
      and is the **only** address with that role.
- [ ] `verseProfile.hasRole(VERIFIER_ROLE, humanVerificationModule)` is `true`.
- [ ] `guardianRecoveryModule.hasRole(PROOF_INITIATOR_ROLE, proofOfOwnerModule)`
      is `true` and is the **only** address with that role.
- [ ] `proofOfOwnerModule.guardianModule()` points at the real
      `GuardianRecoveryModule` proxy address, not an implementation address.
- [ ] `MODULE_ADMIN_ROLE` / `UPGRADER_ROLE` / `PROFILE_ADMIN_ROLE` /
      `ADMIN_ROLE` on every contract are held by a multisig + timelock, not
      a single EOA (see design doc, Section 9 — this is the actual ceiling
      on everything else here).
- [ ] Run a full testnet dry-run of: normal recovery cancel-by-owner,
      guardian-quorum cancel, hard-freeze-during-window, and the
      post-cancellation / post-unfreeze cooldown paths — these are the
      parts most likely to have an off-by-one that only shows up in an
      integration test, not a unit test.
