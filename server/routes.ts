import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Seed data on startup
  await storage.seedData();

  // Transactions
  app.get(api.transactions.list.path, async (req, res) => {
    const transactions = await storage.getTransactions();
    res.json(transactions);
  });

  app.post(api.transactions.create.path, async (req, res) => {
    try {
      const input = api.transactions.create.input.parse(req.body);
      const transaction = await storage.createTransaction(input);
      res.status(201).json(transaction);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Security Logs
  app.get(api.securityLogs.list.path, async (req, res) => {
    const logs = await storage.getSecurityLogs();
    res.json(logs);
  });

  // System Metrics
  app.get(api.systemMetrics.latest.path, async (req, res) => {
    const metrics = await storage.getLatestSystemMetrics();
    res.json(metrics);
  });

  return httpServer;
}
