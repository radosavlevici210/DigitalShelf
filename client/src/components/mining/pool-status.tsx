import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PoolStatus() {
  const { data: pools = [] } = useQuery({
    queryKey: ["/api/mining/pools"],
  });

  const { data: activePool } = useQuery({
    queryKey: ["/api/mining/pool/active"],
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground">Pool Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {pools.map((pool: any) => (
            <div
              key={pool.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                pool.isActive ? "bg-secondary/30" : "bg-secondary/10"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  pool.status === 'online' ? 'bg-accent status-online' : 'bg-yellow-400'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-card-foreground">{pool.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {pool.isActive ? "Primary Pool" : "Backup Pool"}
                  </p>
                </div>
              </div>
              <span className={`text-xs font-medium ${
                pool.status === 'online' ? 'text-accent' : 'text-yellow-400'
              }`}>
                {pool.status === 'online' ? 'Active' : 'Standby'}
              </span>
            </div>
          ))}
        </div>

        {activePool && (
          <div className="pt-4 border-t border-border">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pool Fee</span>
                <span className="text-card-foreground">{activePool.fee}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Difficulty</span>
                <span className="text-card-foreground">{activePool.difficulty || "4.2G"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Workers</span>
                <span className="text-card-foreground">3 Active</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
