// Mining Worker - Handles actual mining operations
let isRunning = false;
let miningConfig = null;

self.onmessage = function(event) {
  const { type, ...data } = event.data;
  
  switch (type) {
    case 'start_mining':
      startMining(data);
      break;
    case 'stop_mining':
      stopMining();
      break;
    case 'update_config':
      updateConfig(data);
      break;
  }
};

function startMining(config) {
  if (isRunning) return;
  
  isRunning = true;
  miningConfig = config;
  
  console.log('Starting mining with protected wallet:', config.wallet);
  
  // Start mining loop
  miningLoop();
}

function stopMining() {
  isRunning = false;
  console.log('Mining stopped');
}

function updateConfig(config) {
  miningConfig = { ...miningConfig, ...config };
}

function miningLoop() {
  if (!isRunning) return;
  
  // Simulate mining work (in real implementation, this would be actual hash computation)
  setTimeout(() => {
    if (!isRunning) return;
    
    // Simulate finding a share occasionally
    if (Math.random() < 0.1) { // 10% chance
      const share = {
        nonce: Math.floor(Math.random() * 1000000),
        hash: generateMockHash(),
        difficulty: '0x1000000',
        wallet: miningConfig.wallet, // This will be the protected wallet
        timestamp: Date.now()
      };
      
      self.postMessage({
        type: 'share_found',
        data: share
      });
    }
    
    // Update hashrate periodically
    const hashrate = 70 + Math.random() * 10; // Simulate 70-80 MH/s
    self.postMessage({
      type: 'hashrate_update',
      data: { hashrate, timestamp: Date.now() }
    });
    
    // Continue mining
    miningLoop();
  }, 1000); // Check every second
}

function generateMockHash() {
  const chars = '0123456789abcdef';
  let result = '0x';
  for (let i = 0; i < 64; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

// Initialize worker
console.log('Mining worker initialized');
