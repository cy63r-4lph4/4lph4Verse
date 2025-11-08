// ignition/modules/VerseModule.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("VerseModule", (m) => {
  const admin = m.getAccount(0);

  // --- Implementations ---
  const verseProfileImpl = m.contract("VerseProfile", [], { id: "VerseProfileImpl" });


  // --- Proxies ---
  const verseProfileProxy = m.contract("TransparentUpgradeableProxy", [verseProfileImpl, admin, "0x"], { id: "VerseProfileProxy" });

  // --- Proxies with ABIs ---
  const verseProfile = m.contractAt("VerseProfile", verseProfileProxy, { id: "VerseProfile" });
  
  // --- Initialize ---
  m.call(verseProfile, "initialize", [admin]);
 
  return { verseProfile };
});
