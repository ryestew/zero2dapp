import { TokenBalance } from "./components/TokenBalance";
import { TokenTransfer } from "./components/TokenTransfer";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_BUENO_TOKEN_ADDRESS;

export default function ContractPage() {
  return (
    <div className="min-h-screen bg-celo-lt-tan">
      {/* Hero Section - Big Color Block */}
      <section className="bg-celo-yellow border-b-4 border-celo-black">
        <div className="container mx-auto px-8 py-24 max-w-7xl">
          <div className="flex flex-col items-start max-w-4xl">
            <h1 className="font-alpina text-h2 md:text-h1 text-celo-black mb-6">
              BuenoToken <span className="italic">Contract</span>
            </h1>
            <p className="font-inter text-body-l text-celo-black mb-12 max-w-2xl">
              Interact with your BuenoToken contract on Celo Mainnet
            </p>
            {CONTRACT_ADDRESS && (
              <div className="bg-celo-forest-green border-2 border-celo-black p-8 w-full">
                <p className="font-inter text-label uppercase text-celo-white mb-4">
                  CONTRACT ADDRESS
                </p>
                <p className="font-mono text-body-m text-celo-white break-all mb-4">
                    {CONTRACT_ADDRESS}
                </p>
                  <a
                    href={`https://celo.blockscout.com/address/${CONTRACT_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  className="inline-block bg-celo-yellow text-celo-black font-inter font-bold text-body-m px-6 py-3 border-2 border-celo-black hover:bg-celo-black hover:text-celo-yellow transition-all"
                  >
                  VIEW ON BLOCKSCOUT →
                  </a>
              </div>
            )}
            {!CONTRACT_ADDRESS && (
              <div className="bg-celo-orange border-2 border-celo-black p-8 w-full">
                <p className="font-inter font-bold text-body-m text-celo-black mb-2">
                  Contract not configured
                </p>
                <p className="font-inter text-body-s text-celo-black">
                  Please set NEXT_PUBLIC_BUENO_TOKEN_ADDRESS in your .env.local file
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Section - Asymmetric Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            {/* Token Balance */}
            <div className="flex flex-col">
              <TokenBalance />
            </div>

            {/* Token Transfer */}
            <div className="flex flex-col">
              <TokenTransfer />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}