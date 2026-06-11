import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
})

api.interceptors.request.use((config) => {
  const publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/verify-otp',
    '/auth/resend-otp',
    '/auth/forgot-password',
    '/auth/reset-password'
  ]

  const isPublicRoute = publicRoutes.some(
    route => config.url?.includes(route)
  )

  if (!isPublicRoute) {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})
// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  resendOtp: (data) => api.post('/auth/resend-otp', data),
  login: (data) => api.post('/auth/login', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
}

// Accounts
export const accountAPI = {
  getDashboard: () => api.get('/accounts/dashboard'),
  getMyAccounts: () => api.get('/accounts/my'),
  getAccount: (accountNumber) => api.get(`/accounts/my/${accountNumber}`),
}

// AI
export const aiAPI = {
  getAccountAnalysis: () => api.get('/ai/account-analysis'),
}

// Payments
export const paymentAPI = {
  createOrder: (data) => api.post('/payments/create-order', data),
  verifyAndCreate: (data) => api.post('/payments/verify-account-opening', data),
}

// Transactions
export const transactionAPI = {
  transfer: (data) => api.post('/transactions/transfer', data),
  getByAccount: (accountNumber) => api.get(`/transactions/account/${accountNumber}`),
}

// Statements
export const statementAPI = {
  download: (accountId, from, to) =>
    api.get('/statements/download', {
      params: { accountId, from, to },
      responseType: 'blob',
    }),
}

// Admin
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
}

export default api
