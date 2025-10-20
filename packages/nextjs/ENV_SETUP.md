# Environment Variables Setup

Create a `.env.local` file in the `packages/nextjs` directory with the following variables:

```bash
# WalletConnect Project ID
# Get yours at https://cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# The Graph Subgraph URL
# Get this from your Subgraph Studio dashboard after deploying
# Example: https://api.studio.thegraph.com/query/12345/your-subgraph-name/version/latest
NEXT_PUBLIC_SUBGRAPH_URL=

# The Graph API Key (Optional)
# For production, get an API key from Subgraph Studio
NEXT_PUBLIC_GRAPH_API_KEY=
```

## Required Variables

### NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Sign in or create an account
3. Create a new project
4. Copy your Project ID

### NEXT_PUBLIC_SUBGRAPH_URL

1. Deploy your subgraph following the instructions in `THEGRAPH.md`
2. Go to [Subgraph Studio](https://thegraph.com/studio/)
3. Select your subgraph
4. Copy the "Query URL" from the dashboard
5. It will look like: `https://api.studio.thegraph.com/query/<ACCOUNT_ID>/<SUBGRAPH_NAME>/version/latest`

### NEXT_PUBLIC_GRAPH_API_KEY (Optional)

For production deployments with higher rate limits:

1. Go to your subgraph in Subgraph Studio
2. Navigate to the API Keys section
3. Create a new API key
4. Copy and paste it here

⚠️ **Important**: Never commit your `.env.local` file to version control. It's already included in `.gitignore`.
