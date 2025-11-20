"use client";

import { TokenBalance } from "../components/TokenBalance";
import { TokenTransfer } from "../components/TokenTransfer";

export default function ContractPage() {
  return (
    <div className="min-h-screen bg-celo-lt-tan">
      {/* Hero Section - Bold Yellow Block */}
      <section className="bg-celo-yellow py-20 md:py-32 border-b-4 border-celo-black">
        <div className="container mx-auto px-8 md:px-16 max-w-7xl">
          <div className="max-w-5xl">
            <h1 className="font-alpina font-thin text-6xl md:text-h1 text-celo-black tracking-tight leading-none mb-6">
              BuenoToken <span className="italic">Contract</span>
            </h1>
            <p className="font-inter text-body-l font-thin text-celo-black max-w-2xl">
              Interact with your BuenoToken contract on Celo Mainnet
            </p>
          </div>
        </div>
      </section>

      {/* Contract Address Section - Purple Block */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-8 md:px-16 max-w-7xl">
          {/* Asymmetric Layout */}
          <div className="grid md:grid-cols-12 gap-0">
            {/* Left Side - Label Block */}
            <div className="md:col-span-4 bg-celo-green p-8 md:p-12 border-4 border-celo-black">
              <h2 className="font-alpina font-thin text-4xl md:text-h3 text-celo-white tracking-tight leading-tight">
                Contract <span className="italic">Address</span>
              </h2>
              <p className="font-inter text-label uppercase text-celo-yellow mt-6 tracking-wide">
                DEPLOYED ON CELO
              </p>
            </div>
            
            {/* Right Side - Content Block */}
            <div className="md:col-span-8 bg-celo-purple p-8 md:p-12 border-4 border-celo-black border-l-0">
              <div className="mb-8">
                <p className="font-inter text-label uppercase text-celo-yellow mb-4 tracking-wide">
                  CONTRACT ADDRESS
                </p>
                <div className="bg-celo-black p-6 border-2 border-celo-yellow font-mono text-body-s text-celo-yellow break-all">
                  {process.env.NEXT_PUBLIC_BUENO_TOKEN_ADDRESS || "Not configured"}
                </div>
              </div>
              
              {process.env.NEXT_PUBLIC_BUENO_TOKEN_ADDRESS && (
                <a
                  href={`https://celoscan.io/address/${process.env.NEXT_PUBLIC_BUENO_TOKEN_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-celo-yellow text-celo-black font-inter font-heavy text-label uppercase px-8 py-4 border-4 border-celo-black hover:bg-celo-black hover:text-celo-yellow transition-colors duration-200 tracking-wide"
                >
                  View on Celoscan →
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Token Interaction Section - Two Equal Cards */}
      <section className="py-16 md:py-24 bg-celo-lt-tan border-t-4 border-celo-brown">
        <div className="container mx-auto px-8 md:px-16 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Token Balance Card */}
            <TokenBalance />
            
            {/* Token Transfer Card */}
            <TokenTransfer />
          </div>
        </div>
      </section>
    </div>
  );
}

