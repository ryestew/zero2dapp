# The Graph Integration Guide

This guide will walk you through deploying a subgraph to The Graph and integrating it with your Next.js application to fetch and display blockchain data.

## 📦 Prerequisites

1. A deployed smart contract on a blockchain (Ethereum, Polygon, Celo, etc.)
2. Your contract's address and ABI
3. [The Graph CLI](https://github.com/graphprotocol/graph-cli) installed globally
4. A [Subgraph Studio](https://thegraph.com/studio/) account

## 📋 Part 1: Deploy Your Subgraph

### Step 0: Install The Graph CLI

If you haven't already, install The Graph CLI globally:

```bash
npm install -g @graphprotocol/graph-cli
```

### Step 1: Initialize Your Subgraph

Navigate to the subgraph package in this monorepo:

```bash
cd packages/subgraph
```

Initialize a new subgraph:

```bash
graph init
```

You'll be prompted to provide:

- **Protocol**: Choose your blockchain (ethereum, polygon, celo, etc.)
- **Subgraph name**: Choose a name for your subgraph
- **Directory**: Press enter to use the current directory
- **Ethereum network**: Choose your network (mainnet, sepolia, celo-alfajores, etc.)
- **Contract address**: Enter your deployed smart contract address
- **Start block** (optional): The block number where your contract was deployed (for faster syncing)
- **Contract name**: A name to reference your contract in the code
- **Index events as entities**: Yes (recommended)

This will generate the following files:

- `subgraph.yaml` - Main configuration file
- `schema.graphql` - GraphQL schema defining your entities
- `src/mapping.ts` - Event handlers
- `networks.json` - Network configurations

### Step 2: Update Your Contract Address

If you need to change the contract address later, edit `subgraph.yaml`:

```yaml
dataSources:
  - kind: ethereum
    name: YourContract
    network: celo-alfajores # or your chosen network
    source:
      address: "0xYourContractAddress" # Update this with your contract address
      abi: YourContract
      startBlock: 12345678 # Optional: block number when contract was deployed
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.7
      language: wasm/assemblyscript
      entities:
        - Transfer
        - Approval
      abis:
        - name: YourContract
          file: ./abis/YourContract.json
      eventHandlers:
        - event: Transfer(indexed address,indexed address,uint256)
          handler: handleTransfer
        - event: Approval(indexed address,indexed address,uint256)
          handler: handleApproval
      file: ./src/mapping.ts
```

### Step 3: Define Your Schema

Edit `schema.graphql` to define the entities you want to index. For example:

```graphql
type Transfer @entity {
  id: ID!
  from: Bytes!
  to: Bytes!
  value: BigInt!
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}

type Approval @entity {
  id: ID!
  owner: Bytes!
  spender: Bytes!
  value: BigInt!
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}

type OwnershipTransferred @entity {
  id: ID!
  previousOwner: Bytes!
  newOwner: Bytes!
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}
```

### Step 4: Generate Code

After defining your schema, generate TypeScript types:

```bash
graph codegen
```

This creates type definitions in `generated/` that you'll use in your mappings.

### Step 5: Write Event Handlers

Update `src/mapping.ts` with your event handlers:

```typescript
import {
  Transfer as TransferEvent,
  Approval as ApprovalEvent,
} from "../generated/YourContract/YourContract";
import { Transfer, Approval } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.value = event.params.value;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();
}

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  entity.owner = event.params.owner;
  entity.spender = event.params.spender;
  entity.value = event.params.value;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();
}
```

### Step 6: Create a Subgraph in Studio

1. Go to [Subgraph Studio](https://thegraph.com/studio/)
2. Connect your wallet
3. Click "Create a Subgraph"
4. Choose a name for your subgraph
5. Copy the deploy command shown in the studio

### Step 7: Authenticate with Studio

Replace `<DEPLOY_KEY>` with your deploy key from Subgraph Studio:

```bash
graph auth --studio <DEPLOY_KEY>
```

### Step 8: Build Your Subgraph

Compile your subgraph:

```bash
graph build
```

Fix any errors that appear before proceeding.

### Step 9: Deploy to Studio

Replace `<SUBGRAPH_NAME>` with your subgraph's name from Studio:

```bash
graph deploy --studio <SUBGRAPH_NAME>
```

You'll be prompted to choose a version label (e.g., `v0.0.1`).

### Step 10: Monitor Syncing

After deployment:

1. Your subgraph will begin syncing in Subgraph Studio
2. Monitor the sync progress in the Studio dashboard
3. Once fully synced, you can query your subgraph in the Studio playground
4. Note your subgraph's API URL (you'll need this for the Next.js integration)

The API URL will look like:

```
https://api.studio.thegraph.com/query/<ACCOUNT_ID>/<SUBGRAPH_NAME>/version/latest
```

### Step 11: Test Your Subgraph

Use the Playground in Subgraph Studio to test queries:

```graphql
{
  transfers(first: 5) {
    id
    from
    to
    value
    blockNumber
  }
}
```

Once you see data returning, your subgraph is ready to integrate with the frontend!

---

## 📱 Part 2: Integrate with Next.js

Now that your subgraph is deployed and syncing, let's integrate it with the Next.js application.

## 🚀 Step 1: Install Required Packages

Install the necessary dependencies:

```bash
npm install @tanstack/react-query graphql graphql-request
```

## 📝 Step 2: Update Providers

We need to add React Query support to our existing providers.

### Update `app/providers.tsx`

Replace the current file with:

```typescript
"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { defineChain } from "viem";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia,
  celo as celoMainnet,
} from "wagmi/chains";
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

// ... (keep existing chain configurations: celo, celoAlfajores, celoSepolia)

const wagmiConfig = getDefaultConfig({
  appName: "ZeroToDapp",
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [
    mainnet,
    sepolia,
    polygon,
    optimism,
    arbitrum,
    base,
    celo,
    celoAlfajores,
    celoSepolia,
  ],
  ssr: true,
});

// React Query setup
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

## 🔧 Step 3: Create Environment Variables

Add your subgraph endpoint to `.env.local`:

```bash
# The Graph API
NEXT_PUBLIC_SUBGRAPH_URL=https://api.studio.thegraph.com/query/YOUR_ACCOUNT/YOUR_SUBGRAPH/version/latest

# Optional: API Key for authentication
NEXT_PUBLIC_GRAPH_API_KEY=your_api_key_here
```

⚠️ **Security Note**: For production, use server-side environment variables (without `NEXT_PUBLIC_`) and make requests from Server Components or API routes.

## 📊 Step 4: Create the Data Component

Create a new file `app/subgraph/components/SubgraphData.tsx`:

```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";

const query = gql`
  {
    transfers(first: 10) {
      id
      to
      transactionHash
      value
      from
      blockTimestamp
      blockNumber
    }
    ownershipTransferreds(first: 10) {
      blockNumber
      blockTimestamp
      id
      newOwner
      transactionHash
      previousOwner
    }
    approvals(first: 5) {
      id
      owner
      spender
      value
      transactionHash
    }
    eip712DomainChangeds(first: 5) {
      id
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

const url = process.env.NEXT_PUBLIC_SUBGRAPH_URL || "";
const headers = process.env.NEXT_PUBLIC_GRAPH_API_KEY
  ? { Authorization: `Bearer ${process.env.NEXT_PUBLIC_GRAPH_API_KEY}` }
  : {};

export default function SubgraphData() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["subgraph-data"],
    async queryFn() {
      return await request(url, query, {}, headers);
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Error loading data: {error.message}</span>
      </div>
    );
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleString();
  };

  return (
    <div className="space-y-12">
      {/* Transfers */}
      <div className="card bg-base-200 shadow-xl border border-base-300">
        <div className="card-body p-8">
          <h2 className="card-title text-3xl mb-6">💸 Transfers</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                  <th>Value</th>
                  <th>Block</th>
                  <th>Transaction</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {data?.transfers?.map((transfer: any) => (
                  <tr key={transfer.id}>
                    <td className="font-mono text-sm">
                      {formatAddress(transfer.from)}
                    </td>
                    <td className="font-mono text-sm">
                      {formatAddress(transfer.to)}
                    </td>
                    <td className="font-semibold">
                      {(parseInt(transfer.value) / 1e18).toFixed(4)}
                    </td>
                    <td>{transfer.blockNumber}</td>
                    <td className="font-mono text-sm">
                      {formatAddress(transfer.transactionHash)}
                    </td>
                    <td className="text-sm opacity-70">
                      {formatTimestamp(transfer.blockTimestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!data?.transfers || data.transfers.length === 0) && (
            <div className="text-center py-8 opacity-60">
              <p>No transfers found</p>
            </div>
          )}
        </div>
      </div>

      {/* Ownership Transferred */}
      <div className="card bg-base-200 shadow-xl border border-base-300">
        <div className="card-body p-8">
          <h2 className="card-title text-3xl mb-6">👑 Ownership Transfers</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Previous Owner</th>
                  <th>New Owner</th>
                  <th>Block</th>
                  <th>Transaction</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {data?.ownershipTransferreds?.map((transfer: any) => (
                  <tr key={transfer.id}>
                    <td className="font-mono text-sm">
                      {formatAddress(transfer.previousOwner)}
                    </td>
                    <td className="font-mono text-sm">
                      {formatAddress(transfer.newOwner)}
                    </td>
                    <td>{transfer.blockNumber}</td>
                    <td className="font-mono text-sm">
                      {formatAddress(transfer.transactionHash)}
                    </td>
                    <td className="text-sm opacity-70">
                      {formatTimestamp(transfer.blockTimestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!data?.ownershipTransferreds ||
            data.ownershipTransferreds.length === 0) && (
            <div className="text-center py-8 opacity-60">
              <p>No ownership transfers found</p>
            </div>
          )}
        </div>
      </div>

      {/* Approvals */}
      <div className="card bg-base-200 shadow-xl border border-base-300">
        <div className="card-body p-8">
          <h2 className="card-title text-3xl mb-6">✅ Approvals</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Owner</th>
                  <th>Spender</th>
                  <th>Value</th>
                  <th>Transaction</th>
                </tr>
              </thead>
              <tbody>
                {data?.approvals?.map((approval: any) => (
                  <tr key={approval.id}>
                    <td className="font-mono text-sm">
                      {formatAddress(approval.owner)}
                    </td>
                    <td className="font-mono text-sm">
                      {formatAddress(approval.spender)}
                    </td>
                    <td className="font-semibold">
                      {(parseInt(approval.value) / 1e18).toFixed(4)}
                    </td>
                    <td className="font-mono text-sm">
                      {formatAddress(approval.transactionHash)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!data?.approvals || data.approvals.length === 0) && (
            <div className="text-center py-8 opacity-60">
              <p>No approvals found</p>
            </div>
          )}
        </div>
      </div>

      {/* EIP712 Domain Changed */}
      <div className="card bg-base-200 shadow-xl border border-base-300">
        <div className="card-body p-8">
          <h2 className="card-title text-3xl mb-6">🔐 EIP712 Domain Changes</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Block</th>
                  <th>Transaction</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {data?.eip712DomainChangeds?.map((event: any) => (
                  <tr key={event.id}>
                    <td className="font-mono text-sm">{event.id}</td>
                    <td>{event.blockNumber}</td>
                    <td className="font-mono text-sm">
                      {formatAddress(event.transactionHash)}
                    </td>
                    <td className="text-sm opacity-70">
                      {formatTimestamp(event.blockTimestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!data?.eip712DomainChangeds ||
            data.eip712DomainChangeds.length === 0) && (
            <div className="text-center py-8 opacity-60">
              <p>No domain changes found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

## 🎨 Step 5: Update the Subgraph Page

Update `app/subgraph/page.tsx`:

```typescript
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import SubgraphData from "./components/SubgraphData";

const query = gql`
  {
    transfers(first: 10) {
      id
      to
      transactionHash
      value
      from
      blockTimestamp
      blockNumber
    }
    ownershipTransferreds(first: 10) {
      blockNumber
      blockTimestamp
      id
      newOwner
      transactionHash
      previousOwner
    }
    approvals(first: 5) {
      id
      owner
      spender
      value
      transactionHash
    }
    eip712DomainChangeds(first: 5) {
      id
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

const url = process.env.NEXT_PUBLIC_SUBGRAPH_URL || "";
const headers = process.env.NEXT_PUBLIC_GRAPH_API_KEY
  ? { Authorization: `Bearer ${process.env.NEXT_PUBLIC_GRAPH_API_KEY}` }
  : {};

export default async function SubgraphPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["subgraph-data"],
    async queryFn() {
      return await request(url, query, {}, headers);
    },
  });

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <section className="hero min-h-[300px] bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Subgraph Data
            </h1>
            <p className="text-xl opacity-80">
              Live blockchain data indexed by The Graph
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-8 md:px-12 max-w-7xl">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <SubgraphData />
          </HydrationBoundary>
        </div>
      </section>
    </div>
  );
}
```

## 🔍 Step 6: Test Your Integration

1. Make sure your environment variables are set in `.env.local`
2. Restart your development server:
   ```bash
   npm run dev
   ```
3. Navigate to `/subgraph` to see your data

## 🎯 Advanced: Server-Side Only Requests

For production, it's more secure to fetch data server-side only. Create an API route:

**Create `app/api/subgraph/route.ts`:**

```typescript
import { gql, request } from "graphql-request";
import { NextResponse } from "next/server";

const query = gql`
  {
    transfers(first: 10) {
      id
      to
      from
      value
      blockNumber
      blockTimestamp
      transactionHash
    }
    # ... rest of your query
  }
`;

export async function GET() {
  const url = process.env.SUBGRAPH_URL!; // Server-side only!
  const headers = process.env.GRAPH_API_KEY
    ? { Authorization: `Bearer ${process.env.GRAPH_API_KEY}` }
    : {};

  try {
    const data = await request(url, query, {}, headers);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}
```

Then update your client component to fetch from `/api/subgraph` instead of the direct URL.

## 📚 Resources

- [The Graph Documentation](https://thegraph.com/docs/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [GraphQL Request Library](https://github.com/jasonkuhrt/graphql-request)
- [The Graph Studio](https://thegraph.com/studio/)

## 🔐 Security Best Practices

1. **Never commit API keys** to version control
2. Use **server-side environment variables** for production
3. Implement **rate limiting** on your API routes
4. Consider using **API routes** as a proxy to hide your subgraph URL
5. Use **CORS** restrictions on your subgraph endpoint if available

## 🐛 Troubleshooting

### CORS Errors

If you see CORS errors, use an API route as a proxy (see Advanced section above).

### Data Not Loading

1. Check your `.env.local` file is properly configured
2. Verify your subgraph URL is correct
3. Check browser console for error messages
4. Ensure your subgraph is deployed and synced

### Empty Data

1. Make sure your subgraph has indexed events
2. Check your GraphQL query matches your subgraph schema
3. Verify the contract address in your subgraph is correct

## ✅ Next Steps

- Customize the UI to match your brand
- Add pagination for large datasets
- Implement real-time updates with polling or subscriptions
- Add filtering and search functionality
- Create detailed views for individual transactions
