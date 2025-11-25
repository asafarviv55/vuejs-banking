<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTransferStore } from '@/stores/transferStore';
import { useAccountStore } from '@/stores/accountStore';
import { useBeneficiaryStore } from '@/stores/beneficiaryStore';
import type { TransferRequest } from '@/models/Transfer';

const transferStore = useTransferStore();
const accountStore = useAccountStore();
const beneficiaryStore = useBeneficiaryStore();

const showForm = ref(false);
const transferForm = ref<TransferRequest>({
  fromAccountId: '',
  toAccountNumber: '',
  amount: 0,
  description: '',
  transferType: 'internal',
  recurring: false
});

const successMessage = ref('');
const errorMessage = ref('');

onMounted(() => {
  accountStore.fetchAccounts();
  beneficiaryStore.fetchBeneficiaries();
  transferStore.fetchTransfers();
});

const submitTransfer = async () => {
  try {
    errorMessage.value = '';
    successMessage.value = '';

    await transferStore.createTransfer(transferForm.value);
    successMessage.value = 'Transfer completed successfully!';

    resetForm();
    showForm.value = false;

    setTimeout(() => {
      successMessage.value = '';
    }, 5000);
  } catch (error) {
    errorMessage.value = 'Failed to process transfer. Please try again.';
  }
};

const resetForm = () => {
  transferForm.value = {
    fromAccountId: '',
    toAccountNumber: '',
    amount: 0,
    description: '',
    transferType: 'internal',
    recurring: false
  };
};

const selectBeneficiary = (accountNumber: string) => {
  transferForm.value.toAccountNumber = accountNumber;
};

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
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusBadge = (status: string) => {
  return {
    'completed': 'badge bg-success',
    'pending': 'badge bg-warning',
    'processing': 'badge bg-info',
    'failed': 'badge bg-danger',
    'cancelled': 'badge bg-secondary'
  }[status] || 'badge bg-secondary';
};
</script>

<template>
  <div class="transfer-container">
    <div class="header">
      <h1>Fund Transfer</h1>
      <button class="btn btn-primary" @click="showForm = !showForm">
        {{ showForm ? 'Cancel' : 'New Transfer' }}
      </button>
    </div>

    <div v-if="successMessage" class="alert alert-success alert-dismissible">
      {{ successMessage }}
      <button type="button" class="btn-close" @click="successMessage = ''"></button>
    </div>

    <div v-if="errorMessage" class="alert alert-danger alert-dismissible">
      {{ errorMessage }}
      <button type="button" class="btn-close" @click="errorMessage = ''"></button>
    </div>

    <div v-if="showForm" class="transfer-form">
      <h3>Make a Transfer</h3>
      <form @submit.prevent="submitTransfer">
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">From Account</label>
            <select v-model="transferForm.fromAccountId" class="form-select" required>
              <option value="">Select account</option>
              <option v-for="account in accountStore.activeAccounts" :key="account.id" :value="account.id">
                {{ account.accountName }} - {{ formatCurrency(account.balance) }}
              </option>
            </select>
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label">Transfer Type</label>
            <select v-model="transferForm.transferType" class="form-select" required>
              <option value="internal">Internal Transfer</option>
              <option value="external">External Transfer</option>
              <option value="international">International Transfer</option>
            </select>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">To Account Number</label>
          <input
            v-model="transferForm.toAccountNumber"
            type="text"
            class="form-control"
            placeholder="Enter account number"
            required
          />
          <div class="beneficiaries-list mt-2">
            <small>Quick select:</small>
            <button
              v-for="beneficiary in beneficiaryStore.verifiedBeneficiaries.slice(0, 3)"
              :key="beneficiary.id"
              type="button"
              class="btn btn-sm btn-outline-secondary ms-2"
              @click="selectBeneficiary(beneficiary.accountNumber)"
            >
              {{ beneficiary.name }}
            </button>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Amount</label>
          <input
            v-model.number="transferForm.amount"
            type="number"
            step="0.01"
            class="form-control"
            placeholder="0.00"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Description</label>
          <textarea
            v-model="transferForm.description"
            class="form-control"
            rows="2"
            placeholder="Enter transfer description"
          ></textarea>
        </div>

        <div class="mb-3 form-check">
          <input
            v-model="transferForm.recurring"
            type="checkbox"
            class="form-check-input"
            id="recurring"
          />
          <label class="form-check-label" for="recurring">
            Make this a recurring transfer
          </label>
        </div>

        <div v-if="transferForm.recurring" class="mb-3">
          <label class="form-label">Frequency</label>
          <select v-model="transferForm.frequency" class="form-select">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="transferStore.loading">
            {{ transferStore.loading ? 'Processing...' : 'Transfer Now' }}
          </button>
          <button type="button" class="btn btn-secondary" @click="showForm = false">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <div class="transfers-history mt-4">
      <h3>Recent Transfers</h3>

      <div v-if="transferStore.loading" class="text-center">
        <div class="spinner-border" role="status"></div>
      </div>

      <div v-else class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>From</th>
              <th>To</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transfer in transferStore.transfers" :key="transfer.id">
              <td>{{ formatDate(transfer.date) }}</td>
              <td>{{ transfer.fromAccountNumber }}</td>
              <td>{{ transfer.toAccountNumber }}</td>
              <td class="amount">{{ formatCurrency(transfer.amount) }}</td>
              <td><span class="badge bg-info">{{ transfer.transferType }}</span></td>
              <td><span :class="getStatusBadge(transfer.status)">{{ transfer.status }}</span></td>
              <td>
                <button
                  v-if="transfer.status === 'pending'"
                  class="btn btn-sm btn-danger"
                  @click="transferStore.cancelTransfer(transfer.id)"
                >
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
.transfer-container {
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

.transfer-form {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.transfer-form h3 {
  margin-bottom: 20px;
}

.beneficiaries-list {
  margin-top: 8px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.transfers-history {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.amount {
  font-weight: bold;
  color: #dc3545;
}

.table {
  margin-top: 20px;
}
</style>
