import { defineStore } from 'pinia';
import type { Budget, BudgetCategory, SpendingAnalytics } from '@/models/Budget';
import { BudgetService } from '@/services/budgetService';

interface BudgetState {
  budgets: Budget[];
  categories: BudgetCategory[];
  analytics: SpendingAnalytics | null;
  currentBudget: Budget | null;
  loading: boolean;
  error: string | null;
}

export const useBudgetStore = defineStore('budget', {
  state: (): BudgetState => ({
    budgets: [],
    categories: [],
    analytics: null,
    currentBudget: null,
    loading: false,
    error: null,
  }),

  getters: {
    activeBudgets: (state) => state.budgets.filter(b =>
      new Date(b.endDate) >= new Date()
    ),
    exceededBudgets: (state) => state.budgets.filter(b => b.status === 'exceeded'),
    warningBudgets: (state) => state.budgets.filter(b => b.status === 'warning'),
    totalBudgeted: (state) => state.budgets.reduce((sum, b) => sum + b.budgetAmount, 0),
    totalSpent: (state) => state.budgets.reduce((sum, b) => sum + b.spentAmount, 0),
  },

  actions: {
    async fetchBudgets() {
      this.loading = true;
      this.error = null;
      try {
        this.budgets = await BudgetService.getBudgets();
      } catch (error) {
        this.error = 'Failed to fetch budgets';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchCategories() {
      try {
        this.categories = await BudgetService.getBudgetCategories();
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    },

    async fetchAnalytics(accountId: string) {
      this.loading = true;
      this.error = null;
      try {
        this.analytics = await BudgetService.getSpendingAnalytics(accountId);
      } catch (error) {
        this.error = 'Failed to fetch analytics';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async createBudget(budget: Partial<Budget>) {
      this.loading = true;
      this.error = null;
      try {
        const newBudget = await BudgetService.createBudget(budget);
        this.budgets.push(newBudget);
        return newBudget;
      } catch (error) {
        this.error = 'Failed to create budget';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateBudget(id: string, budget: Partial<Budget>) {
      try {
        const updated = await BudgetService.updateBudget(id, budget);
        const index = this.budgets.findIndex(b => b.id === id);
        if (index !== -1) {
          this.budgets[index] = updated;
        }
        return updated;
      } catch (error) {
        console.error('Failed to update budget:', error);
        throw error;
      }
    },

    async deleteBudget(id: string) {
      try {
        await BudgetService.deleteBudget(id);
        this.budgets = this.budgets.filter(b => b.id !== id);
      } catch (error) {
        console.error('Failed to delete budget:', error);
        throw error;
      }
    },
  },
});
