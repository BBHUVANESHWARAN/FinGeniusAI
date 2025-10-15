import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import type { Transaction } from "@shared/schema";
import { CATEGORY_ICONS } from "@shared/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as LucideIcons from "lucide-react";

interface TransactionListProps {
  transactions: Transaction[];
  title?: string;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
  limit?: number;
}

export function TransactionList({ 
  transactions, 
  title, 
  onEdit, 
  onDelete,
  limit 
}: TransactionListProps) {
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;

  const getCategoryIcon = (category: string) => {
    const iconName = CATEGORY_ICONS[category] || "more-horizontal";
    const iconKey = iconName.split('-').map((word, i) => 
      i === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word.charAt(0).toUpperCase() + word.slice(1)
    ).join('');
    
    const Icon = (LucideIcons as any)[iconKey] || LucideIcons.MoreHorizontal;
    return Icon;
  };

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0">
        {displayTransactions.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No transactions yet
          </div>
        ) : (
          <div className="divide-y">
            {displayTransactions.map((transaction) => {
              const Icon = getCategoryIcon(transaction.category);
              const isIncome = transaction.type === "income";
              
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 hover-elevate transition-colors"
                  data-testid={`transaction-${transaction.id}`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`p-2 rounded-lg ${isIncome ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                      <Icon className={`h-5 w-5 ${isIncome ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">
                          {transaction.merchant || transaction.category}
                        </p>
                        {isIncome ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-500 flex-shrink-0" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {transaction.description || format(new Date(transaction.date), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className={`font-mono font-semibold tabular-nums ${isIncome ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                        {isIncome ? '+' : '-'}{transaction.currency === 'INR' ? '₹' : transaction.currency}{' '}
                        {Number(transaction.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {transaction.category}
                      </Badge>
                    </div>
                    {(onEdit || onDelete) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" data-testid={`button-transaction-menu-${transaction.id}`}>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onEdit && (
                            <DropdownMenuItem onClick={() => onEdit(transaction)} data-testid={`button-edit-${transaction.id}`}>
                              Edit
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem 
                              onClick={() => onDelete(transaction.id)} 
                              className="text-destructive"
                              data-testid={`button-delete-${transaction.id}`}
                            >
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
