import { useState } from "react";
import { StopCircle, RefreshCw, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export function ControlPanel() {
  const { toast } = useToast();
  const [autoRestart, setAutoRestart] = useState(true);
  const [powerLimit, setPowerLimit] = useState([85]);
  const [memoryClock, setMemoryClock] = useState([800]);
  const [coreClock, setCoreClock] = useState([100]);

  const handleStopMining = () => {
    toast({
      title: "Mining Stopped",
      description: "All mining operations have been halted",
      variant: "destructive",
    });
  };

  const handleRestartMining = () => {
    toast({
      title: "Workers Restarted",
      description: "All mining workers are being restarted",
    });
  };

  const handleOptimizeSettings = () => {
    toast({
      title: "Settings Optimized",
      description: "Mining settings have been automatically optimized",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Mining Operations
          </CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Auto-restart:</span>
            <Switch 
              checked={autoRestart} 
              onCheckedChange={setAutoRestart}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-card-foreground">Quick Actions</h4>
            <div className="space-y-2">
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleStopMining}
              >
                <StopCircle className="w-4 h-4 mr-2" />
                Stop Mining
              </Button>
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={handleRestartMining}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Restart Workers
              </Button>
              <Button 
                variant="default" 
                className="w-full"
                onClick={handleOptimizeSettings}
              >
                <Settings className="w-4 h-4 mr-2" />
                Optimize Settings
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-card-foreground">Performance Settings</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Power Limit</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Slider
                    value={powerLimit}
                    onValueChange={setPowerLimit}
                    max={100}
                    min={50}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm text-card-foreground w-12">{powerLimit[0]}%</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Memory Clock</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Slider
                    value={memoryClock}
                    onValueChange={setMemoryClock}
                    max={1500}
                    min={-500}
                    step={50}
                    className="flex-1"
                  />
                  <span className="text-sm text-card-foreground w-12">+{memoryClock[0]}</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Core Clock</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Slider
                    value={coreClock}
                    onValueChange={setCoreClock}
                    max={300}
                    min={-300}
                    step={25}
                    className="flex-1"
                  />
                  <span className="text-sm text-card-foreground w-12">+{coreClock[0]}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-card-foreground">System Status</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Mining Engine</span>
                <span className="text-sm text-accent font-medium">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Web Workers</span>
                <span className="text-sm text-card-foreground">8/8 Running</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Stratum Proxy</span>
                <span className="text-sm text-accent font-medium">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">API Status</span>
                <span className="text-sm text-accent font-medium">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Uptime</span>
                <span className="text-sm text-card-foreground">2d 14h 32m</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
