# ENS Integration Guide

## 📋 Table of Contents

- [Overview](#overview)
- [What Was Added](#what-was-added)
- [Prerequisites](#prerequisites)
- [ENS Resolution Basics](#ens-resolution-basics)
- [Forward Resolution (Name → Address)](#forward-resolution-name--address)
- [Reverse Resolution (Address → Profile)](#reverse-resolution-address--profile)
- [Testing the ENS Flows](#testing-the-ens-flows)
- [Troubleshooting](#troubleshooting)
- [Resources](#resources)

## 🌐 Overview

This guide documents the ENS enhancements to the contract dashboard:

- Resolve human-readable ENS names to wallet addresses before sending tokens.
- Discover the primary ENS name and profile metadata for a connected wallet.
- Centralize ENS traffic through an Ethereum Mainnet client, even while the dapp runs on Celo Sepolia.

> ⚠️ ENS resolution **must** query Ethereum Mainnet RPC endpoints. Always override the default Celo chain configuration when performing ENS lookups.

## 🆕 What Was Added

- `packages/nextjs/app/lib/ensClient.ts` — shared `mainnetEnsClient` instance targeting Ethereum Mainnet RPC.
- `packages/nextjs/app/contract/components/TokenTransfer.tsx` — forward resolution of ENS names to addresses during transfers.
- `packages/nextjs/app/contract/components/TokenBalance.tsx` — reverse resolution to display the caller’s primary ENS name beside balances.
- `packages/nextjs/app/contract/components/ENSProfile.tsx` — enriched ENS profile card (avatar, banner, social links) powered by React Query.

## ✅ Prerequisites

- Node.js 18+ and `pnpm` installed globally.
- WalletConnect Project ID in `.env.local` (required by Wagmi).
- An RPC provider that serves Ethereum Mainnet (e.g. Alchemy, Infura) connected through the default `viem` HTTP transport, or your own Gateway URL.

## 🧭 ENS Resolution Basics

- **Forward resolution**: Start with an ENS name (`vitalik.eth`) and fetch the canonical `0x` address before executing contract logic.
- **Reverse resolution**: Start with an address and request its primary ENS name plus optional text records (bio, social handles, avatar).
- All ENS calls run against the shared `mainnetEnsClient` so they succeed regardless of the active application chain.

```2:8:packages/nextjs/app/lib/ensClient.ts
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

export const mainnetEnsClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});
```

## 🔁 Forward Resolution (Name → Address)

1. **Collect user input**: `TokenTransfer` accepts either a raw address or ENS name in the “Recipient” field.
2. **Detect ENS strings**: `hasENSShape` looks for dotted names before attempting resolution.
3. **Normalize & resolve**: `getEnsAddress` from `viem/actions` normalizes the name and queries Ethereum Mainnet via `mainnetEnsClient`.
4. **Fallback**: If resolution fails, the UI alerts the user instead of submitting the transaction.
5. **Send transaction**: Once the ENS name resolves to a `0x` address, it proceeds with `transfer`.

```66:105:packages/nextjs/app/contract/components/TokenTransfer.tsx
  const handleTransfer = async () => {
    let resolvedRecipient = recipient;

    if (hasENSShape(recipient)) {
      try {
        const ensAddress = await getEnsAddress(mainnetEnsClient, {
          name: normalize(recipient),
        });
        if (ensAddress) {
          resolvedRecipient = ensAddress;
        } else {
          alert("Could not resolve ENS name");
          return;
        }
      } catch (error) {
        console.error("ENS resolution error:", error);
        alert("Error resolving ENS name");
        return;
      }
    }

    if (!isAddress(resolvedRecipient)) {
      alert("Please enter a valid address");
      return;
    }

    // …continue with transfer write call…
```

## 🔄 Reverse Resolution (Address → Profile)

### Primary ENS Name on the Balance Card

- `TokenBalance` injects a Wagmi config that points `useEnsName` to Mainnet, independent of the default Celo setup.
- Reverse resolution is enabled only when the user is connected and an address is present.

```20:40:packages/nextjs/app/contract/components/TokenBalance.tsx
const mainnetEnsConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
  ssr: true,
});

export function TokenBalance() {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({
    address,
    chainId: mainnet.id,
    config: mainnetEnsConfig,
    query: {
      enabled: !!address,
    },
  });
```

### Rich ENS Profile Card

- `ENSProfile` performs reverse lookups for the connected address, gathering avatar, banner, description, and social handles via ENS text records.
- All metadata requests reuse `mainnetEnsClient` to avoid cross-chain issues.
- Results are cached for 5 minutes with React Query.

```115:175:packages/nextjs/app/contract/components/ENSProfile.tsx
const fetchEnsProfile = async (address: `0x${string}`): Promise<EnsProfile> => {
  const name = await getEnsName(mainnetEnsClient, { address });
  if (!name) {
    return { name: null, socials: [] };
  }

  const normalized = normalize(name);

  const [avatar, header, banner, cover, description, socials] =
    await Promise.all([
      getEnsAvatar(mainnetEnsClient, { name: normalized }).catch(() => null),
      getEnsText(mainnetEnsClient, { name: normalized, key: "header" }).catch(
        () => null,
      ),
      // …additional text record lookups…
    ]);
```

## 🧪 Testing the ENS Flows

1. Run the Next.js app:
   ```bash
   pnpm --filter nextjs dev
   ```
2. Connect a wallet with an ENS primary name.
3. Confirm the balance card shows `Your ENS Name …` instead of the raw address.
4. Visit the transfer card and send tokens to an ENS name (e.g. `vitalik.eth`); confirm it resolves to the expected address.
5. Inspect the ENS Profile card; verify avatar, banner, and social links render when present.

## 🛠️ Troubleshooting

- **ENS lookups returning null**
  - Verify your RPC endpoint supports ENS (Alchemy/Infura Mainnet).
  - Ensure network access to Mainnet isn’t blocked by a firewall or browser extension.

- **Wrong network prompt**
  - Wallets can stay on Celo for contract interactions; ENS calls rely on the backend client, not the wallet network.

- **Slow ENS responses**
  - Provide a dedicated Mainnet RPC URL to `http()` instead of the default public endpoint for better performance.

## 📚 Resources

- [ENS Docs](https://docs.ens.domains/)
- [viem ENS Actions](https://viem.sh/docs/ens/)
- [Wagmi `useEnsName`](https://wagmi.sh/react/api/hooks/useEnsName)
- [RainbowKit + ENS Example](https://www.rainbowkit.com/docs/introduction)
