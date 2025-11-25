<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useLoanStore } from '@/stores/loanStore';
import { useRouter } from 'vue-router';

const loanStore = useLoanStore();
const router = useRouter();
const showPaymentForm = ref(false);
const selectedLoanId = ref('');
const paymentAmount = ref(0);

onMounted(() => {
  loanStore.fetchLoans();
  loanStore.fetchLoanApplications();
});

const makePayment = async () => {
  try {
    await loanStore.makePayment(selectedLoanId.value, paymentAmount.value);
    showPaymentForm.value = false;
    paymentAmount.value = 0;
  } catch (error) {
    console.error('Payment failed:', error);
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const calculateProgress = (loan: any) => {
  const paid = loan.principalAmount - loan.outstandingBalance;
  return (paid / loan.principalAmount) * 100;
};
</script>

<template>
  <div class="loans-container">
    <div class="header">
      <h1>My Loans</h1>
      <button class="btn btn-primary" @click="router.push('/loans/apply')">Apply for Loan</button>
    </div>

    <div class="loan-summary">
      <div class="summary-card">
        <h4>Total Outstanding</h4>
        <p class="amount">{{ formatCurrency(loanStore.totalOutstanding) }}</p>
      </div>
      <div class="summary-card">
        <h4>Monthly Payment</h4>
        <p class="amount">{{ formatCurrency(loanStore.totalMonthlyPayment) }}</p>
      </div>
      <div class="summary-card">
        <h4>Active Loans</h4>
        <p class="count">{{ loanStore.activeLoans.length }}</p>
      </div>
    </div>

    <div class="loans-list">
      <div v-for="loan in loanStore.activeLoans" :key="loan.id" class="loan-card">
        <div class="loan-header">
          <h4>{{ loan.loanType.toUpperCase() }} Loan</h4>
          <span class="badge bg-success">{{ loan.status }}</span>
        </div>
        <div class="loan-body">
          <div class="progress-section">
            <div class="progress">
              <div class="progress-bar" :style="{ width: calculateProgress(loan) + '%' }"></div>
            </div>
            <small>{{ calculateProgress(loan).toFixed(1) }}% paid</small>
          </div>
          <div class="loan-details">
            <div class="detail-row">
              <span>Principal Amount:</span>
              <span>{{ formatCurrency(loan.principalAmount) }}</span>
            </div>
            <div class="detail-row">
              <span>Outstanding Balance:</span>
              <span class="text-danger">{{ formatCurrency(loan.outstandingBalance) }}</span>
            </div>
            <div class="detail-row">
              <span>Interest Rate:</span>
              <span>{{ loan.interestRate }}%</span>
            </div>
            <div class="detail-row">
              <span>Monthly Payment:</span>
              <span>{{ formatCurrency(loan.monthlyPayment) }}</span>
            </div>
            <div class="detail-row">
              <span>Next Payment:</span>
              <span>{{ new Date(loan.nextPaymentDate).toLocaleDateString() }}</span>
            </div>
            <div class="detail-row">
              <span>Remaining Payments:</span>
              <span>{{ loan.remainingPayments }}</span>
            </div>
          </div>
        </div>
        <div class="loan-footer">
          <button class="btn btn-sm btn-primary" @click="selectedLoanId = loan.id; showPaymentForm = true">
            Make Payment
          </button>
          <button class="btn btn-sm btn-outline-secondary" @click="loanStore.fetchLoanPayments(loan.id)">
            Payment History
          </button>
        </div>
      </div>
    </div>

    <div v-if="showPaymentForm" class="payment-modal">
      <div class="modal-content">
        <h3>Make Loan Payment</h3>
        <form @submit.prevent="makePayment">
          <div class="mb-3">
            <label class="form-label">Payment Amount</label>
            <input v-model.number="paymentAmount" type="number" step="0.01" class="form-control" required />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Submit Payment</button>
            <button type="button" class="btn btn-secondary" @click="showPaymentForm = false">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loans-container {
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
.loan-summary {
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
.summary-card .count {
  font-size: 32px;
  font-weight: bold;
  margin: 0;
}
.loans-list {
  display: grid;
  gap: 20px;
}
.loan-card {
  background: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.loan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.progress-section {
  margin-bottom: 20px;
}
.progress {
  height: 10px;
  margin-bottom: 5px;
}
.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.loan-footer {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}
.payment-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
}
.form-actions {
  display: flex;
  gap: 10px;
}
</style>
