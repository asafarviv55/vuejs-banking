import { ApiService } from './api';
import type { Statement, StatementRequest } from '@/models/Statement';

export class StatementService {
  static async getStatements(accountId: string): Promise<Statement[]> {
    return ApiService.get<Statement[]>(`/statements?accountId=${accountId}`);
  }

  static async getStatementById(id: string): Promise<Statement> {
    return ApiService.get<Statement>(`/statements/${id}`);
  }

  static async generateStatement(request: StatementRequest): Promise<Statement> {
    return ApiService.post<Statement>('/statements/generate', request);
  }

  static async downloadStatement(id: string): Promise<Blob> {
    const response = await fetch(`/api/statements/${id}/download`);
    return response.blob();
  }

  static async emailStatement(id: string, email: string): Promise<void> {
    return ApiService.post<void>(`/statements/${id}/email`, { email });
  }
}
