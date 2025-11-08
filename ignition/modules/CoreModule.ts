import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "ethers";

export default buildModule("CoreModule", (m) => {
  const admin = m.getAccount(0);
  const treasury = m.getAccount(1);

  /* -------------------------------------------------------------------------- */
  /* CoreToken (UUPS)                                                           */
  /* -------------------------------------------------------------------------- */

  // Implementation
  const coreImpl = m.contract("CoreToken", [], { id: "CoreTokenImpl" });

  const initCore = m.encodeFunctionCall(coreImpl, "initialize", [
    admin,                              // owner
    treasury,                           // treasury wallet
    ethers.parseEther("1000000"),       // 1M CØRE
    50,                                 // 0.5% fee (50 bps)
    false,                              // feeBurns = false
  ]);

  // Proxy
  const coreProxy = m.contract(
    "ERC1967Proxy",
    [coreImpl, initCore],
    { id: "CoreTokenProxy" }
  );

  // View through proxy as CoreToken
  const coreToken = m.contractAt(
    "CoreToken",
    coreProxy,
    { id: "CoreToken" }
  );

  /* -------------------------------------------------------------------------- */
  /* CoreFaucet (UUPS)                                                          */
  /* -------------------------------------------------------------------------- */

  // Implementation
  const faucetImpl = m.contract("CoreFaucet", [], { id: "CoreFaucetImpl" });

  const initFaucet = m.encodeFunctionCall(faucetImpl, "initialize", [
    admin,
    coreToken,                          // Ignition will resolve to CoreToken proxy address
    ethers.parseEther("5"),             // 5 CØRE per claim
    12 * 60 * 60,                       // 12h cooldown
  ]);

  // Proxy
  const faucetProxy = m.contract(
    "ERC1967Proxy",
    [faucetImpl, initFaucet],
    { id: "CoreFaucetProxy" }
  );

  const faucet = m.contractAt(
    "CoreFaucet",
    faucetProxy,
    { id: "CoreFaucet" }
  );

  // seed faucet with tokens right after deploy
  m.call(coreToken, "transfer", [faucet, ethers.parseEther("1000")]);

  return { coreToken, faucet };
});
