import { 
  users, 
  miningPools, 
  miningStats, 
  hardwareMonitoring, 
  miningConfigurations,
  walletTransactions,
  type User, 
  type InsertUser,
  type MiningPool,
  type InsertMiningPool,
  type MiningStats,
  type InsertMiningStats,
  type HardwareMonitoring,
  type InsertHardwareMonitoring,
  type MiningConfiguration,
  type InsertMiningConfiguration,
  type WalletTransaction,
  type InsertWalletTransaction
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Mining pools
  getMiningPools(): Promise<MiningPool[]>;
  getActiveMiningPool(): Promise<MiningPool | undefined>;
  createMiningPool(pool: InsertMiningPool): Promise<MiningPool>;
  updateMiningPoolStatus(id: number, status: string, latency?: number): Promise<void>;
  
  // Mining statistics
  getMiningStats(userId: number, limit?: number): Promise<MiningStats[]>;
  getLatestMiningStats(userId: number): Promise<MiningStats | undefined>;
  createMiningStats(stats: InsertMiningStats): Promise<MiningStats>;
  
  // Hardware monitoring
  getHardwareMonitoring(userId: number): Promise<HardwareMonitoring[]>;
  createHardwareMonitoring(hardware: InsertHardwareMonitoring): Promise<HardwareMonitoring>;
  
  // Mining configurations
  getMiningConfiguration(userId: number): Promise<MiningConfiguration | undefined>;
  createMiningConfiguration(config: InsertMiningConfiguration): Promise<MiningConfiguration>;
  updateMiningConfiguration(userId: number, config: Partial<InsertMiningConfiguration>): Promise<void>;
  
  // Wallet transactions
  getWalletTransactions(userId: number, limit?: number): Promise<WalletTransaction[]>;
  createWalletTransaction(transaction: InsertWalletTransaction): Promise<WalletTransaction>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getMiningPools(): Promise<MiningPool[]> {
    return await db.select().from(miningPools);
  }

  async getActiveMiningPool(): Promise<MiningPool | undefined> {
    const [pool] = await db.select().from(miningPools).where(eq(miningPools.isActive, true));
    return pool || undefined;
  }

  async createMiningPool(pool: InsertMiningPool): Promise<MiningPool> {
    const [createdPool] = await db
      .insert(miningPools)
      .values(pool)
      .returning();
    return createdPool;
  }

  async updateMiningPoolStatus(id: number, status: string, latency?: number): Promise<void> {
    await db
      .update(miningPools)
      .set({ status, latency })
      .where(eq(miningPools.id, id));
  }

  async getMiningStats(userId: number, limit: number = 24): Promise<MiningStats[]> {
    return await db
      .select()
      .from(miningStats)
      .where(eq(miningStats.userId, userId))
      .orderBy(desc(miningStats.timestamp))
      .limit(limit);
  }

  async getLatestMiningStats(userId: number): Promise<MiningStats | undefined> {
    const [stats] = await db
      .select()
      .from(miningStats)
      .where(eq(miningStats.userId, userId))
      .orderBy(desc(miningStats.timestamp))
      .limit(1);
    return stats || undefined;
  }

  async createMiningStats(stats: InsertMiningStats): Promise<MiningStats> {
    const [created] = await db
      .insert(miningStats)
      .values(stats)
      .returning();
    return created;
  }

  async getHardwareMonitoring(userId: number): Promise<HardwareMonitoring[]> {
    return await db
      .select()
      .from(hardwareMonitoring)
      .where(eq(hardwareMonitoring.userId, userId))
      .orderBy(desc(hardwareMonitoring.timestamp));
  }

  async createHardwareMonitoring(hardware: InsertHardwareMonitoring): Promise<HardwareMonitoring> {
    const [created] = await db
      .insert(hardwareMonitoring)
      .values(hardware)
      .returning();
    return created;
  }

  async getMiningConfiguration(userId: number): Promise<MiningConfiguration | undefined> {
    const [config] = await db
      .select()
      .from(miningConfigurations)
      .where(eq(miningConfigurations.userId, userId));
    return config || undefined;
  }

  async createMiningConfiguration(config: InsertMiningConfiguration): Promise<MiningConfiguration> {
    const [created] = await db
      .insert(miningConfigurations)
      .values(config)
      .returning();
    return created;
  }

  async updateMiningConfiguration(userId: number, config: Partial<InsertMiningConfiguration>): Promise<void> {
    await db
      .update(miningConfigurations)
      .set(config)
      .where(eq(miningConfigurations.userId, userId));
  }

  async getWalletTransactions(userId: number, limit: number = 10): Promise<WalletTransaction[]> {
    return await db
      .select()
      .from(walletTransactions)
      .where(eq(walletTransactions.userId, userId))
      .orderBy(desc(walletTransactions.timestamp))
      .limit(limit);
  }

  async createWalletTransaction(transaction: InsertWalletTransaction): Promise<WalletTransaction> {
    const [created] = await db
      .insert(walletTransactions)
      .values(transaction)
      .returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
