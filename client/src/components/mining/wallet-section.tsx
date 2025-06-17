import { Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface WalletSectionProps {
  data?: Array<{
    amount: number;
    type: string;
    timestamp: string;
  }>;
}

export function WalletSection({ data = [] }: WalletSectionProps) {
  const { toast } = useToast();
  
  // Mining wallet address
  const walletAddress = "0xe246E8773056bc770A4949811AE9223Bcf3c1A3A";
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Copied to clipboard",
      description: "Wallet address copied successfully",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Wallet & Earnings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Mining Wallet</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={copyToClipboard}
              className="text-xs text-primary hover:text-primary/80 p-1 h-auto"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
          <p className="text-sm font-mono text-card-foreground break-all">
            {walletAddress}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Blockchain API integrated - API Key: 5AGBVWW-XB34K4A-PM3W2DY-4ATYZ02
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-secondary/20 rounded-lg">
            <p className="text-xs text-muted-foreground">Today's Earnings</p>
            <p className="text-lg font-bold text-accent">0.0847 ETH</p>
            <p className="text-xs text-muted-foreground">$142.35</p>
          </div>
          <div className="p-3 bg-secondary/20 rounded-lg">
            <p className="text-xs text-muted-foreground">Total Balance</p>
            <p className="text-lg font-bold text-card-foreground">2.4356 ETH</p>
            <p className="text-xs text-muted-foreground">$4,089.23</p>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Weekly Avg</span>
              <span className="text-card-foreground">0.594 ETH</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Monthly Avg</span>
              <span className="text-card-foreground">2.547 ETH</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last Payout</span>
              <span className="text-card-foreground">2 hours ago</span>
            </div>
          </div>
        </div>

        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          Request Withdrawal
        </Button>
      </CardContent>
    </Card>
  );
}
