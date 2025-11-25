<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useInvestmentStore } from '@/stores/investmentStore';

const investmentStore = useInvestmentStore();
const showBuyForm = ref(false);
const buyForm = ref({
  symbol: '',
  quantity: 0,
  accountId: ''
});

onMounted(() => {
  investmentStore.fetchPortfolio();
});

const submitBuy = async () => {
  try {
    await investmentStore.buyInvestment(buyForm.value.symbol, buyForm.value.quantity, buyForm.value.accountId);
    showBuyForm.value = false;
    buyForm.value = { symbol: '', quantity: 0, accountId: '' };
  } catch (error) {
    console.error('Buy failed:', error);
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const formatPercentage = (value: number) => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};
</script>

<template>
  <div class="investments-container">
    <div class="header">
      <h1>Investment Portfolio</h1>
      <button class="btn btn-primary" @click="showBuyForm = !showBuyForm">
        {{ showBuyForm ? 'Cancel' : 'Buy Investment' }}
      </button>
    </div>

    <div v-if="investmentStore.portfolio" class="portfolio-summary">
      <div class="summary-card">
        <h4>Total Value</h4>
        <p class="amount">{{ formatCurrency(investmentStore.portfolio.totalValue) }}</p>
      </div>
      <div class="summary-card">
        <h4>Total Invested</h4>
        <p class="amount">{{ formatCurrency(investmentStore.portfolio.totalInvested) }}</p>
      </div>
      <div class="summary-card">
        <h4>Gain/Loss</h4>
        <p :class="'amount ' + (investmentStore.portfolio.totalGainLoss >= 0 ? 'gain' : 'loss')">
          {{ formatCurrency(investmentStore.portfolio.totalGainLoss) }}
        </p>
        <small>{{ formatPercentage(investmentStore.portfolio.percentageReturn) }}</small>
      </div>
    </div>

    <div v-if="showBuyForm" class="buy-form">
      <h3>Buy Investment</h3>
      <form @submit.prevent="submitBuy">
        <div class="mb-3">
          <label class="form-label">Symbol</label>
          <input v-model="buyForm.symbol" type="text" class="form-control" placeholder="e.g., AAPL" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Quantity</label>
          <input v-model.number="buyForm.quantity" type="number" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-primary">Buy Now</button>
      </form>
    </div>

    <div class="investments-list">
      <h3>Holdings</h3>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Name</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Purchase Price</th>
              <th>Current Price</th>
              <th>Current Value</th>
              <th>Gain/Loss</th>
              <th>Change %</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="investment in investmentStore.investments" :key="investment.id">
              <td><strong>{{ investment.symbol }}</strong></td>
              <td>{{ investment.name }}</td>
              <td><span class="badge bg-secondary">{{ investment.type }}</span></td>
              <td>{{ investment.quantity }}</td>
              <td>{{ formatCurrency(investment.purchasePrice) }}</td>
              <td>{{ formatCurrency(investment.currentPrice) }}</td>
              <td>{{ formatCurrency(investment.currentValue) }}</td>
              <td :class="investment.totalGainLoss >= 0 ? 'text-success' : 'text-danger'">
                {{ formatCurrency(investment.totalGainLoss) }}
              </td>
              <td :class="investment.percentageChange >= 0 ? 'text-success' : 'text-danger'">
                {{ formatPercentage(investment.percentageChange) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.investments-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
.portfolio-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}
.summary-card {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.summary-card h4 {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}
.summary-card .amount {
  font-size: 28px;
  font-weight: bold;
  margin: 0;
}
.summary-card .amount.gain {
  color: #28a745;
}
.summary-card .amount.loss {
  color: #dc3545;
}
.buy-form {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}
.investments-list {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
