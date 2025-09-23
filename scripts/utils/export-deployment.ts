/**
 * 4lph4Verse — Deployment Exporter
 *
 * Aggregates Hardhat Ignition deployments into a global contract registry
 * for the SDK.
 *
 * ✅ Merges multiple networks (instead of overwrite)
 * ✅ Adds chainNames for convenience
 * ✅ Strongly-typed TS export
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
const EXPORT_DIR = path.resolve(__dirname, "../../packages/sdk/utils/contract");
const JSON_PATH = path.join(EXPORT_DIR, "deployedContracts.json");
const TS_PATH = path.join(EXPORT_DIR, "deployedContracts.ts");

// Known chainId ↔ name mapping
const chainNames: Record<number, string> = {
  31337: "localhost",
  42220: "celo",
  11142220: "celoSepolia",
  44787: "alfajores",
  62320: "baklava",
};

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

    const addressesPath = path.join(basePath, "deployed_addresses.json");
    if (!fs.existsSync(addressesPath)) {
      console.warn(`⚠️ Skipping ${chainDir}, no deployed_addresses.json`);
      continue;
    }

    const addresses = JSON.parse(fs.readFileSync(addressesPath, "utf-8"));

    const contracts: Record<string, any> = {};
    for (const [futureId, address] of Object.entries(addresses)) {
      const artifactPath = path.join(basePath, `artifacts/${futureId}.json`);
      if (!fs.existsSync(artifactPath)) {
        console.warn(`⚠️ Missing artifact for ${futureId} on chain ${chainId}`);
        continue;
      }
      const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));

      const contractName = futureId.split("#")[1] || futureId;
      contracts[contractName] = {
        address,
        abi: artifact.abi,
        deployedOnBlock: 0,
      };
    }

    result[chainId] = contracts;
  }

  return result;
}

async function main() {
  console.log("🔍 Aggregating Ignition deployments...");

  const newDeployments = loadChainDeployments();

  // Merge with existing file if present
  let existing: Record<number, any> = {};
  if (fs.existsSync(JSON_PATH)) {
    existing = JSON.parse(fs.readFileSync(JSON_PATH, "utf-8"));
  }

  const merged: Record<number, any> = { ...existing };
  for (const [chainId, contracts] of Object.entries(newDeployments)) {
    merged[chainId as any] = {
      ...(existing[chainId as any] || {}),
      ...contracts,
    };
  }

  fs.mkdirSync(EXPORT_DIR, { recursive: true });

  // JSON output
  fs.writeFileSync(
    JSON_PATH,
    JSON.stringify({ chainNames, deployments: merged }, null, 2)
  );

  // TS output
  const tsContent = `/**
 * 4lph4Verse Deployed Contracts — Auto-generated
 * Do not edit by hand.
 */

export const chainNames = ${JSON.stringify(chainNames, null, 2)} as const;

export const deployedContracts = ${JSON.stringify(merged, null, 2)} as const;

export type DeployedContracts = typeof deployedContracts;
`;

  let formatted = tsContent;
  try {
    formatted = await prettier.format(tsContent, { parser: "typescript" });
  } catch (e) {
    console.warn("⚠️ Prettier not found, writing raw TS");
  }

  fs.writeFileSync(TS_PATH, formatted);

  console.log(`✅ Export complete →
- JSON: ${JSON_PATH}
- TS:   ${TS_PATH}`);
}

main().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
