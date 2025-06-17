import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface HashrateChartProps {
  className?: string;
  data?: Array<{
    hashrate: number;
    timestamp: string;
  }>;
}

export function HashrateChart({ className, data = [] }: HashrateChartProps) {
  const [timeRange, setTimeRange] = useState("24H");

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Hashrate Performance
          </CardTitle>
          <div className="flex items-center space-x-2">
            {["24H", "7D", "30D"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-3 py-1 text-xs",
                  timeRange === range 
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-card-foreground"
                )}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center bg-secondary/20 rounded-lg">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-primary mx-auto mb-2" />
            <p className="text-muted-foreground">Hashrate chart visualization</p>
            <p className="text-xs text-muted-foreground mt-1">
              Real-time performance tracking for {timeRange.toLowerCase()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
