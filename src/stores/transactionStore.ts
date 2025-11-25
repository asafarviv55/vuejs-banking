import { defineStore } from 'pinia';
import type { Transaction, TransactionFilter } from '@/models/Transaction';
import { TransactionService } from '@/services/transactionService';

interface TransactionState {
  transactions: Transaction[];
  currentTransaction: Transaction | null;
  filter: TransactionFilter | null;
  loading: boolean;
  error: string | null;
}

export const useTransactionStore = defineStore('transaction', {
  state: (): TransactionState => ({
    transactions: [],
    currentTransaction: null,
    filter: null,
    loading: false,
    error: null,
  }),

  getters: {
    debitTransactions: (state) => state.transactions.filter(t => t.type === 'debit'),
    creditTransactions: (state) => state.transactions.filter(t => t.type === 'credit'),
    pendingTransactions: (state) => state.transactions.filter(t => t.status === 'pending'),
    recentTransactions: (state) => state.transactions.slice(0, 10),
    totalDebit: (state) => state.transactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0),
    totalCredit: (state) => state.transactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0),
  },

  actions: {
    async fetchTransactions(filter?: TransactionFilter) {
      this.loading = true;
      this.error = null;
      this.filter = filter || null;
      try {
        this.transactions = await TransactionService.getTransactions(filter);
      } catch (error) {
        this.error = 'Failed to fetch transactions';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchAccountTransactions(accountId: string) {
      this.loading = true;
      this.error = null;
      try {
        this.transactions = await TransactionService.getAccountTransactions(accountId);
      } catch (error) {
        this.error = 'Failed to fetch account transactions';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async searchTransactions(query: string) {
      this.loading = true;
      this.error = null;
      try {
        this.transactions = await TransactionService.searchTransactions(query);
      } catch (error) {
        this.error = 'Failed to search transactions';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    clearFilter() {
      this.filter = null;
    },
  },
});
