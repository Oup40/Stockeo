import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import type { Page } from './lib/routes'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Signup from './pages/Signup'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login')

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login setCurrentPage={setCurrentPage} />
      case 'signup':
        return <Signup setCurrentPage={setCurrentPage} />
      case 'profile':
        return <Profile />
      default:
        // Toutes les variantes "dashboard/*" passent ici
        return <Dashboard currentPage={currentPage} setCurrentPage={setCurrentPage} />
    }
  }

  return <div>{renderPage()}</div>
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)