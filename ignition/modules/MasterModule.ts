// ignition/modules/MasterModule.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import CoreModule from "./CoreModule";
import VerseModule from "./VerseModule";
// import HireCoreModule from "./HireCoreModule";

export default buildModule("MasterModule", (m) => {
  const core = m.useModule(CoreModule);
  const verse = m.useModule(VerseModule);
  // const hire = m.useModule(HireCoreModule);

  return { ...core, ...verse,  };
});
