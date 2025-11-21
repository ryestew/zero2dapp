# WalletConnect Setup

This app uses RainbowKit with WalletConnect to enable wallet connections. Follow these steps to set up your WalletConnect Project ID:

## Steps

1. **Visit WalletConnect Cloud**  
   Go to: [https://cloud.walletconnect.com](https://cloud.walletconnect.com)

2. **Create an Account / Sign In**  
   Sign up or log in to your account.

3. **Create a New Project**
   - Click "Create New Project"
   - Name it "ZeroToDapp" (or whatever you prefer)
   - Select "App" as the project type

4. **Copy Your Project ID**  
   Once created, you'll see your Project ID on the project dashboard.

5. **Add to Your Environment**  
   Create a `.env.local` file in the `packages/nextjs` directory:

   ```bash
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```

6. **Restart Your Dev Server**
   ```bash
   npm run dev
   ```

## Without a Project ID

The app will still work with a default placeholder ID, but you may see warnings in the console. For production use, always use your own Project ID.

## Supported Chains

By default, the app supports:

- Ethereum Mainnet
- Polygon
- Optimism
- Arbitrum
- Base
- Sepolia (testnet)
- Celo

You can modify the supported chains in `app/providers.tsx`.
