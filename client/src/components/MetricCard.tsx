import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorClass?: string;
}

export function MetricCard({ title, value, icon: Icon, trend, colorClass = "text-primary" }: MetricCardProps) {
  return (
    <Card className="hover-elevate transition-all duration-200" data-testid={`card-metric-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${colorClass}`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold font-mono tabular-nums" data-testid={`text-${title.toLowerCase().replace(/\s+/g, '-')}-value`}>
          {value}
        </div>
        {trend && (
          <div className={`mt-2 flex items-center gap-1 text-sm ${trend.isPositive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
            {trend.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span className="font-medium">{Math.abs(trend.value)}%</span>
            <span className="text-muted-foreground ml-1">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
