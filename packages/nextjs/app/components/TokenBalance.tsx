"use client";

import { formatUnits, http } from "viem";
import { createConfig, useAccount, useEnsName, useReadContract } from "wagmi";
import buenoTokenAbi from "../../../subgraph/abis/BuenoToken.json";
import { useEffect } from "react";
import { mainnet } from "viem/chains";

const CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_BUENO_TOKEN_ADDRESS as `0x${string}`;

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

  console.log(ensName);

  // Debug log to see what's happening
  useEffect(() => {
    console.log("Account state:", { address, isConnected });
  }, [address, isConnected]);

  const { data: balance, isLoading, error: balanceError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: buenoTokenAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: tokenName, error: nameError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: buenoTokenAbi as any,
    functionName: "name",
  });

  const { data: tokenSymbol, error: symbolError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: buenoTokenAbi as any,
    functionName: "symbol",
  });

  // Debug logging
  console.log("Contract Address:", CONTRACT_ADDRESS);
  console.log("User Address:", address);
  console.log("Balance:", balance);
  console.log("Balance Error:", balanceError);
  console.log("Token Name:", tokenName);
  console.log("Token Symbol:", tokenSymbol);

  if (!isConnected) {
    return (
      <div className="flex flex-col h-full">
        <div className="card bg-celo-dk-tan border-2 border-celo-outline flex-1 flex flex-col">
          <div className="card-body p-8 flex flex-col justify-between">
            <h3 className="font-inter text-2xl font-bold tracking-tight mb-6">
              TOKEN BALANCE
            </h3>
            <div className="alert alert-info p-6">
              <span className="font-inter text-body-m">
                Please connect your wallet to view your token balance
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="card bg-celo-dk-tan border-2 border-celo-outline flex-1 flex flex-col">
        <div className="card-body p-8 flex flex-col justify-between">
          <h3 className="font-inter text-2xl font-bold tracking-tight mb-6">
            TOKEN BALANCE
          </h3>
        {!CONTRACT_ADDRESS ? (
          <div className="alert alert-error p-6">
            <span className="font-inter text-body-m">
              Contract address not configured. Please set NEXT_PUBLIC_BUENO_TOKEN_ADDRESS in your .env file.
            </span>
          </div>
        ) : balanceError ? (
          <div className="alert alert-error p-6">
            <div className="flex flex-col gap-2">
              <span className="font-inter text-body-m font-bold">
                Error loading balance
              </span>
              <span className="font-inter text-body-s">
                {balanceError.message}
              </span>
              <span className="font-mono text-xs mt-2">
                Contract: {CONTRACT_ADDRESS}
              </span>
            </div>
          </div>
        ) : isLoading ? (
            <div className="flex justify-center items-center py-16">
              <span className="loading loading-spinner loading-lg text-celo-purple"></span>
          </div>
        ) : (
            <div className="flex flex-col space-y-8">
              {/* Large Balance Display */}
              <div className="bg-celo-yellow border-2 border-celo-black p-8">
                <div className="flex flex-col">
                  <p className="font-inter text-label uppercase mb-2">
                {(tokenName as string) || "BuenoToken"}
                  </p>
                  <p className="font-alpina text-6xl text-celo-black leading-tight">
                {balance
                  ? parseFloat(formatUnits(balance as bigint, 2)).toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )
                  : "0.00"}
                  </p>
                  <p className="font-inter text-body-m mt-2">
                {(tokenSymbol as string) || "BTK"}
                  </p>
              </div>
            </div>

              {/* Address Display */}
                <p className="font-inter text-label uppercase mb-2">{ ensName ? "YOUR ENS NAME" : "YOUR ADDRESS" }</p>
              <div className="bg-celo-lt-tan border-2 border-celo-outline p-6">
                <p className="font-mono text-body-s text-celo-body-copy break-all">
                  {ensName || address}
                </p>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}