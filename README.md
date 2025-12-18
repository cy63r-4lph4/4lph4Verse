# 🐉 4lph4Verse Monorepo

<p align="center">
  <img src="https://img.shields.io/badge/status-active-brightgreen" alt="Status: Active" />
  <img src="https://img.shields.io/github/license/cy63r-4lph4/4lph4Verse" alt="License" />
  <img src="https://img.shields.io/badge/powered%20by-4lph4%20CØRE-blueviolet" alt="Powered by 4lph4 CØRE" />
</p>

> **The 4lph4Verse** is the abstraction layer for the onchain world — a multi-chain ecosystem powered by the **Alph4 CØRE Token (CØRE)**.
> Its mission is to onboard the next million users onchain by making blockchain invisible — gasless, keyless, seamless — while empowering them with full ownership and control.

---

## 🚀 Vision & Focus

### **Core Focus (2025–2026):**

1. 🧠 **Full Abstraction Infrastructure** — Develop the **Verse Abstraction Layer (VAL)** to power gasless, identity-aware transactions across all Verse dApps.
2. 🪪 **Unified Identity** — Expand **VerseProfile** into a universal onchain identity system with reputation, aura, and persona contexts.
3. 💳 **VerseWallet** — A human-first smart wallet providing Web2-like onboarding, Web3 power, and gasless experiences.
4. 🌐 **Ecosystem Expansion** — Integrate all Verse dApps — HireCore, LeaseVault, VaultOfLove, VerseQuest — into one connected onchain layer.

> The 4lph4Verse is no longer just a collection of apps — it’s the **operating system for the decentralized future.**

---

## 📂 Repository Structure

```text
4lph4verse/
│
├── apps/             # Frontend dApps
│   ├── hirecore-web/     # HireCore platform (decentralized task protocol)
│   ├── leasevault-web/   # LeaseVault - onchain lease & rent manager
│   ├── vaultoflove-web/  # VaultOfLove - community NFT stories
│   └── versequest-web/   # VerseQuest - reflection-based learning dApp
│
├── contracts/        # Smart contracts
│   ├── core/         # Alph4 CØRE Token, Faucet, Registry
│   ├── profile/      # VerseProfile identity & reputation
│   └── utils/        # Forwarder, Paymaster, libraries
│
├── packages/         # Shared code
│   └── sdk/          # SDK (contract bindings + utils + relayer API)
│
├── services/         # Backend/microservices (VAL Gateway, Relayer)
│
└── scripts/          # Deployment/export utilities
```

---

## 🧱 Core Components

### 🪙 **Alph4 CØRE Token (CØRE)**

- ERC-20 with `permit()` (EIP-2612)
- Powers payments, staking, and gas sponsorship
- Multi-chain deployment: Celo, Base, Lisk

### 🧩 **VerseProfile**

