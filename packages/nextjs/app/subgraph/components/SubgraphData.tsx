"use client";

import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";

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
    roleAdminChangeds(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
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

export default function SubgraphData() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["subgraph-data"],
    async queryFn() {
      return await request(url, query, {}, headers);
    },
  });

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
        <span>Error loading data: {error.message}</span>
      </div>
    );
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleString();
  };

  const formatRole = (role: string) => {
    const roleNames: { [key: string]: string } = {
      "0x0000000000000000000000000000000000000000000000000000000000000000":
        "DEFAULT_ADMIN",
      "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6":
        "MINTER_ROLE",
    };
    return roleNames[role] || `${role.slice(0, 10)}...${role.slice(-8)}`;
  };

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
                      {(parseInt(transfer.value) / 100).toFixed(2)} BTK
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

      {/* Roles Granted */}
      <div className="card bg-base-200 shadow-xl border border-base-300">
        <div className="card-body p-8">
          <h2 className="card-title text-3xl mb-6">✨ Roles Granted</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Account</th>
                  <th>Sender</th>
                  <th>Block</th>
                  <th>Transaction</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {data?.roleGranteds?.map((event: any) => (
                  <tr key={event.id}>
                    <td className="font-mono text-sm">
                      {formatRole(event.role)}
                    </td>
                    <td className="font-mono text-sm">
                      {formatAddress(event.account)}
                    </td>
                    <td className="font-mono text-sm">
                      {formatAddress(event.sender)}
                    </td>
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
          {(!data?.roleGranteds || data.roleGranteds.length === 0) && (
            <div className="text-center py-8 opacity-60">
              <p>No roles granted found</p>
            </div>
          )}
        </div>
      </div>

      {/* Roles Revoked */}
      <div className="card bg-base-200 shadow-xl border border-base-300">
        <div className="card-body p-8">
          <h2 className="card-title text-3xl mb-6">🚫 Roles Revoked</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Account</th>
                  <th>Sender</th>
                  <th>Block</th>
                  <th>Transaction</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {data?.roleRevokeds?.map((event: any) => (
                  <tr key={event.id}>
                    <td className="font-mono text-sm">
                      {formatRole(event.role)}
                    </td>
                    <td className="font-mono text-sm">
                      {formatAddress(event.account)}
                    </td>
                    <td className="font-mono text-sm">
                      {formatAddress(event.sender)}
                    </td>
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
          {(!data?.roleRevokeds || data.roleRevokeds.length === 0) && (
            <div className="text-center py-8 opacity-60">
              <p>No roles revoked found</p>
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
                      {(parseInt(approval.value) / 100).toFixed(2)} BTK
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

      {/* Role Admin Changed */}
      <div className="card bg-base-200 shadow-xl border border-base-300">
        <div className="card-body p-8">
          <h2 className="card-title text-3xl mb-6">🔐 Role Admin Changes</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Previous Admin</th>
                  <th>New Admin</th>
                  <th>Block</th>
                  <th>Transaction</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {data?.roleAdminChangeds?.map((event: any) => (
                  <tr key={event.id}>
                    <td className="font-mono text-sm">
                      {formatRole(event.role)}
                    </td>
                    <td className="font-mono text-sm">
                      {formatRole(event.previousAdminRole)}
                    </td>
                    <td className="font-mono text-sm">
                      {formatRole(event.newAdminRole)}
                    </td>
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
          {(!data?.roleAdminChangeds || data.roleAdminChangeds.length === 0) && (
            <div className="text-center py-8 opacity-60">
              <p>No role admin changes found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

