import { useState } from "react";
import { Search, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SearchBarProps {
  onSearch: (ticker: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ onSearch, isLoading, placeholder = "Enter stock ticker (e.g., AAPL, TSLA)", className }: SearchBarProps) {
  const [ticker, setTicker] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker.trim()) {
      onSearch(ticker.trim().toUpperCase());
    }
  };

  const popularStocks = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN", "NVDA"];

  return (
    <Card className={`p-6 shadow-card ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-foreground">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Stock Analysis</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={placeholder}
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              className="pl-10 font-mono uppercase bg-input border-border"
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            variant="financial" 
            disabled={!ticker.trim() || isLoading}
            className="min-w-[100px]"
          >
            {isLoading ? "Analyzing..." : "Analyze"}
          </Button>
        </form>
        
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Popular stocks:</p>
          <div className="flex flex-wrap gap-2">
            {popularStocks.map((stock) => (
              <Button
                key={stock}
                variant="outline"
                size="sm"
                onClick={() => onSearch(stock)}
                disabled={isLoading}
                className="text-xs font-mono"
              >
                {stock}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}