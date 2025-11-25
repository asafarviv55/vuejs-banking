<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAccountStore } from '@/stores/accountStore';
import { useTransactionStore } from '@/stores/transactionStore';
import { useCardStore } from '@/stores/cardStore';
import { useLoanStore } from '@/stores/loanStore';

const router = useRouter();
const accountStore = useAccountStore();
const transactionStore = useTransactionStore();
const cardStore = useCardStore();
const loanStore = useLoanStore();

onMounted(() => {
  accountStore.fetchAccounts();
  accountStore.fetchSummary();
  transactionStore.fetchTransactions();
  cardStore.fetchCards();
  loanStore.fetchLoans();
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};
</script>

<template>
  <div class="home">
    <div class="hero-section">
      <h1>Welcome to Your Banking Dashboard</h1>
      <p>Manage your finances with ease</p>
    </div>

    <div class="quick-stats">
      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <h3>Total Balance</h3>
        <p class="stat-value">{{ formatCurrency(accountStore.totalBalance) }}</p>
        <button class="btn btn-sm btn-outline-primary" @click="router.push('/accounts')">
          View Accounts
        </button>
      </div>

      <div class="stat-card">
        <div class="stat-icon">💳</div>
        <h3>Active Cards</h3>
        <p class="stat-value">{{ cardStore.activeCards.length }}</p>
        <button class="btn btn-sm btn-outline-primary" @click="router.push('/cards')">
          Manage Cards
        </button>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <h3>Recent Transactions</h3>
        <p class="stat-value">{{ transactionStore.transactions.length }}</p>
        <button class="btn btn-sm btn-outline-primary" @click="router.push('/transactions')">
          View All
        </button>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🏦</div>
        <h3>Active Loans</h3>
        <p class="stat-value">{{ loanStore.activeLoans.length }}</p>
        <button class="btn btn-sm btn-outline-primary" @click="router.push('/loans')">
          View Loans
        </button>
      </div>
    </div>

    <div class="quick-actions">
      <h2>Quick Actions</h2>
      <div class="actions-grid">
        <div class="action-card" @click="router.push('/transfers')">
          <div class="action-icon">💸</div>
          <h4>Transfer Funds</h4>
          <p>Send money to anyone</p>
        </div>

        <div class="action-card" @click="router.push('/bills')">
          <div class="action-icon">📄</div>
          <h4>Pay Bills</h4>
          <p>Manage bill payments</p>
        </div>

        <div class="action-card" @click="router.push('/investments')">
          <div class="action-icon">📈</div>
          <h4>Investments</h4>
          <p>Track your portfolio</p>
        </div>

        <div class="action-card" @click="router.push('/budgets')">
          <div class="action-icon">🎯</div>
          <h4>Budgets</h4>
          <p>Manage your spending</p>
        </div>
      </div>
    </div>

    <div class="features-section">
      <h2>Banking Features</h2>
      <div class="features-list">
        <div class="feature-item">
          <h5>Account Management</h5>
          <p>Multiple account types with real-time balance tracking</p>
        </div>
        <div class="feature-item">
          <h5>Transaction History</h5>
          <p>Detailed transaction records with advanced filtering</p>
        </div>
        <div class="feature-item">
          <h5>Fund Transfers</h5>
          <p>Internal, external, and international transfers</p>
        </div>
        <div class="feature-item">
          <h5>Bill Payments</h5>
          <p>Pay bills with auto-pay and scheduling options</p>
        </div>
        <div class="feature-item">
          <h5>Card Management</h5>
          <p>Manage debit and credit cards with transaction tracking</p>
        </div>
        <div class="feature-item">
          <h5>Loan Services</h5>
          <p>Apply for loans and track payments</p>
        </div>
        <div class="feature-item">
          <h5>Investment Portfolio</h5>
          <p>Buy and sell stocks, bonds, and mutual funds</p>
        </div>
        <div class="feature-item">
          <h5>Beneficiary Management</h5>
          <p>Save and manage payment recipients</p>
        </div>
        <div class="feature-item">
          <h5>Budget Tracking</h5>
          <p>Set budgets and monitor spending by category</p>
        </div>
        <div class="feature-item">
          <h5>Account Statements</h5>
          <p>Generate and download statements in multiple formats</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  margin-bottom: 40px;
}

.hero-section h1 {
  font-size: 36px;
  margin-bottom: 10px;
}

.hero-section p {
  font-size: 18px;
  opacity: 0.9;
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.stat-card h3 {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.quick-actions {
  margin-bottom: 40px;
}

.quick-actions h2 {
  margin-bottom: 20px;
  text-align: center;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.action-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.action-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.action-card h4 {
  font-size: 18px;
  margin-bottom: 8px;
}

.action-card p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.features-section {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.features-section h2 {
  text-align: center;
  margin-bottom: 30px;
}

.features-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.feature-item {
  padding: 20px;
  border-left: 4px solid #667eea;
  background: #f8f9fa;
  border-radius: 8px;
}

.feature-item h5 {
  font-size: 16px;
  margin-bottom: 8px;
  color: #667eea;
}

.feature-item p {
  color: #666;
  font-size: 14px;
  margin: 0;
}
</style>
