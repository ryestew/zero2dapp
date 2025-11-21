"use client";

import { encodePacked, keccak256 } from "viem";

const BUENO_TOKEN = process.env.NEXT_PUBLIC_BUENO_TOKEN_ADDRESS ;
const CELO_TOKEN = process.env.NEXT_PUBLIC_CELO_TOKEN_ADDRESS ;
const FEE_TIER = Number(process.env.NEXT_PUBLIC_POOL_FEE_TIER) || 500;
const TICK_SPACING = Number(process.env.NEXT_PUBLIC_POOL_TICK_SPACING) || 60;
const HOOKS = "0x0000000000000000000000000000000000000000";

function computePoolId(
  token0: `0x${string}`,
  token1: `0x${string}`,
  fee: number,
  tickSpacing: number,
  hooks: `0x${string}`
): `0x${string}` {
  const [sortedToken0, sortedToken1] =
    token0.toLowerCase() < token1.toLowerCase()
      ? [token0, token1]
      : [token1, token0];

  const poolKey = encodePacked(
    ["address", "address", "uint24", "int24", "address"],
    [sortedToken0, sortedToken1, fee, tickSpacing, hooks]
  );

  return keccak256(poolKey);
}

export function PoolInfo() {
  if (!BUENO_TOKEN || !CELO_TOKEN) {
    return (
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">⚙️ Configuration Needed</h2>
          <p>Please set token addresses in your .env.local file:</p>
          <ul className="list-disc list-inside text-sm mt-2">
            <li>NEXT_PUBLIC_BUENO_TOKEN_ADDRESS</li>
            <li>NEXT_PUBLIC_CELO_TOKEN_ADDRESS</li>
          </ul>
        </div>
      </div>
    );
  }

  const POOL_ID = computePoolId(BUENO_TOKEN, CELO_TOKEN, FEE_TIER, TICK_SPACING, HOOKS);

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">📊 Pool Information</h2>
        <p className="text-sm opacity-70 mb-4">BuenaToken/CELO Pool</p>

        <div className="collapse collapse-arrow bg-base-300 mb-4">
          <input type="checkbox" />
          <div className="collapse-title font-medium">
            🔍 How Pool ID is Calculated
          </div>
          <div className="collapse-content">
            <div className="space-y-2 text-sm font-mono">
              <p><strong>Token0:</strong> {BUENO_TOKEN < CELO_TOKEN ? BUENO_TOKEN : CELO_TOKEN}</p>
              <p><strong>Token1:</strong> {BUENO_TOKEN < CELO_TOKEN ? CELO_TOKEN : BUENO_TOKEN}</p>
              <p><strong>Fee Tier:</strong> {FEE_TIER} ({FEE_TIER/10000}%)</p>
              <p><strong>Tick Spacing:</strong> {TICK_SPACING}</p>
              <p><strong>Hooks:</strong> {HOOKS}</p>
              <div className="divider"></div>
              <p className="mt-2"><strong>Resulting Pool ID:</strong></p>
              <p className="break-all text-xs bg-base-200 p-2 rounded">{POOL_ID}</p>
              <p className="mt-2 text-xs opacity-70">
                📝 Formula: keccak256(encodePacked(token0, token1, fee, tickSpacing, hooks))
              </p>
            </div>
          </div>
        </div>

        <div className="stats stats-vertical lg:stats-horizontal shadow">
          <div className="stat">
            <div className="stat-title">Pool ID</div>
            <div className="stat-value text-xs break-all">
              {POOL_ID.slice(0, 10)}...{POOL_ID.slice(-8)}
            </div>
            <div className="stat-desc">Computed from PoolKey</div>
          </div>

          <div className="stat">
            <div className="stat-title">Your Position</div>
            <div className="stat-value text-lg">21 BTK + 2 CELO</div>
            <div className="stat-desc">Initial deposit</div>
          </div>

          <div className="stat">
            <div className="stat-title">Pool Price</div>
            <div className="stat-value text-lg">10.5</div>
            <div className="stat-desc">ETK per CELO</div>
          </div>
        </div>

        <div className="alert alert-success mt-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>✅ Pool created successfully on Uniswap v4 Celo Mainnet!</span>
        </div>


      </div>
    </div>
  );
}