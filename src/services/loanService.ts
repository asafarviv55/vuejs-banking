import { ApiService } from './api';
import type { Loan, LoanApplication, LoanPayment } from '@/models/Loan';

export class LoanService {
  static async getLoans(): Promise<Loan[]> {
    return ApiService.get<Loan[]>('/loans');
  }

  static async getLoanById(id: string): Promise<Loan> {
    return ApiService.get<Loan>(`/loans/${id}`);
  }

  static async applyForLoan(application: LoanApplication): Promise<LoanApplication> {
    return ApiService.post<LoanApplication>('/loans/apply', application);
  }

  static async getLoanApplications(): Promise<LoanApplication[]> {
    return ApiService.get<LoanApplication[]>('/loans/applications');
  }

  static async getLoanPayments(loanId: string): Promise<LoanPayment[]> {
    return ApiService.get<LoanPayment[]>(`/loans/${loanId}/payments`);
  }

  static async makePayment(loanId: string, amount: number): Promise<LoanPayment> {
    return ApiService.post<LoanPayment>(`/loans/${loanId}/payments`, { amount });
  }

  static async calculateEMI(principal: number, rate: number, term: number): Promise<number> {
    const result = await ApiService.post<{ emi: number }>('/loans/calculate-emi', {
      principal,
      rate,
      term,
    });
    return result.emi;
  }

  static async getAmortizationSchedule(loanId: string): Promise<LoanPayment[]> {
    return ApiService.get<LoanPayment[]>(`/loans/${loanId}/amortization`);
  }
}
