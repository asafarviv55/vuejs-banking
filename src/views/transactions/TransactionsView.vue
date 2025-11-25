<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useAccountStore } from '@/stores/accountStore';
import { useRoute } from 'vue-router';

const transactionStore = useTransactionStore();
const accountStore = useAccountStore();
const route = useRoute();

const searchQuery = ref('');
const selectedCategory = ref('all');
const selectedType = ref('all');

onMounted(() => {
  accountStore.fetchAccounts();
  const accountId = route.query.account as string;
  if (accountId) {
    transactionStore.fetchAccountTransactions(accountId);
  } else {
    transactionStore.fetchTransactions();
  }
});

const filteredTransactions = computed(() => {
  let filtered = transactionStore.transactions;

  if (selectedType.value !== 'all') {
    filtered = filtered.filter(t => t.type === selectedType.value);
  }

  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(t => t.category === selectedCategory.value);
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(t =>
      t.description.toLowerCase().includes(query) ||
      t.merchant?.toLowerCase().includes(query)
    );
  }

  return filtered;
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getTypeClass = (type: string) => {
  return type === 'credit' ? 'credit' : 'debit';
};

const getStatusBadge = (status: string) => {
  return {
    'completed': 'badge bg-success',
    'pending': 'badge bg-warning',
    'failed': 'badge bg-danger'
  }[status] || 'badge bg-secondary';
};
</script>

<template>
  <div class="transactions-container">
    <div class="header">
      <h1>Transaction History</h1>
    </div>

    <div class="stats-row">
      <div class="stat-card credit-card">
        <h4>Total Credits</h4>
        <p>{{ formatCurrency(transactionStore.totalCredit) }}</p>
      </div>
      <div class="stat-card debit-card">
        <h4>Total Debits</h4>
        <p>{{ formatCurrency(transactionStore.totalDebit) }}</p>
      </div>
      <div class="stat-card">
        <h4>Total Transactions</h4>
        <p>{{ transactionStore.transactions.length }}</p>
      </div>
    </div>

    <div class="filters-section">
      <input
        v-model="searchQuery"
        type="text"
        class="form-control"
        placeholder="Search transactions..."
      />

      <select v-model="selectedType" class="form-select">
        <option value="all">All Types</option>
        <option value="credit">Credit</option>
        <option value="debit">Debit</option>
      </select>

      <select v-model="selectedCategory" class="form-select">
        <option value="all">All Categories</option>
        <option value="transfer">Transfer</option>
        <option value="payment">Payment</option>
        <option value="deposit">Deposit</option>
        <option value="withdrawal">Withdrawal</option>
        <option value="fee">Fee</option>
        <option value="interest">Interest</option>
      </select>
    </div>

    <div v-if="transactionStore.loading" class="text-center">
      <div class="spinner-border" role="status"></div>
    </div>

    <div v-else-if="transactionStore.error" class="alert alert-danger">
      {{ transactionStore.error }}
    </div>

    <div v-else class="transactions-table">
      <table class="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Balance</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in filteredTransactions" :key="transaction.id">
            <td>{{ formatDate(transaction.date) }}</td>
            <td>
              <div class="description">
                {{ transaction.description }}
                <small v-if="transaction.merchant">{{ transaction.merchant }}</small>
              </div>
            </td>
            <td><span class="badge bg-secondary">{{ transaction.category }}</span></td>
            <td>
              <span :class="['type-badge', getTypeClass(transaction.type)]">
                {{ transaction.type }}
              </span>
            </td>
            <td :class="['amount', getTypeClass(transaction.type)]">
              {{ transaction.type === 'credit' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
            </td>
            <td>{{ formatCurrency(transaction.balance) }}</td>
            <td><span :class="getStatusBadge(transaction.status)">{{ transaction.status }}</span></td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredTransactions.length === 0" class="text-center empty-state">
        <p>No transactions found</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.transactions-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  margin-bottom: 30px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.stat-card h4 {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.stat-card p {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.credit-card p {
  color: #28a745;
}

.debit-card p {
  color: #dc3545;
}

.filters-section {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filters-section input,
.filters-section select {
  flex: 1;
  min-width: 200px;
}

.transactions-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.table {
  margin: 0;
}

.table thead {
  background: #f8f9fa;
}

.description small {
  display: block;
  color: #666;
  font-size: 12px;
}

.type-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.type-badge.credit {
  background: #d4edda;
  color: #155724;
}

.type-badge.debit {
  background: #f8d7da;
  color: #721c24;
}

.amount.credit {
  color: #28a745;
  font-weight: bold;
}

.amount.debit {
  color: #dc3545;
  font-weight: bold;
}

.empty-state {
  padding: 40px;
  color: #666;
}
</style>
