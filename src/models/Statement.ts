export interface Statement {
  id: string;
  accountId: string;
  statementDate: Date;
  startDate: Date;
  endDate: Date;
  openingBalance: number;
  closingBalance: number;
  totalCredits: number;
  totalDebits: number;
  transactionCount: number;
  fileUrl?: string;
  format: 'pdf' | 'excel' | 'csv';
}

export interface StatementRequest {
  accountId: string;
  startDate: Date;
  endDate: Date;
  format: 'pdf' | 'excel' | 'csv';
  includeDetails?: boolean;
}
