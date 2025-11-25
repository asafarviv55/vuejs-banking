import { defineStore } from 'pinia';
import type { Card, CardTransaction } from '@/models/Card';
import { CardService } from '@/services/cardService';

interface CardState {
  cards: Card[];
  currentCard: Card | null;
  cardTransactions: CardTransaction[];
  loading: boolean;
  error: string | null;
}

export const useCardStore = defineStore('card', {
  state: (): CardState => ({
    cards: [],
    currentCard: null,
    cardTransactions: [],
    loading: false,
    error: null,
  }),

  getters: {
    activeCards: (state) => state.cards.filter(c => c.status === 'active'),
    blockedCards: (state) => state.cards.filter(c => c.status === 'blocked'),
    creditCards: (state) => state.cards.filter(c => c.cardType === 'credit'),
    debitCards: (state) => state.cards.filter(c => c.cardType === 'debit'),
    totalCreditLimit: (state) => state.cards
      .filter(c => c.cardType === 'credit')
      .reduce((sum, c) => sum + (c.creditLimit || 0), 0),
    totalAvailableCredit: (state) => state.cards
      .filter(c => c.cardType === 'credit')
      .reduce((sum, c) => sum + (c.availableCredit || 0), 0),
  },

  actions: {
    async fetchCards() {
      this.loading = true;
      this.error = null;
      try {
        this.cards = await CardService.getCards();
      } catch (error) {
        this.error = 'Failed to fetch cards';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchCardTransactions(cardId: string) {
      this.loading = true;
      this.error = null;
      try {
        this.cardTransactions = await CardService.getCardTransactions(cardId);
      } catch (error) {
        this.error = 'Failed to fetch card transactions';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async blockCard(id: string, reason: string) {
      try {
        const blocked = await CardService.blockCard(id, reason);
        const index = this.cards.findIndex(c => c.id === id);
        if (index !== -1) {
          this.cards[index] = blocked;
        }
        return blocked;
      } catch (error) {
        console.error('Failed to block card:', error);
        throw error;
      }
    },

    async unblockCard(id: string) {
      try {
        const unblocked = await CardService.unblockCard(id);
        const index = this.cards.findIndex(c => c.id === id);
        if (index !== -1) {
          this.cards[index] = unblocked;
        }
        return unblocked;
      } catch (error) {
        console.error('Failed to unblock card:', error);
        throw error;
      }
    },

    async reportLost(id: string) {
      try {
        const updated = await CardService.reportLost(id);
        const index = this.cards.findIndex(c => c.id === id);
        if (index !== -1) {
          this.cards[index] = updated;
        }
        return updated;
      } catch (error) {
        console.error('Failed to report card as lost:', error);
        throw error;
      }
    },

    async reportStolen(id: string) {
      try {
        const updated = await CardService.reportStolen(id);
        const index = this.cards.findIndex(c => c.id === id);
        if (index !== -1) {
          this.cards[index] = updated;
        }
        return updated;
      } catch (error) {
        console.error('Failed to report card as stolen:', error);
        throw error;
      }
    },

    setCurrentCard(card: Card | null) {
      this.currentCard = card;
    },
  },
});
