export interface Investment {
  id: string;
  accountId: string;
  symbol: string;
  name: string;
  type: 'stock' | 'bond' | 'mutual_fund' | 'etf' | 'crypto';
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: Date;
  currentValue: number;
  totalGainLoss: number;
  percentageChange: number;
}

export interface Portfolio {
  totalValue: number;
  totalInvested: number;
  totalGainLoss: number;
  percentageReturn: number;
  investments: Investment[];
  diversification: {
    stocks: number;
    bonds: number;
    mutualFunds: number;
    etfs: number;
    crypto: number;
  };
}

export interface InvestmentTransaction {
  id: string;
  investmentId: string;
  type: 'buy' | 'sell';
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  fees: number;
  date: Date;
}
