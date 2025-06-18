
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, CheckCircle, AlertCircle, Clock, ExternalLink, Copy } from "lucide-react";
import { blockchainAPI } from "@/lib/blockchain-api";

interface WalletTransferProps {
  availableBalance: number;
}

interface TransferHistory {
  id: string;
  amount: number;
  recipient: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
  txHash?: string;
  fee: number;
}

export function WalletTransfer({ availableBalance }: WalletTransferProps) {
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [transferMethod, setTransferMethod] = useState("standard");
  const [isTransferring, setIsTransferring] = useState(false);
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [estimatedFee, setEstimatedFee] = useState(0);
  const [ethPrice, setEthPrice] = useState(0);
  const [transferHistory, setTransferHistory] = useState<TransferHistory[]>([]);
  const [realTimeBalance, setRealTimeBalance] = useState(availableBalance);
  const { toast } = useToast();

  const fees = {
    standard: 0.001,
    fast: 0.003,
    instant: 0.005
  };

  // Real-time blockchain integration
  useEffect(() => {
    const fetchBlockchainData = async () => {
      try {
        const price = await blockchainAPI.getEthereumPrice();
        setEthPrice(price);
        
        const walletAddress = "0xe246E8773056bc770A4949811AE9223Bcf3c1A3A";
        const balance = await blockchainAPI.getWalletBalance(walletAddress);
        setRealTimeBalance(balance);
        
        const fee = await blockchainAPI.estimateTransferFee(parseFloat(amount) || 0);
        setEstimatedFee(fee);
      } catch (error) {
        console.error("Error fetching blockchain data:", error);
      }
    };

    fetchBlockchainData();
    const interval = setInterval(fetchBlockchainData, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [amount]);

  // Address validation
  useEffect(() => {
    const validateAddress = async () => {
      if (toAddress.length >= 42) {
        const valid = await blockchainAPI.validateAddress(toAddress);
        setIsValidAddress(valid);
      } else {
        setIsValidAddress(false);
      }
    };

    if (toAddress) {
      validateAddress();
    }
  }, [toAddress]);

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
          <div className="relative">
            <Input
              id="toAddress"
              placeholder="0x..."
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              className={`font-mono text-sm pr-10 ${
                toAddress && !isValidAddress 
                  ? 'border-red-500 focus:border-red-500' 
                  : toAddress && isValidAddress 
                    ? 'border-green-500 focus:border-green-500' 
                    : ''
              }`}
            />
            {toAddress && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isValidAddress ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            )}
          </div>
          {toAddress && !isValidAddress && (
            <p className="text-xs text-red-500">Invalid Ethereum address format</p>
          )}
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
            onClick={() => setAmount((realTimeBalance - estimatedFee).toString())}
            className="text-xs"
          >
            Max: {(realTimeBalance - estimatedFee).toFixed(6)} ETH
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Transfer Method</Label>
          <select 
            value={transferMethod} 
            onChange={(e) => setTransferMethod(e.target.value)}
            className="w-full p-2 border rounded-md bg-background text-foreground"
          >
            <option value="standard">Standard (10-30 min) - {fees.standard} ETH fee</option>
            <option value="fast">Fast (3-10 min) - {fees.fast} ETH fee</option>
            <option value="instant">Instant (1-3 min) - {fees.instant} ETH fee</option>
          </select>
        </div>

        <div className="pt-2 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Network Fee:</span>
            <span className="text-foreground">{estimatedFee.toFixed(6)} ETH</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Real-time Balance:</span>
            <span className="text-foreground">{realTimeBalance.toFixed(6)} ETH</span>
          </div>
          {ethPrice > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">ETH Price:</span>
              <span className="text-foreground">${ethPrice.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Button 
            onClick={amount ? handleCustomTransfer : handleTransferAll}
            disabled={isTransferring || !toAddress || !isValidAddress}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isTransferring ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {amount ? `Transfer ${amount} ETH` : 'Transfer All'}
          </Button>
          
          <Button 
            onClick={handleWithdrawAll}
            disabled={isTransferring || !toAddress || !isValidAddress}
            variant="outline"
          >
            {isTransferring ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Withdraw All to External
          </Button>
        </div>

        {transferHistory.length > 0 && (
          <div className="mt-6 space-y-2">
            <Label className="text-sm font-semibold">Recent Transfers</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {transferHistory.slice(0, 3).map((transfer) => (
                <div key={transfer.id} className="flex items-center justify-between p-2 bg-secondary/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    {transfer.status === 'pending' && <Clock className="h-3 w-3 text-yellow-500" />}
                    {transfer.status === 'confirmed' && <CheckCircle className="h-3 w-3 text-green-500" />}
                    {transfer.status === 'failed' && <AlertCircle className="h-3 w-3 text-red-500" />}
                    <div>
                      <p className="text-xs font-mono">{transfer.recipient.slice(0, 10)}...</p>
                      <p className="text-xs text-muted-foreground">{transfer.amount.toFixed(6)} ETH</p>
                    </div>
                  </div>
                  {transfer.txHash && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`https://etherscan.io/tx/${transfer.txHash}`, '_blank')}
                      className="h-6 w-6 p-0"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
