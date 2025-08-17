import { useCurrentUser } from '../hooks/useCurrentUser'
import { supabase } from '../lib/supabaseClient'

export default function Profile({ setCurrentPage }: { setCurrentPage: (p: any) => void }) {
  const { user, loading } = useCurrentUser()

  const logout = async () => {
    await supabase.auth.signOut()
    setCurrentPage('login')
  }

  if (loading) return <div className="p-4 text-sm">Chargement…</div>

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-lg bg-white p-6 shadow">
          <p className="mb-4 text-sm">Vous n’êtes pas connecté.</p>
          <button className="text-blue-600 underline" onClick={() => setCurrentPage('login')}>
            Aller à la page de connexion
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between p-4">
          <h1 className="text-lg font-semibold">Profil</h1>
          <button onClick={logout} className="rounded bg-black px-3 py-1.5 text-white">
            Déconnexion
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl p-4">
        <div className="overflow-hidden rounded-lg border bg-white">
          <div className="border-b bg-gray-50 px-6 py-4 font-medium">Informations</div>
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