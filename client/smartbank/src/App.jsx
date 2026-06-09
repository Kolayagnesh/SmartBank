import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PrivateRoute, PublicRoute } from './components/common/RouteGuards'
import Sidebar from './components/common/Sidebar'

// Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import VerifyOTP from './pages/auth/VerifyOTP'
import { ForgotPassword } from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'

// Customer pages
import Dashboard from './pages/customer/Dashboard'
import Accounts from './pages/customer/Accounts'
import AccountDetail from './pages/customer/AccountDetail'
import CreateAccount from './pages/customer/CreateAccount'
import Transfer from './pages/customer/Transfer'
import Transactions from './pages/customer/Transactions'
import Statements from './pages/customer/Statements'
import Profile from './pages/customer/Profile'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'

function CustomerLayout({ children }) {
  return (
    <PrivateRoute role="CUSTOMER">
      <Sidebar>{children}</Sidebar>
    </PrivateRoute>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Customer routes */}
        <Route path="/dashboard" element={<CustomerLayout><Dashboard /></CustomerLayout>} />
        <Route path="/accounts" element={<CustomerLayout><Accounts /></CustomerLayout>} />
        <Route path="/accounts/create" element={<CustomerLayout><CreateAccount /></CustomerLayout>} />
        <Route path="/accounts/:accountNumber" element={<CustomerLayout><AccountDetail /></CustomerLayout>} />
        <Route path="/transfer" element={<CustomerLayout><Transfer /></CustomerLayout>} />
        <Route path="/transactions/:accountNumber" element={<CustomerLayout><Transactions /></CustomerLayout>} />
        <Route path="/statements" element={<CustomerLayout><Statements /></CustomerLayout>} />
        <Route path="/profile" element={<CustomerLayout><Profile /></CustomerLayout>} />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<PrivateRoute role="ADMIN"><AdminDashboard /></PrivateRoute>} />

        {/* Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}
