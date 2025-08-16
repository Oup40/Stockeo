import { Link, useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { supabase } from '../lib/supabaseClient'

export default function Profile() {
  const navigate = useNavigate()
  const { user, loading } = useCurrentUser()

  const logout = async () => {
    await supabase.auth.signOut()
    // ✅ navigation SPA (remplace window.location.href)
    navigate('/login', { replace: true })
  }

  if (loading) return <div className="p-4 text-sm">Chargement…</div>

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-lg bg-white p-6 shadow">
          <p className="mb-4 text-sm">Vous n’êtes pas connecté.</p>
          <Link to="/login" className="text-blue-600 hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="order-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
          <h1 className="text-lg font-semibold">Mon profil</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
            >
              Dashboard
            </button>
            <button
              onClick={logout}
              className="rounded border border-transparent bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-base font-medium text-gray-900">Informations</h2>
          </div>
          <div className="space-y-4 px-6 py-4">
            <div>
              <div className="text-xs uppercase text-gray-500">Email</div>
              <div className="text-sm">{user.email ?? '—'}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-gray-500">ID</div>
              <div className="text-sm">{user.id}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}