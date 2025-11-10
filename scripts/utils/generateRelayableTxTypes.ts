import fs from "fs";
import path from "path";
import { deployedContracts } from "../../packages/sdk/utils/contract/deployedContracts.js";

const EXPORT_DIR = path.resolve(__dirname, "../../packages/sdk/utils/contract");
const TS_PATH = path.join(EXPORT_DIR, "relayableTxTypes.ts");

// Collect relayable functions per contract
const relayablePerContract: Record<string, Set<string>> = {};

for (const [chainId, contracts] of Object.entries(deployedContracts)) {
  for (const [name, c] of Object.entries(contracts)) {
    const abiPath = path.resolve(EXPORT_DIR, `abis/${chainId}/${name}.json`);
    if (!fs.existsSync(abiPath)) continue;

    const abi = JSON.parse(fs.readFileSync(abiPath, "utf-8"));

    const withSigFunctions = abi
      .filter((item: any) => item.type === "function" && item.name.endsWith("WithSig"))
      .map((item: any) => item.name);

    if (!relayablePerContract[name]) relayablePerContract[name] = new Set();
    withSigFunctions.forEach((f) => relayablePerContract[name].add(f));
  }
}

// Flatten for overall RelayableTxType
const allRelayable = Array.from(
  new Set(Object.values(relayablePerContract).flatMap((s) => Array.from(s)))
);

// Build TypeScript content
let tsContent = `/**
 * Auto-generated RelayableTxTypes
 * Do not edit manually.
 */\n\n`;

// Per-contract type unions
for (const [contractName, funcSet] of Object.entries(relayablePerContract)) {
  const funcs = Array.from(funcSet);
  if (funcs.length === 0) continue;
  tsContent += `export type ${contractName}TxType = ${funcs
    .map((f) => `"${f}"`)
    .join(" | ")};\n`;
}

// Overall union
tsContent += `\nexport type RelayableTxType = ${allRelayable
  .map((f) => `"${f}"`)
  .join(" | ")};\n`;

// Write to file
fs.writeFileSync(TS_PATH, tsContent);
console.log(`✅ RelayableTxType generated at ${TS_PATH}`);
