import { defineStore } from 'pinia';
import type { Transfer, TransferRequest } from '@/models/Transfer';
import { TransferService } from '@/services/transferService';

interface TransferState {
  transfers: Transfer[];
  scheduledTransfers: Transfer[];
  recurringTransfers: Transfer[];
  currentTransfer: Transfer | null;
  loading: boolean;
  error: string | null;
}

export const useTransferStore = defineStore('transfer', {
  state: (): TransferState => ({
    transfers: [],
    scheduledTransfers: [],
    recurringTransfers: [],
    currentTransfer: null,
    loading: false,
    error: null,
  }),

  getters: {
    completedTransfers: (state) => state.transfers.filter(t => t.status === 'completed'),
    pendingTransfers: (state) => state.transfers.filter(t => t.status === 'pending'),
    internalTransfers: (state) => state.transfers.filter(t => t.transferType === 'internal'),
    externalTransfers: (state) => state.transfers.filter(t => t.transferType === 'external'),
  },

  actions: {
    async fetchTransfers() {
      this.loading = true;
      this.error = null;
      try {
        this.transfers = await TransferService.getTransfers();
      } catch (error) {
        this.error = 'Failed to fetch transfers';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchScheduledTransfers() {
      try {
        this.scheduledTransfers = await TransferService.getScheduledTransfers();
      } catch (error) {
        console.error('Failed to fetch scheduled transfers:', error);
      }
    },

    async fetchRecurringTransfers() {
      try {
        this.recurringTransfers = await TransferService.getRecurringTransfers();
      } catch (error) {
        console.error('Failed to fetch recurring transfers:', error);
      }
    },

    async createTransfer(transfer: TransferRequest) {
      this.loading = true;
      this.error = null;
      try {
        const newTransfer = await TransferService.createTransfer(transfer);
        this.transfers.unshift(newTransfer);
        return newTransfer;
      } catch (error) {
        this.error = 'Failed to create transfer';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async validateTransfer(transfer: TransferRequest) {
      try {
        return await TransferService.validateTransfer(transfer);
      } catch (error) {
        console.error('Failed to validate transfer:', error);
        throw error;
      }
    },

    async cancelTransfer(id: string) {
      try {
        const cancelled = await TransferService.cancelTransfer(id);
        const index = this.transfers.findIndex(t => t.id === id);
        if (index !== -1) {
          this.transfers[index] = cancelled;
        }
        return cancelled;
      } catch (error) {
        console.error('Failed to cancel transfer:', error);
        throw error;
      }
    },
  },
});
