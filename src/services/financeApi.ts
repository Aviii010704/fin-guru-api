// Finance API service to connect to your FastAPI backend
const API_BASE_URL = 'http://localhost:8000'; // Update this to match your API URL

export interface StockQuoteResponse {
  ticker: string;
  price: number;
  change?: number;
  changePct?: number;
  currency?: string;
  timestamp?: string;
}

export interface ModelResponse {
  content: string;
  model?: string;
}

export interface StockAnalysisRequest {
  ticker: string;
}

export interface NewsRequest {
  ticker?: string;
}

export interface PromptRequest {
  prompt: string;
}

class FinanceApiService {
  private async fetchWithErrorHandling<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the Finance API. Please ensure the backend is running on ' + API_BASE_URL);
      }
      throw error;
    }
  }

  async getStockQuote(ticker: string): Promise<StockQuoteResponse> {
    return this.fetchWithErrorHandling<StockQuoteResponse>(
      `/price/quote?ticker=${encodeURIComponent(ticker)}`
    );
  }

  async analyzeStock(request: StockAnalysisRequest): Promise<ModelResponse> {
    return this.fetchWithErrorHandling<ModelResponse>('/analysis/stock', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getNews(request: NewsRequest = {}): Promise<ModelResponse> {
    return this.fetchWithErrorHandling<ModelResponse>('/news', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async sendPrompt(request: PromptRequest): Promise<ModelResponse> {
    return this.fetchWithErrorHandling<ModelResponse>('/prompt', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async checkHealth(): Promise<{ status: string }> {
    return this.fetchWithErrorHandling<{ status: string }>('/health');
  }
}

export const financeApi = new FinanceApiService();