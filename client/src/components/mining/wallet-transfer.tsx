
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";

interface WalletTransferProps {
  availableBalance: number;
}

export function WalletTransfer({ availableBalance }: WalletTransferProps) {
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [transferMethod, setTransferMethod] = useState("standard");
  const [isTransferring, setIsTransferring] = useState(false);
  const { toast } = useToast();

  const fees = {
    standard: 0.001,
    fast: 0.003,
    instant: 0.005
  };

  const handleTransferAll = async () => {
    if (!toAddress) {
      toast({
        title: "Error",
        description: "Please enter a destination wallet address",
        variant: "destructive"
      });
      return;
    }

    const fee = fees[transferMethod as keyof typeof fees];
    const transferAmount = availableBalance - fee;

    if (transferAmount <= 0) {
      toast({
        title: "Error", 
        description: "Insufficient balance to cover transfer fees",
        variant: "destructive"
      });
      return;
    }

    setIsTransferring(true);

    try {
      const response = await fetch('/api/wallet/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fromAddress: "0xe246E8773056bc770A4949811AE9223Bcf3c1A3A",
          toAddress,
          amount: transferAmount,
          apiKey: "5AGBVWW-XB34K4A-PM3W2DY-4ATYZ02",
          method: transferMethod
        })
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Transfer Successful",
          description: `${transferAmount.toFixed(6)} ETH transferred to ${toAddress}. TX: ${result.txHash}`,
        });
        setToAddress("");
        setAmount("");
      } else {
        toast({
          title: "Transfer Failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Transfer Failed",
        description: "Network error occurred",
        variant: "destructive"
      });
    } finally {
      setIsTransferring(false);
    }
  };

  const handleWithdrawAll = async () => {
    if (!toAddress) {
      toast({
        title: "Error",
        description: "Please enter a destination wallet address",
        variant: "destructive"
      });
      return;
    }

    const fee = fees[transferMethod as keyof typeof fees];
    const withdrawAmount = availableBalance - fee;

    if (withdrawAmount <= 0) {
      toast({
        title: "Error",
        description: "Insufficient balance to cover withdrawal fees", 
        variant: "destructive"
      });
      return;
    }

    setIsTransferring(true);

    try {
      const response = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          toAddress,
          amount: withdrawAmount,
          apiKey: "5AGBVWW-XB34K4A-PM3W2DY-4ATYZ02",
          withdrawalMethod: transferMethod
        })
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Withdrawal Successful",
          description: `${withdrawAmount.toFixed(6)} ETH withdrawn to ${toAddress}. TX: ${result.txHash}`,
        });
        setToAddress("");
      } else {
        toast({
          title: "Withdrawal Failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Withdrawal Failed", 
        description: "Network error occurred",
        variant: "destructive"
      });
    } finally {
      setIsTransferring(false);
    }
  };

  const fee = fees[transferMethod as keyof typeof fees];
  const maxTransferAmount = Math.max(0, availableBalance - fee);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Transfer All Cryptocurrency
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 p-3 bg-secondary/20 rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground">Available Balance</p>
            <p className="text-lg font-bold text-card-foreground">
              {availableBalance.toFixed(6)} ETH
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Transfer Amount</p>
            <p className="text-lg font-bold text-accent">
              {maxTransferAmount.toFixed(6)} ETH
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="toAddress">Destination Wallet Address</Label>
          <Input
            id="toAddress"
            placeholder="0x..."
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label>Transfer Method</Label>
          <Select value={transferMethod} onValueChange={setTransferMethod}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">
                Standard (10-30 min) - {fees.standard} ETH fee
              </SelectItem>
              <SelectItem value="fast">
                Fast (3-10 min) - {fees.fast} ETH fee
              </SelectItem>
              <SelectItem value="instant">
                Instant (1-3 min) - {fees.instant} ETH fee
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-2 space-y-2">
          <p className="text-xs text-muted-foreground">
            Fee: {fee.toFixed(6)} ETH • Final Amount: {maxTransferAmount.toFixed(6)} ETH
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={handleTransferAll}
            disabled={isTransferring || !toAddress || maxTransferAmount <= 0}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isTransferring ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Transfer All
          </Button>
          
          <Button 
            onClick={handleWithdrawAll}
            disabled={isTransferring || !toAddress || maxTransferAmount <= 0}
            variant="outline"
          >
            {isTransferring ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Withdraw All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
