import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, AlertTriangle, Trophy, Lightbulb } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Insight } from "@shared/schema";
import { format } from "date-fns";

export default function Insights() {
  const { t } = useLanguage();

  const { data: insights = [], isLoading } = useQuery<Insight[]>({
    queryKey: ["/api/insights"],
  });

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "tip":
        return Lightbulb;
      case "warning":
        return AlertTriangle;
      case "achievement":
        return Trophy;
      case "recommendation":
        return TrendingUp;
      default:
        return Sparkles;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "tip":
        return "text-blue-600 dark:text-blue-500";
      case "warning":
        return "text-amber-600 dark:text-amber-500";
      case "achievement":
        return "text-green-600 dark:text-green-500";
      case "recommendation":
        return "text-primary";
      default:
        return "text-primary";
    }
  };

  const getInsightBg = (type: string) => {
    switch (type) {
      case "tip":
        return "bg-blue-100 dark:bg-blue-900/30";
      case "warning":
        return "bg-amber-100 dark:bg-amber-900/30";
      case "achievement":
        return "bg-green-100 dark:bg-green-900/30";
      case "recommendation":
        return "bg-primary/10";
      default:
        return "bg-primary/10";
    }
  };

  const sortedInsights = [...insights].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const priorityDiff = priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            {t("insights.title")}
          </h1>
          <p className="text-muted-foreground mt-1">AI-powered financial recommendations and tips</p>
        </div>
      </div>

      {sortedInsights.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Sparkles className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center">
              No insights available yet.<br />
              Add some transactions to get personalized AI recommendations!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {sortedInsights.map((insight) => {
            const Icon = getInsightIcon(insight.type);
            const colorClass = getInsightColor(insight.type);
            const bgClass = getInsightBg(insight.type);

            return (
              <Card key={insight.id} className="hover-elevate transition-all duration-200" data-testid={`insight-${insight.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${bgClass}`}>
                        <Icon className={`h-5 w-5 ${colorClass}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base">{insight.title}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(insight.createdAt), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {insight.priority === "high" && (
                        <Badge variant="destructive" className="text-xs">High</Badge>
                      )}
                      {insight.priority === "medium" && (
                        <Badge variant="outline" className="text-xs">Medium</Badge>
                      )}
                      {insight.category && (
                        <Badge variant="outline" className="text-xs">{insight.category}</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {insight.content}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
