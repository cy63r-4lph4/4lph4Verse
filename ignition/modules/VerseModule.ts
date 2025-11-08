import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("VerseModule", (m) => {
  const admin = m.getAccount(0);

  /* -------------------------------------------------------------------------- */
  /* 🧩 VerseProfile (UUPS Root Identity)                                       */
  /* -------------------------------------------------------------------------- */
  const verseProfileImpl = m.contract("VerseProfile", [], { id: "VerseProfileImpl" });

  const initVerseProfile = m.encodeFunctionCall(verseProfileImpl, "initialize", [admin]);

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
  /* ✅ Return Deployments                                                      */
  /* -------------------------------------------------------------------------- */
  return { verseProfile, guardian };
});
