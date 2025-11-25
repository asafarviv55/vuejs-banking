export interface Budget {
  id: string;
  accountId: string;
  category: string;
  budgetAmount: number;
  spentAmount: number;
  period: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate: Date;
  alertThreshold: number; // percentage
  status: 'on_track' | 'warning' | 'exceeded';
}

export interface BudgetCategory {
  name: string;
  icon: string;
  color: string;
  defaultAmount?: number;
}

export interface SpendingAnalytics {
  totalSpending: number;
  categoryBreakdown: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  monthlyComparison: {
    month: string;
    amount: number;
  }[];
  topMerchants: {
    name: string;
    amount: number;
    count: number;
  }[];
}
