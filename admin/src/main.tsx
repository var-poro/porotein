import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider, ColorSchemeScript } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import App from './App'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import './styles/index.scss'
import { AuthProvider } from './context/AuthContext'
import { defaultLocale, dynamicActivate } from './i18n'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
})

// Initialize i18n
dynamicActivate(defaultLocale)

const AppWithProviders = () => (
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <MantineProvider defaultColorScheme="auto">
          <ColorSchemeScript />
          <I18nProvider i18n={i18n}>
            <AuthProvider>
              <App />
            </AuthProvider>
          </I18nProvider>
        </MantineProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
)

const root = createRoot(document.getElementById('root')!)
root.render(<AppWithProviders />)
