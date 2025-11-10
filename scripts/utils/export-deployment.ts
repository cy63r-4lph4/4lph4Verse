/**
 * 4lph4Verse — Deployment Exporter
 *
 * Aggregates Hardhat Ignition deployments into a global contract registry
 * for the SDK.
 *
 * ✅ Merges multiple networks (instead of overwrite)
 * ✅ Exports ABIs into /abis/<chainId>/
 * ✅ Generates abis/index.ts barrel
 * ✅ Imports ABIs into deployedContracts.ts
 * ✅ Strongly typed helper getDeployedContract()
 */

import fs from "fs";
import path from "path";
import prettier from "prettier";
import { fileURLToPath } from "url";

// Polyfill __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ignition deployments dir
const DEPLOYMENTS_DIR = path.resolve(__dirname, "../../ignition/deployments");

// SDK target output
const EXPORT_DIR = path.resolve(__dirname, "../../packages/sdk/utils/contract");
const ABIS_DIR = path.join(EXPORT_DIR, "abis");
const JSON_PATH = path.join(EXPORT_DIR, "deployedContracts.json");
const TS_PATH = path.join(EXPORT_DIR, "deployedContracts.ts");
const ABIS_INDEX_PATH = path.join(ABIS_DIR, "index.ts");

// Known chainId ↔ name mapping
const chainNames: Record<number, string> = {
  42220: "celo",
  11142220: "celoSepolia",
  84532: "baseSepolia",
  4202: "liskSepolia",
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

  fs.mkdirSync(ABIS_DIR, { recursive: true });

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

      // Save ABI JSON → /abis/<chainId>/<Contract>.json
      const chainAbiDir = path.join(ABIS_DIR, String(chainId));
      fs.mkdirSync(chainAbiDir, { recursive: true });

      const abiPath = path.join(chainAbiDir, `${contractName}.json`);
      fs.writeFileSync(abiPath, JSON.stringify(artifact.abi, null, 2));

      contracts[contractName] = {
        address,
        abi: `${contractName}_${chainId}`, // placeholder until replaced
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

  // Merge with existing if present
  let existing: Record<number, any> = {};
  if (fs.existsSync(JSON_PATH)) {
    existing =
      JSON.parse(fs.readFileSync(JSON_PATH, "utf-8")).deployments || {};
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

  // Collect ABI imports for deployedContracts.ts
  const abiImports: string[] = [];
  const contractsWithImports: Record<number, any> = {};
  const abiIndexExports: string[] = [];

  for (const [chainId, contracts] of Object.entries(merged)) {
    contractsWithImports[chainId] = {};
    for (const [name, c] of Object.entries(contracts) as [
      string,
      { address: string; abi: string; deployedOnBlock: number },
    ][]) {
      const importName = `${name}_${chainId}Abi`;
      const relPath = `./abis/${chainId}/${name}.json`;

      abiImports.push(`import ${importName} from "${relPath}";`);
      abiIndexExports.push(
        `export { default as ${name}Abi_${chainId} } from "./${chainId}/${name}.json";`
      );

      contractsWithImports[chainId][name] = {
        address: c.address,
        abi: importName,
        deployedOnBlock: c.deployedOnBlock,
      };
    }
  }

  // Build deployedContracts.ts
  const tsContent = `/**
 * 4lph4Verse Deployed Contracts — Auto-generated
 * Do not edit by hand.
 */

import type { Abi } from "viem";
${abiImports.join("\n")}

// Utility: preserve ABI type from JSON imports
type ExtractAbi<T> = T extends Abi ? T : Abi;

export type DeployedContract<TAbi extends Abi = Abi> = {
  address: \`0x\${string}\`;
  abi: TAbi;
  deployedOnBlock: number;
};

export const chainNames = ${JSON.stringify(chainNames, null, 2)} as const;

export const deployedContracts = {
${Object.entries(contractsWithImports)
  .map(
    ([chainId, contracts]) => `  ${Number(chainId)}: {
${(
  Object.entries(contracts) as [
    string,
    { address: string; abi: string; deployedOnBlock: number },
  ][]
)
  .map(
    ([name, c]) =>
      `    ${name}: { address: "${c.address}", abi: ${c.abi} as ExtractAbi<typeof ${c.abi}>, deployedOnBlock: ${c.deployedOnBlock} },`
  )
  .join("\n")}
  },`
  )
  .join("\n")}
} as const;


export type DeployedContracts = typeof deployedContracts;
export type ChainId = keyof DeployedContracts;

export type ContractNames<C extends ChainId> = keyof DeployedContracts[C];

export function getDeployedContract<
  C extends ChainId,
  N extends ContractNames<C>
>(chainId: C, name: N): DeployedContracts[C][N] {
  return deployedContracts[chainId][name];
}
`;

  let formatted = tsContent;
  try {
    formatted = await prettier.format(tsContent, { parser: "typescript" });
  } catch {
    console.warn("⚠️ Prettier not found, writing raw TS");
  }
  fs.writeFileSync(TS_PATH, formatted);

  // --- after deployedContracts.ts generation ---

  const RELAYABLE_TS_PATH = path.join(EXPORT_DIR, "relayableTxTypes.ts");

  function extractRelayableFunctions(abi: any[]) {
    return abi.filter(
      (item) => item.type === "function" && item.name.endsWith("WithSig")
    );
  }

  function buildRelayableTypes(allAbisDir: string) {
    const relayable: Record<string, any> = {};

    const chainDirs = fs.readdirSync(allAbisDir, { withFileTypes: true });
    for (const dir of chainDirs) {
      if (!dir.isDirectory()) continue;
      const chainDir = path.join(allAbisDir, dir.name);
      const abiFiles = fs
        .readdirSync(chainDir)
        .filter((f) => f.endsWith(".json"));

      for (const file of abiFiles) {
        // Skip implementation contracts
        if (file.endsWith("Impl.json")) continue;

        const contractName = path.basename(file, ".json");
        const abi = JSON.parse(
          fs.readFileSync(path.join(chainDir, file), "utf-8")
        );
        const relayables = extractRelayableFunctions(abi);

        if (relayables.length === 0) continue;
        relayable[contractName] = {};

        for (const fn of relayables) {
          const primaryType =
            fn.name.charAt(0).toUpperCase() + fn.name.slice(1);

          // Find tuple type (if exists)
          const opParam = fn.inputs.find((i: any) => i.type === "tuple");
          const tupleFields = opParam?.components || [];

          relayable[contractName][fn.name] = {
            primaryType,
            inputs: fn.inputs,
            types: {
              [primaryType]: tupleFields.length
                ? tupleFields.map((f: any) => ({ name: f.name, type: f.type }))
                : fn.inputs
                    .filter((i: any) => i.type !== "bytes") // skip sig
                    .map((i: any) => ({ name: i.name, type: i.type })),
            },
          };
        }
      }
    }

    return relayable;
  }

  async function generateRelayableTxTypes() {
    const relayable = buildRelayableTypes(ABIS_DIR);

    const relayableContent = `/**
 * Auto-generated Relayable Tx Types
 * Derived from proxy contracts (...WithSig functions)
 * Do not edit manually.
 */
export const RelayableTxTypes = ${JSON.stringify(relayable, null, 2)} as const;

export type RelayableContract = keyof typeof RelayableTxTypes;
export type RelayableFunction<C extends RelayableContract> =
  keyof (typeof RelayableTxTypes)[C];
`;

    let formatted = relayableContent;
    try {
      formatted = await prettier.format(relayableContent, {
        parser: "typescript",
      });
    } catch {}

    fs.writeFileSync(RELAYABLE_TS_PATH, formatted);
    console.log(`✅ Relayable Tx Types generated → ${RELAYABLE_TS_PATH}`);
  }

  // Build abis/index.ts barrel
  let abiIndexContent = `/**
 * Auto-generated ABI Barrel
 * All contract ABIs in one place.
 * Do not edit manually.
 */

${abiIndexExports.join("\n")}
`;

  try {
    abiIndexContent = await prettier.format(abiIndexContent, {
      parser: "typescript",
    });
  } catch {
    console.warn("⚠️ Prettier not found, writing raw ABI index TS");
  }

  fs.writeFileSync(ABIS_INDEX_PATH, abiIndexContent);

  console.log(`✅ Export complete →
- JSON: ${JSON_PATH}
- TS:   ${TS_PATH}
- ABIs: ${ABIS_DIR}/<chainId>/*.json
- ABI Barrel: ${ABIS_INDEX_PATH}`);

  await generateRelayableTxTypes();
}

main().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
