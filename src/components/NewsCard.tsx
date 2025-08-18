import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Clock } from "lucide-react";

interface NewsItem {
  title: string;
  summary: string;
  source: string;
  date: string;
  url?: string;
  sentiment?: 'bullish' | 'bearish' | 'neutral';
}

interface NewsCardProps {
  news: NewsItem;
  className?: string;
}

export function NewsCard({ news, className }: NewsCardProps) {
  const getSentimentColor = () => {
    switch (news.sentiment) {
      case 'bullish': return 'text-bullish';
      case 'bearish': return 'text-bearish';
      default: return 'text-neutral';
    }
  };

  const getSentimentBadge = () => {
    switch (news.sentiment) {
      case 'bullish': return 'default';
      case 'bearish': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card className={`p-4 shadow-card hover:shadow-primary transition-all duration-300 cursor-pointer ${className}`}>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-sm font-semibold text-foreground leading-tight line-clamp-2">
            {news.title}
          </h4>
          {news.url && (
            <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          )}
        </div>
        
        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
          {news.summary}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{news.source}</span>
            <span>•</span>
            <span>{news.date}</span>
          </div>
          
          {news.sentiment && (
            <Badge variant={getSentimentBadge()} className="text-xs">
              {news.sentiment}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}