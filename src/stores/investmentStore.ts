import { defineStore } from 'pinia';
import type { Investment, Portfolio, InvestmentTransaction } from '@/models/Investment';
import { InvestmentService } from '@/services/investmentService';

interface InvestmentState {
  portfolio: Portfolio | null;
  investments: Investment[];
  currentInvestment: Investment | null;
  transactions: InvestmentTransaction[];
  loading: boolean;
  error: string | null;
}

export const useInvestmentStore = defineStore('investment', {
  state: (): InvestmentState => ({
    portfolio: null,
    investments: [],
    currentInvestment: null,
    transactions: [],
    loading: false,
    error: null,
  }),

  getters: {
    totalValue: (state) => state.portfolio?.totalValue || 0,
    totalGainLoss: (state) => state.portfolio?.totalGainLoss || 0,
    percentageReturn: (state) => state.portfolio?.percentageReturn || 0,
    profitableInvestments: (state) => state.investments.filter(i => i.totalGainLoss > 0),
    losingInvestments: (state) => state.investments.filter(i => i.totalGainLoss < 0),
  },

  actions: {
    async fetchPortfolio() {
      this.loading = true;
      this.error = null;
      try {
        this.portfolio = await InvestmentService.getPortfolio();
        this.investments = this.portfolio.investments;
      } catch (error) {
        this.error = 'Failed to fetch portfolio';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchInvestmentTransactions(id: string) {
      this.loading = true;
      this.error = null;
      try {
        this.transactions = await InvestmentService.getInvestmentTransactions(id);
      } catch (error) {
        this.error = 'Failed to fetch investment transactions';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async buyInvestment(symbol: string, quantity: number, accountId: string) {
      this.loading = true;
      this.error = null;
      try {
        const investment = await InvestmentService.buyInvestment(symbol, quantity, accountId);
        this.investments.push(investment);
        await this.fetchPortfolio(); // Refresh portfolio
        return investment;
      } catch (error) {
        this.error = 'Failed to buy investment';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async sellInvestment(id: string, quantity: number) {
      try {
        const transaction = await InvestmentService.sellInvestment(id, quantity);
        await this.fetchPortfolio(); // Refresh portfolio
        return transaction;
      } catch (error) {
        console.error('Failed to sell investment:', error);
        throw error;
      }
    },

    setCurrentInvestment(investment: Investment | null) {
      this.currentInvestment = investment;
    },
  },
});
