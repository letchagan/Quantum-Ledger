import { db } from "./db";
import {
  transactions,
  securityLogs,
  systemMetrics,
  type CreateTransactionRequest,
  type TransactionResponse,
  type SecurityLogResponse,
  type SystemMetricResponse
} from "@shared/schema";
import { desc, limit } from "drizzle-orm";

export interface IStorage {
  getTransactions(): Promise<TransactionResponse[]>;
  createTransaction(transaction: CreateTransactionRequest): Promise<TransactionResponse>;
  getSecurityLogs(): Promise<SecurityLogResponse[]>;
  getLatestSystemMetrics(): Promise<SystemMetricResponse[]>;
  seedData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getTransactions(): Promise<TransactionResponse[]> {
    return await db.select().from(transactions).orderBy(desc(transactions.timestamp)).limit(50);
  }

  async createTransaction(transaction: CreateTransactionRequest): Promise<TransactionResponse> {
    const [newTransaction] = await db.insert(transactions).values(transaction).returning();
    return newTransaction;
  }

  async getSecurityLogs(): Promise<SecurityLogResponse[]> {
    return await db.select().from(securityLogs).orderBy(desc(securityLogs.timestamp)).limit(20);
  }

  async getLatestSystemMetrics(): Promise<SystemMetricResponse[]> {
    return await db.select().from(systemMetrics).orderBy(desc(systemMetrics.timestamp)).limit(10);
  }

  async seedData(): Promise<void> {
    const existing = await this.getTransactions();
    if (existing.length === 0) {
      // Seed Transactions
      await db.insert(transactions).values([
        { hash: "0x9a8b...7c6d", amount: "450.00", currency: "QBIT", sender: "Wallet_A", receiver: "Vault_X", status: "verified", quantumSignature: "QSIG_ALPHA_1" },
        { hash: "0x1e2f...3g4h", amount: "1200.50", currency: "QBIT", sender: "Node_Cluster_9", receiver: "Secure_Link_2", status: "encrypted", quantumSignature: "QSIG_BETA_9" },
        { hash: "0x5i6j...7k8l", amount: "8900.00", currency: "ETH", sender: "Exchange_Hub", receiver: "Cold_Storage", status: "verified", quantumSignature: "QSIG_GAMMA_3" },
        { hash: "0x9m0n...1o2p", amount: "33.33", currency: "BTC", sender: "Unknown_Proxy", receiver: "Honeypot_4", status: "flagged", quantumSignature: "INVALID_SIG" },
      ]);

      // Seed Security Logs
      await db.insert(securityLogs).values([
        { level: "info", event: "System Startup", details: { init_time: "45ms" } },
        { level: "warning", event: "High Entropy Detected", details: { sector: "7G" } },
        { level: "critical", event: "Unauthorized Access Attempt", sourceIp: "192.168.X.X", details: { method: "brute_force" } },
        { level: "info", event: "Quantum Key Rotation", details: { status: "success" } },
      ]);

      // Seed Metrics
      await db.insert(systemMetrics).values([
        { nodeId: "CORE_01", cpuUsage: 45, memoryUsage: 60, networkLatency: 12, quantumEntropy: 88 },
        { nodeId: "CORE_01", cpuUsage: 42, memoryUsage: 58, networkLatency: 10, quantumEntropy: 85 },
      ]);
    }
  }
}

export const storage = new DatabaseStorage();
