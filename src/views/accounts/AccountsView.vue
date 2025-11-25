<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAccountStore } from '@/stores/accountStore';
import { useRouter } from 'vue-router';

const accountStore = useAccountStore();
const router = useRouter();
const selectedAccountType = ref('all');

onMounted(() => {
  accountStore.fetchAccounts();
  accountStore.fetchSummary();
});

const filteredAccounts = () => {
  if (selectedAccountType.value === 'all') {
    return accountStore.accounts;
  }
  return accountStore.accounts.filter(acc => acc.accountType === selectedAccountType.value);
};

const viewDetails = (id: string) => {
  router.push(`/accounts/${id}`);
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const getStatusClass = (status: string) => {
  return {
    'active': 'badge bg-success',
    'inactive': 'badge bg-secondary',
    'frozen': 'badge bg-danger'
  }[status] || 'badge bg-secondary';
};
</script>

<template>
  <div class="accounts-container">
    <div class="header">
      <h1>My Accounts</h1>
      <button class="btn btn-primary" @click="router.push('/accounts/new')">
        Open New Account
      </button>
    </div>

    <div v-if="accountStore.summary" class="summary-cards">
      <div class="summary-card">
        <h3>Total Balance</h3>
        <p class="amount">{{ formatCurrency(accountStore.summary.totalBalance) }}</p>
      </div>
      <div class="summary-card">
        <h3>Total Accounts</h3>
        <p class="count">{{ accountStore.summary.totalAccounts }}</p>
      </div>
      <div class="summary-card">
        <h3>Active Accounts</h3>
        <p class="count">{{ accountStore.summary.activeAccounts }}</p>
      </div>
    </div>

    <div class="filter-section">
      <label>Filter by Type:</label>
      <select v-model="selectedAccountType" class="form-select">
        <option value="all">All Accounts</option>
        <option value="checking">Checking</option>
        <option value="savings">Savings</option>
        <option value="business">Business</option>
        <option value="investment">Investment</option>
      </select>
    </div>

    <div v-if="accountStore.loading" class="text-center">
      <div class="spinner-border" role="status"></div>
    </div>

    <div v-else-if="accountStore.error" class="alert alert-danger">
      {{ accountStore.error }}
    </div>

    <div v-else class="accounts-list">
      <div v-for="account in filteredAccounts()" :key="account.id" class="account-card">
        <div class="account-header">
          <div>
            <h4>{{ account.accountName }}</h4>
            <p class="account-number">{{ account.accountNumber }}</p>
          </div>
          <span :class="getStatusClass(account.status)">{{ account.status }}</span>
        </div>
        <div class="account-body">
          <div class="account-info">
            <span class="label">Type:</span>
            <span class="value">{{ account.accountType }}</span>
          </div>
          <div class="account-info">
            <span class="label">Balance:</span>
            <span class="value balance">{{ formatCurrency(account.balance) }}</span>
          </div>
          <div class="account-info">
            <span class="label">Currency:</span>
            <span class="value">{{ account.currency }}</span>
          </div>
        </div>
        <div class="account-footer">
          <button class="btn btn-sm btn-outline-primary" @click="viewDetails(account.id)">
            View Details
          </button>
          <button class="btn btn-sm btn-outline-secondary" @click="router.push(`/transactions?account=${account.id}`)">
            Transactions
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.accounts-container {
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

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.summary-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.summary-card h3 {
  font-size: 14px;
  margin-bottom: 10px;
  opacity: 0.9;
}

.summary-card .amount {
  font-size: 32px;
  font-weight: bold;
  margin: 0;
}

.summary-card .count {
  font-size: 36px;
  font-weight: bold;
  margin: 0;
}

.filter-section {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-section select {
  max-width: 200px;
}

.accounts-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.account-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: white;
  transition: box-shadow 0.3s;
}

.account-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.account-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.account-header h4 {
  margin: 0;
  font-size: 18px;
}

.account-number {
  color: #666;
  font-size: 14px;
  margin: 5px 0 0 0;
}

.account-body {
  margin-bottom: 15px;
}

.account-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.account-info .label {
  color: #666;
}

.account-info .value {
  font-weight: 500;
}

.account-info .balance {
  color: #28a745;
  font-size: 18px;
  font-weight: bold;
}

.account-footer {
  display: flex;
  gap: 10px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}
</style>
