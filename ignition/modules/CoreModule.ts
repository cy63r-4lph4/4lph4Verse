import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "ethers";

export default buildModule("CoreModule", (m) => {
  const admin = m.getAccount(0);
  const treasury = m.getAccount(1);

  /* -------------------------------------------------------------------------- */
  /* CoreToken (UUPS)                                                           */
  /* -------------------------------------------------------------------------- */
  const coreImpl = m.contract("CoreToken");

  const initCore = m.encodeFunctionCall(coreImpl, "initialize", [
    admin, // owner
    treasury, // treasury wallet
    ethers.parseEther("1000000"), // initial supply = 1M CØRE
    50, // 0.5% fee
    false, // feeBurns = false
  ]);

  const coreProxy = m.contract("ERC1967Proxy", [coreImpl, initCore]);
  const coreToken = m.contractAt("CoreToken", coreProxy);

  /* -------------------------------------------------------------------------- */
  /* CoreFaucet (UUPS)                                                          */
  /* -------------------------------------------------------------------------- */
  const faucetImpl = m.contract("CoreFaucet");

  const initFaucet = m.encodeFunctionCall(faucetImpl, "initialize", [
    admin,
    coreToken, // linked to CØRE token
    ethers.parseEther("5"), // 5 CØRE per claim
    12 * 3600, // 12-hour cooldown
  ]);

  const faucetProxy = m.contract("ERC1967Proxy", [faucetImpl, initFaucet]);
  const faucet = m.contractAt("CoreFaucet", faucetProxy);

  return { coreToken, faucet };
});
