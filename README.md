# ZeroToDapp Monorepo

A monorepo for building decentralized applications with smart contracts, a Next.js frontend, and The Graph subgraph indexing.

## Project Structure

```
zero2dapp/
├── packages/
│   ├── nextjs/          # Next.js frontend application
│   └── subgraph/        # The Graph protocol subgraph
├── contracts/           # Smart contracts
├── scripts/            # Deployment and utility scripts
├── tests/              # Contract tests
└── artifacts/          # Compiled contract artifacts
```

## Getting Started

### Install Dependencies

From the root of the monorepo:

```bash
npm install
```

This will install dependencies for all packages in the monorepo.

### Next.js Frontend

Run the Next.js development server:

```bash
npm run dev:nextjs
```

Or navigate to the package and run directly:

```bash
cd packages/nextjs
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Subgraph

To set up your subgraph, navigate to the subgraph package and initialize:

```bash
cd packages/subgraph
graph init
```

See the [subgraph README](./packages/subgraph/README.md) for detailed instructions.

### Smart Contracts

Your smart contracts are located in the `contracts/` directory. Use the scripts in the `scripts/` directory to deploy them.

## Workspace Commands

The monorepo is set up with npm workspaces. You can run commands for specific packages:

- `npm run dev:nextjs` - Start Next.js development server
- `npm run build:nextjs` - Build Next.js for production
- `npm run dev:subgraph` - Run subgraph development commands
- `npm run build:subgraph` - Build the subgraph

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [The Graph Documentation](https://thegraph.com/docs/)
- [Solidity Documentation](https://docs.soliditylang.org/)
