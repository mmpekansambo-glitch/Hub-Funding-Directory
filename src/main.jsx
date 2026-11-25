import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { DataProvider } from './DataContext.jsx'
import { SavedProvider } from './SavedContext.jsx'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <DataProvider>
        <SavedProvider>
          <App />
        </SavedProvider>
      </DataProvider>
    </BrowserRouter>
  </StrictMode>
)
