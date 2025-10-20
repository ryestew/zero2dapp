# Next.js Application

This is a [Next.js](https://nextjs.org) project bootstrapped as part of the ZeroToDapp monorepo. It includes:

- ⚡ **Next.js 15** with App Router
- 🎨 **Tailwind CSS** for styling
- 🔗 **RainbowKit** for wallet connections
- 🔄 **Wagmi** & **Viem** for Web3 interactions

## Getting Started

### 1. Install Dependencies

From the root of the monorepo:

```bash
npm install
```

### 2. Set Up WalletConnect (Recommended)

Create a `.env.local` file with your WalletConnect Project ID:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

Get your Project ID from [https://cloud.walletconnect.com](https://cloud.walletconnect.com)

See [WALLETCONNECT_SETUP.md](./WALLETCONNECT_SETUP.md) for detailed instructions.

### 3. Run the Development Server

From the root:

```bash
npm run dev:nextjs
```

Or from this directory:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **Header with Connect Button**: Click "Connect Wallet" to connect your Web3 wallet
- **Multi-chain Support**: Ethereum, Polygon, Optimism, Arbitrum, Base, and Sepolia
- **Responsive Design**: Mobile-friendly layout with Tailwind CSS
- **Footer**: Links to resources and documentation

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
