import { ApiService } from './api';
import type { Beneficiary, BeneficiaryRequest } from '@/models/Beneficiary';

export class BeneficiaryService {
  static async getBeneficiaries(): Promise<Beneficiary[]> {
    return ApiService.get<Beneficiary[]>('/beneficiaries');
  }

  static async getBeneficiaryById(id: string): Promise<Beneficiary> {
    return ApiService.get<Beneficiary>(`/beneficiaries/${id}`);
  }

  static async addBeneficiary(beneficiary: BeneficiaryRequest): Promise<Beneficiary> {
    return ApiService.post<Beneficiary>('/beneficiaries', beneficiary);
  }

  static async updateBeneficiary(id: string, beneficiary: Partial<Beneficiary>): Promise<Beneficiary> {
    return ApiService.put<Beneficiary>(`/beneficiaries/${id}`, beneficiary);
  }

  static async deleteBeneficiary(id: string): Promise<void> {
    return ApiService.delete<void>(`/beneficiaries/${id}`);
  }

  static async verifyBeneficiary(id: string): Promise<Beneficiary> {
    return ApiService.put<Beneficiary>(`/beneficiaries/${id}/verify`, {});
  }

  static async searchBeneficiaries(query: string): Promise<Beneficiary[]> {
    return ApiService.get<Beneficiary[]>(`/beneficiaries/search?q=${query}`);
  }
}
