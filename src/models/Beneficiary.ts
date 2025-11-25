export interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  bankCode?: string;
  swiftCode?: string;
  iban?: string;
  email?: string;
  phone?: string;
  type: 'personal' | 'business';
  country: string;
  currency: string;
  isVerified: boolean;
  addedDate: Date;
  lastUsed?: Date;
  nickname?: string;
}

export interface BeneficiaryRequest {
  name: string;
  accountNumber: string;
  bankName: string;
  bankCode?: string;
  type: 'personal' | 'business';
  country: string;
  currency: string;
  email?: string;
  phone?: string;
  nickname?: string;
}
