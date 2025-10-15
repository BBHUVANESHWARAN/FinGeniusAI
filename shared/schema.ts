import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Transactions table
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // 'income' | 'expense'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("INR"),
  category: text("category").notNull(),
  description: text("description"),
  merchant: text("merchant"),
  date: timestamp("date").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

// Budgets table
export const budgets = pgTable("budgets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(),
  limit: decimal("limit", { precision: 10, scale: 2 }).notNull(),
  period: text("period").notNull().default("monthly"), // 'weekly' | 'monthly' | 'yearly'
  currency: text("currency").notNull().default("INR"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBudgetSchema = createInsertSchema(budgets).omit({
  id: true,
  createdAt: true,
});

export type Budget = typeof budgets.$inferSelect;
export type InsertBudget = z.infer<typeof insertBudgetSchema>;

// Bills table
export const bills = pgTable("bills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("INR"),
  dueDate: timestamp("due_date").notNull(),
  category: text("category").notNull(),
  isPaid: integer("is_paid").notNull().default(0), // 0 or 1
  recurring: integer("recurring").notNull().default(0), // 0 or 1
  frequency: text("frequency"), // 'monthly' | 'quarterly' | 'yearly'
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBillSchema = createInsertSchema(bills).omit({
  id: true,
  createdAt: true,
});

export type Bill = typeof bills.$inferSelect;
export type InsertBill = z.infer<typeof insertBillSchema>;

// AI Insights table
export const insights = pgTable("insights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // 'tip' | 'warning' | 'achievement' | 'recommendation'
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category"),
  priority: text("priority").notNull().default("medium"), // 'low' | 'medium' | 'high'
  isRead: integer("is_read").notNull().default(0), // 0 or 1
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertInsightSchema = createInsertSchema(insights).omit({
  id: true,
  createdAt: true,
});

export type Insight = typeof insights.$inferSelect;
export type InsertInsight = z.infer<typeof insertInsightSchema>;

// Category definitions
export const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Personal Care",
  "Other",
] as const;

export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Gift",
  "Other",
] as const;

export const CURRENCIES = [
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
] as const;

// Language types
export type Language = "en" | "ta";

// Category icons mapping
export const CATEGORY_ICONS: Record<string, string> = {
  "Food & Dining": "utensils",
  "Transportation": "car",
  "Shopping": "shopping-bag",
  "Entertainment": "film",
  "Bills & Utilities": "file-text",
  "Healthcare": "heart-pulse",
  "Education": "graduation-cap",
  "Travel": "plane",
  "Personal Care": "sparkles",
  "Salary": "briefcase",
  "Freelance": "laptop",
  "Business": "building",
  "Investment": "trending-up",
  "Gift": "gift",
  "Other": "more-horizontal",
};
