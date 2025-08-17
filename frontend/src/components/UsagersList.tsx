import { listUsagersByParc, type Usager } from '@/services/usagers'
import { useEffect, useMemo, useState } from 'react'

export default function UsagersList({ parcId }: { parcId: string }) {
  const [rows, setRows] = useState<Usager[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await listUsagersByParc(parcId)
        if (!ignore) setRows(data)
      } catch (e: any) {
        setError(e.message || 'Erreur de chargement')
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [parcId])

  // Filtres séparés par colonne
  const [fNom, setFNom] = useState('')
  const [fPrenom, setFPrenom] = useState('')
  const [fAdr, setFAdr] = useState('')
  const [fAdrCompl, setFAdrCompl] = useState('')
  const [fCP, setFCP] = useState('')
  const [fCommune, setFCommune] = useState('')
  const [fTelFixe, setFTelFixe] = useState('')
  const [fTelPort, setFTelPort] = useState('')
  const [fCom, setFCom] = useState('')

  const filtered = useMemo(() => {
    const inc = (a: any, b: string) => String(a ?? '').toLowerCase().includes(b.toLowerCase())
    return rows.filter(
      (u) =>
        inc(u.nom, fNom) &&
        inc(u.prenom, fPrenom) &&
        inc(u.adresse, fAdr) &&
        inc(u.complement_adresse, fAdrCompl) &&
        inc(u.code_postal, fCP) &&
        inc(u.commune, fCommune) &&
        inc(u.telephone_fixe, fTelFixe) &&
        inc(u.telephone_portable, fTelPort) &&
        inc(u.commentaires, fCom),
    )
  }, [rows, fNom, fPrenom, fAdr, fAdrCompl, fCP, fCommune, fTelFixe, fTelPort, fCom])

  if (loading) return <div className="text-sm opacity-70">Chargement…</div>
  if (error) return <div className="text-sm text-red-600">{error}</div>
  if (!filtered.length) return <div className="text-sm opacity-70">Aucun usager.</div>

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50 text-left">
            <th className="p-2">Nom</th>
            <th className="p-2">Prénom</th>
            <th className="p-2">Adresse</th>
            <th className="p-2">Complément</th>
            <th className="p-2">CP</th>
            <th className="p-2">Commune</th>
            <th className="p-2">Tél fixe</th>
            <th className="p-2">Tél portable</th>
            <th className="p-2">Commentaire</th>
          </tr>
          <tr className="border-b text-left">
            <th className="p-1"><input className="w-full rounded border p-1" value={fNom} onChange={(e) => setFNom(e.target.value)} /></th>
            <th className="p-1"><input className="w-full rounded border p-1" value={fPrenom} onChange={(e) => setFPrenom(e.target.value)} /></th>
            <th className="p-1"><input className="w-full rounded border p-1" value={fAdr} onChange={(e) => setFAdr(e.target.value)} /></th>
            <th className="p-1"><input className="w-full rounded border p-1" value={fAdrCompl} onChange={(e) => setFAdrCompl(e.target.value)} /></th>
            <th className="p-1"><input className="w-full rounded border p-1" value={fCP} onChange={(e) => setFCP(e.target.value)} /></th>
            <th className="p-1"><input className="w-full rounded border p-1" value={fCommune} onChange={(e) => setFCommune(e.target.value)} /></th>
            <th className="p-1"><input className="w-full rounded border p-1" value={fTelFixe} onChange={(e) => setFTelFixe(e.target.value)} /></th>
            <th className="p-1"><input className="w-full rounded border p-1" value={fTelPort} onChange={(e) => setFTelPort(e.target.value)} /></th>
            <th className="p-1"><input className="w-full rounded border p-1" value={fCom} onChange={(e) => setFCom(e.target.value)} /></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((u) => (
            <tr key={u.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{u.nom}</td>
              <td className="p-2">{u.prenom}</td>
              <td className="p-2">{u.adresse ?? '—'}</td>
              <td className="p-2">{u.complement_adresse ?? '—'}</td>
              <td className="p-2">{u.code_postal ?? '—'}</td>
              <td className="p-2">{u.commune ?? '—'}</td>
              <td className="p-2">{u.telephone_fixe ?? '—'}</td>
              <td className="p-2">{u.telephone_portable ?? '—'}</td>
              <td className="p-2">{u.commentaires ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}