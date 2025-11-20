# Celo Integration Guide

Complete guide for integrating Celo Mainnet with BuenoToken and implementing Celo's bold brand identity in your dApp.

## 📋 Table of Contents

- [Overview](#overview)
- [Environment Variables Setup](#environment-variables-setup)
- [Frontend Contract Interaction](#frontend-contract-interaction)
- [Celo Branding Implementation](#celo-branding-implementation)
- [Celo Mainnet Details](#celo-network-details)
- [Vibecoding Section](#vibecoding-section)
- [Resources](#resources)

## 📖 Overview

This integration adds:

- BuenoToken contract deployment on Celo Mainnet
- Frontend contract interaction page (`/contract`)
- Token balance display and transfer functionality
- Celo branding with bold color palette (yellow, green, purple, tan)
- Celo Mainnet as the default network




## 🔧 Environment Variables Setup

After deploying your contract, create a `.env.local` file in `packages/nextjs/` directory:

```bash
# BuenoToken Contract Address (from Remix deployment)
NEXT_PUBLIC_BUENO_TOKEN_ADDRESS=0xYourContractAddressHere

# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

### Getting WalletConnect Project ID

1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create an account or sign in
3. Create a new project
4. Copy the Project ID

## 🖥️ Frontend Contract Interaction

The contract interaction page has been created at `/contract` with the following components:

### Component Architecture

```
/contract
├── page.tsx              # Main page with hero section and grid layout
└── components/
    ├── TokenBalance.tsx  # Display wallet balance
    └── TokenTransfer.tsx # Transfer tokens form
```

### Key Features

1. **Token Balance Display**
   - Reads balance from contract for connected wallet
   - Large yellow display with GT Alpina typography
   - Shows token name, symbol, and user address
   - Real-time updates after transactions

2. **Token Transfer**
   - Form to transfer tokens to any address
   - Address validation before submission
   - Transaction state tracking (pending, confirming, success)
   - Auto-reset form after successful transfer
   - Error handling with user-friendly messages

3. **Design System**
   - Bold Celo brand colors (yellow, forest green, purple, tan)
   - Hard-edged components (no rounded corners)
   - GT Alpina headlines with architectural feel
   - Inter font for body text and labels
   - Color inversions on hover states

## 🎨 Celo Branding Implementation

The application uses Celo's bold brand identity with hard-edged design, high-contrast colors, and architectural typography.

### Color Palette

**Primary Colors:**
- Yellow (`#FCFF52`) - Hero sections, CTAs, key buttons
- Forest Green (`#4E632A`) - Alternate backgrounds, dark surfaces

**Base Colors:**
- Lt Tan (`#FBF6F1`) - Main canvas
- Dk Tan (`#E6E3D5`) - Content panels
- Brown (`#635949`) - Text accents
- Purple (`#1A0329`) - High-impact sections

**Functional Colors:**
- Black (`#000000`) - Core text, high contrast
- White (`#FFFFFF`) - Inverse surfaces
- Inactive (`#9B9B9B`) - Disabled elements
- Body Copy (`#666666`) - Paragraph text

**Feedback Colors:**
- Success (`#329F3B`)
- Error (`#E70532`)

**Accent Pops:**
- Lt Blue (`#8AC0F9`) - Highlights
- Orange (`#F29E5F`) - Alerts, callouts
- Pink (`#F2A9E7`) - Emphasis
- Lime Green (`#B2EBA1`) - Fresh highlights

### Typography

- **Headlines**: GT Alpina (thin 250 weight, tight letter-spacing, oversized)
- **Body**: Inter (clean, geometric, 250 weight)
- **Labels**: Inter (heavy 750 weight, uppercase, small)
- **Code**: Monospace for addresses and technical data

### Design Principles

- **Hard edges**: No rounded corners on any components
- **Bold color blocks**: Large fields of pure color
- **High contrast**: Sharp color inversions (e.g., black/yellow flip on hover)
- **Visible structure**: Borders and outlines on all components
- **Asymmetric layouts**: Breaking grid norms with unexpected spacing
- **Architectural typography**: Headlines as visual architecture

### Component Styling

All components follow these rules:
- **Buttons**: Thick rectangular, 2px borders, color inversion on hover
- **Inputs**: Stark outlined boxes with 2px borders, focus states with black outline
- **Cards**: Hard-edged with visible 2px outlines, no shadows
- **Alerts**: Stark blocks with 2px borders and bold colors


## 🎵 Vibecoding Section

Use these prompts with AI coding assistants to rebuild or customize the components:

### Prompt 1: Contract Page (`packages/nextjs/app/contract/page.tsx`)

```
Create a ContractPage component for a Next.js application that serves as the main interface for interacting with a BuenoToken smart contract on the Celo blockchain. This should be a server component that imports and displays TokenBalance and TokenTransfer child components.

Start by getting the contract address from the environment variable NEXT_PUBLIC_BUENO_TOKEN_ADDRESS at the top of the component. This will be used to conditionally display information and provide links to the blockchain explorer.

The page should have two main sections. First, create a hero section with a yellow background (bg-celo-yellow) and a 4px black bottom border. The hero should be full-width with a max-width container of 7xl and padding. Center the hero content and include a large bold heading that says "BuenoToken Contract" using GT Alpina font at text-h2 on mobile and text-h1 on desktop. Add the word "Contract" in italics. Below that, add a subtitle with 80% opacity that reads "Interact with your BuenoToken contract on Celo Mainnet" using Inter font at text-body-l.

In the hero section, add conditional rendering based on whether the contract address exists. If the CONTRACT_ADDRESS is configured, display a forest green card (bg-celo-forest-green) with a 2px black border and full width. Inside, show a label "CONTRACT ADDRESS" in uppercase using Inter font at text-label weight 750, then display the address in monospace font that breaks on all characters to prevent overflow, and finally add a link that opens Blockscout in a new tab using the pattern https://celo.blockscout.com/address/ followed by the contract address. Style this link as a yellow button with black text, Inter font, bold weight, with a 2px black border that inverts colors on hover (black background, yellow text).

If the CONTRACT_ADDRESS is not configured, show an orange warning card (bg-celo-orange) with a 2px black border instead. Display bold text saying "Contract not configured" and smaller text below instructing the user to set NEXT_PUBLIC_BUENO_TOKEN_ADDRESS in their .env.local file.

After the hero section, create a content section with vertical padding of 16 on mobile and 24 on desktop. Use a container with auto margins and max-width of 7xl. Inside this section, create a responsive grid that shows one column on mobile and two columns on large screens with a gap of 12 between items and items-stretch to ensure equal heights. In the left column rendered using flex flex-col wrapper, render the TokenBalance component. In the right column also with flex flex-col wrapper, render the TokenTransfer component.

Style everything using Celo brand colors from Tailwind config. Use bg-celo-lt-tan for the main page background. All text should use either font-alpina for headlines or font-inter for body text. Buttons and interactive elements should have the hard color inversion hover effect. Make sure all components use hard edges with no rounded corners and visible 2px borders.

Build this as a clean, production-ready page component that provides a professional interface for users to interact with their token contract, with clear visual feedback about configuration status and easy access to blockchain explorer information. Use the Celo brand guidelines with bold color blocks, high contrast, and architectural typography.
```

### Prompt 2: Token Balance Component (`packages/nextjs/app/contract/components/TokenBalance.tsx`)

```
Create a TokenBalance client component in TypeScript for a Next.js application that displays the connected wallet's ERC20 token balance with Celo brand styling. This component should use wagmi hooks for blockchain interactions and viem utilities for data formatting.

Import the necessary dependencies: formatEther from viem, useAccount and useReadContract from wagmi, and the BuenoToken ABI from the artifacts folder at ../../../../../artifacts/BuenoToken.json. Get the contract address from the environment variable NEXT_PUBLIC_BUENO_TOKEN_ADDRESS and cast it as a hex string type.

Use the useAccount hook to get the connected wallet address and connection status. Set up three useReadContract hooks to fetch data from the contract. The first should read the balanceOf function with the connected address as an argument, enabled only when the wallet is connected. The second should read the token name from the name function. The third should read the token symbol from the symbol function.

If the wallet is not connected, return a card with Celo brand styling. Use flex flex-col h-full as the wrapper, then a card with bg-celo-dk-tan, 2px border with border-celo-outline, and flex-1 flex flex-col classes. Inside the card body with p-8 padding, display a title "TOKEN BALANCE" in uppercase using font-inter text-2xl font-bold with tracking-tight and mb-6. Below that, show an info alert with p-6 padding containing the message "Please connect your wallet to view your token balance" in font-inter text-body-m.

If the wallet is connected, return a similar card structure. In the card body, show the same "TOKEN BALANCE" title. If the balance is loading, display a centered loading spinner with py-16 padding using text-celo-purple color. Otherwise, create a flex flex-col wrapper with space-y-8 between elements.

Inside this wrapper, create two sections. First, a large balance display block with bg-celo-yellow background, 2px black border, and p-8 padding. Inside a flex flex-col layout, display the token name in uppercase using font-inter text-label with mb-2 margin. Then show the actual balance in a huge font-alpina text-6xl with text-celo-black color and leading-tight. Format the balance using formatEther to convert from wei, then use toLocaleString with 2 minimum and 4 maximum fraction digits. Display a default of "0.00" if no balance. Below the balance, show the token symbol in font-inter text-body-m with mt-2 margin.

Second, create an address display block with bg-celo-lt-tan background, 2px border with border-celo-outline, and p-6 padding. Show a label "YOUR ADDRESS" in uppercase using font-inter text-label with mb-2 margin. Below that, display the connected wallet address in font-mono text-body-s with text-celo-body-copy color and break-all to prevent overflow.

Use all Celo brand colors from the Tailwind config. Ensure all cards have hard edges with no rounded corners. Use 2px borders throughout for visible structure. The component should have flex flex-col h-full on the outer wrapper to ensure it stretches to fill available space and matches the height of sibling components.

Build this as a production-ready component with proper TypeScript types, clear visual hierarchy using Celo's bold brand colors, and responsive layout that works on all screen sizes. The design should feel architectural with GT Alpina for the large balance number and Inter for labels and body text.
```

### Prompt 3: Token Transfer Component (`packages/nextjs/app/contract/components/TokenTransfer.tsx`)

```
Create a TokenTransfer client component in TypeScript for a Next.js application that allows users to transfer ERC20 tokens with Celo brand styling. This component should use React state management and wagmi hooks for blockchain interactions.

Import the necessary dependencies from React, viem, and wagmi. You'll need useState from React, isAddress and parseEther from viem, and useAccount, useReadContract, useWriteContract, and useWaitForTransactionReceipt from wagmi. Import the BuenoToken ABI from ../../../../../artifacts/BuenoToken.json and get the contract address from the environment variable NEXT_PUBLIC_BUENO_TOKEN_ADDRESS cast as a hex string type.

Set up state management for form inputs. Create state variables for recipient address and amount. Use the useAccount hook to get the connected wallet address and connection status. Set up a useWriteContract hook for the transfer function, destructuring it to get a transfer function, transferHash data, isTransferPending flag, and transferError. Set up a useWaitForTransactionReceipt hook to monitor the transfer transaction, getting isTransferConfirming and isTransferSuccess flags.

Create a handleTransfer async function that first validates the recipient address using isAddress. If invalid, show an alert with "Please enter a valid address" and return. Then validate that amount exists and is greater than zero. If invalid, show an alert with "Please enter a valid amount" and return. If validation passes, wrap in a try-catch block and call the transfer function with the contract address, ABI, function name as "transfer", and arguments array containing the recipient address cast as hex string and the amount converted using parseEther. Log any errors to the console.

Create a resetForm function that clears both state variables. Add an effect that checks if isTransferSuccess is true, and if so, uses setTimeout to call resetForm after 3000 milliseconds to auto-clear the form after successful transactions.

If the wallet is not connected, return early with a card that has flex flex-col h-full wrapper and contains a card with bg-celo-dk-tan, 2px border with border-celo-outline, and flex-1 flex flex-col classes. Inside the card body with p-8 padding, display a title "TRANSFER TOKENS" in uppercase using font-inter text-2xl font-bold with tracking-tight and mb-6. Show an info alert with p-6 padding containing the message "Please connect your wallet to transfer tokens" in font-inter text-body-m.

If the wallet is connected, return a wrapper div with flex flex-col h-full and space-y-8. Create a card for the transfer form with bg-celo-dk-tan, 2px border with border-celo-outline, and flex-1 class. In the card body with p-8 padding, show the title "TRANSFER TOKENS" in uppercase using font-inter text-2xl font-bold with mb-8. Create a flex flex-col wrapper with space-y-6 for the form elements.

Add two form controls. First, a recipient address input with a label "Recipient Address" in uppercase using font-inter text-label. The input should be type text with placeholder "0x...", using input class with border-2 border-celo-outline, bg-celo-lt-tan, w-full, font-mono, text-body-m, and p-4. Bind the value to recipient state and update on change. Disable when transactions are pending or confirming.

Second, an amount input with label "Amount" in uppercase using font-inter text-label. The input should be type number with step 0.0001 and placeholder "0.0", using similar styling but without font-mono. Bind to amount state and disable during transactions.

Add conditional rendering for transaction states. When isTransferPending or isTransferConfirming is true, show an info alert with p-6 padding containing a loading spinner and text that says either "Waiting for confirmation..." or "Transaction submitted..." depending on the state. When isTransferSuccess is true, show a success alert with p-6 padding and bold text "Transfer successful!". If transferError exists, show an error alert with the error message in text-body-s.

Add a primary button with w-full py-4 mt-4 classes that says "SEND TOKENS" in uppercase. Call handleTransfer on click. Disable the button when transactions are pending, confirming, or when recipient or amount fields are empty.

Style everything with Celo brand colors. Use btn btn-primary class which should have yellow background with black text and 2px black border, inverting to black background with yellow text on hover. All inputs should have 2px borders and hard edges with no rounded corners. The component should use flex flex-col h-full on the outer wrapper to stretch and match sibling component heights.

Build this as a production-ready component with comprehensive error handling, proper TypeScript types throughout, and a clean user interface that provides clear feedback at every step of the transaction process using Celo's bold brand styling.
```

### Prompt 4: Global CSS (`packages/nextjs/app/globals.css`)

```
Create a global CSS file for a Next.js application that implements Celo's bold brand identity with hard-edged design, high-contrast colors, and architectural typography.

Start with Tailwind directives. First import the Inter font from Google Fonts with weights 250, 400, and 750. Then add the three Tailwind directives for base, components, and utilities.

Set up global resets. Use universal selector to set box-sizing to border-box and reset padding and margin to zero. Set html to have smooth scroll behavior and 100% height. Set both html and body to have 100% width and overflow-x hidden, with Inter as the font family. Set body to 100% height with background color FBF6F1 (light tan) and black text color.

Define typography rules. For all heading tags (h1 through h6), set font-family to GT Alpina serif with font-weight 250 and letter-spacing -0.01em. Define specific sizes: h1 at 72px with 84px line-height, h2 at 54px with 72px line-height, h3 at 48px with 48px line-height, and h4 at 40px with 40px line-height.

Create CSS custom properties in the root selector for all Celo brand colors. Define primary colors: celo-yellow as FCFF52 and celo-forest-green as 4E632A. Define base colors: celo-lt-tan as FBF6F1, celo-dk-tan as E6E3D5, celo-brown as 635949, and celo-purple as 1A0329. Define functional colors: celo-black as 000000, celo-white as FFFFFF, celo-inactive as 9B9B9B, and celo-body-copy as 666666. Define feedback colors: celo-success as 329F3B and celo-error as E70532. Define accent colors: celo-lt-blue as 8AC0F9, celo-orange as F29E5F, celo-pink as F2A9E7, and celo-lime as B2EBA1. Define outline colors: celo-outline as CCCCCC and celo-outline-alt as 483554.

Override DaisyUI theme variables. For the celo theme selector, set primary to 252 255 82 (yellow), secondary to 78 99 42 (forest green), accent to 242 169 231 (pink), neutral to 26 3 41 (purple), base-100 to 251 246 241 (light tan), base-200 to 230 227 213 (dark tan), base-300 to 99 89 73 (brown), base content to 0 0 0 (black text), primary content to 0 0 0 (black on yellow), and secondary content to 255 255 255 (white on green). For celo-dark theme, use similar values but with purple (26 3 41) as base-100, forest green as base-200, white as base content.

Create hard-edged component overrides. Select card, btn, input, alert, and badge classes and set border-radius to 0 with important flag. Set font-family to Inter.

Style buttons for hard inversion on hover. Set btn class to have font-weight 750, letter-spacing 0em, 2px solid border, and 0.15s ease transition. For btn-primary, set background to yellow, color to black, and border-color to black. On hover, invert to black background, yellow color, and yellow border. For btn-secondary, set background to purple, color to white, and border-color to purple. On hover, invert to white background, purple color, and purple border.

Style inputs with stark outlines. Set input class to have 2px solid outline border and font-weight 250. On focus, add 2px solid black outline and black border-color.

Style cards with hard edges. Set card class to have 2px solid outline border and no box-shadow using important flag.

Style alerts as stark blocks. Set alert class to have 2px solid border. For alert-info, use light blue background with black text and black border. For alert-success, use success green background with white text and black border. For alert-error, use error red background with white text and black border. For alert-warning, use orange background with black text and black border.

This CSS should create a bold, unpolished, striking interface that feels engineered and intentional rather than decorative. Use hard contrasts, big fields of pure color, no soft blending or subtle shadows. The UI should feel poster-like where color, typography, and negative space are the interface itself.
```

### Prompt 5: Tailwind Config (`packages/nextjs/tailwind.config.ts`)

```
Create a Tailwind configuration file in TypeScript for a Next.js application that implements Celo's bold brand identity with custom colors, typography, and DaisyUI theme integration.

Import the Config type from tailwindcss. Set darkMode to "class" for class-based dark mode toggling. Define content paths to include all pages, components, and app directory files with js, ts, jsx, tsx, and mdx extensions.

In the theme extend section, add a custom colors object for Celo brand colors. Define celo as an object with these properties: yellow as FCFF52, forest-green as 4E632A, lt-tan as FBF6F1, dk-tan as E6E3D5, brown as 635949, purple as 1A0329, black as 000000, white as FFFFFF, inactive as 9B9B9B, body-copy as 666666, success as 329F3B, error as E70532, lt-blue as 8AC0F9, orange as F29E5F, pink as F2A9E7, lime as B2EBA1, outline as CCCCCC, and outline-alt as 483554.

Add custom font families. Define alpina as an array with "GT Alpina" in quotes followed by serif. Define inter as an array with Inter followed by sans-serif.

Add custom font sizes with line heights, letter spacing, and font weights. Define h1 as 72px with 84px line-height, -0.01em letter-spacing, and 250 font-weight. Define h2 as 54px with 72px line-height, -0.01em letter-spacing, and 250 weight. Define h3 as 48px with 48px line-height, -0.01em letter-spacing, and 250 weight. Define h4 as 40px with 40px line-height, -0.01em letter-spacing, and 250 weight. Define body-l as 20px with 26px line-height, -0.01em letter-spacing, and 250 weight. Define body-m as 16px with 26px line-height, -0.01em letter-spacing, and 250 weight. Define body-s as 14px with 18px line-height, -0.01em letter-spacing, and 250 weight. Define label as 12px with 16px line-height, 0em letter-spacing, and 750 weight.

Add DaisyUI as a plugin by requiring it. In the daisyui configuration object, define a themes array containing a custom theme object. The first theme should be named "celo" with these properties: primary as FCFF52 (yellow), secondary as 4E632A (forest green), accent as F2A9E7 (pink), neutral as 1A0329 (purple), base-100 as FBF6F1 (light tan), base-200 as E6E3D5 (dark tan), base-300 as 635949 (brown), info as 8AC0F9 (light blue), success as 329F3B (success green), warning as F29E5F (orange), and error as E70532 (error red).

The second theme should be named "celo-dark" with the same color values except: neutral as 1A0329, base-100 as 1A0329 (purple for dark mode), base-200 as 4E632A (forest green), and base-300 as 635949 (brown).

Set darkTheme to "celo-dark" to specify which theme to use for dark mode. Set base to true to include DaisyUI base styles, styled to true to include component styles, utils to true to include utility classes, and logs to false to disable console logs.

Export this config as the default export. This configuration creates a bold, high-contrast design system that emphasizes architectural typography with GT Alpina headlines and Inter body text, uses Celo's brand colors throughout, and provides both light and dark themes following Celo's brand guidelines. All components will have hard edges (no rounded corners), visible structure through borders, and stark color blocks. The design feels engineered and intentional with poster-like screens where color, type, and negative space are the primary interface elements.
```

## 💻 Code Integration Guide

Complete code examples for the contract interaction pages in the `/contract` folder:

### 1. Contract Page (`packages/nextjs/app/contract/page.tsx`)

Main page that displays the contract address and renders the balance and transfer components:

```typescript
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
```

**Key Features:**
- Yellow hero section with GT Alpina typography
- Forest green contract address card with Blockscout link
- Two-column grid layout for balance and transfer components
- Hard-edged design with Celo brand colors

### 2. Token Balance Component (`packages/nextjs/app/contract/components/TokenBalance.tsx`)

Displays the connected wallet's token balance with Celo brand styling:

```typescript
"use client";

import { formatUnits } from "viem";
import { useAccount, useReadContract } from "wagmi";
import buenoTokenAbi from "../../../subgraph/abis/BuenoToken.json";
import { useEffect } from "react";

const CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_BUENO_TOKEN_ADDRESS as `0x${string}`;

export function TokenBalance() {
  const { address, isConnected } = useAccount();

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
              <div className="bg-celo-lt-tan border-2 border-celo-outline p-6">
                <p className="font-inter text-label uppercase mb-2">YOUR ADDRESS</p>
                <p className="font-mono text-body-s text-celo-body-copy break-all">
                  {address}
                </p>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
```

**Key Features:**
- Reads token balance, name, and symbol from contract using wagmi hooks
- Large yellow balance display with GT Alpina typography
- Address display with monospace font
- Loading spinner with Celo purple color
- Hard-edged cards with 2px borders

### 3. Token Transfer Component (`packages/nextjs/app/contract/components/TokenTransfer.tsx`)

Allows users to transfer tokens (includes owner-only mint functionality):

```typescript
"use client";

import { useState } from "react";
import { isAddress, parseUnits } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import buenoTokenAbi from "../../../subgraph/abis/BuenoToken.json";

const CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_BUENO_TOKEN_ADDRESS as `0x${string}`;

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
    abi: buenoTokenAbi as any,
    functionName: "owner",
  });

  const isOwner =
    owner && address
      ? (owner as string).toLowerCase() === address.toLowerCase()
      : false;

  const handleTransfer = async () => {
    if (!isAddress(recipient)) {
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
        abi: buenoTokenAbi as any,
        functionName: "transfer",
        args: [recipient as `0x${string}`, parseUnits(amount, 2)],
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
        abi: buenoTokenAbi as any,
        functionName: "mint",
        args: [mintRecipient as `0x${string}`, parseUnits(mintAmount, 2)],
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
            <h3 className="font-inter text-2xl font-bold tracking-tight mb-6">
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
          <h3 className="font-inter text-2xl font-bold tracking-tight mb-8">
            TRANSFER TOKENS
          </h3>
          <div className="flex flex-col space-y-6">
            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text font-inter text-label uppercase">
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
                <span className="label-text font-inter text-label uppercase">
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
                <span className="font-inter text-body-m">
                  {isTransferConfirming
                    ? "Waiting for confirmation..."
                    : "Transaction submitted..."}
                </span>
              </div>
            )}
            {isTransferSuccess && (
              <div className="alert alert-success p-6">
                <span className="font-inter text-body-m font-bold">
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
              className="btn btn-primary w-full py-4 mt-4"
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
```

**Key Features:**
- Transfer form with address and amount validation
- Transaction state tracking (pending, confirming, success, error)
- Auto-reset form after 3 seconds on success
- Owner-only mint section with purple background
- Hard-edged inputs and buttons with Celo brand colors
- Color inversion on button hover (yellow ↔ black)

## 📚 Resources

- [Celo Documentation](https://docs.celo.org/)
- [Celo Mainnet Network Info](https://docs.celo.org/network)
- [Celo Block Explorer](https://celo.blockscout.com/)
- [Remix IDE](https://remix.ethereum.org/)
- [MetaMask Documentation](https://docs.metamask.io/)
- [Wagmi Documentation](https://wagmi.sh/)
- [RainbowKit Documentation](https://www.rainbowkit.com/docs/introduction)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [DaisyUI Documentation](https://daisyui.com/)

