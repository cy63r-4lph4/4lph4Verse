/**
 * 4lph4Verse — Deployment Exporter
 *
 * This script aggregates Hardhat Ignition deployments and generates
 * a strongly-typed contract registry for the SDK.
 *
 * ✅ Supports multiple networks (merges by chainId)
 * ✅ Auto-detects chainId from Ignition folder names
 * ✅ Outputs both JSON (runtime) and TS (typed import)
 *
 * Run after each deployment:
 *   pnpm hardhat run scripts/export-deployment.ts --network <network>
 */

import fs from "fs";
import path from "path";
import prettier from "prettier";
import { fileURLToPath } from "url";

// Polyfill __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ignition deployments live here
const DEPLOYMENTS_DIR = path.resolve(__dirname, "../ignition/deployments");

// SDK target output
const EXPORT_DIR = path.resolve(__dirname, "../../../packages/sdk/utils/contract");
const JSON_PATH = path.join(EXPORT_DIR, "deployedContracts.json");
const TS_PATH = path.join(EXPORT_DIR, "deployedContracts.ts");

function loadChainDeployments() {
  if (!fs.existsSync(DEPLOYMENTS_DIR)) {
    throw new Error("⚠️ No ignition/deployments directory found.");
  }

  const chainDirs = fs
    .readdirSync(DEPLOYMENTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name.startsWith("chain-"))
    .map((d) => d.name);

  const result: Record<number, any> = {};

  for (const chainDir of chainDirs) {
    const chainId = parseInt(chainDir.replace("chain-", ""));
    const basePath = path.join(DEPLOYMENTS_DIR, chainDir);

    // Must exist
    const addressesPath = path.join(basePath, "deployed_addresses.json");
    if (!fs.existsSync(addressesPath)) {
      console.warn(`⚠️ Skipping ${chainDir}, no deployed_addresses.json`);
      continue;
    }

    const addresses = JSON.parse(fs.readFileSync(addressesPath, "utf-8"));

    // Load artifacts per contract
    const contracts: Record<string, any> = {};
    for (const [futureId, address] of Object.entries(addresses)) {
      const artifactPath = path.join(basePath, `artifacts/${futureId}.json`);
      if (!fs.existsSync(artifactPath)) {
        console.warn(`⚠️ Missing artifact for ${futureId} on chain ${chainId}`);
        continue;
      }
      const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));

      const contractName = futureId.split("#")[1] || futureId; // e.g. CoreModule#CoreToken → CoreToken
      contracts[contractName] = {
        address,
        abi: artifact.abi,
        deployedOnBlock: 0, // optional: parse from journal.jsonl if needed
      };
    }

    result[chainId] = contracts;
  }

  return result;
}

async function main() {
  console.log("🔍 Aggregating Ignition deployments...");

  const contracts = loadChainDeployments();

  fs.mkdirSync(EXPORT_DIR, { recursive: true });

  // JSON output
  fs.writeFileSync(JSON_PATH, JSON.stringify(contracts, null, 2));

  // TS output
  const tsContent = `/**
 * 4lph4Verse Deployed Contracts — Auto-generated
 * Do not edit by hand. Run \`pnpm hardhat run scripts/export-deployment.ts --network <network>\` instead.
 */

export const deployedContracts = ${JSON.stringify(contracts, null, 2)} as const;

export type DeployedContracts = typeof deployedContracts;
`;

  const formatted = await prettier.format(tsContent, { parser: "typescript" });
  fs.writeFileSync(TS_PATH, formatted);

  console.log(`✅ Export complete → 
- JSON: ${JSON_PATH}
- TS:   ${TS_PATH}`);
}

main().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
