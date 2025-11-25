import { ApiService } from './api';
import type { Investment, Portfolio, InvestmentTransaction } from '@/models/Investment';

export class InvestmentService {
  static async getPortfolio(): Promise<Portfolio> {
    return ApiService.get<Portfolio>('/investments/portfolio');
  }

  static async getInvestments(): Promise<Investment[]> {
    return ApiService.get<Investment[]>('/investments');
  }

  static async getInvestmentById(id: string): Promise<Investment> {
    return ApiService.get<Investment>(`/investments/${id}`);
  }

  static async buyInvestment(
    symbol: string,
    quantity: number,
    accountId: string
  ): Promise<Investment> {
    return ApiService.post<Investment>('/investments/buy', {
      symbol,
      quantity,
      accountId,
    });
  }

  static async sellInvestment(id: string, quantity: number): Promise<InvestmentTransaction> {
    return ApiService.post<InvestmentTransaction>(`/investments/${id}/sell`, { quantity });
  }

  static async getInvestmentTransactions(id: string): Promise<InvestmentTransaction[]> {
    return ApiService.get<InvestmentTransaction[]>(`/investments/${id}/transactions`);
  }

  static async searchSecurities(query: string): Promise<any[]> {
    return ApiService.get<any[]>(`/investments/search?q=${query}`);
  }

  static async getMarketData(symbol: string): Promise<any> {
    return ApiService.get<any>(`/investments/market-data/${symbol}`);
  }
}
