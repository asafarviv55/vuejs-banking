export interface Account {
  id: string;
  accountNumber: string;
  accountType: 'checking' | 'savings' | 'business' | 'investment';
  accountName: string;
  balance: number;
  currency: string;
  status: 'active' | 'inactive' | 'frozen';
  openedDate: Date;
  lastTransaction?: Date;
  interestRate?: number;
  overdraftLimit?: number;
}

export interface AccountSummary {
  totalAccounts: number;
  totalBalance: number;
  activeAccounts: number;
  inactiveAccounts: number;
}
