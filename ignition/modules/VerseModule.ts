// ignition/modules/VerseModule.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("VerseModule", (m) => {
  const admin = m.getAccount(0);

  // --- Implementations ---
  const verseProfileImpl = m.contract("VerseProfile", [], { id: "VerseProfileImpl" });
  const badgeRegistryImpl = m.contract("BadgeRegistry", [], { id: "BadgeRegistryImpl" });
  const appRegistryImpl = m.contract("VerseAppRegistry", [], { id: "AppRegistryImpl" });
  const reputationHubImpl = m.contract("VerseReputationHub", [], { id: "ReputationHubImpl" });
  const scoreAggregatorImpl = m.contract("VerseScoreAggregator", [], { id: "ScoreAggregatorImpl" });

  // --- Proxies ---
  const verseProfileProxy = m.contract("TransparentUpgradeableProxy", [verseProfileImpl, admin, "0x"], { id: "VerseProfileProxy" });
  const badgeRegistryProxy = m.contract("TransparentUpgradeableProxy", [badgeRegistryImpl, admin, "0x"], { id: "BadgeRegistryProxy" });
  const appRegistryProxy = m.contract("TransparentUpgradeableProxy", [appRegistryImpl, admin, "0x"], { id: "AppRegistryProxy" });
  const reputationHubProxy = m.contract("TransparentUpgradeableProxy", [reputationHubImpl, admin, "0x"], { id: "ReputationHubProxy" });
  const scoreAggregatorProxy = m.contract("TransparentUpgradeableProxy", [scoreAggregatorImpl, admin, "0x"], { id: "ScoreAggregatorProxy" });

  // --- Proxies with ABIs ---
  const verseProfile = m.contractAt("VerseProfile", verseProfileProxy, { id: "VerseProfile" });
  const badgeRegistry = m.contractAt("BadgeRegistry", badgeRegistryProxy, { id: "BadgeRegistry" });
  const appRegistry = m.contractAt("VerseAppRegistry", appRegistryProxy, { id: "AppRegistry" });
  const reputationHub = m.contractAt("VerseReputationHub", reputationHubProxy, { id: "ReputationHub" });
  const scoreAggregator = m.contractAt("VerseScoreAggregator", scoreAggregatorProxy, { id: "ScoreAggregator" });

  // --- Initialize ---
  m.call(verseProfile, "initialize", [admin]);
  m.call(badgeRegistry, "initialize", [admin, ""]);
  m.call(appRegistry, "initialize", [admin]);
  m.call(reputationHub, "initialize", [admin, appRegistry]);
  m.call(scoreAggregator, "initialize", [admin, appRegistry]);

  return { verseProfile, badgeRegistry, appRegistry, reputationHub, scoreAggregator };
});
