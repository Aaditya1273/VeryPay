import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import HomePage from '@/pages/HomePage'

// Auth pages
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import OnboardingPage from '@/pages/auth/OnboardingPage'

// Main pages
import WalletPage from '@/pages/WalletPage'
import TasksPage from '@/pages/TasksPage'
import RewardsPage from '@/pages/RewardsPage'
import ProfilePage from '@/pages/ProfilePage'

// Payment pages
import SendPaymentPage from '@/pages/payments/SendPaymentPage'
import ReceivePaymentPage from '@/pages/payments/ReceivePaymentPage'

// Task pages
import CreateTaskPage from '@/pages/tasks/CreateTaskPage'

import { useTheme } from './contexts/ThemeContext'

function App() {
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="wallet/send" element={<SendPaymentPage />} />
          <Route path="wallet/receive" element={<ReceivePaymentPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="tasks/create" element={<CreateTaskPage />} />
          <Route path="rewards" element={<RewardsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </div>
  )
}

export default App
