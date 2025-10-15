import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Budget } from "@shared/schema";

interface BudgetProgressProps {
  budgets: Budget[];
  spent: Record<string, number>;
  currency: string;
}

export function BudgetProgress({ budgets, spent, currency }: BudgetProgressProps) {
  const getCurrencySymbol = (code: string) => {
    const symbols: Record<string, string> = {
      INR: "₹",
      USD: "$",
      EUR: "€",
      GBP: "£",
    };
    return symbols[code] || code;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {budgets.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            No budgets set yet
          </div>
        ) : (
          budgets.map((budget) => {
            const spentAmount = spent[budget.category] || 0;
            const limitAmount = Number(budget.limit);
            const percentage = Math.min((spentAmount / limitAmount) * 100, 100);
            const remaining = Math.max(limitAmount - spentAmount, 0);
            const isOverBudget = spentAmount > limitAmount;

            return (
              <div key={budget.id} className="space-y-2" data-testid={`budget-${budget.category.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{budget.category}</p>
                    <p className="text-sm text-muted-foreground">
                      {getCurrencySymbol(currency)}{spentAmount.toLocaleString('en-IN')} of {getCurrencySymbol(currency)}{limitAmount.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-mono font-semibold tabular-nums ${isOverBudget ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {percentage.toFixed(0)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isOverBudget ? 'Over' : 'Left'}: {getCurrencySymbol(currency)}{Math.abs(remaining).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
                <Progress 
                  value={percentage} 
                  className="h-2"
                  indicatorClassName={isOverBudget ? 'bg-destructive' : undefined}
                />
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
