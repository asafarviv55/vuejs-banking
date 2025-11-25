<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useBudgetStore } from '@/stores/budgetStore';
import { useAccountStore } from '@/stores/accountStore';

const budgetStore = useBudgetStore();
const accountStore = useAccountStore();
const showForm = ref(false);

const budgetForm = ref({
  accountId: '',
  category: '',
  budgetAmount: 0,
  period: 'monthly' as 'weekly' | 'monthly' | 'quarterly' | 'yearly',
  alertThreshold: 80
});

onMounted(() => {
  budgetStore.fetchBudgets();
  budgetStore.fetchCategories();
  accountStore.fetchAccounts();
});

const submitBudget = async () => {
  try {
    const startDate = new Date();
    const endDate = new Date();

    if (budgetForm.value.period === 'weekly') {
      endDate.setDate(endDate.getDate() + 7);
    } else if (budgetForm.value.period === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (budgetForm.value.period === 'quarterly') {
      endDate.setMonth(endDate.getMonth() + 3);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    await budgetStore.createBudget({
      ...budgetForm.value,
      startDate,
      endDate,
      spentAmount: 0,
      status: 'on_track'
    });

    showForm.value = false;
    budgetForm.value = {
      accountId: '',
      category: '',
      budgetAmount: 0,
      period: 'monthly',
      alertThreshold: 80
    };
  } catch (error) {
    console.error('Failed to create budget:', error);
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const getProgressPercent = (budget: any) => {
  return (budget.spentAmount / budget.budgetAmount) * 100;
};

const getProgressClass = (budget: any) => {
  const percent = getProgressPercent(budget);
  if (percent >= 100) return 'bg-danger';
  if (percent >= budget.alertThreshold) return 'bg-warning';
  return 'bg-success';
};
</script>

<template>
  <div class="budget-container">
    <div class="header">
      <h1>Budget Management</h1>
      <button class="btn btn-primary" @click="showForm = !showForm">
        {{ showForm ? 'Cancel' : 'Create Budget' }}
      </button>
    </div>

    <div class="budget-summary">
      <div class="summary-card">
        <h4>Total Budgeted</h4>
        <p class="amount">{{ formatCurrency(budgetStore.totalBudgeted) }}</p>
      </div>
      <div class="summary-card">
        <h4>Total Spent</h4>
        <p class="amount spent">{{ formatCurrency(budgetStore.totalSpent) }}</p>
      </div>
      <div class="summary-card">
        <h4>Remaining</h4>
        <p class="amount">{{ formatCurrency(budgetStore.totalBudgeted - budgetStore.totalSpent) }}</p>
      </div>
    </div>

    <div v-if="showForm" class="budget-form">
      <h3>Create New Budget</h3>
      <form @submit.prevent="submitBudget">
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Account</label>
            <select v-model="budgetForm.accountId" class="form-select" required>
              <option value="">Select account</option>
              <option v-for="account in accountStore.activeAccounts" :key="account.id" :value="account.id">
                {{ account.accountName }}
              </option>
            </select>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Category</label>
            <select v-model="budgetForm.category" class="form-select" required>
              <option value="">Select category</option>
              <option v-for="category in budgetStore.categories" :key="category.name" :value="category.name">
                {{ category.name }}
              </option>
              <option value="Groceries">Groceries</option>
              <option value="Dining">Dining</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4 mb-3">
            <label class="form-label">Budget Amount</label>
            <input v-model.number="budgetForm.budgetAmount" type="number" step="0.01" class="form-control" required />
          </div>
          <div class="col-md-4 mb-3">
            <label class="form-label">Period</label>
            <select v-model="budgetForm.period" class="form-select" required>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div class="col-md-4 mb-3">
            <label class="form-label">Alert Threshold (%)</label>
            <input v-model.number="budgetForm.alertThreshold" type="number" min="0" max="100" class="form-control" required />
          </div>
        </div>
        <button type="submit" class="btn btn-primary">Create Budget</button>
      </form>
    </div>

    <div class="budgets-list">
      <h3>Active Budgets</h3>
      <div class="budget-cards">
        <div v-for="budget in budgetStore.activeBudgets" :key="budget.id" class="budget-card">
          <div class="budget-header">
            <h4>{{ budget.category }}</h4>
            <span :class="'badge bg-' + (budget.status === 'on_track' ? 'success' : budget.status === 'warning' ? 'warning' : 'danger')">
              {{ budget.status }}
            </span>
          </div>
          <div class="budget-amounts">
            <div class="amount-item">
              <span>Budgeted:</span>
              <strong>{{ formatCurrency(budget.budgetAmount) }}</strong>
            </div>
            <div class="amount-item">
              <span>Spent:</span>
              <strong>{{ formatCurrency(budget.spentAmount) }}</strong>
            </div>
            <div class="amount-item">
              <span>Remaining:</span>
              <strong>{{ formatCurrency(budget.budgetAmount - budget.spentAmount) }}</strong>
            </div>
          </div>
          <div class="progress mt-3">
            <div :class="'progress-bar ' + getProgressClass(budget)" :style="{ width: Math.min(getProgressPercent(budget), 100) + '%' }">
              {{ getProgressPercent(budget).toFixed(0) }}%
            </div>
          </div>
          <div class="budget-footer">
            <small>Period: {{ budget.period }} | Ends: {{ new Date(budget.endDate).toLocaleDateString() }}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.budget-container {
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
.budget-summary {
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
.summary-card .amount.spent {
  color: #dc3545;
}
.budget-form {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}
.budgets-list {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.budget-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 20px;
}
.budget-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: #f8f9fa;
}
.budget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.budget-amounts {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}
.amount-item {
  display: flex;
  justify-content: space-between;
}
.budget-footer {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #ddd;
  text-align: center;
}
</style>
