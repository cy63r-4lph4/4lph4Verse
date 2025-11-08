import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import CoreModule from "./CoreModule";
import VerseModule from "./VerseModule";

export default buildModule("MasterModule", (m) => {
  const core = m.useModule(CoreModule);
  const verse = m.useModule(VerseModule);


  return { ...core, ...verse };
});
