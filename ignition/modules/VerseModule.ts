import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("VerseModule", (m) => {
  const admin = m.getAccount(0);

  /* -------------------------------------------------------------------------- */
  /* VerseProfile (UUPS Root Identity)                                          */
  /* -------------------------------------------------------------------------- */
  const profileImpl = m.contract("VerseProfile");
  const initData = m.encodeFunctionCall(profileImpl, "initialize", [admin]);
  const profileProxy = m.contract("ERC1967Proxy", [profileImpl, initData]);
  const verseProfile = m.contractAt("VerseProfile", profileProxy);

  /* -------------------------------------------------------------------------- */
  /* (Optional) GuardianRecoveryModule                                          */
  /* -------------------------------------------------------------------------- */
  const guardianImpl = m.contract("GuardianRecoveryModule");
  const guardianInit = m.encodeFunctionCall(guardianImpl, "initialize", [admin, verseProfile]);
  const guardianProxy = m.contract("ERC1967Proxy", [guardianImpl, guardianInit]);
  const guardian = m.contractAt("GuardianRecoveryModule", guardianProxy);
  
  // Register guardian inside VerseProfile
  m.call(verseProfile, "grantRecoveryModule", [guardian]);

  return { verseProfile, guardian };
});
