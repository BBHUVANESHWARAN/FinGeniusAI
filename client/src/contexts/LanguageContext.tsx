import { createContext, useContext, useState, useEffect } from "react";
import type { Language } from "@shared/schema";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.transactions": "Transactions",
    "nav.budgets": "Budgets",
    "nav.bills": "Bills",
    "nav.insights": "AI Insights",
    
    // Dashboard
    "dashboard.title": "Financial Overview",
    "dashboard.totalBalance": "Total Balance",
    "dashboard.income": "Income",
    "dashboard.expenses": "Expenses",
    "dashboard.savings": "Savings",
    "dashboard.thisMonth": "This Month",
    "dashboard.recentTransactions": "Recent Transactions",
    "dashboard.budgetProgress": "Budget Progress",
    "dashboard.upcomingBills": "Upcoming Bills",
    
    // Transactions
    "transactions.title": "Transactions",
    "transactions.add": "Add Transaction",
    "transactions.income": "Income",
    "transactions.expense": "Expense",
    "transactions.amount": "Amount",
    "transactions.category": "Category",
    "transactions.description": "Description",
    "transactions.merchant": "Merchant",
    "transactions.date": "Date",
    "transactions.filter": "Filter",
    "transactions.all": "All",
    "transactions.scanReceipt": "Scan Receipt",
    
    // Budgets
    "budgets.title": "Budget Planning",
    "budgets.create": "Create Budget",
    "budgets.category": "Category",
    "budgets.limit": "Limit",
    "budgets.spent": "Spent",
    "budgets.remaining": "Remaining",
    "budgets.period": "Period",
    "budgets.monthly": "Monthly",
    "budgets.weekly": "Weekly",
    "budgets.yearly": "Yearly",
    "budgets.rule503020": "50-30-20 Rule",
    
    // Bills
    "bills.title": "Bill Reminders",
    "bills.add": "Add Bill",
    "bills.name": "Bill Name",
    "bills.amount": "Amount",
    "bills.dueDate": "Due Date",
    "bills.paid": "Paid",
    "bills.unpaid": "Unpaid",
    "bills.recurring": "Recurring",
    "bills.dueIn": "Due in",
    "bills.days": "days",
    "bills.overdue": "Overdue",
    
    // Insights
    "insights.title": "AI Financial Insights",
    "insights.tips": "Money-Saving Tips",
    "insights.warnings": "Warnings",
    "insights.achievements": "Achievements",
    "insights.recommendations": "Recommendations",
    
    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.search": "Search",
    "common.currency": "Currency",
    "common.loading": "Loading...",
    "common.noData": "No data available",
    "common.error": "An error occurred",
  },
  ta: {
    // Navigation
    "nav.dashboard": "முகப்பு",
    "nav.transactions": "பரிவர்த்தனைகள்",
    "nav.budgets": "வரவு செலவுத் திட்டம்",
    "nav.bills": "பில்கள்",
    "nav.insights": "AI நுண்ணறிவுகள்",
    
    // Dashboard
    "dashboard.title": "நிதி கண்ணோட்டம்",
    "dashboard.totalBalance": "மொத்த இருப்பு",
    "dashboard.income": "வருமானம்",
    "dashboard.expenses": "செலவுகள்",
    "dashboard.savings": "சேமிப்பு",
    "dashboard.thisMonth": "இந்த மாதம்",
    "dashboard.recentTransactions": "சமீபத்திய பரிவர்த்தனைகள்",
    "dashboard.budgetProgress": "பட்ஜெட் முன்னேற்றம்",
    "dashboard.upcomingBills": "வரவிருக்கும் பில்கள்",
    
    // Transactions
    "transactions.title": "பரிவர்த்தனைகள்",
    "transactions.add": "பரிவர்த்தனை சேர்",
    "transactions.income": "வருமானம்",
    "transactions.expense": "செலவு",
    "transactions.amount": "தொகை",
    "transactions.category": "வகை",
    "transactions.description": "விளக்கம்",
    "transactions.merchant": "கடை பெயர்",
    "transactions.date": "தேதி",
    "transactions.filter": "வடிகட்டு",
    "transactions.all": "அனைத்தும்",
    "transactions.scanReceipt": "ரசீது ஸ்கேன்",
    
    // Budgets
    "budgets.title": "பட்ஜெட் திட்டமிடல்",
    "budgets.create": "பட்ஜெட் உருவாக்கு",
    "budgets.category": "வகை",
    "budgets.limit": "வரம்பு",
    "budgets.spent": "செலவழித்தது",
    "budgets.remaining": "மீதமுள்ளது",
    "budgets.period": "கால அளவு",
    "budgets.monthly": "மாதாந்திர",
    "budgets.weekly": "வாராந்திர",
    "budgets.yearly": "ஆண்டுதோறும்",
    "budgets.rule503020": "50-30-20 விதி",
    
    // Bills
    "bills.title": "பில் நினைவூட்டல்கள்",
    "bills.add": "பில் சேர்",
    "bills.name": "பில் பெயர்",
    "bills.amount": "தொகை",
    "bills.dueDate": "செலுத்த வேண்டிய தேதி",
    "bills.paid": "செலுத்தப்பட்டது",
    "bills.unpaid": "செலுத்தப்படவில்லை",
    "bills.recurring": "மீண்டும் வருவது",
    "bills.dueIn": "முடிய உள்ளது",
    "bills.days": "நாட்கள்",
    "bills.overdue": "கால தாமதம்",
    
    // Insights
    "insights.title": "AI நிதி நுண்ணறிவுகள்",
    "insights.tips": "பணம் சேமிப்பு குறிப்புகள்",
    "insights.warnings": "எச்சரிக்கைகள்",
    "insights.achievements": "சாதனைகள்",
    "insights.recommendations": "பரிந்துரைகள்",
    
    // Common
    "common.save": "சேமி",
    "common.cancel": "ரத்து செய்",
    "common.delete": "நீக்கு",
    "common.edit": "திருத்து",
    "common.search": "தேடு",
    "common.currency": "நாணயம்",
    "common.loading": "ஏற்றுகிறது...",
    "common.noData": "தரவு இல்லை",
    "common.error": "பிழை ஏற்பட்டது",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("fingenius-language");
    return (saved as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("fingenius-language", language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
