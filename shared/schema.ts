import { pgTable, text, serial, integer, boolean, timestamp, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const miningPools = pgTable("mining_pools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  port: integer("port").notNull(),
  isActive: boolean("is_active").default(false),
  fee: real("fee").notNull(),
  latency: integer("latency"),
  difficulty: text("difficulty"),
  status: text("status").default("offline"),
});

export const miningStats = pgTable("mining_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  hashrate: real("hashrate").notNull(),
  sharesSubmitted: integer("shares_submitted").default(0),
  sharesAccepted: integer("shares_accepted").default(0),
  dailyEarnings: real("daily_earnings").default(0),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const hardwareMonitoring = pgTable("hardware_monitoring", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  gpuName: text("gpu_name").notNull(),
  temperature: integer("temperature"),
  powerUsage: integer("power_usage"),
  fanSpeed: integer("fan_speed"),
  hashrate: real("hashrate"),
  status: text("status").default("online"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const miningConfigurations = pgTable("mining_configurations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  poolId: integer("pool_id").notNull(),
  workerName: text("worker_name").notNull(),
  powerLimit: integer("power_limit").default(85),
  memoryClock: integer("memory_clock").default(0),
  coreClock: integer("core_clock").default(0),
  autoRestart: boolean("auto_restart").default(true),
});

export const walletTransactions = pgTable("wallet_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: real("amount").notNull(),
  transactionHash: text("transaction_hash"),
  type: text("type").notNull(), // 'earning' or 'withdrawal'
  status: text("status").default("pending"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  miningStats: many(miningStats),
  hardwareMonitoring: many(hardwareMonitoring),
  miningConfigurations: many(miningConfigurations),
  walletTransactions: many(walletTransactions),
}));

export const miningStatsRelations = relations(miningStats, ({ one }) => ({
  user: one(users, {
    fields: [miningStats.userId],
    references: [users.id],
  }),
}));

export const hardwareMonitoringRelations = relations(hardwareMonitoring, ({ one }) => ({
  user: one(users, {
    fields: [hardwareMonitoring.userId],
    references: [users.id],
  }),
}));

export const miningConfigurationsRelations = relations(miningConfigurations, ({ one }) => ({
  user: one(users, {
    fields: [miningConfigurations.userId],
    references: [users.id],
  }),
  pool: one(miningPools, {
    fields: [miningConfigurations.poolId],
    references: [miningPools.id],
  }),
}));

export const walletTransactionsRelations = relations(walletTransactions, ({ one }) => ({
  user: one(users, {
    fields: [walletTransactions.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertMiningPoolSchema = createInsertSchema(miningPools).omit({
  id: true,
});

export const insertMiningStatsSchema = createInsertSchema(miningStats).omit({
  id: true,
  timestamp: true,
});

export const insertHardwareMonitoringSchema = createInsertSchema(hardwareMonitoring).omit({
  id: true,
  timestamp: true,
});

export const insertMiningConfigurationSchema = createInsertSchema(miningConfigurations).omit({
  id: true,
});

export const insertWalletTransactionSchema = createInsertSchema(walletTransactions).omit({
  id: true,
  timestamp: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMiningPool = z.infer<typeof insertMiningPoolSchema>;
export type MiningPool = typeof miningPools.$inferSelect;
export type InsertMiningStats = z.infer<typeof insertMiningStatsSchema>;
export type MiningStats = typeof miningStats.$inferSelect;
export type InsertHardwareMonitoring = z.infer<typeof insertHardwareMonitoringSchema>;
export type HardwareMonitoring = typeof hardwareMonitoring.$inferSelect;
export type InsertMiningConfiguration = z.infer<typeof insertMiningConfigurationSchema>;
export type MiningConfiguration = typeof miningConfigurations.$inferSelect;
export type InsertWalletTransaction = z.infer<typeof insertWalletTransactionSchema>;
export type WalletTransaction = typeof walletTransactions.$inferSelect;
