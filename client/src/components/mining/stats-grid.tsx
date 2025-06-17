import { Zap, DollarSign, Target, Activity, TrendingUp, CheckCircle, Wifi } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsGridProps {
  data?: {
    latestStats?: {
      hashrate: number;
      dailyEarnings: number;
      sharesSubmitted: number;
      sharesAccepted: number;
    };
    poolLatency?: number;
  };
}

export function StatsGrid({ data }: StatsGridProps) {
  const hashrate = data?.latestStats?.hashrate || 145.7;
  const dailyEarnings = data?.latestStats?.dailyEarnings || 0.0847;
  const sharesSubmitted = data?.latestStats?.sharesSubmitted || 2847;
  const sharesAccepted = data?.latestStats?.sharesAccepted || 2838;
  const acceptanceRate = sharesSubmitted > 0 ? ((sharesAccepted / sharesSubmitted) * 100).toFixed(1) : '0.0';
  const poolLatency = data?.poolLatency || 24;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="mining-glow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Hashrate</p>
              <p className="text-2xl font-bold text-primary">{hashrate.toFixed(1)} MH/s</p>
              <p className="text-xs text-accent flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +5.2% from yesterday
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Daily Earnings</p>
              <p className="text-2xl font-bold text-card-foreground">{dailyEarnings.toFixed(4)} ETH</p>
              <p className="text-xs text-muted-foreground mt-1">≈ ${(dailyEarnings * 1680).toFixed(2)} USD</p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-accent" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Shares Submitted</p>
              <p className="text-2xl font-bold text-card-foreground">{sharesSubmitted.toLocaleString()}</p>
              <p className="text-xs text-accent flex items-center mt-1">
                <CheckCircle className="w-3 h-3 mr-1" />
                {acceptanceRate}% acceptance rate
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pool Latency</p>
              <p className="text-2xl font-bold text-card-foreground">{poolLatency}ms</p>
              <p className="text-xs text-accent flex items-center mt-1">
                <Wifi className="w-3 h-3 mr-1" />
                Excellent connection
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
