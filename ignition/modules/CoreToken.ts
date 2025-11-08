import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "ethers";

export default buildModule("CoreToken", (m) => {
  // Accounts
  const admin = m.getAccount(0);
  const treasury = m.getAccount(1);

  // Parameters
  const initialSupply = ethers.parseEther("1000000"); // 1M CØRE (18 decimals)
  const feeBps = 50; // 0.5%
  const feeBurns = false;

  // Deploy Implementation
  const coreImpl = m.contract("CoreToken");

  // Encode initializer call
  const initData = m.encodeFunctionData(coreImpl, "initialize", [
    admin.address,
    treasury.address,
    initialSupply,
    feeBps,
    feeBurns,
  ]);

  // Deploy Proxy with implementation + initializer
  const proxy = m.contract("ERC1967Proxy", [coreImpl, initData]);

  m.log("Deployed CoreToken implementation + proxy");

  return { coreImpl, proxy };
});
