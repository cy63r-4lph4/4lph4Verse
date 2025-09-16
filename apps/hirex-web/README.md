# ⚡ HireCore — Frontend dApp

> **HireCore** is the first dApp of the **4lph4Verse** ecosystem and the registered project for **Proof of Ship**.  
> It’s a decentralized task & reputation platform for skilled and unskilled labor.

This frontend is built with **Next.js (App Router)**, **TailwindCSS**, and **Wagmi/viem** for Web3 integration.

---

## ✨ Features (MVP)

- 🌐 Connect wallet (RainbowKit + Wagmi).
- 👤 On-chain **profiles & reputation** (no CV required).
- 📋 Browse and create tasks.
- 🔒 Escrow payments in **Alph4 CØRE Token (CØRE)**.
- 💧 Built-in faucet for onboarding new users.

---

## 📂 Project Structure

```text
apps/hirecore/
│
├── app/               # Next.js App Router pages
├── components/        # UI + reusable components
├── hooks/             # Custom React hooks
├── lib/               # Web3 utils & helpers
├── public/            # Static assets
└── README.md          # You're here 🚀
⚙️ Setup & Development
Navigate into HireCore app

cd apps/hirecore
Install dependencies


pnpm install
Setup environment variables




pnpm dev
Build for production


pnpm build
pnpm start
🔗 Smart Contracts
HireCore currently integrates with the CØRE Token + Faucet deployed from contracts/core.

Contract addresses are synced from:


packages/sdk/utils/contract/deployedContracts.ts
📜 Ship Log (Frontend)
2025-09-15 — Bootstrapped HireCore with Next.js App Router.

2025-09-16 — Integrated wallet connect + contract bindings.

2025-09-16 — Connected to Celo Sepolia deployment.

🧭 Next Steps
Add task creation flow with escrow lock.

Display on-chain profiles with reputation scores.

Integrate gasless UX via relayer.

Expand dashboard UI with filters, search, and categories.

---
```
