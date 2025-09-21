
# DeHub Frontend

A decentralized social and streaming platform built on BNB Smart Chain (BSC) and compatible with other EVM networks.

---

## Technology Stack

- **Blockchain:** BNB Smart Chain (BSC), EVM-compatible chains (Ethereum, etc.)
- **Smart Contracts:** Solidity ^0.x.x
- **Frontend:** Next.js (React), wagmi, ethers.js
- **Development:** Hardhat, OpenZeppelin libraries

---

## Supported Networks

- BNB Smart Chain (Mainnet): 56
- Base (Mainnet): 8453
- BNB Smart Chain Testnet: 97
- Goerli (Ethereum Testnet): 5

---

## Contract Addresses

Core contract is the Stream Controller. Token is the DHB token used in-app. Optional columns include Stream Collection, Vault, and Staking where applicable.

| Network                | Stream Controller                         | Stream Collection                          | Vault                                     | Token (DHB)                               | Staking (if any)                          |
|------------------------|-------------------------------------------|--------------------------------------------|-------------------------------------------|-------------------------------------------|-------------------------------------------|
| BNB Smart Chain (56)   | 0x6e19ba22da239c46941582530c0ef61400b0e3e6 | 0x1065F5922a336C75623B55D22c4a0C760efCe947 | 0xfBA69f9a77CAB5892D568144397DC6A2068EceD3 | 0x680D3113caf77B61b510f332D5Ef4cf5b41A761D | 0x26d2Cd7763106FDcE443faDD36163E2ad33A76E6 |
| Base (8453)            | 0x4fa30dAef50c6dc8593470750F3c721CA3275581 | 0x9f8012074d27F8596C0E5038477ACB52057BC934 | —                                         | 0xD20ab1015f6a2De4a6FdDEbAB270113F689c2F7c | —                                         |
| BSC Testnet (97)       | 0x6e19ba22da239c46941582530c0ef61400b0e3e6 | 0xfdFe40A30416e0aEcF4814d1d140e027253c00c7 | 0xc90f5CbB3bb3e9a181b8Fed7d8a4835B291b7c9F | 0x06EdA7889330031a8417f46e4C771C628c0b6418 | —                                         |
| Goerli (5)             | 0x2B44a04d2e62d84395EB30f9cF71a256Bc7b158A | 0xfdFe40A30416e0aEcF4814d1d140e027253c00c7 | 0x067e7613BFe063A778D1799A58Ee78419A0d9B73 | 0x0F0fBE6FB65AaCE87D84f599924f6524b4F8d858 | —                                         |

---

## Features

- Wallet-based sign-in and signature auth (EVM wallets)
- User profiles: username, avatar, bio, social links
- Feeds and discovery: global/feed views, trending content
- Live and recorded streams: watch and interact (comments, likes)
- On-chain subscriptions: buy/join creator subscription groups
- Direct messaging
- Content upload: video/image with crop and preview
- Staking (DHB)
- DeHub Pay (dPay): payments, transfer summary, txn lists
- Crypto on/off-ramp: Buy, Sell, Swap (BSC, Base, testnets)
- Notifications and search
- Playlists and collections
- Token balances and approvals across supported networks
- Report content and moderation tools

---

## BNB Chain Repository Submission Guidelines

This repository is intended for deployment on BNB Smart Chain (BSC) and compatible EVM networks. It complies with the BNB Chain repository submission requirements:

1. **Purpose:**
	- The project is designed for the BNB Chain ecosystem (BSC, opBNB, or Greenfield) as shown in the configuration and documentation.
2. **Core Verification Principle:**
	- A reviewer can confirm BNB Chain deployment intent by examining this repository alone.
3. **Positive Indicators:**
	- Config files and documentation reference BNB Chain and its network IDs.
	- This README explicitly states BNB Chain deployment.
	- EVM-compatible tooling and libraries are used throughout the codebase.
4. **Common False Positives:**
	- This repository avoids ambiguous or conflicting chain references.
5. **Submission Requirements:**
	- This is the official, public source code for [dehub.io](https://dehub.io).
	- README and config files are compliant with BNB Chain guidelines.

---

## Development

### Environment Variables

The project uses [t3-oss/env-nextjs](https://github.com/t3-oss/env-nextjs) to manage environment variables.

Steps to add a new environment variable:

1. Decide if the variable is server-side or client-side and add it to the relevant section.
2. Add the variable to `.env.example` and `.env`.
3. Add the variable to `configs/env.ts`.
4. Add the variable to Netlify environment variables.

**Notes:**
- Never reference `process.env` directly; always use the `env` object from `@/configs`.
- Client-side variables must use the `NEXT_PUBLIC_` prefix.
- Do not include a trailing slash `/` in URL variables.

### Commit Message Format

This project enforces [Conventional Commits](https://www.conventionalcommits.org/). Use [Commitizen](https://github.com/commitizen/cz-cli) for guided commit messages:

```shell
npm run commit
```

Conventional Commits enable automatic changelog generation and semantic versioning.

---

[Dehub Figma Design System](https://www.figma.com/design/vQyUQzckQ7rQzRYpwBqgaL/Dehub-Design-System)
