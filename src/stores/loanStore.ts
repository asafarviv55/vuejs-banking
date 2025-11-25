import { defineStore } from 'pinia';
import type { Loan, LoanApplication, LoanPayment } from '@/models/Loan';
import { LoanService } from '@/services/loanService';

interface LoanState {
  loans: Loan[];
  applications: LoanApplication[];
  currentLoan: Loan | null;
  loanPayments: LoanPayment[];
  loading: boolean;
  error: string | null;
}

export const useLoanStore = defineStore('loan', {
  state: (): LoanState => ({
    loans: [],
    applications: [],
    currentLoan: null,
    loanPayments: [],
    loading: false,
    error: null,
  }),

  getters: {
    activeLoans: (state) => state.loans.filter(l => l.status === 'active'),
    totalOutstanding: (state) => state.loans.reduce((sum, l) => sum + l.outstandingBalance, 0),
    totalMonthlyPayment: (state) => state.loans
      .filter(l => l.status === 'active')
      .reduce((sum, l) => sum + l.monthlyPayment, 0),
    pendingApplications: (state) => state.applications.filter(a =>
      a.status === 'submitted' || a.status === 'under_review'
    ),
  },

  actions: {
    async fetchLoans() {
      this.loading = true;
      this.error = null;
      try {
        this.loans = await LoanService.getLoans();
      } catch (error) {
        this.error = 'Failed to fetch loans';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchLoanApplications() {
      try {
        this.applications = await LoanService.getLoanApplications();
      } catch (error) {
        console.error('Failed to fetch loan applications:', error);
      }
    },

    async applyForLoan(application: LoanApplication) {
      this.loading = true;
      this.error = null;
      try {
        const newApplication = await LoanService.applyForLoan(application);
        this.applications.unshift(newApplication);
        return newApplication;
      } catch (error) {
        this.error = 'Failed to submit loan application';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchLoanPayments(loanId: string) {
      this.loading = true;
      this.error = null;
      try {
        this.loanPayments = await LoanService.getLoanPayments(loanId);
      } catch (error) {
        this.error = 'Failed to fetch loan payments';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async makePayment(loanId: string, amount: number) {
      try {
        const payment = await LoanService.makePayment(loanId, amount);
        this.loanPayments.unshift(payment);
        await this.fetchLoans(); // Refresh loans to update balance
        return payment;
      } catch (error) {
        console.error('Failed to make payment:', error);
        throw error;
      }
    },

    setCurrentLoan(loan: Loan | null) {
      this.currentLoan = loan;
    },
  },
});
