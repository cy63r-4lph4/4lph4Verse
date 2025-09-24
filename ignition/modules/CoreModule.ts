// ignition/modules/CoreModule.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CoreModule", (m) => {
  const coreToken = m.contractAt(
    "CoreToken",
    "0xB0CB172Ea557F4bd53A11BB259050fFA9e8B2b94", // deployed CoreToken
    { id: "CoreToken" }
  );

  const faucet = m.contractAt(
    "CoreFaucet",
    "0xb5d8887AB09AdB5983AACEed4e1AbB9267407823", // deployed CoreFaucet
    { id: "CoreFaucet" }
  );

  return { coreToken, faucet };
});
