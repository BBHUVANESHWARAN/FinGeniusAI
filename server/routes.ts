import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertTransactionSchema, 
  insertBudgetSchema, 
  insertBillSchema,
  insertInsightSchema 
} from "@shared/schema";
import { categorizeTransaction, generateFinancialInsights, analyzeBudgetHealth, isGeminiAvailable } from "./gemini";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Transactions Routes
  app.get("/api/transactions", async (_req, res) => {
    try {
      const transactions = await storage.getTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.get("/api/transactions/:id", async (req, res) => {
    try {
      const transaction = await storage.getTransaction(req.params.id);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transaction" });
    }
  });

  app.post("/api/transactions", (req, res) => {
    const { type, amount, currency, category, description, merchant, date } = req.body;

    const numericAmount = Number(amount); // ✅ convert string to number

    if (!type || !numericAmount || !category || !date) {
      return res.status(400).json({ error: "Invalid transaction data" });
    }

    const transaction = {
      type,
      amount: numericAmount,
      currency,
      category,
      description,
      merchant,
      date: new Date(date),
    };

    // Save transaction to DB (or your array)
    console.log("✅ Transaction saved:", transaction);
    res.status(201).json({ success: true, transaction });
  });


  app.patch("/api/transactions/:id", async (req, res) => {
    try {
      // Validate partial updates using the insert schema
      const partialTransactionSchema = insertTransactionSchema.partial();
      const validatedData = partialTransactionSchema.parse(req.body);
      
      const transaction = await storage.updateTransaction(req.params.id, validatedData);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ error: "Invalid transaction data" });
    }
  });

  app.delete("/api/transactions/:id", async (req, res) => {
    try {
      await storage.deleteTransaction(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete transaction" });
    }
  });

  // AI-powered transaction categorization
  app.post("/api/transactions/categorize", async (req, res) => {
    try {
      if (!isGeminiAvailable()) {
        return res.status(503).json({ 
          error: "AI service unavailable",
          message: "Gemini API key is not configured" 
        });
      }

      const { description, amount, type } = req.body;
      if (!description || !amount || !type) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const result = await categorizeTransaction(description, amount, type);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to categorize transaction" });
    }
  });

  // Budgets Routes
  app.get("/api/budgets", async (_req, res) => {
    try {
      const budgets = await storage.getBudgets();
      res.json(budgets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch budgets" });
    }
  });

  app.get("/api/budgets/:id", async (req, res) => {
    try {
      const budget = await storage.getBudget(req.params.id);
      if (!budget) {
        return res.status(404).json({ error: "Budget not found" });
      }
      res.json(budget);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch budget" });
    }
  });

  app.post("/api/budgets", async (req, res) => {
    try {
      const validatedData = insertBudgetSchema.parse(req.body);
      const budget = await storage.createBudget(validatedData);
      res.status(201).json(budget);
    } catch (error) {
      res.status(400).json({ error: "Invalid budget data" });
    }
  });

  app.patch("/api/budgets/:id", async (req, res) => {
    try {
      // Validate partial updates using the insert schema
      const partialBudgetSchema = insertBudgetSchema.partial();
      const validatedData = partialBudgetSchema.parse(req.body);
      
      const budget = await storage.updateBudget(req.params.id, validatedData);
      if (!budget) {
        return res.status(404).json({ error: "Budget not found" });
      }
      res.json(budget);
    } catch (error) {
      res.status(400).json({ error: "Invalid budget data" });
    }
  });

  app.delete("/api/budgets/:id", async (req, res) => {
    try {
      await storage.deleteBudget(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete budget" });
    }
  });

  // Budget analysis with AI
  app.post("/api/budgets/analyze", async (req, res) => {
    try {
      if (!isGeminiAvailable()) {
        return res.status(503).json({ 
          error: "AI service unavailable",
          message: "Gemini API key is not configured" 
        });
      }

      const budgets = await storage.getBudgets();
      const transactions = await storage.getTransactions();

      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();

      const monthlyExpenses = transactions.filter(t => {
        const date = new Date(t.date);
        return t.type === "expense" && date.getMonth() === thisMonth && date.getFullYear() === thisYear;
      });

      const spent = monthlyExpenses.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
        return acc;
      }, {} as Record<string, number>);

      const analysis = await analyzeBudgetHealth(budgets, spent);
      res.json({ analysis });
    } catch (error) {
      res.status(500).json({ error: "Failed to analyze budget" });
    }
  });

  // Bills Routes
  app.get("/api/bills", async (_req, res) => {
    try {
      const bills = await storage.getBills();
      res.json(bills);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bills" });
    }
  });

  app.get("/api/bills/:id", async (req, res) => {
    try {
      const bill = await storage.getBill(req.params.id);
      if (!bill) {
        return res.status(404).json({ error: "Bill not found" });
      }
      res.json(bill);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bill" });
    }
  });

  app.post("/api/bills", async (req, res) => {
    try {
      const validatedData = insertBillSchema.parse(req.body);
      const bill = await storage.createBill(validatedData);
      res.status(201).json(bill);
    } catch (error) {
      res.status(400).json({ error: "Invalid bill data" });
    }
  });

  app.patch("/api/bills/:id", async (req, res) => {
    try {
      // Validate partial updates using the insert schema
      const partialBillSchema = insertBillSchema.partial();
      const validatedData = partialBillSchema.parse(req.body);
      
      const bill = await storage.updateBill(req.params.id, validatedData);
      if (!bill) {
        return res.status(404).json({ error: "Bill not found" });
      }
      res.json(bill);
    } catch (error) {
      res.status(400).json({ error: "Invalid bill data" });
    }
  });

  app.delete("/api/bills/:id", async (req, res) => {
    try {
      await storage.deleteBill(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete bill" });
    }
  });

  // Insights Routes
  app.get("/api/insights", async (_req, res) => {
    try {
      const insights = await storage.getInsights();
      res.json(insights);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch insights" });
    }
  });

  app.get("/api/insights/:id", async (req, res) => {
    try {
      const insight = await storage.getInsight(req.params.id);
      if (!insight) {
        return res.status(404).json({ error: "Insight not found" });
      }
      res.json(insight);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch insight" });
    }
  });

  app.post("/api/insights", async (req, res) => {
    try {
      const validatedData = insertInsightSchema.parse(req.body);
      const insight = await storage.createInsight(validatedData);
      res.status(201).json(insight);
    } catch (error) {
      res.status(400).json({ error: "Invalid insight data" });
    }
  });

  app.delete("/api/insights/:id", async (req, res) => {
    try {
      await storage.deleteInsight(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete insight" });
    }
  });

  // Generate AI insights
  app.post("/api/insights/generate", async (_req, res) => {
    try {
      if (!isGeminiAvailable()) {
        return res.status(503).json({ 
          error: "AI service unavailable",
          message: "Gemini API key is not configured" 
        });
      }

      const transactions = await storage.getTransactions();
      const budgets = await storage.getBudgets();

      const generatedInsights = await generateFinancialInsights(transactions, budgets);

      // Save insights to storage
      const savedInsights = [];
      for (const insight of generatedInsights) {
        const saved = await storage.createInsight({
          type: insight.type,
          title: insight.title,
          content: insight.content,
          category: insight.category,
          priority: insight.priority,
          isRead: 0,
        });
        savedInsights.push(saved);
      }

      res.json(savedInsights);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate insights" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
