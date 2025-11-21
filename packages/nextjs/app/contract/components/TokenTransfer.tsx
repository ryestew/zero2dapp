"use client";

import { useState } from "react";
import { isAddress, parseEther } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import buenoTokenAbi from "../../../../../artifacts/BuenoToken.json";
import { getEnsAddress } from "viem/actions";
import { normalize } from "viem/ens";
import { mainnetEnsClient } from "@/app/lib/ensClient";

const CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_BUENO_TOKEN_ADDRESS as `0x${string}`;
  
const hasENSShape = (input: string) => input.includes(".") && input.length > 2;

export function TokenTransfer() {
  const { address, isConnected } = useAccount();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [mintRecipient, setMintRecipient] = useState("");

  const {
    writeContract: transfer,
    data: transferHash,
    isPending: isTransferPending,
    error: transferError,
  } = useWriteContract();

  const {
    writeContract: mint,
    data: mintHash,
    isPending: isMintPending,
    error: mintError,
  } = useWriteContract();

  const { isLoading: isTransferConfirming, isSuccess: isTransferSuccess } =
    useWaitForTransactionReceipt({
      hash: transferHash,
    });

  const { isLoading: isMintConfirming, isSuccess: isMintSuccess } =
    useWaitForTransactionReceipt({
      hash: mintHash,
    });

  const { data: owner } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: buenoTokenAbi.abi as any,
    functionName: "owner",
  });

  const isOwner =
    owner && address
      ? (owner as string).toLowerCase() === address.toLowerCase()
      : false;

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
    }else if (isAddress(recipient)) {
        resolvedRecipient = recipient
   } else {

       alert("Please enter a valid address");
       return;
   }

    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      transfer({
        address: CONTRACT_ADDRESS,
        abi: buenoTokenAbi.abi as any,
        functionName: "transfer",
        args: [resolvedRecipient as `0x${string}`, parseEther(amount)],
      });
    } catch (error) {
      console.error("Transfer error:", error);
    }
  };

  const handleMint = async () => {
    if (!isAddress(mintRecipient)) {
      alert("Please enter a valid address");
      return;
    }

    if (!mintAmount || parseFloat(mintAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      mint({
        address: CONTRACT_ADDRESS,
        abi: buenoTokenAbi.abi as any,
        functionName: "mint",
        args: [mintRecipient as `0x${string}`, parseEther(mintAmount)],
      });
    } catch (error) {
      console.error("Mint error:", error);
    }
  };

  const resetForm = () => {
    setRecipient("");
    setAmount("");
    setMintAmount("");
    setMintRecipient("");
  };

  if (isTransferSuccess || isMintSuccess) {
    setTimeout(() => {
      resetForm();
    }, 3000);
  }

  if (!isConnected) {
  return (
      <div className="flex flex-col h-full">
        <div className="card bg-celo-dk-tan border-2 border-celo-outline flex-1 flex flex-col">
          <div className="card-body p-8 flex flex-col justify-between">
            <h3 className="font-inter text-2xl font-bold tracking-tight mb-6 text-black">
              TRANSFER TOKENS
            </h3>
            <div className="alert alert-info p-6">
              <span className="font-inter text-body-m">
                Please connect your wallet to transfer tokens
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-8">
      {/* Transfer Tokens */}
      <div className="card bg-celo-dk-tan border-2 border-celo-outline flex-1">
        <div className="card-body p-8">
          <h3 className="font-inter text-2xl font-bold tracking-tight mb-8 text-black">
            TRANSFER TOKENS
          </h3>
          <div className="flex flex-col space-y-6">
            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text font-inter text-label uppercase text-black">
                  Recipient Address
                </span>
              </label>
              <input
                type="text"
                placeholder="0x..."
                className="input border-2 border-celo-outline bg-celo-lt-tan w-full font-mono text-body-m p-4"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                disabled={isTransferPending || isTransferConfirming}
              />
            </div>
            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text font-inter text-label uppercase text-black">
                  Amount
                </span>
              </label>
              <input
                type="number"
                step="0.0001"
                placeholder="0.0"
                className="input border-2 border-celo-outline bg-celo-lt-tan w-full text-body-m p-4"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isTransferPending || isTransferConfirming}
              />
            </div>
            {(isTransferPending || isTransferConfirming) && (
              <div className="alert alert-info p-6">
                <span className="loading loading-spinner loading-sm"></span>
                <span className="font-inter text-body-m text-black">
                  {isTransferConfirming
                    ? "Waiting for confirmation..."
                    : "Transaction submitted..."}
                </span>
              </div>
            )}
            {isTransferSuccess && (
              <div className="alert alert-success p-6">
                <span className="font-inter text-body-m font-bold text-black">
                  Transfer successful!
                </span>
              </div>
            )}
            {transferError && (
              <div className="alert alert-error p-6">
                <span className="font-inter text-body-s">
                  Error: {transferError.message}
                </span>
              </div>
            )}
            <button
              className="btn btn-primary w-full rounded-[500px]] hover:cursor-pointer hover:size-105 mt-4 text-black px-4 py-2 bg-yellow border-black"
              onClick={handleTransfer}
              disabled={
                isTransferPending ||
                isTransferConfirming ||
                !recipient ||
                !amount
              }
            >
              SEND TOKENS
            </button>
          </div>
        </div>
      </div>

      {/* Mint Tokens (Owner Only) */}
      {isOwner && (
        <div className="card bg-celo-purple border-2 border-celo-black">
          <div className="card-body p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-inter text-2xl font-bold tracking-tight text-celo-white">
                MINT TOKENS
              </h3>
              <span className="badge bg-celo-orange border-2 border-celo-black text-celo-black font-inter text-label px-4 py-2">
                OWNER ONLY
              </span>
            </div>
            <div className="flex flex-col space-y-6">
              <div className="form-control">
                <label className="label pb-2">
                  <span className="label-text font-inter text-label uppercase text-celo-white">
                    Recipient Address
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  className="input border-2 border-celo-outline bg-celo-lt-tan w-full font-mono text-body-m p-4"
                  value={mintRecipient}
                  onChange={(e) => setMintRecipient(e.target.value)}
                  disabled={isMintPending || isMintConfirming}
                />
              </div>
              <div className="form-control">
                <label className="label pb-2">
                  <span className="label-text font-inter text-label uppercase text-celo-white">
                    Amount
                  </span>
                </label>
                <input
                  type="number"
                  step="0.0001"
                  placeholder="0.0"
                  className="input border-2 border-celo-outline bg-celo-lt-tan w-full text-body-m p-4"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(e.target.value)}
                  disabled={isMintPending || isMintConfirming}
                />
              </div>
              {(isMintPending || isMintConfirming) && (
                <div className="alert alert-info p-6">
                  <span className="loading loading-spinner loading-sm"></span>
                  <span className="font-inter text-body-m">
                    {isMintConfirming
                      ? "Waiting for confirmation..."
                      : "Transaction submitted..."}
                  </span>
                </div>
              )}
              {isMintSuccess && (
                <div className="alert alert-success p-6">
                  <span className="font-inter text-body-m font-bold">
                    Mint successful!
                  </span>
                </div>
              )}
              {mintError && (
                <div className="alert alert-error p-6">
                  <span className="font-inter text-body-s">
                    Error: {mintError.message}
                  </span>
                </div>
              )}
              <button
                className="btn bg-celo-yellow hover:bg-celo-white text-celo-black border-2 border-celo-yellow w-full py-4 mt-4"
                onClick={handleMint}
                disabled={
                  isMintPending ||
                  isMintConfirming ||
                  !mintRecipient ||
                  !mintAmount
                }
              >
                MINT TOKENS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}