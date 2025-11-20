import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

export const mainnetEnsClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});