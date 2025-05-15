import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import './index.css'
import App from './App.jsx'
import { AuthContextProvider } from './context/AuthContextProvider.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AuthContextProvider>
    <App />
  </AuthContextProvider>,
  </BrowserRouter>
)
