"use client";

import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";

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

export default function SubgraphData() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["subgraph-data"],
    async queryFn() {
      return await request(url, query, {}, headers);
    },
  });

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
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
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Error loading data: {(error as Error).message}</span>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Transfers */}
      <div className="card bg-base-200 shadow-xl border border-base-300">
        <div className="card-body p-8">
          <h2 className="card-title text-3xl mb-6">💸 Transfers</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                  <th>Value</th>
                  <th>Block</th>
                  <th>Transaction</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {data?.transfers?.map((transfer: any) => (
                  <tr key={transfer.id}>
                    <td className="font-mono text-sm">
                      {formatAddress(transfer.from)}
                    </td>
                    <td className="font-mono text-sm">
                      {formatAddress(transfer.to)}
                    </td>
                    <td className="font-semibold">
                      {(parseInt(transfer.value) / 1e18).toFixed(4)}
                    </td>
                    <td>{transfer.blockNumber}</td>
                    <td className="font-mono text-sm">
                      {formatAddress(transfer.transactionHash)}
                    </td>
                    <td className="text-sm opacity-70">
                      {formatTimestamp(transfer.blockTimestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!data?.transfers || data.transfers.length === 0) && (
            <div className="text-center py-8 opacity-60">
              <p>No transfers found</p>
            </div>
          )}
        </div>
      </div>

      {/* Ownership Transferred */}
      <div className="card bg-base-200 shadow-xl border border-base-300">
        <div className="card-body p-8">
          <h2 className="card-title text-3xl mb-6">👑 Ownership Transfers</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Previous Owner</th>
                  <th>New Owner</th>
                  <th>Block</th>
                  <th>Transaction</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {data?.ownershipTransferreds?.map((transfer: any) => (
                  <tr key={transfer.id}>
                    <td className="font-mono text-sm">
                      {formatAddress(transfer.previousOwner)}
                    </td>
                    <td className="font-mono text-sm">
                      {formatAddress(transfer.newOwner)}
                    </td>
                    <td>{transfer.blockNumber}</td>
                    <td className="font-mono text-sm">
                      {formatAddress(transfer.transactionHash)}
                    </td>
                    <td className="text-sm opacity-70">
                      {formatTimestamp(transfer.blockTimestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!data?.ownershipTransferreds ||
            data.ownershipTransferreds.length === 0) && (
            <div className="text-center py-8 opacity-60">
              <p>No ownership transfers found</p>
            </div>
          )}
        </div>
      </div>

      {/* Approvals */}
      <div className="card bg-base-200 shadow-xl border border-base-300">
        <div className="card-body p-8">
          <h2 className="card-title text-3xl mb-6">✅ Approvals</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Owner</th>
                  <th>Spender</th>
                  <th>Value</th>
                  <th>Transaction</th>
                </tr>
              </thead>
              <tbody>
                {data?.approvals?.map((approval: any) => (
                  <tr key={approval.id}>
                    <td className="font-mono text-sm">
                      {formatAddress(approval.owner)}
                    </td>
                    <td className="font-mono text-sm">
                      {formatAddress(approval.spender)}
                    </td>
                    <td className="font-semibold">
                      {(parseInt(approval.value) / 1e18).toFixed(4)}
                    </td>
                    <td className="font-mono text-sm">
                      {formatAddress(approval.transactionHash)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!data?.approvals || data.approvals.length === 0) && (
            <div className="text-center py-8 opacity-60">
              <p>No approvals found</p>
            </div>
          )}
        </div>
      </div>

      {/* EIP712 Domain Changed */}
      <div className="card bg-base-200 shadow-xl border border-base-300">
        <div className="card-body p-8">
          <h2 className="card-title text-3xl mb-6">🔐 EIP712 Domain Changes</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Block</th>
                  <th>Transaction</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {data?.eip712DomainChangeds?.map((event: any) => (
                  <tr key={event.id}>
                    <td className="font-mono text-sm">{event.id}</td>
                    <td>{event.blockNumber}</td>
                    <td className="font-mono text-sm">
                      {formatAddress(event.transactionHash)}
                    </td>
                    <td className="text-sm opacity-70">
                      {formatTimestamp(event.blockTimestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!data?.eip712DomainChangeds ||
            data.eip712DomainChangeds.length === 0) && (
            <div className="text-center py-8 opacity-60">
              <p>No domain changes found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
