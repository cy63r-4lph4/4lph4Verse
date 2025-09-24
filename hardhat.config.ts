import type { HardhatUserConfig } from "hardhat/config";
import { configVariable } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-ignition-viem";
import hardhatIgnitionViemPlugin from "@nomicfoundation/hardhat-ignition-viem";
import fs from "fs";


import path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";


function getRemappings() {
  return fs
    .readFileSync("remappings.txt", "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => line.trim().split("="));
}

// Polyfill __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

const config: HardhatUserConfig = {
  plugins: [hardhatIgnitionViemPlugin],
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
    // 👇 Add this so Hardhat compiles OZ proxy contracts too
    npmFilesToBuild: [
      "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol",
      "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol",
    ],
  },

  paths: {
    sources: "./contracts",
    cache: "./cache",
    artifacts: "./artifacts",
    tests: "./test",
    ignition: "./ignition",
  },

  networks: {
    localhost: {
      type: "http",
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    celo: {
      type: "http",
      url: configVariable("CELO_RPC")!,
      accounts: [
        configVariable("DEPLOYER_PRIVATE_KEY")!,
        configVariable("TREASURY_PRIVATE_KEY")!,
      ],
      chainId: 42220,
    },
    celoSepolia: {
      type: "http",
      url: configVariable("CELO_SEPOLIA_RPC")!,
      accounts: [
        configVariable("DEPLOYER_PRIVATE_KEY")!,
        configVariable("TREASURY_PRIVATE_KEY")!,
      ],
      chainId: 11142220,
    },
    alfajores: {
      type: "http",
      url: configVariable("ALFAJORES_RPC")!,
      accounts: [
        configVariable("DEPLOYER_PRIVATE_KEY")!,
        configVariable("TREASURY_PRIVATE_KEY")!,
      ],
      chainId: 44787,
    },
    baklava: {
      type: "http",
      url: configVariable("BAKLAVA_RPC")!,
      accounts: [
        configVariable("DEPLOYER_PRIVATE_KEY")!,
        configVariable("TREASURY_PRIVATE_KEY")!,
      ],
      chainId: 62320,
    },
  },
};

export default config;
