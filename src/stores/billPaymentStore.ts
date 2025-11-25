import { defineStore } from 'pinia';
import type { Biller, BillPayment, BillPaymentRequest } from '@/models/BillPayment';
import { BillPaymentService } from '@/services/billPaymentService';

interface BillPaymentState {
  billers: Biller[];
  payments: BillPayment[];
  scheduledPayments: BillPayment[];
  currentPayment: BillPayment | null;
  loading: boolean;
  error: string | null;
}

export const useBillPaymentStore = defineStore('billPayment', {
  state: (): BillPaymentState => ({
    billers: [],
    payments: [],
    scheduledPayments: [],
    currentPayment: null,
    loading: false,
    error: null,
  }),

  getters: {
    paidBills: (state) => state.payments.filter(p => p.status === 'paid'),
    overdueBills: (state) => state.payments.filter(p => p.status === 'overdue'),
    upcomingBills: (state) => state.payments.filter(p => p.status === 'scheduled'),
    recurringPayments: (state) => state.payments.filter(p => p.recurring),
  },

  actions: {
    async fetchBillers() {
      this.loading = true;
      this.error = null;
      try {
        this.billers = await BillPaymentService.getBillers();
      } catch (error) {
        this.error = 'Failed to fetch billers';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async searchBillers(query: string) {
      try {
        this.billers = await BillPaymentService.searchBillers(query);
      } catch (error) {
        console.error('Failed to search billers:', error);
      }
    },

    async fetchPayments() {
      this.loading = true;
      this.error = null;
      try {
        this.payments = await BillPaymentService.getPayments();
      } catch (error) {
        this.error = 'Failed to fetch payments';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchScheduledPayments() {
      try {
        this.scheduledPayments = await BillPaymentService.getScheduledPayments();
      } catch (error) {
        console.error('Failed to fetch scheduled payments:', error);
      }
    },

    async createPayment(payment: BillPaymentRequest) {
      this.loading = true;
      this.error = null;
      try {
        const newPayment = await BillPaymentService.createPayment(payment);
        this.payments.unshift(newPayment);
        return newPayment;
      } catch (error) {
        this.error = 'Failed to create payment';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async cancelPayment(id: string) {
      try {
        const cancelled = await BillPaymentService.cancelPayment(id);
        const index = this.payments.findIndex(p => p.id === id);
        if (index !== -1) {
          this.payments[index] = cancelled;
        }
        return cancelled;
      } catch (error) {
        console.error('Failed to cancel payment:', error);
        throw error;
      }
    },

    async updateAutoPay(id: string, enabled: boolean) {
      try {
        const updated = await BillPaymentService.updateAutoPay(id, enabled);
        const index = this.payments.findIndex(p => p.id === id);
        if (index !== -1) {
          this.payments[index] = updated;
        }
        return updated;
      } catch (error) {
        console.error('Failed to update auto-pay:', error);
        throw error;
      }
    },
  },
});
