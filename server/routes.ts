import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertMiningStatsSchema, insertHardwareMonitoringSchema, insertMiningConfigurationSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Initialize mining pools
  await initializeMiningPools();

  // API Routes
  app.get("/api/mining/stats/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const limit = parseInt(req.query.limit as string) || 24;
      const stats = await storage.getMiningStats(userId, limit);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mining stats" });
    }
  });

  app.get("/api/mining/latest-stats/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const stats = await storage.getLatestMiningStats(userId);
      res.json(stats || {});
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch latest mining stats" });
    }
  });

  app.post("/api/mining/stats", async (req, res) => {
    try {
      const validation = insertMiningStatsSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: fromZodError(validation.error).toString() });
      }
      const stats = await storage.createMiningStats(validation.data);
      res.json(stats);
      
      // Broadcast to WebSocket clients
      broadcastMiningUpdate('stats', stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to create mining stats" });
    }
  });

  app.get("/api/hardware/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const hardware = await storage.getHardwareMonitoring(userId);
      res.json(hardware);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hardware data" });
    }
  });

  app.post("/api/hardware", async (req, res) => {
    try {
      const validation = insertHardwareMonitoringSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: fromZodError(validation.error).toString() });
      }
      const hardware = await storage.createHardwareMonitoring(validation.data);
      res.json(hardware);
      
      // Broadcast to WebSocket clients
      broadcastMiningUpdate('hardware', hardware);
    } catch (error) {
      res.status(500).json({ error: "Failed to create hardware monitoring data" });
    }
  });

  app.get("/api/mining/pools", async (req, res) => {
    try {
      const pools = await storage.getMiningPools();
      res.json(pools);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mining pools" });
    }
  });

  app.get("/api/mining/pool/active", async (req, res) => {
    try {
      const pool = await storage.getActiveMiningPool();
      res.json(pool || {});
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active mining pool" });
    }
  });

  app.get("/api/mining/config/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const config = await storage.getMiningConfiguration(userId);
      res.json(config || {});
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mining configuration" });
    }
  });

  app.post("/api/mining/config", async (req, res) => {
    try {
      const validation = insertMiningConfigurationSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: fromZodError(validation.error).toString() });
      }
      const config = await storage.createMiningConfiguration(validation.data);
      res.json(config);
    } catch (error) {
      res.status(500).json({ error: "Failed to create mining configuration" });
    }
  });

  app.put("/api/mining/config/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      await storage.updateMiningConfiguration(userId, req.body);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update mining configuration" });
    }
  });

  app.get("/api/wallet/transactions/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const limit = parseInt(req.query.limit as string) || 10;
      const transactions = await storage.getWalletTransactions(userId, limit);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch wallet transactions" });
    }
  });

  // WebSocket Server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('WebSocket client connected');

    ws.on('close', () => {
      clients.delete(ws);
      console.log('WebSocket client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });

  // Broadcast function for mining updates
  function broadcastMiningUpdate(type: string, data: any) {
    const message = JSON.stringify({ type, data });
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Simulate real-time mining data updates
  setInterval(async () => {
    try {
      // Simulate mining stats update for user 1 (demo user)
      const mockStats = {
        userId: 1,
        hashrate: 145.7 + (Math.random() - 0.5) * 10, // Fluctuate around 145.7
        sharesSubmitted: Math.floor(Math.random() * 10),
        sharesAccepted: Math.floor(Math.random() * 10),
        dailyEarnings: 0.0847 + (Math.random() - 0.5) * 0.01,
      };
      
      const stats = await storage.createMiningStats(mockStats);
      broadcastMiningUpdate('stats', stats);
      
      // Simulate hardware updates
      const mockHardware = {
        userId: 1,
        gpuName: 'RTX 4080 - GPU 1',
        temperature: 65 + Math.floor(Math.random() * 10),
        powerUsage: 240 + Math.floor(Math.random() * 20),
        fanSpeed: 75 + Math.floor(Math.random() * 10),
        hashrate: 72.3 + (Math.random() - 0.5) * 5,
        status: 'online',
      };
      
      const hardware = await storage.createHardwareMonitoring(mockHardware);
      broadcastMiningUpdate('hardware', hardware);
    } catch (error) {
      console.error('Error generating mock mining data:', error);
    }
  }, 5000); // Update every 5 seconds

  return httpServer;
}

async function initializeMiningPools() {
  try {
    const existingPools = await storage.getMiningPools();
    if (existingPools.length === 0) {
      // Initialize default mining pools
      await storage.createMiningPool({
        name: "Ethermine",
        url: "eth-us-east1.nanopool.org",
        port: 9999,
        isActive: true,
        fee: 1.0,
        status: "online"
      });
      
      await storage.createMiningPool({
        name: "F2Pool",
        url: "eth.f2pool.com",
        port: 8008,
        isActive: false,
        fee: 2.5,
        status: "standby"
      });
      
      console.log('Initialized default mining pools');
    }
  } catch (error) {
    console.error('Error initializing mining pools:', error);
  }
}
