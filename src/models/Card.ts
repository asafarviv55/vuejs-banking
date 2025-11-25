export interface Card {
  id: string;
  cardNumber: string;
  cardType: 'debit' | 'credit' | 'prepaid';
  cardName: string;
  accountId: string;
  holderName: string;
  expiryDate: Date;
  cvv?: string;
  status: 'active' | 'blocked' | 'expired' | 'lost' | 'stolen';
  issuedDate: Date;
  creditLimit?: number;
  availableCredit?: number;
  outstandingBalance?: number;
  minimumPayment?: number;
  dueDate?: Date;
  rewardsPoints?: number;
  cardBrand: 'visa' | 'mastercard' | 'amex' | 'discover';
}

export interface CardTransaction {
  id: string;
  cardId: string;
  merchant: string;
  amount: number;
  currency: string;
  date: Date;
  category: string;
  status: 'posted' | 'pending' | 'declined';
  location?: string;
  description?: string;
}
