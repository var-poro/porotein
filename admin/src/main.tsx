import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider, ColorSchemeScript } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import './styles/index.scss'
import { AuthProvider } from './context/AuthContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
})

const AppWithProviders = () => (
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <MantineProvider defaultColorScheme="auto">
          <ColorSchemeScript />
          <AuthProvider>
            <App />
          </AuthProvider>
        </MantineProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
)

const root = createRoot(document.getElementById('root')!)
root.render(<AppWithProviders />)
