import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Signup from './pages/Signup'

// Composant principal avec navigation simple
function App() {
  const [currentPage, setCurrentPage] = useState('login')
  const [isAuthenticated, setIsAuthenticated] = useState(false) // Commencer non connecté

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login setCurrentPage={setCurrentPage} />
      case 'signup':
        return <Signup setCurrentPage={setCurrentPage} />
      case 'profile':
        return <Profile />
      case 'dashboard':
      default:
        return <Dashboard currentPage={currentPage} setCurrentPage={setCurrentPage} />
    }
  }

  return (
    <div>
      {renderPage()}
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)