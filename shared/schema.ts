import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  hash: text("hash").notNull(),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  currency: text("currency").notNull(), // e.g., QBIT, ETH, BTC
  sender: text("sender").notNull(),
  receiver: text("receiver").notNull(),
  status: text("status").notNull().default("pending"), // pending, verified, encrypted, failed
  quantumSignature: text("quantum_signature"), // Simulated quantum encryption signature
  timestamp: timestamp("timestamp").defaultNow(),
});

export const securityLogs = pgTable("security_logs", {
  id: serial("id").primaryKey(),
  level: text("level").notNull(), // info, warning, critical, breach
  event: text("event").notNull(),
  sourceIp: text("source_ip"),
  details: jsonb("details"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const systemMetrics = pgTable("system_metrics", {
  id: serial("id").primaryKey(),
  nodeId: text("node_id").notNull(),
  cpuUsage: integer("cpu_usage"),
  memoryUsage: integer("memory_usage"),
  networkLatency: integer("network_latency"),
  quantumEntropy: integer("quantum_entropy"), // Thematic metric
  timestamp: timestamp("timestamp").defaultNow(),
});

// === SCHEMAS ===

export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, timestamp: true });
export const insertSecurityLogSchema = createInsertSchema(securityLogs).omit({ id: true, timestamp: true });
export const insertSystemMetricSchema = createInsertSchema(systemMetrics).omit({ id: true, timestamp: true });

// === EXPLICIT API CONTRACT TYPES ===

export type Transaction = typeof transactions.$inferSelect;
export type SecurityLog = typeof securityLogs.$inferSelect;
export type SystemMetric = typeof systemMetrics.$inferSelect;

export type TransactionResponse = Transaction;
export type SecurityLogResponse = SecurityLog;
export type SystemMetricResponse = SystemMetric;

export type CreateTransactionRequest = z.infer<typeof insertTransactionSchema>;
