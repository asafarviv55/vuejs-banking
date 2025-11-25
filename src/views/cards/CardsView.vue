<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCardStore } from '@/stores/cardStore';
import { useRouter } from 'vue-router';

const cardStore = useCardStore();
const router = useRouter();
const selectedCard = ref<string | null>(null);

onMounted(() => {
  cardStore.fetchCards();
});

const blockCard = async (id: string) => {
  if (confirm('Are you sure you want to block this card?')) {
    await cardStore.blockCard(id, 'User requested');
  }
};

const reportLostOrStolen = async (id: string, type: 'lost' | 'stolen') => {
  if (confirm(`Report this card as ${type}?`)) {
    if (type === 'lost') {
      await cardStore.reportLost(id);
    } else {
      await cardStore.reportStolen(id);
    }
  }
};

const viewTransactions = (cardId: string) => {
  cardStore.fetchCardTransactions(cardId);
  selectedCard.value = cardId;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const maskCardNumber = (cardNumber: string) => {
  return '**** **** **** ' + cardNumber.slice(-4);
};
</script>

<template>
  <div class="cards-container">
    <div class="header">
      <h1>My Cards</h1>
      <button class="btn btn-primary" @click="router.push('/cards/apply')">Apply for New Card</button>
    </div>

    <div class="cards-grid">
      <div v-for="card in cardStore.cards" :key="card.id" class="card-item" :class="'card-' + card.cardType">
        <div class="card-visual">
          <div class="card-brand">{{ card.cardBrand.toUpperCase() }}</div>
          <div class="card-number">{{ maskCardNumber(card.cardNumber) }}</div>
          <div class="card-holder">{{ card.holderName }}</div>
          <div class="card-expiry">Expires: {{ new Date(card.expiryDate).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' }) }}</div>
          <span :class="'badge position-absolute top-0 end-0 m-2 bg-' + (card.status === 'active' ? 'success' : 'danger')">
            {{ card.status }}
          </span>
        </div>
        <div class="card-details">
          <div v-if="card.cardType === 'credit'" class="credit-info">
            <div class="info-row">
              <span>Credit Limit:</span>
              <span>{{ formatCurrency(card.creditLimit || 0) }}</span>
            </div>
            <div class="info-row">
              <span>Available:</span>
              <span>{{ formatCurrency(card.availableCredit || 0) }}</span>
            </div>
            <div class="info-row">
              <span>Outstanding:</span>
              <span class="text-danger">{{ formatCurrency(card.outstandingBalance || 0) }}</span>
            </div>
          </div>
          <div class="card-actions">
            <button class="btn btn-sm btn-outline-primary" @click="viewTransactions(card.id)">Transactions</button>
            <button v-if="card.status === 'active'" class="btn btn-sm btn-warning" @click="blockCard(card.id)">Block</button>
            <button class="btn btn-sm btn-danger" @click="reportLostOrStolen(card.id, 'lost')">Report Lost</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedCard && cardStore.cardTransactions.length > 0" class="transactions-section mt-4">
      <h3>Card Transactions</h3>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Merchant</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="txn in cardStore.cardTransactions" :key="txn.id">
              <td>{{ new Date(txn.date).toLocaleDateString() }}</td>
              <td>{{ txn.merchant }}</td>
              <td>{{ txn.category }}</td>
              <td>{{ formatCurrency(txn.amount) }}</td>
              <td><span :class="'badge bg-' + (txn.status === 'posted' ? 'success' : 'warning')">{{ txn.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cards-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
}
.card-item {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.card-visual {
  padding: 30px;
  color: white;
  position: relative;
  min-height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.card-item.card-credit .card-visual {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}
.card-item.card-debit .card-visual {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}
.card-brand {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 30px;
}
.card-number {
  font-size: 20px;
  letter-spacing: 2px;
  margin-bottom: 20px;
  font-family: 'Courier New', monospace;
}
.card-holder {
  font-size: 14px;
  text-transform: uppercase;
}
.card-expiry {
  font-size: 12px;
  margin-top: 5px;
}
.card-details {
  background: white;
  padding: 20px;
}
.credit-info .info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.card-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  flex-wrap: wrap;
}
.transactions-section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
