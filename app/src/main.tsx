import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './routes/App.tsx'
import {QueryClient, QueryClientProvider} from "react-query";
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import '@mantine/core/styles.css';
import { ThemeProvider } from './context/ThemeContext';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider
      theme={{
        primaryColor: 'blue',
        fontFamily: 'Poppins, sans-serif',
        headings: {
          fontFamily: 'Prata, serif',
        },
      }}
      defaultColorScheme="auto"
    >
      <ColorSchemeScript />
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <App/>
        </QueryClientProvider>
      </ThemeProvider>
    </MantineProvider>
  </React.StrictMode>
)
