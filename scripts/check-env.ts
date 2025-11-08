import { createPublicClient, http } from "viem";
import { baseSepolia, celo, celoSepolia, liskSepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();

const RPCS = {
  celo: process.env.CELO_RPC,
  celoSepolia: process.env.CELO_SEPOLIA_RPC,
  baseSepolia: process.env.BASE_SEPOLIA_RPC,
  liskSepolia: process.env.LISK_SEPOLIA_RPC,
};

async function check() {
  for (const [name, url] of Object.entries(RPCS)) {
    if (!url) {
      console.error(`❌ Missing RPC for ${name}`);
      continue;
    }
    try {
      const chainMap = { celo, celoSepolia, baseSepolia, liskSepolia };
      const client = createPublicClient({ chain: chainMap[name as keyof typeof chainMap], transport: http(url) });
      const block = await client.getBlockNumber();
      console.log(`✅ ${name} RPC OK — block ${block}`);
    } catch (err) {
      console.error(`⚠️ ${name} RPC failed:`, err.message);
    }
  }
}
check();
