import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import SubgraphData from "./components/SubgraphData";

const query = gql`
  {
    transfers(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
      id
      from
      to
      value
      blockNumber
      blockTimestamp
      transactionHash
    }
    approvals(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
      id
      owner
      spender
      value
      blockNumber
      blockTimestamp
      transactionHash
    }
    roleGranteds(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
      id
      role
      account
      sender
      blockNumber
      blockTimestamp
      transactionHash
    }
    roleRevokeds(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
      id
      role
      account
      sender
      blockNumber
      blockTimestamp
      transactionHash
    }
    roleAdminChangeds(
      first: 10
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      id
      role
      previousAdminRole
      newAdminRole
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

  await queryClient.prefetchQuery({
    queryKey: ["subgraph-data"],
    async queryFn() {
      return await request(url, query, {}, headers);
    },
  });

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
          <HydrationBoundary state={dehydrate(queryClient)}>
            <SubgraphData />
          </HydrationBoundary>
        </div>
      </section>
    </div>
  );
}
