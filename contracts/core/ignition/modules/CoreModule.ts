import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "viem";

export default buildModule("CoreModule", (m) => {
  const treasury = m.getAccount(1);

  const coreToken = m.contract("CoreToken", [
    "Alph4 Core",
    "CØRE",
    parseEther("1000000"),
    treasury,
    10n,   // feeBps = 0.1%
    false  // feeBurns
  ]);

  const faucet = m.contract("CoreFaucet", [
    coreToken,
    parseEther("50"), // claim amount
    86400n            // cooldown: 1 day
  ]);

  // Seed faucet with 1000 tokens and mark it fee-exempt
  m.call(coreToken, "transfer", [faucet, parseEther("1000")]);
  m.call(coreToken, "setFeeExempt", [faucet, true]);

  return { coreToken, faucet };
});
