import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // <-- ¡Esta línea es vital!
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)