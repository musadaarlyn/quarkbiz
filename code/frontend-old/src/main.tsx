import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import AlertModal from './components/modals/alert/AlertModal.tsx'
import { AlertProvider } from './contexts/AlertContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AlertProvider>
      <App />
      <AlertModal />
    </AlertProvider>
  </StrictMode>,
)
