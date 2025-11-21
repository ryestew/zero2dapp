"use client";

import { useState, useEffect } from "react";
import { useAccount, usePublicClient, useWalletClient, useWaitForTransactionReceipt } from "wagmi";
import { formatUnits, parseEther } from "viem";
import { Actions, V4Planner } from '@uniswap/v4-sdk';
import { CommandType, RoutePlanner } from '@uniswap/universal-router-sdk';
import { ERC20_ABI } from "../lib/erc20Abi";
import { QUOTER_ABI } from "../lib/quoterAbi";
import { BUENO_TOKEN, CELO_TOKEN,QUOTER_ADDRESS, FEE_TIER, TICK_SPACING, HOOKS, UNIVERSAL_ROUTER, PERMIT2_ADDRESS } from "../lib/config";
import { PERMIT2_ABI } from "../lib/permit2Abi";
import { UNIVERSAL_ROUTER_ABI } from "../lib/universalRouterAbi";

export function SwapInterface() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [amount, setAmount] = useState("");
  const [celoBalance, setCeloBalance] = useState<string>("0");
  const [btkBalance, setBtkBalance] = useState<string>("0");
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [quote, setQuote] = useState<string>("");
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);

  const [swapHash, setSwapHash] = useState<`0x${string}` | undefined>();
  const [isApproving, setIsApproving] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: swapHash,
  });

  async function fetchBalances() {
    if (!publicClient || !address) return;

    setIsLoadingBalances(true);

    try {
      const celoBalanceResult = await publicClient.readContract({
        address: CELO_TOKEN,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [address],
      });

      const btkBalanceResult = await publicClient.readContract({
        address: BUENO_TOKEN,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [address],
      });

      setCeloBalance(formatUnits(celoBalanceResult, 18));
      setBtkBalance(formatUnits(btkBalanceResult, 2));
    } catch (error) {
      console.error("Error fetching balances:", error);
    } finally {
      setIsLoadingBalances(false);
    }
  }

  async function handleGetQuote() {
    if (!amount || Number(amount) <= 0 || !publicClient) return;

    setIsLoadingQuote(true);

    try {
      const amountIn = parseEther(amount);
      const zeroForOne = CELO_TOKEN.toLowerCase() < BUENO_TOKEN.toLowerCase();

      const poolKey = {
        currency0: zeroForOne ? CELO_TOKEN : BUENO_TOKEN,
        currency1: zeroForOne ? BUENO_TOKEN : CELO_TOKEN,
        fee: FEE_TIER,
        tickSpacing: TICK_SPACING,
        hooks: HOOKS,
      };

      const result = await publicClient.readContract({
        address: QUOTER_ADDRESS,
        abi: QUOTER_ABI,
        functionName: "quoteExactInputSingle",
        args: [
          {
            poolKey,
            zeroForOne,
            exactAmount: amountIn,
            hookData: "0x",
          },
        ],
      });

      const [amountOut] = result;
      setQuote(formatUnits(amountOut, 2));
    } catch (error: any) {
      console.error("Error getting quote:", error);
      alert(`Failed to get quote: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoadingQuote(false);
    }
  }

  async function handleSwap() {
    if (!walletClient || !publicClient || !address || !quote) return;

    try {
      setIsSwapping(true);

      const amountIn = parseEther(amount);
      const quoteAmount = Number(quote) * 100;
      const amountOutMinimum = BigInt(Math.floor(quoteAmount * 0.995));

      const zeroForOne = CELO_TOKEN.toLowerCase() < BUENO_TOKEN.toLowerCase();

      const poolKey = {
        currency0: zeroForOne ? CELO_TOKEN : BUENO_TOKEN,
        currency1: zeroForOne ? BUENO_TOKEN : CELO_TOKEN,
        fee: FEE_TIER,
        tickSpacing: TICK_SPACING,
        hooks: HOOKS,
      };

      const celoBalance = await publicClient.readContract({
        address: CELO_TOKEN,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [address],
      });

      if (celoBalance < amountIn) {
        alert(`Insufficient CELO balance. You have ${formatUnits(celoBalance, 18)} CELO`);
        return;
      }

      const erc20Allowance = await publicClient.readContract({
        address: CELO_TOKEN,
        abi: ERC20_ABI,
        functionName: "allowance",
        args: [address, PERMIT2_ADDRESS],
      });

      if (erc20Allowance < amountIn) {
        setIsApproving(true);

        const approveTx = await walletClient.writeContract({
          address: CELO_TOKEN,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [PERMIT2_ADDRESS, BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")],
        });

        await publicClient.waitForTransactionReceipt({ hash: approveTx });
      }

      const permit2Allowance = await publicClient.readContract({
        address: PERMIT2_ADDRESS,
        abi: PERMIT2_ABI,
        functionName: "allowance",
        args: [address, CELO_TOKEN, UNIVERSAL_ROUTER],
      });

      const now = Math.floor(Date.now() / 1000);
      const needsPermit2Approval =
        permit2Allowance[0] < amountIn ||
        permit2Allowance[1] < now + 3600;

      if (needsPermit2Approval) {
        const deadline = now + 31536000;
        const maxUint160 = BigInt("0xffffffffffffffffffffffffffffffffffffffff");

        const permit2ApproveTx = await walletClient.writeContract({
          address: PERMIT2_ADDRESS,
          abi: PERMIT2_ABI,
          functionName: "approve",
          args: [CELO_TOKEN, UNIVERSAL_ROUTER, maxUint160, deadline],
        });

        await publicClient.waitForTransactionReceipt({ hash: permit2ApproveTx });
        setIsApproving(false);
      }

      const swapConfig = {
        poolKey,
        zeroForOne,
        amountIn: amountIn.toString(),
        amountOutMinimum: amountOutMinimum.toString(),
        hookData: "0x00",
      };

      const v4Planner = new V4Planner();

      v4Planner.addAction(Actions.SWAP_EXACT_IN_SINGLE, [swapConfig]);
      v4Planner.addAction(Actions.SETTLE_ALL, [poolKey.currency0, amountIn]);
      v4Planner.addAction(Actions.TAKE_ALL, [poolKey.currency1, amountOutMinimum]);

      const encodedActions = v4Planner.finalize();

      const routePlanner = new RoutePlanner();
      routePlanner.addCommand(CommandType.V4_SWAP, [encodedActions]);

      const deadline = Math.floor(Date.now() / 1000) + 3600;

      const hash = await walletClient.writeContract({
        address: UNIVERSAL_ROUTER,
        abi: UNIVERSAL_ROUTER_ABI,
        functionName: "execute",
        args: [routePlanner.commands, [encodedActions], BigInt(deadline)],
      });

      setSwapHash(hash);
    } catch (error: any) {
      console.error("Swap failed:", error);

      let userMessage = "Swap failed: ";

      if (error.message?.includes("user rejected")) {
        userMessage += "Transaction rejected by user";
      } else if (error.message?.includes("insufficient funds")) {
        userMessage += "Insufficient funds for transaction";
      } else {
        userMessage += error.shortMessage || error.message || "Unknown error";
      }

      alert(userMessage);
    } finally {
      setIsSwapping(false);
      setIsApproving(false);
    }
  }

  useEffect(() => {
    if (isConnected && address) {
      fetchBalances();
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (isConfirmed) {
      fetchBalances();
    }
  }, [isConfirmed]);

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-2">💱 Swap Tokens</h2>
        <p className="text-sm opacity-70 mb-6">
          Swap CELO for BuenaToken using Uniswap v4
        </p>

        {!isConnected ? (
          <div className="alert alert-warning">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>Please connect your wallet to swap</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-base-300 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium opacity-70">You pay</span>
                <span className="text-sm opacity-50">
                  Balance: {isLoadingBalances ? "..." : celoBalance} CELO
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="0.0"
                  className="input input-ghost text-3xl font-bold w-full p-0 focus:outline-none bg-transparent"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.01"
                  min="0"
                />
                <div className="flex items-center gap-2 bg-base-100 px-4 py-2 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold">
                    C
                  </div>
                  <span className="font-bold">CELO</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center -my-2 relative z-10">
              <div className="btn btn-circle btn-sm bg-base-300 border-4 border-base-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>

            <div className="bg-base-300 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium opacity-70">You receive (estimated)</span>
                <span className="text-sm opacity-50">
                  Balance: {isLoadingBalances ? "..." : btkBalance} BTK
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="0.0"
                  className="input input-ghost text-3xl font-bold w-full p-0 focus:outline-none bg-transparent"
                  value={quote}
                  disabled
                />
                <div className="flex items-center gap-2 bg-base-100 px-4 py-2 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-xs font-bold">
                    B
                  </div>
                  <span className="font-bold">BTK</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-base-300 rounded-xl p-4">
                <div className="text-xs opacity-60 mb-1">Price</div>
                <div className="font-bold">
                  {quote && amount ? (Number(quote) / Number(amount)).toFixed(2) : "--"} BTK/CELO
                </div>
              </div>
              <div className="bg-base-300 rounded-xl p-4">
                <div className="text-xs opacity-60 mb-1">Minimum Received</div>
                <div className="font-bold">
                  {quote ? (Number(quote) * 0.995).toFixed(2) : "--"} BTK
                </div>
              </div>
            </div>

            <button
              className="btn btn-sm btn-ghost w-full"
              onClick={fetchBalances}
              disabled={isLoadingBalances}
            >
              {isLoadingBalances ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Refreshing...
                </>
              ) : (
                "🔄 Refresh Balances"
              )}
            </button>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                className="btn btn-outline btn-primary btn-lg"
                disabled={!amount || Number(amount) <= 0 || isLoadingQuote}
                onClick={handleGetQuote}
              >
                {isLoadingQuote ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Calculating...
                  </>
                ) : (
                  "📊 Get Quote"
                )}
              </button>
              <button
                className="btn btn-primary btn-lg"
                disabled={!quote || isApproving || isSwapping || isConfirming}
                onClick={handleSwap}
              >
                {isApproving ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Approving...
                  </>
                ) : isSwapping || isConfirming ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Swapping...
                  </>
                ) : (
                  "🔄 Swap"
                )}
              </button>
            </div>

            {(isApproving || isSwapping || isConfirming || isConfirmed) && (
              <div className="mt-4">
                {isApproving && (
                  <div className="alert alert-info">
                    <span className="loading loading-spinner"></span>
                    <span>Setting up approvals (Permit2 + Universal Router)...</span>
                  </div>
                )}
                {isSwapping && (
                  <div className="alert alert-info">
                    <span className="loading loading-spinner"></span>
                    <span>Confirm swap in your wallet...</span>
                  </div>
                )}
                {isConfirming && swapHash && (
                  <div className="alert alert-info">
                    <span className="loading loading-spinner"></span>
                    <div>
                      <p>Transaction submitted!</p>
                      <a
                        href={`https://celoscan.io/tx/${swapHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-primary text-sm"
                      >
                        View on Celoscan
                      </a>
                    </div>
                  </div>
                )}
                {isConfirmed && (
                  <div className="alert alert-success">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="font-bold">Swap successful!</p>
                      <a
                        href={`https://celoscan.io/tx/${swapHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-primary text-sm"
                      >
                        View transaction
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="divider"></div>

        <div className="flex items-start gap-3 p-4 bg-success/10 rounded-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-success shrink-0 w-5 h-5 mt-0.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div className="text-sm">
            <p className="font-bold mb-1">Universal Router SDK Swap</p>
            <p className="opacity-70">
              Using Uniswap v4 SDK with V4Planner + RoutePlanner for proper unlock callback pattern
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}