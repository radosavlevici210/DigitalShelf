import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Wallet, TrendingUp } from "lucide-react";

interface WalletTransferProps {
  availableBalance: number;
  onTransferComplete?: (amount: number, txHash: string) => void;
}

export function WalletTransfer({ availableBalance, onTransferComplete }: WalletTransferProps) {
  const { toast } = useToast();
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [transferMethod, setTransferMethod] = useState("standard");
  const [isTransferring, setIsTransferring] = useState(false);
  const [ethPrice, setEthPrice] = useState(0);
  const [estimatedFee, setEstimatedFee] = useState(0.001);
  const [realTimeBalance, setRealTimeBalance] = useState(availableBalance);

  // Update real-time balance when prop changes
  useEffect(() => {
    setRealTimeBalance(availableBalance);
  }, [availableBalance]);

  // Fetch ETH price
  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const data = await response.json();
        setEthPrice(data.ethereum?.usd || 0);
      } catch (error) {
        console.error('Failed to fetch ETH price:', error);
      }
    };

    fetchEthPrice();
    const interval = setInterval(fetchEthPrice, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Update estimated fee based on transfer method
  useEffect(() => {
    const fees = {
      standard: 0.001,
      fast: 0.003,
      instant: 0.005
    };
    setEstimatedFee(fees[transferMethod as keyof typeof fees] || 0.001);
  }, [transferMethod]);

  const validateAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleTransfer = async () => {
    if (!toAddress || !validateAddress(toAddress)) {
      toast({
        title: "Error",
        description: "Please enter a valid Ethereum address",
        variant: "destructive"
      });
      return;
    }

    const transferAmount = parseFloat(amount);
    if (!transferAmount || transferAmount <= 0) {
      toast({
        title: "Error", 
        description: "Please enter a valid transfer amount",
        variant: "destructive"
      });
      return;
    }

    const fee = estimatedFee;
    if (transferAmount + fee > realTimeBalance) {
      toast({
        title: "Error",
        description: "Insufficient balance including fees",
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

      if (response.ok && result.success) {
        toast({
          title: "Transfer Successful",
          description: `Transferred ${transferAmount} ETH to ${toAddress.slice(0, 6)}...${toAddress.slice(-4)}`,
        });

        // Update balance
        setRealTimeBalance(prev => prev - transferAmount - fee);

        // Reset form
        setToAddress("");
        setAmount("");

        // Notify parent component
        onTransferComplete?.(transferAmount, result.txHash);
      } else {
        throw new Error(result.error || 'Transfer failed');
      }
    } catch (error) {
      console.error('Transfer error:', error);
      toast({
        title: "Transfer Failed",
        description: error instanceof Error ? error.message : "Failed to process transfer",
        variant: "destructive"
      });
    } finally {
      setIsTransferring(false);
    }
  };

  const handleCustomTransfer = async (customAmount: number, targetAddress: string) => {
    setAmount(customAmount.toString());
    setToAddress(targetAddress);

    // Auto-trigger transfer for custom amounts
    setTimeout(() => {
      handleTransfer();
    }, 500);
  };

  const maxTransferAmount = Math.max(0, realTimeBalance - estimatedFee);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
          <Send className="w-5 h-5" />
          Transfer Cryptocurrency
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 p-3 bg-secondary/20 rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground">Available Balance</p>
            <p className="text-lg font-bold text-card-foreground">
              {realTimeBalance.toFixed(6)} ETH
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Max Transfer</p>
            <p className="text-lg font-bold text-accent">
              {maxTransferAmount.toFixed(6)} ETH
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Recipient Address</Label>
          <Input
            id="address"
            placeholder="0x..."
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Transfer Amount (ETH)</Label>
          <div className="relative">
            <Input
              id="amount"
              type="number"
              step="0.000001"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pr-16"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
              ETH
            </div>
          </div>
          {amount && ethPrice > 0 && (
            <p className="text-xs text-muted-foreground">
              ≈ ${(parseFloat(amount) * ethPrice).toFixed(2)} USD
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setAmount(maxTransferAmount.toString())}
            className="text-xs"
          >
            Max: {maxTransferAmount.toFixed(6)} ETH
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="method">Transfer Method</Label>
          <Select value={transferMethod} onValueChange={setTransferMethod}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (10-30 min) - 0.001 ETH</SelectItem>
              <SelectItem value="fast">Fast (3-10 min) - 0.003 ETH</SelectItem>
              <SelectItem value="instant">Instant (1-3 min) - 0.005 ETH</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-secondary/20 p-3 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Transfer Amount:</span>
            <span className="text-card-foreground">{amount || '0'} ETH</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Network Fee:</span>
            <span className="text-card-foreground">{estimatedFee.toFixed(6)} ETH</span>
          </div>
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-card-foreground">Total:</span>
            <span className="text-card-foreground">
              {(parseFloat(amount || '0') + estimatedFee).toFixed(6)} ETH
            </span>
          </div>
        </div>

        <Button 
          onClick={handleTransfer} 
          disabled={isTransferring || !toAddress || !amount}
          className="w-full"
        >
          {isTransferring ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing Transfer...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Transfer Cryptocurrency
            </>
          )}
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCustomTransfer(0.001, "0x742d35Cc6635C0532925a3b8D0b5b6B65D98F2F9")}
            disabled={isTransferring}
          >
            <Wallet className="w-3 h-3 mr-1" />
            Test 0.001 ETH
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCustomTransfer(maxTransferAmount, "0x8ba1f109551bD432803012645Hac136c4c7ae673")}
            disabled={isTransferring || maxTransferAmount <= 0}
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            Max Transfer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}