import { PoolInfo } from "./components/PoolInfo";
import { SwapInterface } from "./components/SwapInterface";

export default function UniswapPage() {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="hero bg-primary text-primary-content py-20">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Uniswap v4 Integration
            </h1>
            <p className="text-xl opacity-80">
              Trade EstebanToken on Uniswap v4
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <PoolInfo />
          <SwapInterface />
        </div>
      </div>
    </div>
  );
}