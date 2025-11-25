export interface Transfer {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  fromAccountNumber: string;
  toAccountNumber: string;
  amount: number;
  currency: string;
  description: string;
  date: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  transferType: 'internal' | 'external' | 'international';
  fee?: number;
  exchangeRate?: number;
  scheduledDate?: Date;
  recurring?: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface TransferRequest {
  fromAccountId: string;
  toAccountNumber: string;
  amount: number;
  description: string;
  transferType: 'internal' | 'external' | 'international';
  scheduledDate?: Date;
  recurring?: boolean;
  frequency?: string;
}
