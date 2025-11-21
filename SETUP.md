# ZeroToDapp Monorepo Setup Guide

## ✅ What's Been Set Up

Your project has been transformed into a monorepo with the following structure:

```
zero2dapp/
├── package.json              # Root package with workspace configuration
├── packages/
│   ├── nextjs/              # ✅ Next.js app (fully configured)
│   │   ├── app/
│   │   │   ├── layout.tsx   # Root layout
│   │   │   └── page.tsx     # Home page
│   │   ├── public/          # Static assets
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── next.config.ts
│   │   └── .eslintrc.json
│   └── subgraph/            # 📦 Ready for graph init
│       └── README.md
├── contracts/               # Your existing smart contracts
├── scripts/                 # Your existing deployment scripts
├── tests/                   # Your existing tests
└── artifacts/               # Compiled contract artifacts
```

## 🚀 Next Steps

### 1. Start the Next.js Application

From the root directory:

```bash
npm run dev:nextjs
```

Or from the nextjs package:

```bash
cd packages/nextjs
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app!

### 2. Initialize Your Subgraph

Install The Graph CLI globally:

```bash
npm install -g @graphprotocol/graph-cli
```

Navigate to the subgraph folder:

```bash
cd packages/subgraph
```

Initialize your subgraph using one of these methods:

**Option A: From an existing contract**

```bash
graph init \
  --studio \
  --from-contract YOUR_CONTRACT_ADDRESS \
  --network sepolia \
  --contract-name BuenoToken
```

**Option B: Interactive setup**

```bash
graph init --studio YOUR_SUBGRAPH_SLUG
```

**Option C: For local development**

```bash
graph init \
  --protocol ethereum \
  --from-contract YOUR_CONTRACT_ADDRESS \
  --network mainnet \
  --contract-name YourContract \
  YOUR_SUBGRAPH_NAME
```

### 3. Available Commands

**Next.js:**

- `npm run dev:nextjs` - Start development server
- `npm run build:nextjs` - Build for production
- `npm run start:nextjs` - Start production server

**Subgraph:**
After initializing with `graph init`, you'll have:

- `npm run dev:subgraph` - Development commands
- `npm run build:subgraph` - Build the subgraph

**Install dependencies for all packages:**

```bash
npm install
```

## 📚 Resources

- **Next.js**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **The Graph**: [https://thegraph.com/docs/en/subgraphs/quick-start/](https://thegraph.com/docs/en/subgraphs/quick-start/)
- **Solidity**: [https://docs.soliditylang.org/](https://docs.soliditylang.org/)

## 🔧 Workspace Configuration

This monorepo uses npm workspaces. Benefits include:

- ✅ Single `node_modules` at the root
- ✅ Shared dependencies across packages
- ✅ Run commands from root or within packages
- ✅ Easy to add more packages in the future

## 💡 Tips

1. Keep your smart contracts in the root `contracts/` folder
2. The Next.js app can import contract ABIs from `../../artifacts/`
3. The subgraph will reference your deployed contracts
4. Each package can have its own dependencies and scripts

Happy building! 🎉
