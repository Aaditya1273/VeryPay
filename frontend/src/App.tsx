import { Routes, Route } from 'react-router-dom'
import { useTheme } from './contexts/ThemeContext'

// Layout components
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Pages
import HomePage from './pages/HomePage'
import WalletPage from './pages/WalletPage'
import TasksPage from './pages/TasksPage'
import RewardsPage from './pages/RewardsPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import OnboardingPage from './pages/auth/OnboardingPage'
import SendPaymentPage from './pages/payments/SendPaymentPage'
import ReceivePaymentPage from './pages/payments/ReceivePaymentPage'
import TaskDetailPage from './pages/tasks/TaskDetailPage'
import CreateTaskPage from './pages/tasks/CreateTaskPage'

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
          <Route path="tasks/:id" element={<TaskDetailPage />} />
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
