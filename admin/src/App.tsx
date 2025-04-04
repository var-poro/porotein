import { Routes, Route, Navigate } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import { Login } from './pages/Login'
import Users from './pages/Users'
import { useTranslation } from './hooks/useTranslation'

function AppRoutes() {
  const { user, loading } = useAuth()
  const { Trans } = useTranslation()

  if (loading) {
    return <div><Trans>Loading...</Trans></div>
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/users" replace />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </Layout>
  )
}

function App() {
  return (
    <MantineProvider>
      <Notifications position="top-right" />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </MantineProvider>
  )
}

export default App
