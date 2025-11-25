import { defineStore } from 'pinia';
import type { Account, AccountSummary } from '@/models/Account';
import { AccountService } from '@/services/accountService';

interface AccountState {
  accounts: Account[];
  currentAccount: Account | null;
  summary: AccountSummary | null;
  loading: boolean;
  error: string | null;
}

export const useAccountStore = defineStore('account', {
  state: (): AccountState => ({
    accounts: [],
    currentAccount: null,
    summary: null,
    loading: false,
    error: null,
  }),

  getters: {
    activeAccounts: (state) => state.accounts.filter(acc => acc.status === 'active'),
    totalBalance: (state) => state.accounts.reduce((sum, acc) => sum + acc.balance, 0),
    checkingAccounts: (state) => state.accounts.filter(acc => acc.accountType === 'checking'),
    savingsAccounts: (state) => state.accounts.filter(acc => acc.accountType === 'savings'),
  },

  actions: {
    async fetchAccounts() {
      this.loading = true;
      this.error = null;
      try {
        this.accounts = await AccountService.getAccounts();
      } catch (error) {
        this.error = 'Failed to fetch accounts';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchAccountById(id: string) {
      this.loading = true;
      this.error = null;
      try {
        this.currentAccount = await AccountService.getAccountById(id);
      } catch (error) {
        this.error = 'Failed to fetch account details';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchSummary() {
      try {
        this.summary = await AccountService.getAccountSummary();
      } catch (error) {
        console.error('Failed to fetch summary:', error);
      }
    },

    async createAccount(account: Partial<Account>) {
      this.loading = true;
      this.error = null;
      try {
        const newAccount = await AccountService.createAccount(account);
        this.accounts.push(newAccount);
        return newAccount;
      } catch (error) {
        this.error = 'Failed to create account';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateAccount(id: string, account: Partial<Account>) {
      this.loading = true;
      this.error = null;
      try {
        const updated = await AccountService.updateAccount(id, account);
        const index = this.accounts.findIndex(acc => acc.id === id);
        if (index !== -1) {
          this.accounts[index] = updated;
        }
        return updated;
      } catch (error) {
        this.error = 'Failed to update account';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    setCurrentAccount(account: Account | null) {
      this.currentAccount = account;
    },
  },
});
