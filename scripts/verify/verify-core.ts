// scripts/verify/verify-core-all.ts
import { execSync } from "child_process";
import fs from "fs";

const CHAINS = [
  { name: "celoSepolia", id: 11142220 },
  { name: "baseSepolia", id: 84532 },
  { name: "liskSepolia", id: 4202 },
];

function verify(address: string, network: string, args: any[] = []) {
  try {
    console.log(`🧾 Verifying ${address} on ${network}`);
    const cmd = [
      "npx hardhat verify",
      `--network ${network}`,
      address,
      ...args,
    ].join(" ");
    execSync(cmd, { stdio: "inherit" });
  } catch (err) {
    console.warn(`⚠️ Verification failed for ${address} on ${network}`);
  }
}

async function main() {
  for (const { name, id } of CHAINS) {
    const file = `ignition/deployments/chain-${id}/deployed_addresses.json`;
    if (!fs.existsSync(file)) {
      console.warn(`⚠️ Skipping ${name} — no deployment found.`);
      continue;
    }

    console.log(`\n============================`);
    console.log(`🌐 Verifying CoreModule on ${name}`);
    console.log(`============================`);

    const deployed = JSON.parse(fs.readFileSync(file, "utf8"));

    const coreImpl = deployed["CoreModule#CoreTokenImpl"];
    const coreProxy = deployed["CoreModule#CoreTokenProxy"];
    const faucetImpl = deployed["CoreModule#CoreFaucetImpl"];
    const faucetProxy = deployed["CoreModule#CoreFaucetProxy"];
    const proxyAdmin = deployed["CoreModule#ProxyAdmin"];

    if (!coreImpl || !coreProxy) {
      console.warn(`⚠️ Missing contracts for ${name}, skipping.`);
      continue;
    }

    // Verify all CoreModule contracts
    verify(coreImpl, name);
    verify(coreProxy, name, [coreImpl, proxyAdmin, "0x"]);

    if (faucetImpl && faucetProxy) {
      verify(faucetImpl, name);
      verify(faucetProxy, name, [faucetImpl, proxyAdmin, "0x"]);
    }

    console.log(`✅ Verification completed for ${name}\n`);
  }
}

main().catch(console.error);