- Onchain identity + reputation system
- Human verification, Guardian recovery and self recovery with self protocol
- Gasless creation and updates via VAL
- Persona mapping, aura sync, cross-dApp profile linkage
  🌐 **Live Demo:** [verseProfile Web Interface](https://verse-profile.vercel.app/)

### ⚙️ **Verse Abstraction Layer (VAL)**

- Gateway API for meta-transactions and gasless actions
- Policy engine for gas sponsorship
- Multi-chain relayer powering VerseWallet

### 💼 **VerseWallet**

- Smart wallet for frictionless onboarding
- Passkey-ready login & session-based signatures
- VAL integration for gasless UX

---

## 💡 Active Project: HireCore

**HireCore** is the first Proof-of-Ship registered dApp under the 4lph4Verse.
A decentralized task & reputation protocol connecting skilled & unskilled labor.

**MVP Features:**

- Onchain profiles + skill reputation
- Task creation + escrow using CØRE token
- Community-verified proof of skill
- Faucet for onboarding test users

**Frontend:** `apps/hirecore`
**Contracts:** `contracts/core`, `contracts/hirecore`
**SDK:** `packages/sdk/utils/contract/deployedContracts.ts`

🌐 **Live Demo:** [hirecore.vercel.app](https://4lph4-verse-hirecore.vercel.app/)

**VerseProfile** The Unified Identity layer of the 4lph4verse has a live demo web interface to allow performing mutation actions on the profile.

**Frontend:** `apps/profile-web`
**Contracts:** `contracts/core/VerseProfile.sol`,`contracts/core/HumanVerificationModule.sol`,`contracts/core/selfRecoveryModule.sol`

🌐 **Live Demo:** [verseProfile Web Interface](https://verse-profile.vercel.app/)


---

## ⚙️ Setup

### Clone Repo

```bash
git clone https://github.com/cy63r-4lph4/4lph4Verse.git
cd 4lph4Verse
```

### Install Dependencies

```bash
pnpm install
```

### Setup Environment Variables

```text
DEPLOYER_PRIVATE_KEY={0xYourKey}
TREASURY_PRIVATE_KEY={0xYourKey}
CELO_RPC=https://forno.celo.org
CELO_SEPOLIA_RPC=https://forno-sepolia.celo-testnet.org/
NEXT_PUBLIC_PROJECT_ID={YourProjectID}
```

### Deploy

```bash
pnpm run deploy --filter contracts/core --network celosepolia
```

### Export Deployments

```bash
pnpm export
```

---

## 🌍 Current Deployments (Celo)

| Contract                    | Address                                      | Explorer                                                                               |
| --------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------- |
| **VerseProfile**            | `0x6806dC623f7b250D14fb78F17b417f2e9a8F228e` | [View](https://celo.blockscout.com/address/0x6806dC623f7b250D14fb78F17b417f2e9a8F228e) |
| **HumanVerificationModule** | `0xE7575C6Ff2fE71783fD80280FE685CaCf38b0774` | [View](https://celo.blockscout.com/address/0xE7575C6Ff2fE71783fD80280FE685CaCf38b0774) |
| **selfRecoveryModule**      | `0xEe9ab2B8a636bc8a79dCe15bd8bbe17389aF36A7` | [View](https://celo.blockscout.com/address/0xEe9ab2B8a636bc8a79dCe15bd8bbe17389aF36A7) |

---

## 🌍 Current Deployments (Celo Sepolia)

| Contract               | Address                                      | Explorer                                                                                       |
| ---------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **CoreToken**          | `0xB0CB172Ea557F4bd53A11BB259050fFA9e8B2b94` | [View](https://celo-sepolia.blockscout.com/address/0xB0CB172Ea557F4bd53A11BB259050fFA9e8B2b94) |
| **CoreFaucet**         | `0xb5d8887AB09AdB5983AACEed4e1AbB9267407823` | [View](https://celo-sepolia.blockscout.com/address/0xb5d8887AB09AdB5983AACEed4e1AbB9267407823) |
| **HireCoreJobBoard**   | `0x56a5BA686856F0787ce1B0278ED55D359A1D050e` | [View](https://celo-sepolia.blockscout.com/address/0x56a5BA686856F0787ce1B0278ED55D359A1D050e) |
| **HireCoreJobManager** | `0x775808914a3f338eebaEd255fD4Ba6403546b57a` | [View](https://celo-sepolia.blockscout.com/address/0x775808914a3f338eebaEd255fD4Ba6403546b57a) |
| **VerseProfile**       | `0x9B347f8b7118d673730d8BA774975AcBe1DD4d5E` | [View](https://celo-sepolia.blockscout.com/address/0x9B347f8b7118d673730d8BA774975AcBe1DD4d5E) |
| **AppRegistry**        | `0xb8be06EB50fe5a4089Bc8CcA3C5240e613c29735` | [View](https://celo-sepolia.blockscout.com/address/0xb8be06EB50fe5a4089Bc8CcA3C5240e613c29735) |
| **BadgeRegistry**      | `0x2D3D0525A0FdFE8032d6eA6D5e3d5223d60526aE` | [View](https://celo-sepolia.blockscout.com/address/0x2D3D0525A0FdFE8032d6eA6D5e3d5223d60526aE) |

---

## 🧭 Next Steps (Q4 2025 → Q1 2026)

- [ ] Deploy VerseWallet MVP
- [ ] Enable multi-chain sync for Profile + CØRE (Base + Lisk)
- [ ] Add paymaster for sponsored gas
- [ ] Release Developer SDK v1.0
- [ ] Launch 4lph4Verse metrics dashboard

---

## 👥 Contributors

| Role      | Name  | Handle                                         |
| --------- | ----- | ---------------------------------------------- |
| Architect | Barry | [@cy63r-4lph4](https://github.com/cy63r-4lph4) |
| Core Dev  | —     | —                                              |
| UI/UX     | —     | —                                              |

---

## 🧱 Motto

> _“A dragon doesn’t need a matchbox — it is the flame.”_ 🔥
