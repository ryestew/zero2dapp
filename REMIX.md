# Remix Contract Deployment Guide

Complete guide for deploying BuenoToken smart contract using Remix IDE on Celo Mainnet.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Getting CELO Tokens](#getting-celo-tokens)
- [Deployment Steps](#deployment-steps)
- [Verification](#verification)
- [Next Steps](#next-steps)

## ✅ Prerequisites

Before deploying your contract, ensure you have:

- MetaMask wallet installed
- Celo Mainnet added to MetaMask
- CELO tokens for gas fees (at least 0.01 CELO)
- Remix IDE account (optional, works in browser)

## 🚰 Getting CELO Tokens

You'll need CELO tokens on Celo Mainnet to pay for gas fees.

### Faucet Drops

Get your CELO tokens at [FaucetDrops](https://faucetdrops.io/faucet/0xb34D25c41df27D62e49f975b0E854d642c5F246E?networkId=42220). Get the code during the workshop!

### Adding Celo to MetaMask

If you haven't added Celo Mainnet to MetaMask yet:

**Option 1: Use Chainlist (Recommended)**

Add Celo to your MetaMask on [Chainlist](https://chainlist.org/)

**Option 2: Add Manually**

1. Open MetaMask
2. Click the network dropdown
3. Select "Add Network" or "Add a network manually"
4. Enter the following details:

```
Network Name: Celo Mainnet
RPC URL: https://forno.celo.org
Chain ID: 42220
Currency Symbol: CELO
Block Explorer: https://celo.blockscout.com
```

5. Click "Save"
6. Switch to Celo Mainnet network

## 🚀 Deployment Steps

### Step 1: Open Remix IDE

Visit [remix.ethereum.org](https://remix.ethereum.org/) in your browser.

### Step 2: Create Contract File

1. In the File Explorer (left sidebar), click the "+" icon to create a new file
2. Name it `BuenoToken.sol`
3. Copy the contract code from `contracts/BuenoToken.sol` in your project
4. Paste it into the Remix editor

### Step 3: Compile Contract

1. Click on the "Solidity Compiler" tab (left sidebar, second icon)
2. Select compiler version `0.8.27` or higher
3. Click "Compile BuenoToken.sol" button
4. Wait for compilation to complete
5. Ensure there are no errors (warnings are okay)
6. You should see a green checkmark when compilation succeeds

### Step 4: Connect MetaMask

1. In MetaMask, ensure you're on **Celo Mainnet** network
2. Verify you have CELO tokens for gas fees
3. Unlock your MetaMask wallet if locked

### Step 5: Configure Deployment

1. Click on the "Deploy & Run Transactions" tab (left sidebar, third icon)
2. In the "Environment" dropdown, select **"Injected Provider - MetaMask"**
3. MetaMask should automatically connect
4. Verify that the connected account is displayed below the environment dropdown
5. Verify that "Celo (42220)" is shown as the network

### Step 6: Set Constructor Parameters

1. Find the contract dropdown (should say "BuenoToken")
2. Below it, you'll see a field for constructor parameters
3. Enter your wallet address (the address that will own the contract)
   - This address will have special permissions
   - Copy your address from MetaMask
   - Paste it in the constructor field
   - Make sure it starts with `0x` and is 42 characters long

### Step 7: Deploy Contract

1. Click the orange **"Deploy"** button
2. MetaMask will pop up asking you to confirm the transaction
3. Review the transaction details:
   - Gas fee should be displayed
   - Network should be Celo Mainnet
4. Click **"Confirm"** in MetaMask
5. Wait for the transaction to be mined (usually 5-15 seconds)

### Step 8: Verify Deployment

1. Once deployed, you'll see the contract under "Deployed Contracts" section
2. Click the dropdown arrow to see all contract functions
3. Copy the contract address (displayed next to the contract name)
4. Click the copy icon to copy the address

### Step 9: Verify on Block Explorer

1. Go to [Celo Blockscout](https://celo.blockscout.com/)
2. Paste your contract address in the search bar
3. Press Enter
4. You should see your deployed contract with:
   - Contract address
   - Deployment transaction
   - Contract creation timestamp
   - Balance (should be 0)

### Step 10: Save Contract Address

**Important:** Save your contract address! You'll need it for:

- Frontend configuration (`.env.local`)
- Subgraph configuration (if using The Graph)
- Future interactions with the contract

Create a note with:
```
Contract Address: 0xYourContractAddressHere
Network: Celo Mainnet (Chain ID: 42220)
Owner Address: 0xYourOwnerAddressHere
Deployment Date: [Date]
Block Explorer: https://celo.blockscout.com/address/0xYourContractAddressHere
```

## ✅ Verification Checklist

Use this checklist to verify successful deployment:

- [ ] Contract compiled without errors
- [ ] MetaMask connected to Celo Mainnet
- [ ] Constructor parameter (owner address) entered correctly
- [ ] Deployment transaction confirmed in MetaMask
- [ ] Contract address copied and saved
- [ ] Contract visible on Celo Blockscout
- [ ] Deployment transaction shows "Success" status
- [ ] Contract functions visible in Remix under "Deployed Contracts"

## 🎯 Next Steps

After successful deployment:

1. **Update Environment Variables**

   Navigate to your project's `packages/nextjs/` directory and create/update `.env.local`:

   ```bash
   # BuenoToken Contract Address
   NEXT_PUBLIC_BUENO_TOKEN_ADDRESS=0xYourContractAddressHere
   
   # WalletConnect Project ID
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
   ```

2. **Restart Development Server**

   ```bash
   cd packages/nextjs
   yarn dev
   ```

3. **Mint Some Test Tokens (Remix)**

   After deployment, mint tokens to test:
   
   - In Remix, under "Deployed Contracts", find your BuenoToken
   - Expand the `mint` function
   - Enter:
     - `to`: your wallet address
     - `amount`: `100000` (this equals 1000 tokens with 2 decimals)
   - Click "transact" and confirm in MetaMask
   
   **Important:** BuenoToken uses 2 decimals, so:
   - To mint 1 token: enter `100`
   - To mint 10 tokens: enter `1000`
   - To mint 100 tokens: enter `10000`
   - To mint 1000 tokens: enter `100000`

4. **Test Contract Interaction**

   - Visit `http://localhost:3000/contract`
   - Connect your wallet
   - Check that your token balance displays correctly
   - Try transferring tokens to another address (e.g., 10.50 tokens)
   - Verify the balance updates

4. **Optional: Deploy Subgraph**

   If you want to index contract events:
   - Follow instructions in `THEGRAPH.md`
   - Update `packages/subgraph/networks.json` with your contract address
   - Deploy subgraph to The Graph Studio

## 🔧 Common Deployment Issues

### Issue: "Gas estimation failed"

**Solutions:**
- Ensure you have enough CELO tokens (at least 0.01)
- Check that you're on the correct network (Celo Mainnet)
- Try increasing gas limit manually in MetaMask

### Issue: "Invalid address" error

**Solutions:**
- Verify constructor parameter is a valid Ethereum address
- Ensure address starts with `0x`
- Check address is exactly 42 characters long
- Remove any spaces or extra characters

### Issue: Transaction pending too long

**Solutions:**
- Check [Celo Blockscout](https://celo.blockscout.com/) for network status
- Wait a few more minutes (can take up to 30 seconds during high traffic)
- If stuck after 5 minutes, try canceling and redeploying with higher gas

### Issue: MetaMask not connecting

**Solutions:**
- Refresh Remix page
- Disconnect and reconnect MetaMask
- Try a different browser
- Ensure MetaMask is unlocked

## 💡 Understanding Token Decimals

BuenoToken uses **2 decimals** (not the standard 18). This affects how you work with amounts:

### In Remix (when calling contract functions):

| Tokens You Want | Amount to Enter in Remix |
|-----------------|--------------------------|
| 0.01 tokens     | `1`                      |
| 1 token         | `100`                    |
| 10 tokens       | `1000`                   |
| 100 tokens      | `10000`                  |
| 1000 tokens     | `100000`                 |

### Example: Minting Tokens

**Scenario:** You want to mint 500 tokens to your address

1. In Remix, under "Deployed Contracts", expand the `mint` function
2. Enter:
   - `to`: `0xYourWalletAddress`
   - `amount`: `50000` (500 tokens × 100)
3. Click "transact"
4. Confirm in MetaMask

**Calculation:** `Desired Tokens × 100 = Amount to Enter`

### Why 2 Decimals?

Most tokens use 18 decimals to match ETH, but 2 decimals work better for tokens that represent:
- Currency (like cents in dollars)
- Percentage values
- Simple counting scenarios

For detailed examples and frontend code, see `CELO_TOKEN_GUIDE.md`.

## 📚 Additional Resources

- [Remix Documentation](https://remix-ide.readthedocs.io/)
- [Celo Developer Documentation](https://docs.celo.org/)
- [MetaMask Documentation](https://docs.metamask.io/)
- [Celo Block Explorer](https://celo.blockscout.com/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [BuenoToken Decimal Guide](./CELO_TOKEN_GUIDE.md) - Complete guide for working with 2 decimals

