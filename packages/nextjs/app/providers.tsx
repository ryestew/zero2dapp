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

// Override Celo mainnet with icon
const celo = {
  ...celoMainnet,
  iconUrl: "https://s2.coinmarketcap.com/static/img/coins/200x200/5567.png",
};

// Define Celo Alfajores testnet
const celoAlfajores = defineChain({
  id: 44787,
  name: "Celo Alfajores Testnet",
  nativeCurrency: {
    name: "CELO",
    symbol: "CELO",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://alfajores-forno.celo-testnet.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://celo-alfajores.blockscout.com",
    },
  },
  iconUrl: "https://s2.coinmarketcap.com/static/img/coins/200x200/5567.png",
  testnet: true,
});

// Define Celo Sepolia testnet
const celoSepolia = defineChain({
  id: 11142220,
  name: "Celo Sepolia Testnet",
  nativeCurrency: {
    name: "CELO",
    symbol: "CELO",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://forno.celo-sepolia.celo-testnet.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://celo-sepolia.blockscout.com",
    },
  },
  iconUrl: "https://s2.coinmarketcap.com/static/img/coins/200x200/5567.png",
  testnet: true,
});

const config = getDefaultConfig({
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
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000, // 1 minute
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
