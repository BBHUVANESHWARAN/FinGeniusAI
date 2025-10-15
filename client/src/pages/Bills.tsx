import { useQuery, useMutation } from "@tanstack/react-query";
import { AddBillDialog } from "@/components/AddBillDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Bill, InsertBill } from "@shared/schema";
import { format, differenceInDays } from "date-fns";
import { Calendar, Trash2 } from "lucide-react";

export default function Bills() {
  const { t } = useLanguage();
  const { toast } = useToast();

  const { data: bills = [], isLoading } = useQuery<Bill[]>({
    queryKey: ["/api/bills"],
  });

  const addMutation = useMutation({
    mutationFn: (bill: InsertBill) =>
      apiRequest("POST", "/api/bills", bill),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bills"] });
      toast({
        title: "Bill added",
        description: "Your bill reminder has been created",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add bill",
        variant: "destructive",
      });
    },
  });

  const togglePaidMutation = useMutation({
    mutationFn: ({ id, isPaid }: { id: string; isPaid: number }) =>
      apiRequest("PATCH", `/api/bills/${id}`, { isPaid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bills"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update bill status",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest("DELETE", `/api/bills/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bills"] });
      toast({
        title: "Bill deleted",
        description: "Your bill reminder has been removed",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete bill",
        variant: "destructive",
      });
    },
  });

  const getCurrencySymbol = (code: string) => {
    const symbols: Record<string, string> = {
      INR: "₹",
      USD: "$",
      EUR: "€",
      GBP: "£",
    };
    return symbols[code] || code;
  };

  const sortedBills = [...bills].sort((a, b) => {
    if (a.isPaid !== b.isPaid) return a.isPaid - b.isPaid;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  if (isLoading) {
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
          <h1 className="text-3xl font-bold">{t("bills.title")}</h1>
          <p className="text-muted-foreground mt-1">Never miss a payment deadline</p>
        </div>
        <AddBillDialog
          onAdd={(bill) => addMutation.mutate(bill)}
          isPending={addMutation.isPending}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            All Bills
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedBills.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No bills added yet. Create your first bill reminder!
            </div>
          ) : (
            <div className="space-y-3">
              {sortedBills.map((bill) => {
                const daysUntilDue = differenceInDays(new Date(bill.dueDate), new Date());
                const isOverdue = daysUntilDue < 0 && bill.isPaid === 0;
                const isPaid = bill.isPaid === 1;

                return (
                  <div
                    key={bill.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                      isPaid ? 'bg-muted/30 opacity-60' : 'hover-elevate'
                    }`}
                    data-testid={`bill-${bill.id}`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <Checkbox
                        checked={isPaid}
                        onCheckedChange={(checked) =>
                          togglePaidMutation.mutate({ id: bill.id, isPaid: checked ? 1 : 0 })
                        }
                        data-testid={`checkbox-bill-${bill.id}`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`font-medium ${isPaid ? 'line-through' : ''}`}>
                            {bill.name}
                          </p>
                          {bill.recurring === 1 && (
                            <Badge variant="outline" className="text-xs">
                              {bill.frequency}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Due: {format(new Date(bill.dueDate), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-mono font-semibold tabular-nums">
                          {getCurrencySymbol(bill.currency)}{Number(bill.amount).toLocaleString('en-IN')}
                        </p>
                        {!isPaid && (
                          <Badge 
                            variant={isOverdue ? "destructive" : "outline"} 
                            className="text-xs mt-1"
                          >
                            {isOverdue 
                              ? t("bills.overdue")
                              : `${daysUntilDue} ${t("bills.days")}`
                            }
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(bill.id)}
                        data-testid={`button-delete-bill-${bill.id}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
