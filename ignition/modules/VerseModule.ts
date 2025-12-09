import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { keccak256, toBytes } from "viem";

export default buildModule("VerseModule", (m) => {
  const admin = m.getAccount(0);

  /* -------------------------------------------------------------------------- */
  /* 🧩 VerseProfile (UUPS Root Identity)                                       */
  /* -------------------------------------------------------------------------- */
  const verseProfileImpl = m.contract("VerseProfile", [], {
    id: "VerseProfileImpl",
  });
  const initVerseProfile = m.encodeFunctionCall(
    verseProfileImpl,
    "initialize",
    [admin]
  );

  const verseProfileProxy = m.contract(
    "ERC1967Proxy",
    [verseProfileImpl, initVerseProfile],
    { id: "VerseProfileProxy" }
  );

  const verseProfile = m.contractAt("VerseProfile", verseProfileProxy, {
    id: "VerseProfile",
  });

  /* -------------------------------------------------------------------------- */
  /* 🛡️ GuardianRecoveryModule (UUPS)                                          */
  /* -------------------------------------------------------------------------- */
  const guardianImpl = m.contract("GuardianRecoveryModule", [], {
    id: "GuardianRecoveryImpl",
  });
  const guardianInit = m.encodeFunctionCall(guardianImpl, "initialize", [
    admin,
    verseProfile,
  ]);

  const guardianProxy = m.contract(
    "ERC1967Proxy",
    [guardianImpl, guardianInit],
    { id: "GuardianRecoveryProxy" }
  );

  const guardian = m.contractAt("GuardianRecoveryModule", guardianProxy, {
    id: "GuardianRecovery",
  });

  /* -------------------------------------------------------------------------- */
  /* 🔗 Register Guardian inside VerseProfile                                   */
  /* -------------------------------------------------------------------------- */
  m.call(verseProfile, "grantRecoveryModule", [guardian]);

  /* -------------------------------------------------------------------------- */
  /* 🧪 HumanVerificationModule                                                  */
  /* -------------------------------------------------------------------------- */
  const identityHub = "0x16ECBA51e18a4a7e61fdC417f0d47AFEeDfbed74";
  const humanModule = m.contract("HumanVerificationModule", [identityHub], {
    id: "HumanVerificationModule",
  });

  // Wire VerseProfile into HumanVerificationModule
  m.call(humanModule, "setVerseProfile", [verseProfile]);

  // Grant VERIFIER_ROLE in VerseProfile to HumanVerificationModule
  const VERIFIER_ROLE = keccak256(toBytes("VERIFIER_ROLE"));
  m.call(verseProfile, "grantRole", [VERIFIER_ROLE, humanModule]);

  /* -------------------------------------------------------------------------- */
  /* 🛡️ SelfRecoveryModule (UUPS)                                          */
  /* -------------------------------------------------------------------------- */
  const selfModule = m.contract("selfRecoveryModule", [identityHub], {
    id: "SelfRecoveryModule",
  });
  // Wire VerseProfile into selfRecoveryModule
  m.call(selfModule, "setVerseProfile", [verseProfile]);

  // Grant VERIFIER_ROLE in VerseProfile to HumanVerificationModule

  const RECOVERY_ROLE = keccak256(toBytes("RECOVERY_ROLE"));
  m.call(verseProfile, "grantRole", [RECOVERY_ROLE, selfModule], {
    id: "GrantRecoveryRoleToSelfModule",
  });
  /* -------------------------------------------------------------------------- */
  /* ✅ Return deployments                                                      */
  /* -------------------------------------------------------------------------- */
  return { verseProfile, guardian, humanModule,selfModule };
});
