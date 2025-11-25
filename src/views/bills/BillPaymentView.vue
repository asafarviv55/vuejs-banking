<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useBillPaymentStore } from '@/stores/billPaymentStore';
import { useAccountStore } from '@/stores/accountStore';

const billStore = useBillPaymentStore();
const accountStore = useAccountStore();
const showForm = ref(false);
const searchQuery = ref('');

const paymentForm = ref({
  billerId: '',
  accountId: '',
  amount: 0,
  paymentDate: new Date().toISOString().split('T')[0],
  recurring: false,
  autoPayEnabled: false
});

onMounted(() => {
  billStore.fetchBillers();
  billStore.fetchPayments();
  accountStore.fetchAccounts();
});

const searchBillers = () => {
  if (searchQuery.value) {
    billStore.searchBillers(searchQuery.value);
  } else {
    billStore.fetchBillers();
  }
};

const submitPayment = async () => {
  try {
    await billStore.createPayment(paymentForm.value);
    showForm.value = false;
    paymentForm.value = {
      billerId: '',
      accountId: '',
      amount: 0,
      paymentDate: new Date().toISOString().split('T')[0],
      recurring: false,
      autoPayEnabled: false
    };
  } catch (error) {
    console.error('Payment failed:', error);
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};
</script>

<template>
  <div class="bill-payment-container">
    <div class="header">
      <h1>Bill Payments</h1>
      <button class="btn btn-primary" @click="showForm = !showForm">
        {{ showForm ? 'Cancel' : 'Pay Bill' }}
      </button>
    </div>

    <div v-if="showForm" class="payment-form">
      <h3>Pay a Bill</h3>
      <form @submit.prevent="submitPayment">
        <div class="mb-3">
          <label class="form-label">Search Biller</label>
          <div class="input-group">
            <input v-model="searchQuery" class="form-control" placeholder="Search for a biller..." />
            <button class="btn btn-outline-secondary" type="button" @click="searchBillers">Search</button>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Biller</label>
          <select v-model="paymentForm.billerId" class="form-select" required>
            <option value="">Select biller</option>
            <option v-for="biller in billStore.billers" :key="biller.id" :value="biller.id">
              {{ biller.name }} - {{ biller.category }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">From Account</label>
          <select v-model="paymentForm.accountId" class="form-select" required>
            <option value="">Select account</option>
            <option v-for="account in accountStore.activeAccounts" :key="account.id" :value="account.id">
              {{ account.accountName }} - {{ formatCurrency(account.balance) }}
            </option>
          </select>
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Amount</label>
            <input v-model.number="paymentForm.amount" type="number" step="0.01" class="form-control" required />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Payment Date</label>
            <input v-model="paymentForm.paymentDate" type="date" class="form-control" required />
          </div>
        </div>
        <div class="mb-3 form-check">
          <input v-model="paymentForm.autoPayEnabled" type="checkbox" class="form-check-input" id="autopay" />
          <label class="form-check-label" for="autopay">Enable Auto-Pay</label>
        </div>
        <button type="submit" class="btn btn-primary">Pay Now</button>
      </form>
    </div>

    <div class="payments-list mt-4">
      <h3>Recent Payments</h3>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Biller</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Auto-Pay</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="payment in billStore.payments" :key="payment.id">
              <td>{{ payment.billerName }}</td>
              <td>{{ formatCurrency(payment.amount) }}</td>
              <td>{{ formatDate(payment.dueDate) }}</td>
              <td><span :class="'badge bg-' + (payment.status === 'paid' ? 'success' : 'warning')">{{ payment.status }}</span></td>
              <td>{{ payment.autoPayEnabled ? 'Yes' : 'No' }}</td>
              <td>
                <button v-if="payment.status === 'scheduled'" class="btn btn-sm btn-danger" @click="billStore.cancelPayment(payment.id)">
                  Cancel
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bill-payment-container {
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
.payment-form {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}
.payments-list {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
