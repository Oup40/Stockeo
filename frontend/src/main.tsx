import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Import clair pour éviter toute confusion avec d'autres composants nommés "Dashboard"
import DashboardPage, { type Page } from '@/pages/Dashboard'
import Login from '@/pages/Login'
import Profile from '@/pages/Profile'
import Signup from '@/pages/Signup'

// Le routeur maison peut afficher 'login' | 'signup' en plus des pages internes du Dashboard
type AppPage = 'login' | 'signup' | Page

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('login')

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login setCurrentPage={setCurrentPage} />
      case 'signup':
        return <Signup setCurrentPage={setCurrentPage} />
      case 'profil':
        return <Profile setCurrentPage={setCurrentPage} />
      default:
        // Toutes les variantes 'dashboard/*' passent au composant DashboardPage
        return (
          <DashboardPage
            currentPage={currentPage as Page}
            setCurrentPage={setCurrentPage}
          />
        )
    }
  }

  return <div>{renderPage()}</div>
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)