import { useEffect } from "react";
import { Sidebar } from "@/components/mining/sidebar";
import { Header } from "@/components/mining/header";
import { StatsGrid } from "@/components/mining/stats-grid";
import { HashrateChart } from "@/components/mining/hashrate-chart";
import { PoolStatus } from "@/components/mining/pool-status";
import { HardwareMonitoring } from "@/components/mining/hardware-monitoring";
import { ControlPanel } from "@/components/mining/control-panel";
import { useMiningData } from "@/hooks/use-mining-data";
import { useWebSocket } from "@/hooks/use-websocket";
import { WalletWithTransfer } from "@/components/mining/wallet-with-transfer";

export default function Dashboard() {
  const { data: miningData, refetch } = useMiningData(1); // Using user ID 1 for demo

  // Set up WebSocket for real-time updates
  useWebSocket('/ws', (message) => {
    if (message.type === 'stats' || message.type === 'hardware') {
      refetch();
    }
  });

  useEffect(() => {
    document.title = "CryptoMiner Pro - Professional Mining Dashboard";
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto p-6 space-y-6">
          <StatsGrid data={miningData} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <HashrateChart className="lg:col-span-2" data={miningData?.stats} />
            <PoolStatus />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HardwareMonitoring data={miningData?.hardware} />
            <WalletWithTransfer data={miningData?.transactions} />
          </div>

          <ControlPanel />
        </main>
      </div>
    </div>
  );
}