import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { ChatProvider } from './contexts/ChatContext'
import Layout from './components/layout/Layout'
// Simple loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
  </div>
)

// Pages
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import OnboardingPage from './pages/auth/OnboardingPage'
import WalletPage from './pages/WalletPage'
import TasksPage from './pages/TasksPage'
import TaskMarketplace from './pages/TaskMarketplace'
import RewardsPage from './pages/RewardsPage'
import ProfilePage from './pages/ProfilePage'
import SendPaymentPage from './pages/payments/SendPaymentPage'
import ReceivePaymentPage from './pages/payments/ReceivePaymentPage'
import CreateTaskPage from './pages/tasks/CreateTaskPage'

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

// Public Route Component (redirect to home if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />
}

function App() {
  return (
    <ChatProvider>
      <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      } />

      {/* Protected Routes with Layout */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <HomePage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/onboarding" element={
        <ProtectedRoute>
          <OnboardingPage />
        </ProtectedRoute>
      } />
      
      <Route path="/wallet" element={
        <ProtectedRoute>
          <Layout>
            <WalletPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/tasks" element={
        <ProtectedRoute>
          <Layout>
            <TasksPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/marketplace" element={
        <ProtectedRoute>
          <Layout>
            <TaskMarketplace />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/rewards" element={
        <ProtectedRoute>
          <Layout>
            <RewardsPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout>
            <ProfilePage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/send" element={
        <ProtectedRoute>
          <Layout>
            <SendPaymentPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/receive" element={
        <ProtectedRoute>
          <Layout>
            <ReceivePaymentPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/tasks/create" element={
        <ProtectedRoute>
          <Layout>
            <CreateTaskPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/tasks/:id" element={
        <ProtectedRoute>
          <Layout>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Task Details</h2>
              <p className="text-muted-foreground">Task details page coming soon!</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/tasks/:id/apply" element={
        <ProtectedRoute>
          <Layout>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Apply to Task</h2>
              <p className="text-muted-foreground">Task application page coming soon!</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ChatProvider>
  )
}

export default App
