import { useQuery } from "@tanstack/react-query";

export function useMiningData(userId: number) {
  return useQuery({
    queryKey: [`/api/mining/dashboard/${userId}`],
    queryFn: async () => {
      const [statsResponse, hardwareResponse, transactionsResponse, latestStatsResponse] = await Promise.all([
        fetch(`/api/mining/stats/${userId}`),
        fetch(`/api/hardware/${userId}`),
        fetch(`/api/wallet/transactions/${userId}`),
        fetch(`/api/mining/latest-stats/${userId}`)
      ]);

      const [stats, hardware, transactions, latestStats] = await Promise.all([
        statsResponse.json(),
        hardwareResponse.json(),
        transactionsResponse.json(),
        latestStatsResponse.json()
      ]);

      return {
        stats,
        hardware,
        transactions,
        latestStats,
        poolLatency: 24 // This would come from pool monitoring
      };
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}
