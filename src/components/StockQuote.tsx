import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StockQuoteProps {
  ticker: string;
  price: number;
  change?: number;
  changePct?: number;
  currency?: string;
  timestamp?: string;
  className?: string;
}

export function StockQuote({ 
  ticker, 
  price, 
  change, 
  changePct, 
  currency = "USD",
  timestamp,
  className 
}: StockQuoteProps) {
  const isPositive = (change || 0) >= 0;
  const isNeutral = (change || 0) === 0;
  
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatChange = (value: number) => {
    const formatted = Math.abs(value).toFixed(2);
    return isPositive ? `+${formatted}` : `-${formatted}`;
  };

  const formatPercent = (value: number) => {
    const formatted = Math.abs(value).toFixed(2);
    return isPositive ? `+${formatted}%` : `-${formatted}%`;
  };

  const getTrendIcon = () => {
    if (isNeutral) return <Minus className="h-4 w-4" />;
    return isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  const getTrendColor = () => {
    if (isNeutral) return "text-neutral";
    return isPositive ? "text-bullish" : "text-bearish";
  };

  const getBadgeVariant = () => {
    if (isNeutral) return "secondary";
    return isPositive ? "default" : "destructive";
  };

  return (
    <Card className={`p-6 shadow-card hover:shadow-primary transition-all duration-300 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">{ticker}</h3>
          <Badge variant={getBadgeVariant()} className="font-mono">
            {getTrendIcon()}
            {currency}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="text-3xl font-bold text-foreground font-mono">
            {formatPrice(price)}
          </div>
          
          {change !== undefined && changePct !== undefined && (
            <div className={`flex items-center space-x-2 text-sm font-mono ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{formatChange(change)}</span>
              <span>({formatPercent(changePct)})</span>
            </div>
          )}
        </div>
        
        {timestamp && (
          <div className="text-xs text-muted-foreground font-mono">
            Last updated: {new Date(timestamp).toLocaleString()}
          </div>
        )}
      </div>
    </Card>
  );
}