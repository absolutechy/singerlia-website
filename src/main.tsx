import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import { consumeAuthHandoffFromUrl } from './api/services/authService'

// Ingest a token handed off from the portal (URL fragment) before anything renders,
// so route guards and pages see the authenticated session immediately.
consumeAuthHandoffFromUrl()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
