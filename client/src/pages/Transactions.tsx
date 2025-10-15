import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { TransactionList } from "@/components/TransactionList";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Transaction, InsertTransaction } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Transactions() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const addMutation = useMutation({
    mutationFn: (transaction: InsertTransaction) =>
      apiRequest("POST", "/api/transactions", transaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({
        title: "Transaction added",
        description: "Your transaction has been saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest("DELETE", `/api/transactions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({
        title: "Transaction deleted",
        description: "Your transaction has been removed",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    },
  });

  const filteredTransactions = transactions
    .filter(t => {
      if (filterType !== "all" && t.type !== filterType) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          t.merchant?.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
          <h1 className="text-3xl font-bold">{t("transactions.title")}</h1>
          <p className="text-muted-foreground mt-1">Track all your income and expenses</p>
        </div>
        <AddTransactionDialog
          onAdd={(transaction) => addMutation.mutate(transaction)}
          isPending={addMutation.isPending}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("common.search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-transactions"
          />
        </div>
      </div>

      <Tabs value={filterType} onValueChange={(v) => setFilterType(v as any)}>
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all">{t("transactions.all")}</TabsTrigger>
          <TabsTrigger value="income" data-testid="tab-income">{t("transactions.income")}</TabsTrigger>
          <TabsTrigger value="expense" data-testid="tab-expense">{t("transactions.expense")}</TabsTrigger>
        </TabsList>
        <TabsContent value={filterType} className="mt-6">
          <TransactionList
            transactions={filteredTransactions}
            onDelete={(id) => deleteMutation.mutate(id)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
