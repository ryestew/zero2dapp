# Subgraph

This folder is set up for The Graph protocol subgraph configuration.

## Getting Started

To initialize your subgraph, you'll need to run `graph init` from this directory. First, install The Graph CLI:

```bash
npm install -g @graphprotocol/graph-cli
```

Then, initialize your subgraph:

```bash
cd packages/subgraph
graph init --studio <YOUR_SUBGRAPH_SLUG>
```

Or to create a subgraph for an existing contract:

```bash
graph init \
  --studio \
  --from-contract <CONTRACT_ADDRESS> \
  --network <NETWORK_NAME> \
  --contract-name <CONTRACT_NAME>
```

For example, for the BuenoToken contract deployed on Celo mainnet:

```bash
graph init \
  --studio \
  --from-contract 0xCFA45ECA955dd195b5b5Fc0E40d1A1B06f16793C \
  --network celo \
  --contract-name BuenoToken
```

## Learn More

To learn more about The Graph and subgraphs:

- [The Graph Documentation](https://thegraph.com/docs/)
- [Quick Start Guide](https://thegraph.com/docs/en/subgraphs/quick-start/)
- [Building a Subgraph](https://thegraph.com/docs/en/developing/creating-a-subgraph/)

## Deploy Your Subgraph

After building your subgraph, you can deploy it to The Graph's hosted service or decentralized network:

```bash
graph auth --studio <DEPLOY_KEY>
graph codegen
graph build
graph deploy --studio <SUBGRAPH_SLUG>
```
