import { 
  type Transaction, 
  type InsertTransaction,
  type Budget,
  type InsertBudget,
  type Bill,
  type InsertBill,
  type Insight,
  type InsertInsight
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Transactions
  getTransactions(): Promise<Transaction[]>;
  getTransaction(id: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: string, updates: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: string): Promise<void>;

  // Budgets
  getBudgets(): Promise<Budget[]>;
  getBudget(id: string): Promise<Budget | undefined>;
  createBudget(budget: InsertBudget): Promise<Budget>;
  updateBudget(id: string, updates: Partial<InsertBudget>): Promise<Budget | undefined>;
  deleteBudget(id: string): Promise<void>;

  // Bills
  getBills(): Promise<Bill[]>;
  getBill(id: string): Promise<Bill | undefined>;
  createBill(bill: InsertBill): Promise<Bill>;
  updateBill(id: string, updates: Partial<Bill>): Promise<Bill | undefined>;
  deleteBill(id: string): Promise<void>;

  // Insights
  getInsights(): Promise<Insight[]>;
  getInsight(id: string): Promise<Insight | undefined>;
  createInsight(insight: InsertInsight): Promise<Insight>;
  deleteInsight(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private transactions: Map<string, Transaction>;
  private budgets: Map<string, Budget>;
  private bills: Map<string, Bill>;
  private insights: Map<string, Insight>;

  constructor() {
    this.transactions = new Map();
    this.budgets = new Map();
    this.bills = new Map();
    this.insights = new Map();
  }

  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values());
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = { 
      ...insertTransaction, 
      id,
      createdAt: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransaction(id: string, updates: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;
    
    const updated = { ...transaction, ...updates };
    this.transactions.set(id, updated);
    return updated;
  }

  async deleteTransaction(id: string): Promise<void> {
    this.transactions.delete(id);
  }

  // Budgets
  async getBudgets(): Promise<Budget[]> {
    return Array.from(this.budgets.values());
  }

  async getBudget(id: string): Promise<Budget | undefined> {
    return this.budgets.get(id);
  }

  async createBudget(insertBudget: InsertBudget): Promise<Budget> {
    const id = randomUUID();
    const budget: Budget = { 
      ...insertBudget, 
      id,
      createdAt: new Date(),
    };
    this.budgets.set(id, budget);
    return budget;
  }

  async updateBudget(id: string, updates: Partial<InsertBudget>): Promise<Budget | undefined> {
    const budget = this.budgets.get(id);
    if (!budget) return undefined;
    
    const updated = { ...budget, ...updates };
    this.budgets.set(id, updated);
    return updated;
  }

  async deleteBudget(id: string): Promise<void> {
    this.budgets.delete(id);
  }

  // Bills
  async getBills(): Promise<Bill[]> {
    return Array.from(this.bills.values());
  }

  async getBill(id: string): Promise<Bill | undefined> {
    return this.bills.get(id);
  }

  async createBill(insertBill: InsertBill): Promise<Bill> {
    const id = randomUUID();
    const bill: Bill = { 
      ...insertBill, 
      id,
      createdAt: new Date(),
    };
    this.bills.set(id, bill);
    return bill;
  }

  async updateBill(id: string, updates: Partial<Bill>): Promise<Bill | undefined> {
    const bill = this.bills.get(id);
    if (!bill) return undefined;
    
    const updated = { ...bill, ...updates };
    this.bills.set(id, updated);
    return updated;
  }

  async deleteBill(id: string): Promise<void> {
    this.bills.delete(id);
  }

  // Insights
  async getInsights(): Promise<Insight[]> {
    return Array.from(this.insights.values());
  }

  async getInsight(id: string): Promise<Insight | undefined> {
    return this.insights.get(id);
  }

  async createInsight(insertInsight: InsertInsight): Promise<Insight> {
    const id = randomUUID();
    const insight: Insight = { 
      ...insertInsight, 
      id,
      createdAt: new Date(),
    };
    this.insights.set(id, insight);
    return insight;
  }

  async deleteInsight(id: string): Promise<void> {
    this.insights.delete(id);
  }
}

export const storage = new MemStorage();
