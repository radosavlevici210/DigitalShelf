// Mining engine with blockchain API integration
export class MiningEngine {
  private workers: Worker[] = [];
  private isRunning = false;
  private miningWallet = "0xe246E8773056bc770A4949811AE9223Bcf3c1A3A"; // Mining wallet
  private apiKey = "5AGBVWW-XB34K4A-PM3W2DY-4ATYZ02"; // Blockchain API key
  
  constructor() {
    this.initializeWorkers();
  }

  private initializeWorkers() {
    const numWorkers = navigator.hardwareConcurrency || 4;
    
    for (let i = 0; i < numWorkers; i++) {
      try {
        const worker = new Worker('/workers/mining-worker.js');
        worker.onmessage = this.handleWorkerMessage.bind(this);
        worker.onerror = this.handleWorkerError.bind(this);
        this.workers.push(worker);
      } catch (error) {
        console.error(`Failed to create worker ${i}:`, error);
      }
    }
  }

  private handleWorkerMessage(event: MessageEvent) {
    const { type, data } = event.data;
    
    switch (type) {
      case 'share_found':
        this.submitShare(data);
        break;
      case 'hashrate_update':
        this.updateHashrate(data);
        break;
      default:
        console.log('Unknown worker message:', type, data);
    }
  }

  private handleWorkerError(error: ErrorEvent) {
    console.error('Worker error:', error);
  }

  private async submitShare(shareData: any) {
    try {
      // Submit share to blockchain API through our backend
      const sharePayload = {
        ...shareData,
        wallet: this.miningWallet,
        apiKey: this.apiKey,
        timestamp: Date.now(),
        difficulty: shareData.difficulty || 1000000000,
        nonce: shareData.nonce || Math.random().toString(36).substring(2)
      };

      const response = await fetch('/api/mining/submit-share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sharePayload)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Share submitted to blockchain successfully:', result);
        
        // Notify dashboard of successful share submission
        window.dispatchEvent(new CustomEvent('share-submitted', { 
          detail: { 
            wallet: this.miningWallet,
            amount: result.reward || 0.001,
            txHash: result.txHash,
            blockNumber: result.blockNumber
          } 
        }));
        
        return result;
      } else {
        console.error('Share submission failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting share to blockchain:', error);
    }
  }

  private updateHashrate(hashrateData: any) {
    // Update dashboard with new hashrate data
    window.dispatchEvent(new CustomEvent('hashrate-update', { detail: hashrateData }));
  }

  public start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log(`Starting mining with wallet: ${this.miningWallet}`);
    
    this.workers.forEach(worker => {
      worker.postMessage({ 
        type: 'start_mining',
        wallet: this.miningWallet,
        pool: 'eth-us-east1.nanopool.org:9999',
        apiKey: this.apiKey
      });
    });
  }

  public stop() {
    this.isRunning = false;
    this.workers.forEach(worker => {
      worker.postMessage({ type: 'stop_mining' });
    });
  }

  public getStatus() {
    return {
      isRunning: this.isRunning,
      numWorkers: this.workers.length,
      miningWallet: this.miningWallet,
      apiConnected: !!this.apiKey
    };
  }

  public async getWalletBalance() {
    try {
      const response = await fetch(`/api/wallet/balance/${this.miningWallet}`);
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch wallet balance:', error);
      return null;
    }
  }
}

export const miningEngine = new MiningEngine();
