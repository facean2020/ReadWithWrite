import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './utilities/i18n.ts'
import App from './App.tsx'
import { SystemColorThemeProvider } from '@/context/AppProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SystemColorThemeProvider>
      <Suspense fallback="Loading...">
        <App />
      </Suspense>
    </SystemColorThemeProvider>
  </StrictMode>,
)
