import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Check if API key is available
export function isGeminiAvailable(): boolean {
  return !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 0;
}

interface CategorizedTransaction {
  category: string;
  merchant?: string;
  confidence: number;
}

export async function categorizeTransaction(
  description: string,
  amount: number,
  type: "income" | "expense"
): Promise<CategorizedTransaction> {
  try {
    const categories = type === "income" 
      ? ["Salary", "Freelance", "Business", "Investment", "Gift", "Other"]
      : ["Food & Dining", "Transportation", "Shopping", "Entertainment", "Bills & Utilities", "Healthcare", "Education", "Travel", "Personal Care", "Other"];

    const systemPrompt = `You are a financial categorization expert. 
Analyze the transaction and categorize it appropriately.
Return JSON with: category (from the list), merchant name if identifiable, and confidence (0-1).`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            category: { type: "string", enum: categories },
            merchant: { type: "string" },
            confidence: { type: "number" },
          },
          required: ["category", "confidence"],
        },
      },
      contents: `Categorize this ${type} transaction:
Description: ${description}
Amount: ${amount}
Categories: ${categories.join(", ")}`,
    });

    const rawJson = response.text;
    if (rawJson) {
      const data: CategorizedTransaction = JSON.parse(rawJson);
      return data;
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error) {
    console.error("Categorization error:", error);
    return {
      category: type === "income" ? "Other" : "Other",
      confidence: 0,
    };
  }
}

interface FinancialInsight {
  type: "tip" | "warning" | "achievement" | "recommendation";
  title: string;
  content: string;
  category?: string;
  priority: "low" | "medium" | "high";
}

export async function generateFinancialInsights(
  transactions: any[],
  budgets: any[]
): Promise<FinancialInsight[]> {
  try {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();

    const monthlyTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    });

    const totalIncome = monthlyTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = monthlyTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expensesByCategory = monthlyTransactions
      .filter(t => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
        return acc;
      }, {} as Record<string, number>);

    const systemPrompt = `You are a financial advisor AI. 
Analyze the user's spending patterns and provide actionable insights.
Generate 2-4 insights as JSON array with: type (tip/warning/achievement/recommendation), 
title, content, optional category, and priority (low/medium/high).`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            insights: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string", enum: ["tip", "warning", "achievement", "recommendation"] },
                  title: { type: "string" },
                  content: { type: "string" },
                  category: { type: "string" },
                  priority: { type: "string", enum: ["low", "medium", "high"] },
                },
                required: ["type", "title", "content", "priority"],
              },
            },
          },
          required: ["insights"],
        },
      },
      contents: `Analyze this financial data and provide insights:
Total Income: ₹${totalIncome}
Total Expenses: ₹${totalExpenses}
Expenses by Category: ${JSON.stringify(expensesByCategory)}
Budgets: ${JSON.stringify(budgets)}

Provide practical, actionable insights to help the user save money and manage finances better.`,
    });

    const rawJson = response.text;
    if (rawJson) {
      const data = JSON.parse(rawJson);
      return data.insights || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Insights generation error:", error);
    return [];
  }
}

export async function analyzeBudgetHealth(
  budgets: any[],
  spent: Record<string, number>
): Promise<string> {
  try {
    const budgetStatus = budgets.map(b => ({
      category: b.category,
      limit: Number(b.limit),
      spent: spent[b.category] || 0,
      percentage: ((spent[b.category] || 0) / Number(b.limit)) * 100,
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze this budget status and provide a brief summary (2-3 sentences):
${JSON.stringify(budgetStatus, null, 2)}

Focus on which categories are doing well and which need attention.`,
    });

    return response.text || "Budget analysis unavailable";
  } catch (error) {
    console.error("Budget analysis error:", error);
    return "Budget analysis unavailable";
  }
}
