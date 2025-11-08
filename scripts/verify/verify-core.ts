// scripts/verify/verify-core.ts
import { execSync } from "child_process";
import fs from "fs";

const chainId = 11142220; // 👈 change per run (e.g. 84532 for BaseSepolia)
const base = `ignition/deployments/chain-${chainId}/deployed_addresses.json`;

async function main() {
  if (!fs.existsSync(base)) throw new Error(`No deployment found for chain ${chainId}`);
  const deployed = JSON.parse(fs.readFileSync(base, "utf8"));

  const coreImpl = deployed["CoreModule#CoreTokenImpl"];
  const coreProxy = deployed["CoreModule#CoreTokenProxy"];
  const faucetImpl = deployed["CoreModule#CoreFaucetImpl"];
  const faucetProxy = deployed["CoreModule#CoreFaucetProxy"];
  const proxyAdmin = deployed["CoreModule#ProxyAdmin"];

  console.log("🔍 Verifying CoreModule contracts...\n");

  const verify = (address: string, args: any[] = []) => {
    try {
      console.log(`🧾 Verifying ${address}`);
      execSync(
        `npx hardhat verify --network celoSepolia ${address} ${args.join(" ")}`,
        { stdio: "inherit" }
      );
    } catch (err) {
      console.warn(`⚠️  Verification failed for ${address}:`, (err as any).message);
    }
  };

  verify(coreImpl);
  verify(coreProxy, [coreImpl, proxyAdmin, "0x"]);
  verify(faucetImpl);
  verify(faucetProxy, [faucetImpl, proxyAdmin, "0x"]);

  console.log("\n✅ CoreModule verification complete.");
}

main().catch(console.error);
