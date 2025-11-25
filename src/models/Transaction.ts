export interface Transaction {
  id: string;
  accountId: string;
  type: 'debit' | 'credit';
  category: 'transfer' | 'payment' | 'deposit' | 'withdrawal' | 'fee' | 'interest';
  amount: number;
  currency: string;
  description: string;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
  balance: number;
  reference?: string;
  merchant?: string;
  location?: string;
}

export interface TransactionFilter {
  accountId?: string;
  startDate?: Date;
  endDate?: Date;
  type?: string;
  category?: string;
  minAmount?: number;
  maxAmount?: number;
}
