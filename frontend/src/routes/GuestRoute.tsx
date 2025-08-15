import { Navigate } from 'react-router-dom'
import { useCurrentUser } from '../hooks/useCurrentUser'

export default function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useCurrentUser()
  if (loading) return <div className="p-4 text-sm">Chargement…</div>
  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>
}