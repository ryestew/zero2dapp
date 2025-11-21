export default function Page() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero min-h-[600px] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-4xl space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold">
              Web3 dApp Starter
            </h1>
            <p className="text-xl md:text-2xl opacity-80 max-w-3xl">
              A monorepo template with Next.js, The Graph, and smart contracts.
              Everything you need to build a production-ready decentralized
              application.
            </p>
            <div className="flex flex-wrap gap-3 justify-center pt-4">
              <div className="badge badge-primary badge-lg px-6 py-4 gap-2">
                <span className="text-base font-semibold">Next.js 15</span>
              </div>
              <div className="badge badge-secondary badge-lg px-6 py-4 gap-2">
                <span className="text-base font-semibold">The Graph</span>
              </div>
              <div className="badge badge-accent badge-lg px-6 py-4 gap-2">
                <span className="text-base font-semibold">
                  RainbowKit + Wagmi
                </span>
              </div>
              <div className="badge badge-info badge-lg px-6 py-4 gap-2">
                <span className="text-base font-semibold">TypeScript</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 bg-base-100">
        <div className="container mx-auto px-8 md:px-12 max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            What&apos;s Included
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1 */}
            <div className="card bg-base-200 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300">
              <div className="card-body p-10">
                <div className="text-5xl mb-4">🔗</div>
                <h3 className="card-title text-2xl mb-3">Wallet Integration</h3>
                <p className="text-base opacity-70 leading-relaxed">
                  RainbowKit for easy wallet connections. Supports MetaMask,
                  WalletConnect, Coinbase Wallet, and more.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="card bg-base-200 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300">
              <div className="card-body p-10">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="card-title text-2xl mb-3">Subgraph Ready</h3>
                <p className="text-base opacity-70 leading-relaxed">
                  Pre-configured subgraph package for indexing blockchain data
                  with The Graph protocol.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="card bg-base-200 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300">
              <div className="card-body p-10">
                <div className="text-5xl mb-4">⛓️</div>
                <h3 className="card-title text-2xl mb-3">Multi-Chain</h3>
                <p className="text-base opacity-70 leading-relaxed">
                  Supports Celo, and Celo Sepolia.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="card bg-base-200 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300">
              <div className="card-body p-10">
                <div className="text-5xl mb-4">📦</div>
                <h3 className="card-title text-2xl mb-3">Monorepo Structure</h3>
                <p className="text-base opacity-70 leading-relaxed">
                  Organized workspace with separate packages for frontend,
                  subgraph, and shared contracts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
