import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/users/UsersListView.vue')
    },
    {
      path: '/userForm/:id',
      name: 'userForm',
      component: () => import('../views/users/UserForm.vue')
    },
    {
      path: '/accounts',
      name: 'accounts',
      component: () => import('../views/accounts/AccountsView.vue')
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('../views/transactions/TransactionsView.vue')
    },
    {
      path: '/transfers',
      name: 'transfers',
      component: () => import('../views/transfers/TransferView.vue')
    },
    {
      path: '/bills',
      name: 'bills',
      component: () => import('../views/bills/BillPaymentView.vue')
    },
    {
      path: '/cards',
      name: 'cards',
      component: () => import('../views/cards/CardsView.vue')
    },
    {
      path: '/loans',
      name: 'loans',
      component: () => import('../views/loans/LoansView.vue')
    },
    {
      path: '/investments',
      name: 'investments',
      component: () => import('../views/investments/InvestmentsView.vue')
    },
    {
      path: '/beneficiaries',
      name: 'beneficiaries',
      component: () => import('../views/beneficiaries/BeneficiariesView.vue')
    },
    {
      path: '/budgets',
      name: 'budgets',
      component: () => import('../views/budgets/BudgetView.vue')
    }
  ]
})

export default router
