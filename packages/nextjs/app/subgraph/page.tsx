export default function SubgraphPage() {
  // TODO: Fetch data from The Graph API
  const transfers: any[] = [];
  const ownershipTransferreds: any[] = [];
  const approvals: any[] = [];
  const eip712DomainChangeds: any[] = [];

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleString();
  };

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
        <div className="container mx-auto px-8 md:px-12 max-w-7xl space-y-12">
          {/* Transfers Section */}
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
                    {transfers.map((transfer) => (
                      <tr key={transfer.id}>
                        <td className="font-mono text-sm">
                          {formatAddress(transfer.from)}
                        </td>
                        <td className="font-mono text-sm">
                          {formatAddress(transfer.to)}
                        </td>
                        <td className="font-semibold">
                          {(parseInt(transfer.value) / 1e18).toFixed(2)} ETH
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
              {transfers.length === 0 && (
                <div className="text-center py-8 opacity-60">
                  <p>No transfers found. Connect a subgraph to see data.</p>
                </div>
              )}
            </div>
          </div>

          {/* Ownership Transferred Section */}
          <div className="card bg-base-200 shadow-xl border border-base-300">
            <div className="card-body p-8">
              <h2 className="card-title text-3xl mb-6">
                👑 Ownership Transfers
              </h2>
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
                    {ownershipTransferreds.map((transfer) => (
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
              {ownershipTransferreds.length === 0 && (
                <div className="text-center py-8 opacity-60">
                  <p>
                    No ownership transfers found. Connect a subgraph to see
                    data.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Approvals Section */}
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
                    {approvals.map((approval) => (
                      <tr key={approval.id}>
                        <td className="font-mono text-sm">
                          {formatAddress(approval.owner)}
                        </td>
                        <td className="font-mono text-sm">
                          {formatAddress(approval.spender)}
                        </td>
                        <td className="font-semibold">
                          {(parseInt(approval.value) / 1e18).toFixed(2)} ETH
                        </td>
                        <td className="font-mono text-sm">
                          {formatAddress(approval.transactionHash)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {approvals.length === 0 && (
                <div className="text-center py-8 opacity-60">
                  <p>No approvals found. Connect a subgraph to see data.</p>
                </div>
              )}
            </div>
          </div>

          {/* EIP712 Domain Changed Section */}
          <div className="card bg-base-200 shadow-xl border border-base-300">
            <div className="card-body p-8">
              <h2 className="card-title text-3xl mb-6">
                🔐 EIP712 Domain Changes
              </h2>
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
                    {eip712DomainChangeds.map((event) => (
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
              {eip712DomainChangeds.length === 0 && (
                <div className="text-center py-8 opacity-60">
                  <p>
                    No domain changes found. Connect a subgraph to see data.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
