import { defineStore } from 'pinia';
import type { Beneficiary, BeneficiaryRequest } from '@/models/Beneficiary';
import { BeneficiaryService } from '@/services/beneficiaryService';

interface BeneficiaryState {
  beneficiaries: Beneficiary[];
  currentBeneficiary: Beneficiary | null;
  loading: boolean;
  error: string | null;
}

export const useBeneficiaryStore = defineStore('beneficiary', {
  state: (): BeneficiaryState => ({
    beneficiaries: [],
    currentBeneficiary: null,
    loading: false,
    error: null,
  }),

  getters: {
    verifiedBeneficiaries: (state) => state.beneficiaries.filter(b => b.isVerified),
    personalBeneficiaries: (state) => state.beneficiaries.filter(b => b.type === 'personal'),
    businessBeneficiaries: (state) => state.beneficiaries.filter(b => b.type === 'business'),
  },

  actions: {
    async fetchBeneficiaries() {
      this.loading = true;
      this.error = null;
      try {
        this.beneficiaries = await BeneficiaryService.getBeneficiaries();
      } catch (error) {
        this.error = 'Failed to fetch beneficiaries';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async addBeneficiary(beneficiary: BeneficiaryRequest) {
      this.loading = true;
      this.error = null;
      try {
        const newBeneficiary = await BeneficiaryService.addBeneficiary(beneficiary);
        this.beneficiaries.push(newBeneficiary);
        return newBeneficiary;
      } catch (error) {
        this.error = 'Failed to add beneficiary';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateBeneficiary(id: string, beneficiary: Partial<Beneficiary>) {
      try {
        const updated = await BeneficiaryService.updateBeneficiary(id, beneficiary);
        const index = this.beneficiaries.findIndex(b => b.id === id);
        if (index !== -1) {
          this.beneficiaries[index] = updated;
        }
        return updated;
      } catch (error) {
        console.error('Failed to update beneficiary:', error);
        throw error;
      }
    },

    async deleteBeneficiary(id: string) {
      try {
        await BeneficiaryService.deleteBeneficiary(id);
        this.beneficiaries = this.beneficiaries.filter(b => b.id !== id);
      } catch (error) {
        console.error('Failed to delete beneficiary:', error);
        throw error;
      }
    },

    async searchBeneficiaries(query: string) {
      try {
        this.beneficiaries = await BeneficiaryService.searchBeneficiaries(query);
      } catch (error) {
        console.error('Failed to search beneficiaries:', error);
      }
    },
  },
});
