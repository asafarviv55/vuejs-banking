import { ApiService } from './api';
import type { Card, CardTransaction } from '@/models/Card';

export class CardService {
  static async getCards(): Promise<Card[]> {
    return ApiService.get<Card[]>('/cards');
  }

  static async getCardById(id: string): Promise<Card> {
    return ApiService.get<Card>(`/cards/${id}`);
  }

  static async applyForCard(application: Partial<Card>): Promise<Card> {
    return ApiService.post<Card>('/cards/apply', application);
  }

  static async activateCard(id: string): Promise<Card> {
    return ApiService.put<Card>(`/cards/${id}/activate`, {});
  }

  static async blockCard(id: string, reason: string): Promise<Card> {
    return ApiService.put<Card>(`/cards/${id}/block`, { reason });
  }

  static async unblockCard(id: string): Promise<Card> {
    return ApiService.put<Card>(`/cards/${id}/unblock`, {});
  }

  static async reportLost(id: string): Promise<Card> {
    return ApiService.put<Card>(`/cards/${id}/report-lost`, {});
  }

  static async reportStolen(id: string): Promise<Card> {
    return ApiService.put<Card>(`/cards/${id}/report-stolen`, {});
  }

  static async getCardTransactions(cardId: string): Promise<CardTransaction[]> {
    return ApiService.get<CardTransaction[]>(`/cards/${cardId}/transactions`);
  }

  static async updateCreditLimit(id: string, newLimit: number): Promise<Card> {
    return ApiService.put<Card>(`/cards/${id}/credit-limit`, { limit: newLimit });
  }

  static async setPIN(id: string, pin: string): Promise<void> {
    return ApiService.put<void>(`/cards/${id}/pin`, { pin });
  }
}
