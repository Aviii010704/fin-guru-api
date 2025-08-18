import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, TrendingUp, Newspaper, MessageSquare, Activity } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { StockQuote } from "./StockQuote";
import { AnalysisPanel } from "./AnalysisPanel";
import { NewsCard } from "./NewsCard";
import { ChatInterface } from "./ChatInterface";
import { financeApi, type StockQuoteResponse, type ModelResponse } from "@/services/financeApi";
import { useToast } from "@/hooks/use-toast";

export function Dashboard() {
  const [selectedTicker, setSelectedTicker] = useState<string>("");
  const [stockQuote, setStockQuote] = useState<StockQuoteResponse | null>(null);
  const [analysis, setAnalysis] = useState<ModelResponse | null>(null);
  const [news, setNews] = useState<ModelResponse | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [loadingNews, setLoadingNews] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const { toast } = useToast();

  // Check API health on component mount
  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      await financeApi.checkHealth();
      setApiStatus('online');
    } catch (error) {
      setApiStatus('offline');
      toast({
        title: "API Connection Error",
        description: "Unable to connect to the Finance API. Please ensure the backend is running.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = async (ticker: string) => {
    setSelectedTicker(ticker);
    await Promise.all([
      fetchStockQuote(ticker),
      fetchAnalysis(ticker),
      fetchNews(ticker)
    ]);
  };

  const fetchStockQuote = async (ticker: string) => {
    setLoadingQuote(true);
    try {
      const quote = await financeApi.getStockQuote(ticker);
      setStockQuote(quote);
    } catch (error) {
      toast({
        title: "Quote Error",
        description: error instanceof Error ? error.message : "Failed to fetch stock quote",
        variant: "destructive",
      });
      setStockQuote(null);
    } finally {
      setLoadingQuote(false);
    }
  };

  const fetchAnalysis = async (ticker: string) => {
    setLoadingAnalysis(true);
    try {
      const analysisResult = await financeApi.analyzeStock({ ticker });
      setAnalysis(analysisResult);
    } catch (error) {
      toast({
        title: "Analysis Error",
        description: error instanceof Error ? error.message : "Failed to fetch analysis",
        variant: "destructive",
      });
      setAnalysis(null);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const fetchNews = async (ticker?: string) => {
    setLoadingNews(true);
    try {
      const newsResult = await financeApi.getNews({ ticker });
      setNews(newsResult);
    } catch (error) {
      toast({
        title: "News Error",
        description: error instanceof Error ? error.message : "Failed to fetch news",
        variant: "destructive",
      });
      setNews(null);
    } finally {
      setLoadingNews(false);
    }
  };

  const handleChatMessage = async (message: string): Promise<{ content: string; model?: string }> => {
    try {
      const response = await financeApi.sendPrompt({ prompt: message });
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Failed to send message");
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            Finance Guru
          </h1>
          <p className="text-muted-foreground">AI-Powered Financial Analysis Dashboard</p>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className={`h-4 w-4 ${apiStatus === 'online' ? 'text-bullish' : 'text-bearish'}`} />
          <Badge variant={apiStatus === 'online' ? 'default' : 'destructive'}>
            API {apiStatus === 'checking' ? 'Checking...' : apiStatus}
          </Badge>
        </div>
      </div>

      {/* API Status Alert */}
      {apiStatus === 'offline' && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            The Finance API is offline. Please ensure your FastAPI backend is running on localhost:8000
            and try refreshing the page.
          </AlertDescription>
        </Alert>
      )}

      {/* Search Section */}
      <SearchBar 
        onSearch={handleSearch} 
        isLoading={loadingQuote || loadingAnalysis} 
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stock Quote */}
        <div className="space-y-6">
          {loadingQuote ? (
            <Card className="p-6 shadow-card">
              <div className="space-y-4 animate-pulse">
                <div className="h-6 bg-muted rounded w-1/3"></div>
                <div className="h-10 bg-muted rounded w-2/3"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </Card>
          ) : stockQuote ? (
            <StockQuote {...stockQuote} />
          ) : (
            <Card className="p-6 shadow-card text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">Stock Quote</h3>
              <p className="text-sm text-muted-foreground">
                Search for a stock to see live pricing data
              </p>
            </Card>
          )}

          {/* News Section */}
          <Card className="shadow-card">
            <div className="p-4 border-b border-border">
              <div className="flex items-center space-x-2">
                <Newspaper className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Latest News</h3>
                {selectedTicker && (
                  <Badge variant="outline" className="font-mono">{selectedTicker}</Badge>
                )}
              </div>
            </div>
            
            <div className="p-4">
              {loadingNews ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2 animate-pulse">
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : news ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {news.content}
                  </div>
                  {news.model && (
                    <Badge variant="outline" className="text-xs mt-2">
                      {news.model}
                    </Badge>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Newspaper className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Search for a stock to see related news
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column - Analysis and Chat */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="analysis" className="h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="analysis" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Analysis</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>AI Chat</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="analysis" className="mt-6">
              <AnalysisPanel
                content={analysis?.content}
                isLoading={loadingAnalysis}
                model={analysis?.model}
                className="h-[600px]"
              />
            </TabsContent>
            
            <TabsContent value="chat" className="mt-6">
              <ChatInterface
                onSendMessage={handleChatMessage}
                className="h-[600px]"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}