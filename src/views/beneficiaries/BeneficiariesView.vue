<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useBeneficiaryStore } from '@/stores/beneficiaryStore';
import type { BeneficiaryRequest } from '@/models/Beneficiary';

const beneficiaryStore = useBeneficiaryStore();
const showForm = ref(false);
const beneficiaryForm = ref<BeneficiaryRequest>({
  name: '',
  accountNumber: '',
  bankName: '',
  type: 'personal',
  country: 'USA',
  currency: 'USD'
});

onMounted(() => {
  beneficiaryStore.fetchBeneficiaries();
});

const submitBeneficiary = async () => {
  try {
    await beneficiaryStore.addBeneficiary(beneficiaryForm.value);
    showForm.value = false;
    beneficiaryForm.value = {
      name: '',
      accountNumber: '',
      bankName: '',
      type: 'personal',
      country: 'USA',
      currency: 'USD'
    };
  } catch (error) {
    console.error('Failed to add beneficiary:', error);
  }
};

const deleteBeneficiary = async (id: string) => {
  if (confirm('Are you sure you want to delete this beneficiary?')) {
    await beneficiaryStore.deleteBeneficiary(id);
  }
};
</script>

<template>
  <div class="beneficiaries-container">
    <div class="header">
      <h1>Beneficiaries</h1>
      <button class="btn btn-primary" @click="showForm = !showForm">
        {{ showForm ? 'Cancel' : 'Add Beneficiary' }}
      </button>
    </div>

    <div v-if="showForm" class="beneficiary-form">
      <h3>Add New Beneficiary</h3>
      <form @submit.prevent="submitBeneficiary">
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Name</label>
            <input v-model="beneficiaryForm.name" type="text" class="form-control" required />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Type</label>
            <select v-model="beneficiaryForm.type" class="form-select" required>
              <option value="personal">Personal</option>
              <option value="business">Business</option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Account Number</label>
            <input v-model="beneficiaryForm.accountNumber" type="text" class="form-control" required />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Bank Name</label>
            <input v-model="beneficiaryForm.bankName" type="text" class="form-control" required />
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Country</label>
            <input v-model="beneficiaryForm.country" type="text" class="form-control" required />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Currency</label>
            <input v-model="beneficiaryForm.currency" type="text" class="form-control" required />
          </div>
        </div>
        <button type="submit" class="btn btn-primary">Add Beneficiary</button>
      </form>
    </div>

    <div class="beneficiaries-list">
      <h3>My Beneficiaries</h3>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Account Number</th>
              <th>Bank</th>
              <th>Type</th>
              <th>Country</th>
              <th>Verified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="beneficiary in beneficiaryStore.beneficiaries" :key="beneficiary.id">
              <td><strong>{{ beneficiary.name }}</strong></td>
              <td>{{ beneficiary.accountNumber }}</td>
              <td>{{ beneficiary.bankName }}</td>
              <td><span class="badge bg-secondary">{{ beneficiary.type }}</span></td>
              <td>{{ beneficiary.country }}</td>
              <td>
                <span :class="'badge ' + (beneficiary.isVerified ? 'bg-success' : 'bg-warning')">
                  {{ beneficiary.isVerified ? 'Verified' : 'Pending' }}
                </span>
              </td>
              <td>
                <button class="btn btn-sm btn-danger" @click="deleteBeneficiary(beneficiary.id)">
                  Delete
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
.beneficiaries-container {
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
.beneficiary-form {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}
.beneficiaries-list {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
