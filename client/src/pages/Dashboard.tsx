import { useQuery } from "@tanstack/react-query";
import { Wallet, TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { TransactionList } from "@/components/TransactionList";
import { BudgetProgress } from "@/components/BudgetProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Transaction, Budget, Bill } from "@shared/schema";
import { format, differenceInDays } from "date-fns";

export default function Dashboard() {
  const { t } = useLanguage();

  const { data: transactions = [], isLoading: loadingTransactions } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: budgets = [], isLoading: loadingBudgets } = useQuery<Budget[]>({
    queryKey: ["/api/budgets"],
  });

  const { data: bills = [], isLoading: loadingBills } = useQuery<Bill[]>({
    queryKey: ["/api/bills"],
  });

  // Calculate metrics
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

  const balance = totalIncome - totalExpenses;
  const savings = totalIncome > 0 ? ((balance / totalIncome) * 100) : 0;

  // Calculate spent per category for budgets
  const spentByCategory = monthlyTransactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {} as Record<string, number>);

  // Get upcoming bills
  const upcomingBills = bills
    .filter(b => b.isPaid === 0)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  const getCurrencySymbol = (code: string) => {
    const symbols: Record<string, string> = {
      INR: "₹",
      USD: "$",
      EUR: "€",
      GBP: "£",
    };
    return symbols[code] || code;
  };

  if (loadingTransactions || loadingBudgets || loadingBills) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t("dashboard.title")}</h1>
        <p className="text-muted-foreground">{t("dashboard.thisMonth")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title={t("dashboard.totalBalance")}
          value={`₹${balance.toLocaleString('en-IN')}`}
          icon={Wallet}
          colorClass="text-primary"
        />
        <MetricCard
          title={t("dashboard.income")}
          value={`₹${totalIncome.toLocaleString('en-IN')}`}
          icon={TrendingUp}
          colorClass="text-green-600 dark:text-green-500"
        />
        <MetricCard
          title={t("dashboard.expenses")}
          value={`₹${totalExpenses.toLocaleString('en-IN')}`}
          icon={TrendingDown}
          colorClass="text-red-600 dark:text-red-500"
        />
        <MetricCard
          title={t("dashboard.savings")}
          value={`${savings.toFixed(1)}%`}
          icon={Sparkles}
          colorClass="text-primary"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <TransactionList
          transactions={monthlyTransactions}
          title={t("dashboard.recentTransactions")}
          limit={5}
        />

        <div className="space-y-6">
          <BudgetProgress
            budgets={budgets}
            spent={spentByCategory}
            currency="INR"
          />

          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.upcomingBills")}</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingBills.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">
                  No upcoming bills
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingBills.map((bill) => {
                    const daysUntilDue = differenceInDays(new Date(bill.dueDate), new Date());
                    const isOverdue = daysUntilDue < 0;

                    return (
                      <div
                        key={bill.id}
                        className="flex items-center justify-between p-3 rounded-lg hover-elevate"
                        data-testid={`bill-${bill.id}`}
                      >
                        <div className="flex-1">
                          <p className="font-medium">{bill.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(bill.dueDate), "MMM dd, yyyy")}
                          </p>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <div>
                            <p className="font-mono font-semibold tabular-nums">
                              {getCurrencySymbol(bill.currency)}{Number(bill.amount).toLocaleString('en-IN')}
                            </p>
                            <Badge variant={isOverdue ? "destructive" : "outline"} className="text-xs mt-1">
                              {isOverdue ? t("bills.overdue") : `${daysUntilDue} ${t("bills.days")}`}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
