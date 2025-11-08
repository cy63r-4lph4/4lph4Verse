import type { HardhatUserConfig } from "hardhat/config";
import { configVariable } from "hardhat/config"; // if you’re using your own config util
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-ignition-viem";
import hardhatIgnitionViemPlugin from "@nomicfoundation/hardhat-ignition-viem";
import "@nomicfoundation/hardhat-verify"; 


import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";
import { celoSepolia } from "viem/chains";

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
    // 👇 build OZ proxy contracts too
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
    
    baseSepolia: {
      type: "http",
      url: configVariable("BASE_SEPOLIA_RPC")!,
      accounts: [
        configVariable("DEPLOYER_PRIVATE_KEY")!,
        configVariable("TREASURY_PRIVATE_KEY")!,
      ],
      chainId: 84532,
    },
    liskSepolia: {
      type: "http",
      url: configVariable("LISK_SEPOLIA_RPC")!,
      accounts: [
        configVariable("DEPLOYER_PRIVATE_KEY")!,
        configVariable("TREASURY_PRIVATE_KEY")!,
      ],
      chainId: 4202,
    },
  },

  verify: {
    etherscan: {
      enabled: true,
      apiKey: configVariable("ETHERSCAN_API_KEY")!,
    },
    blockscout: {
      enabled: true,
    }
  },

 chainDescriptors: {
      11142220: {
        name: "CeloSepolia",
        blockExplorers: {
          blockscout: {
            name: "Celo Sepolia Blockscout",
            url: "https://celo-sepolia.blockscout.com",
            apiUrl: "https://celo-sepolia.blockscout.com/api",
          },
           etherscan: {
          name: "Celo Sepolia Etherscan",
          url: "https://celo-sepolia.blockscout.com",
          apiUrl: "https://celo-sepolia.blockscout.com/api",
        },
        },
       
      },

      42220: {
        name: "Celo",
        blockExplorers: {
          blockscout: {
            name: "Celo Blockscout",
            url: "https://explorer.celo.org/mainnet",
            apiUrl: "https://explorer.celo.org/mainnet/api",
          },
          
        },
      },

      4202: {
        name: "LiskSepolia",
        blockExplorers: {
          blockscout: {
            name: "Lisk Sepolia Blockscout",
            url: "https://lisk-sepolia.blockscout.com",
            apiUrl: "https://lisk-sepolia.blockscout.com/api",
          },
          etherscan: {
            name: "Lisk Sepolia Etherscan",
            url: "https://lisk-sepolia.blockscout.com",
            apiUrl: "https://lisk-sepolia.blockscout.com/api",
          },
        },
      },
      84532: {
        name: "BaseSepolia",
        blockExplorers: {
          etherscan: {
            name: "Base Sepolia Etherscan",
            url: "https://basescan.org",
            apiUrl: "https://api.basescan.org/api",
          },
        },
      },
    },
};

export default config;
