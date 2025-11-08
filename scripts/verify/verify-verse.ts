// scripts/verify/verify-verse.ts
import { execSync } from "child_process";
import fs from "fs";

const chainId = 11142220; // Celo Sepolia by default
const file = `ignition/deployments/chain-${chainId}/deployed_addresses.json`;

async function main() {
  if (!fs.existsSync(file)) throw new Error(`No deployment found for chain ${chainId}`);
  const deployed = JSON.parse(fs.readFileSync(file, "utf8"));

  const profileImpl = deployed["VerseModule#VerseProfileImpl"];
  const profileProxy = deployed["VerseModule#VerseProfileProxy"];
  const guardianImpl = deployed["VerseModule#GuardianRecoveryImpl"];
  const guardianProxy = deployed["VerseModule#GuardianRecoveryProxy"];

  console.log("🔍 Verifying VerseModule contracts...\n");

  const verify = (addr: string, args: any[] = []) => {
    try {
      console.log(`🧾 Verifying ${addr}`);
      execSync(
        `npx hardhat verify --network celoSepolia ${addr} ${args.join(" ")}`,
        { stdio: "inherit" }
      );
    } catch (err) {
      console.warn(`⚠️  Verification failed for ${addr}:`, (err as any).message);
    }
  };

  verify(profileImpl);
  verify(profileProxy, [profileImpl, "0x"]); // UUPS proxies usually take (impl, data)
  verify(guardianImpl);
  verify(guardianProxy, [guardianImpl, "0x"]);

  console.log("\n✅ VerseModule verification complete.");
}

main().catch(console.error);
