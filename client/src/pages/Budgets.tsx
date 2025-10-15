import { useQuery, useMutation } from "@tanstack/react-query";
import { AddBudgetDialog } from "@/components/AddBudgetDialog";
import { BudgetProgress } from "@/components/BudgetProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Budget, InsertBudget, Transaction } from "@shared/schema";

export default function Budgets() {
  const { t } = useLanguage();
  const { toast } = useToast();

  const { data: budgets = [], isLoading: loadingBudgets } = useQuery<Budget[]>({
    queryKey: ["/api/budgets"],
  });

  const { data: transactions = [], isLoading: loadingTransactions } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const addMutation = useMutation({
    mutationFn: (budget: InsertBudget) =>
      apiRequest("POST", "/api/budgets", budget),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
      toast({
        title: "Budget created",
        description: "Your budget has been set successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create budget",
        variant: "destructive",
      });
    },
  });

  // Calculate spent per category
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();

  const monthlyExpenses = transactions.filter(t => {
    const date = new Date(t.date);
    return t.type === "expense" && date.getMonth() === thisMonth && date.getFullYear() === thisYear;
  });

  const spentByCategory = monthlyExpenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
    return acc;
  }, {} as Record<string, number>);

  // Calculate 50-30-20 rule
  const totalIncome = transactions
    .filter(t => {
      const date = new Date(t.date);
      return t.type === "income" && date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    })
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = monthlyExpenses.reduce((sum, t) => sum + Number(t.amount), 0);

  const needsTarget = totalIncome * 0.5;
  const wantsTarget = totalIncome * 0.3;
  const savingsTarget = totalIncome * 0.2;

  const needsCategories = ["Food & Dining", "Bills & Utilities", "Healthcare", "Transportation"];
  const wantsCategories = ["Shopping", "Entertainment", "Travel", "Personal Care"];

  const needsSpent = monthlyExpenses
    .filter(t => needsCategories.includes(t.category))
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const wantsSpent = monthlyExpenses
    .filter(t => wantsCategories.includes(t.category))
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const actualSavings = totalIncome - totalExpenses;

  if (loadingBudgets || loadingTransactions) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("budgets.title")}</h1>
          <p className="text-muted-foreground mt-1">Set spending limits and track your budget</p>
        </div>
        <AddBudgetDialog
          onAdd={(budget) => addMutation.mutate(budget)}
          isPending={addMutation.isPending}
        />
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {t("budgets.rule503020")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Needs (50%)</p>
                <p className="text-sm text-muted-foreground">
                  ₹{needsSpent.toLocaleString('en-IN')} / ₹{needsTarget.toLocaleString('en-IN')}
                </p>
              </div>
              <Progress 
                value={Math.min((needsSpent / needsTarget) * 100, 100)} 
                className="h-2"
                indicatorClassName={needsSpent > needsTarget ? 'bg-destructive' : undefined}
              />
              <p className="text-xs text-muted-foreground">
                Essential expenses like food, rent, utilities
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Wants (30%)</p>
                <p className="text-sm text-muted-foreground">
                  ₹{wantsSpent.toLocaleString('en-IN')} / ₹{wantsTarget.toLocaleString('en-IN')}
                </p>
              </div>
              <Progress 
                value={Math.min((wantsSpent / wantsTarget) * 100, 100)} 
                className="h-2"
                indicatorClassName={wantsSpent > wantsTarget ? 'bg-destructive' : undefined}
              />
              <p className="text-xs text-muted-foreground">
                Entertainment, shopping, dining out
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Savings (20%)</p>
                <p className="text-sm text-muted-foreground">
                  ₹{actualSavings.toLocaleString('en-IN')} / ₹{savingsTarget.toLocaleString('en-IN')}
                </p>
              </div>
              <Progress 
                value={Math.min((actualSavings / savingsTarget) * 100, 100)} 
                className="h-2"
                indicatorClassName={actualSavings < savingsTarget ? 'bg-destructive' : 'bg-green-600'}
              />
              <p className="text-xs text-muted-foreground">
                Emergency fund, investments, debt repayment
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <BudgetProgress
        budgets={budgets}
        spent={spentByCategory}
        currency="INR"
      />
    </div>
  );
}
