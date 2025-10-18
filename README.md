# 🐉 4lph4Verse Monorepo

> **The 4lph4Verse** is a multi-chain ecosystem powered by the **Alph4 CØRE Token (CØRE)**.  
> This monorepo contains all apps, contracts, SDKs, and services that make up the 4lph4Verse.

---

## 🚀 Update

updated the Hirecore platform to allow task posting and live task and profile fetching
url: https://4lph4-verse-hirecore.vercel.app/

---

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

💡 Active Project: HireCore

HireCore is the Proof of Ship registered project.
It’s a decentralized task & reputation protocol for skilled & unskilled labor.

Features (MVP phase):
On-chain profiles & reputation (no CV needed).

Task creation + escrow using CØRE token.

Community-backed proof of skill.

Faucet to onboard new users with test tokens.

Location in repo:
Frontend dApp → apps/hirecore

Contracts → contracts/core (CØRE + Faucet) & contracts/hirecore (JobBoard + JobManager + ScoreModel)

## SDK → packages/sdk/utils/contract/deployedContracts.ts

⚙️ Setup
Clone repo

```bash
git clone https://github.com/cy63r-4lph4/4lph4Verse.git
cd 4lph4Verse
```

Install dependencies

```bash
pnpm install
```

Setup env vars

Create .env in contracts/core/:

```text
DEPLOYER_PRIVATE_KEY={0xyour_deployer_private_key}
TREASURY_PRIVATE_KEY={0xyour_treasury_private_key}
CELO_RPC=https://forno.celo.org
CELO_SEPOLIA_RPC=https://forno.celo-sepolia.celo-testnet.org/
ETHERSCAN_API_KEY={Your_etherscan_api_key}
NEXT_PUBLIC_PROJECT_ID={your_project_id_from_reown_cloud}
STORACHA_SPACE_DID=did:key:{Your_storacha_delegation_did}
```

Localhost

```
pnpm run deploy --filter contracts/core --network localhost
```

Testnet (Celo Sepolia)

```
pnpm run deploy --filter contracts/core --network celosepolia
```

Export deployment info

```
pnpm export
```

This generates synced contract bindings in:

packages/sdk/utils/contract/deployedContracts.json
packages/sdk/utils/contract/deployedContracts.ts

---

## 🌍 Current Deployments

Celo Sepolia (11142220)

Last updated: 2025-09-23

| Contract               | Address                                      | Explorer                                                                                       |
| ---------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **CoreToken**          | `0xB0CB172Ea557F4bd53A11BB259050fFA9e8B2b94` | [View](https://celo-sepolia.blockscout.com/address/0xB0CB172Ea557F4bd53A11BB259050fFA9e8B2b94) |
| **CoreFaucet**         | `0xb5d8887AB09AdB5983AACEed4e1AbB9267407823` | [View](https://celo-sepolia.blockscout.com/address/0xb5d8887AB09AdB5983AACEed4e1AbB9267407823) |
| **HireCoreJobBoard**   | `0x56a5BA686856F0787ce1B0278ED55D359A1D050e` | [View](https://celo-sepolia.blockscout.com/address/0x56a5BA686856F0787ce1B0278ED55D359A1D050e) |
| **HireCoreJobManager** | `0x775808914a3f338eebaEd255fD4Ba6403546b57a` | [View](https://celo-sepolia.blockscout.com/address/0x775808914a3f338eebaEd255fD4Ba6403546b57a) |
| **HireCoreScoreModel** | `0xb4741A7d2d26a59fbeF9fb17BEbb65e1acb6c5DA` | [View](https://celo-sepolia.blockscout.com/address/0xb4741A7d2d26a59fbeF9fb17BEbb65e1acb6c5DA) |
| **VerseProfile**       | `0x9B347f8b7118d673730d8BA774975AcBe1DD4d5E` | [View](https://celo-sepolia.blockscout.com/address/0x9B347f8b7118d673730d8BA774975AcBe1DD4d5E) |
| **AppRegistry**        | `0xb8be06EB50fe5a4089Bc8CcA3C5240e613c29735` | [View](https://celo-sepolia.blockscout.com/address/0xb8be06EB50fe5a4089Bc8CcA3C5240e613c29735) |
| **BadgeRegistry**      | `0x2D3D0525A0FdFE8032d6eA6D5e3d5223d60526aE` | [View](https://celo-sepolia.blockscout.com/address/0x2D3D0525A0FdFE8032d6eA6D5e3d5223d60526aE) |
| **ReputationHub**      | `0xB617E64D4b1C927d7cE3e35f7bbA852bC2c5c50F` | [View](https://celo-sepolia.blockscout.com/address/0xB617E64D4b1C927d7cE3e35f7bbA852bC2c5c50F) |
| **ScoreAggregator**    | `0xFC6F44E9307B2CACbA608CDc6A3D9A57876cfD66` | [View](https://celo-sepolia.blockscout.com/address/0xFC6F44E9307B2CACbA608CDc6A3D9A57876cfD66) |

## 🌐 Frontend Deployments

| App           | URL                                                                              |
| ------------- | -------------------------------------------------------------------------------- |
| **HireCore**  | [hirecore.vercel.app](https://4lph4-verse-hirecore.vercel.app/)                  |
| **VerseCore** | [verse-core.vercel.app](https://4lph4-verse-verse-core.vercel.app/)              |
| **Faucet**    | [verse-core.vercel.app/faucet](https://4lph4-verse-verse-core.vercel.app/faucet) |

---

## 📜 Ship Log (Proof of Ship)

2025-10-18 — Updated the frontend to display task details and user profiles

---

## 🧭 Next Steps

Update Alph4 CØRE token contract to allow permits which will allow a fully gasless expeirience for users.
Depoy HireCore on base and Verse profile on celo to test multichain compactibility.
Deploy Alph4 CØRE token to multiple chains (lisk and base).
