import { useState } from 'react'
import type { Page } from '../lib/routes'
import { supabase } from '../lib/supabaseClient'

type Props = { setCurrentPage: React.Dispatch<React.SetStateAction<Page>> }

export default function Signup({ setCurrentPage }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setMessage(`Erreur : ${error.message}`)
    } else {
      setMessage('Compte créé ! Vous pouvez vous connecter.')
      setCurrentPage('login')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
        <h1 className="mb-4 text-xl font-semibold">Créer un compte</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            S’inscrire
          </button>
        </form>

        {message && <div className="mt-3 text-center text-sm">{message}</div>}

        <div className="mt-4 text-center text-sm">
          Déjà un compte ?{' '}
          <button onClick={() => setCurrentPage('login')} className="text-blue-600 hover:underline">
            Se connecter
          </button>
        </div>
      </div>
    </div>
  )
}