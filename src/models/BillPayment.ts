export interface Biller {
  id: string;
  name: string;
  category: 'utilities' | 'telecom' | 'insurance' | 'loan' | 'credit_card' | 'subscription' | 'other';
  accountNumber: string;
  logo?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface BillPayment {
  id: string;
  billerId: string;
  billerName: string;
  accountId: string;
  amount: number;
  dueDate: Date;
  paymentDate?: Date;
  status: 'scheduled' | 'paid' | 'overdue' | 'cancelled';
  recurring: boolean;
  frequency?: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  autoPayEnabled: boolean;
  reference?: string;
}

export interface BillPaymentRequest {
  billerId: string;
  accountId: string;
  amount: number;
  paymentDate: Date;
  recurring?: boolean;
  frequency?: string;
  autoPayEnabled?: boolean;
}
