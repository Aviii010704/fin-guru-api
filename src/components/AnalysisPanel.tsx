import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Brain, AlertTriangle } from "lucide-react";
import ReactMarkdown from 'react-markdown';

interface AnalysisPanelProps {
  content?: string;
  isLoading?: boolean;
  model?: string;
  className?: string;
}

export function AnalysisPanel({ content, isLoading, model, className }: AnalysisPanelProps) {
  if (isLoading) {
    return (
      <Card className={`p-6 shadow-card ${className}`}>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary animate-pulse" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" style={{ width: `${Math.random() * 40 + 60}%` }} />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!content) {
    return (
      <Card className={`p-6 shadow-card ${className}`}>
        <div className="text-center space-y-4 py-8">
          <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">AI Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Enter a stock ticker to get comprehensive financial analysis
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`shadow-card ${className}`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">AI Analysis</h3>
          </div>
          {model && (
            <Badge variant="outline" className="text-xs">
              {model}
            </Badge>
          )}
        </div>
      </div>
      
      <ScrollArea className="h-[500px] p-6">
        <div className="prose prose-invert prose-sm max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="text-xl font-bold text-foreground mb-4">{children}</h1>,
              h2: ({ children }) => <h2 className="text-lg font-semibold text-foreground mb-3 mt-6">{children}</h2>,
              h3: ({ children }) => <h3 className="text-base font-medium text-foreground mb-2 mt-4">{children}</h3>,
              p: ({ children }) => <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="text-sm text-muted-foreground space-y-1 mb-4">{children}</ul>,
              li: ({ children }) => <li className="flex items-start space-x-2"><span>•</span><span>{children}</span></li>,
              table: ({ children }) => (
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full border border-border rounded-lg">{children}</table>
                </div>
              ),
              thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
              th: ({ children }) => <th className="px-3 py-2 text-left text-xs font-medium text-foreground border-b border-border">{children}</th>,
              td: ({ children }) => <td className="px-3 py-2 text-xs text-muted-foreground border-b border-border">{children}</td>,
              blockquote: ({ children }) => (
                <div className="border-l-4 border-primary pl-4 my-4 bg-card/50 py-3 rounded-r">
                  <AlertTriangle className="h-4 w-4 text-primary mb-2" />
                  <div className="text-sm text-foreground">{children}</div>
                </div>
              ),
              code: ({ children }) => (
                <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono text-foreground">{children}</code>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </ScrollArea>
    </Card>
  );
}