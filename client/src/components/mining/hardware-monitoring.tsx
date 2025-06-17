import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HardwareMonitoringProps {
  data?: Array<{
    gpuName: string;
    temperature: number;
    powerUsage: number;
    fanSpeed: number;
    hashrate: number;
    status: string;
  }>;
}

export function HardwareMonitoring({ data = [] }: HardwareMonitoringProps) {
  // Default data if none provided
  const defaultData = [
    {
      gpuName: "RTX 4080 - GPU 1",
      temperature: 65,
      powerUsage: 240,
      fanSpeed: 75,
      hashrate: 72.3,
      status: "online"
    },
    {
      gpuName: "RTX 4080 - GPU 2", 
      temperature: 68,
      powerUsage: 246,
      fanSpeed: 78,
      hashrate: 73.4,
      status: "online"
    }
  ];

  const gpus = data.length > 0 ? data : defaultData;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Hardware Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {gpus.map((gpu, index) => (
          <div key={index} className="p-4 bg-secondary/20 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-card-foreground">{gpu.gpuName}</h4>
              <Badge variant={gpu.status === 'online' ? 'default' : 'secondary'} className="bg-accent text-accent-foreground">
                {gpu.status}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Temperature</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-secondary rounded-full h-2">
                    <div 
                      className="bg-accent h-2 rounded-full" 
                      style={{ width: `${Math.min((gpu.temperature / 100) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-card-foreground">{gpu.temperature}°C</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Power Usage</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-secondary rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full" 
                      style={{ width: `${Math.min((gpu.powerUsage / 300) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-card-foreground">{gpu.powerUsage}W</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Hashrate</p>
                <p className="text-sm font-medium text-card-foreground">{gpu.hashrate.toFixed(1)} MH/s</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Fan Speed</p>
                <p className="text-sm font-medium text-card-foreground">{gpu.fanSpeed}%</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
