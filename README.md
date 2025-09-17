# 🐉 4lph4Verse Monorepo

> **The 4lph4Verse** is a multi-chain ecosystem powered by the **Alph4 CØRE Token (CØRE)**.  
> This monorepo contains all apps, contracts, SDKs, and services that make up the 4lph4Verse.

---

## 🚀 Update

Faucet system working with direct claims (no relayer)🎉
apps/verse-core/

## 📂 Repository Structure

```text
4lph4verse/
│
├── apps/             # Frontend dApps
│   └── hirecore/     # HireCore platform (Proof of Ship registered project)
│
├── contracts/        # Smart contracts
│   └── core/         # CoreToken + Faucet (foundation layer)
│
├── packages/         # Shared code
│   └── sdk/          # SDK (contracts bindings + utils for dApps)
│
├── services/         # Backend/microservices (future expansion)
│
└── scripts/          # Utility scripts
```

---

##💡 Active Project: HireCore

HireCore is the Proof of Ship registered project.
It’s a decentralized task & reputation protocol for skilled & unskilled labor.

Features (MVP phase):
On-chain profiles & reputation (no CV needed).

Task creation + escrow using CØRE token.

Community-backed proof of skill.

Faucet to onboard new users with test tokens.

Location in repo:
Frontend dApp → apps/hirecore

Contracts → contracts/core (CØRE + Faucet)

SDK → packages/sdk/utils/contract/deployedContracts.ts

⚙️ Setup
Clone repo

git clone https://github.com/cy63r-4lph4/4lph4Verse.git
cd 4lph4Verse
Install dependencies

pnpm install
Setup env vars

Create .env in contracts/core/:

DEPLOYER_PRIVATE_KEY=.....00000.....
TREASURY_PRIVATE_KEY=......0000......
CELO_RPC=https://forno.celo.org
CELO_SEPOLIA_RPC=https://forno.celo-sepolia.celo-testnet.org/
🧪 Tests

cd contracts/core
pnpm hardhat test
🚀 Deployment Flow
We use Hardhat Ignition + viem for declarative deployments.

Localhost

pnpm run deploy --filter contracts/core --network localhost
Testnet (Celo Sepolia)

pnpm run deploy --filter contracts/core --network celosepolia
Export deployment info

pnpm hardhat run scripts/export-deployment.ts --network celosepolia
This generates synced contract bindings in:

packages/sdk/utils/contract/deployedContracts.json
packages/sdk/utils/contract/deployedContracts.ts
🌍 Current Deployments
Network Chain ID CoreToken Address CoreFaucet Address Last Updated
Localhost 31337 0x... 0x... 2025-09-16
Celo Sepolia 11142220 0x... 0x... 2025-09-16

📜 Ship Log (Proof of Ship)
2025-09-10 — Setup monorepo structure (apps, contracts, sdk, services).

2025-09-12 — Added CoreToken + Faucet contracts.

2025-09-15 — Registered HireCore for Proof of Ship.

2025-09-16 — Integrated Ignition deployments + export script.

2025-09-16 — Successfully deployed to Celo Sepolia testnet 🎉.

🧭 Next Steps
Expand HireCore frontend (task creation, escrow flows).

Integrate profile + ENS manager contract.

Develop a gasless UX with relayer.

Deploy Alph4 CØRE token to multiple chains.

---
