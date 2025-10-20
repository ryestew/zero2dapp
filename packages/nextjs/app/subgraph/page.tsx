import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import SubgraphData from "./components/SubgraphData";

const query = gql`
  {
    transfers(first: 10) {
      id
      to
      transactionHash
      value
      from
      blockTimestamp
      blockNumber
    }
    ownershipTransferreds(first: 10) {
      blockNumber
      blockTimestamp
      id
      newOwner
      transactionHash
      previousOwner
    }
    approvals(first: 5) {
      id
      owner
      spender
      value
      transactionHash
    }
    eip712DomainChangeds(first: 5) {
      id
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

const url = process.env.NEXT_PUBLIC_SUBGRAPH_URL || "";
const headers: Record<string, string> = process.env.NEXT_PUBLIC_GRAPH_API_KEY
  ? { Authorization: `Bearer ${process.env.NEXT_PUBLIC_GRAPH_API_KEY}` }
  : {};

export default async function SubgraphPage() {
  const queryClient = new QueryClient();

  // Only prefetch if URL is configured
  if (url) {
    try {
      await queryClient.prefetchQuery({
        queryKey: ["subgraph-data"],
        async queryFn() {
          return await request(url, query, {}, headers);
        },
      });
    } catch (error) {
      // Handle prefetch error silently - will be shown in component
      console.error("Error prefetching subgraph data:", error);
    }
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <section className="hero min-h-[300px] bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Subgraph Data
            </h1>
            <p className="text-xl opacity-80">
              Live blockchain data indexed by The Graph
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-8 md:px-12 max-w-7xl">
          {!url ? (
            <div className="alert alert-warning shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <h3 className="font-bold">Subgraph Not Configured</h3>
                <div className="text-sm">
                  Please follow the instructions in{" "}
                  <code className="bg-base-300 px-2 py-1 rounded">
                    THEGRAPH.md
                  </code>{" "}
                  to deploy your subgraph and configure the environment
                  variables.
                </div>
              </div>
            </div>
          ) : (
            <HydrationBoundary state={dehydrate(queryClient)}>
              <SubgraphData />
            </HydrationBoundary>
          )}
        </div>
      </section>
    </div>
  );
}
