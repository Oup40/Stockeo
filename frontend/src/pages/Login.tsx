import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Login({ setCurrentPage }: { setCurrentPage: (p: any) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else setCurrentPage('dashboard')
  }

  return (
    <main className="grid min-h-screen place-items-center">
      <form onSubmit={onSubmit} className="space-y-3 rounded border p-4">
        <h1 className="text-xl font-bold">Connexion</h1>
        <input className="block w-64 rounded border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="block w-64 rounded border p-2" placeholder="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button className="rounded bg-black px-3 py-2 text-white">Se connecter</button>
        <div className="mt-2 text-sm">
          Pas de compte ?{' '}
          <button type="button" className="underline" onClick={() => setCurrentPage('signup')}>
            Créer un compte
          </button>
        </div>
      </form>
    </main>
  )
}