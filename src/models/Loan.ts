export interface Loan {
  id: string;
  loanType: 'personal' | 'home' | 'auto' | 'business' | 'student';
  accountId: string;
  principalAmount: number;
  outstandingBalance: number;
  interestRate: number;
  term: number; // in months
  monthlyPayment: number;
  startDate: Date;
  endDate: Date;
  nextPaymentDate: Date;
  status: 'active' | 'paid_off' | 'defaulted' | 'pending_approval';
  totalPaid: number;
  totalInterestPaid: number;
  remainingPayments: number;
}

export interface LoanApplication {
  id?: string;
  loanType: 'personal' | 'home' | 'auto' | 'business' | 'student';
  requestedAmount: number;
  term: number;
  purpose: string;
  employmentStatus: string;
  annualIncome: number;
  status?: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  applicationDate?: Date;
}

export interface LoanPayment {
  id: string;
  loanId: string;
  amount: number;
  paymentDate: Date;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
}
