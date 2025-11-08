// // ignition/modules/HireCoreModule.ts
// import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
// import CoreModule from "./CoreModule";
// import VerseModule from "./VerseModule";

// export default buildModule("HireCoreModule", (m) => {
//   const { coreToken } = m.useModule(CoreModule);
//   const { verseProfile} = m.useModule(VerseModule);

//   const admin = m.getAccount(0);
//   const treasury = m.getAccount(1);

//   // --- Implementations ---
//   const jobManagerImpl = m.contract("HireCoreJobManager", [], { id: "HireCoreJobManagerImpl" });
//   const jobBoardImpl = m.contract("HireCoreJobBoard", [], { id: "HireCoreJobBoardImpl" });
//   const scoreModelImpl = m.contract("HireCoreScoreModel", [], { id: "HireCoreScoreModelImpl" });

//   // --- Proxies ---
//   const jobManagerProxy = m.contract("TransparentUpgradeableProxy", [jobManagerImpl, admin, "0x"], { id: "HireCoreJobManagerProxy" });
//   const jobBoardProxy = m.contract("TransparentUpgradeableProxy", [jobBoardImpl, admin, "0x"], { id: "HireCoreJobBoardProxy" });
//   const scoreModelProxy = m.contract("TransparentUpgradeableProxy", [scoreModelImpl, admin, "0x"], { id: "HireCoreScoreModelProxy" });

//   // --- Proxies with ABIs ---
//   const jobManager = m.contractAt("HireCoreJobManager", jobManagerProxy, { id: "HireCoreJobManager" });
//   const jobBoard = m.contractAt("HireCoreJobBoard", jobBoardProxy, { id: "HireCoreJobBoard" });
//   const scoreModel = m.contractAt("HireCoreScoreModel", scoreModelProxy, { id: "HireCoreScoreModel" });

//   // --- Initialize ---
//   m.call(jobManager, "initialize", [
//     admin,
//     treasury,
//     verseProfile,
//     reputationHub,
//     300n, // baseFeeBps
//     1000n // maxFeeBps
//   ]);

//   m.call(jobBoard, "initialize", [
//     admin,
//     jobManager,
//     coreToken,
//     treasury,
//     100n // minDeposit
//   ]);

//   m.call(scoreModel, "initialize", [admin, reputationHub]);

//   return { jobManager, jobBoard, scoreModel };
// });
