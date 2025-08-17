import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Signup({ setCurrentPage }: { setCurrentPage: (p: any) => void }) {
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { prenom: prenom.trim(), nom: nom.trim() },
        },
      })
      if (error) throw error
      setSuccess('Compte créé. Vérifie ta boîte mail si la confirmation est activée.')
      setPrenom(''); setNom(''); setEmail(''); setPassword('')
      // Optionnel: retour auto vers connexion
      // setTimeout(() => setCurrentPage('login'), 1200)
    } catch (e: any) {
      setError(e.message || 'Erreur à la création du compte')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center">
      <form onSubmit={onSubmit} className="space-y-3 rounded border p-4">
        <h1 className="text-xl font-bold">Créer un compte</h1>
        <input className="block w-64 rounded border p-2" placeholder="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
        <input className="block w-64 rounded border p-2" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
        <input className="block w-64 rounded border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        <input className="block w-64 rounded border p-2" placeholder="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <div className="text-sm text-red-600">{error}</div>}
        {success && <div className="text-sm text-green-700">{success}</div>}
        <button disabled={loading} className="rounded bg-black px-3 py-2 text-white disabled:opacity-50">
          {loading ? 'Création…' : "S'inscrire"}
        </button>
        <div className="mt-2 text-sm">
          Déjà un compte ?{' '}
          <button type="button" className="underline" onClick={() => setCurrentPage('login')}>
            Se connecter
          </button>
        </div>
      </form>
    </main>
  )
}