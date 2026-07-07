import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './contexts/ThemeContext'
import { TimerProvider } from './contexts/TimerContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <TimerProvider>
        <App />
      </TimerProvider>
    </ThemeProvider>
  </StrictMode>
)
