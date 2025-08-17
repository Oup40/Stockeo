import { mapPgErrorToMessage } from '@/lib/errorMessages'
import { supabase } from '@/lib/supabaseClient'
import { listEquipementsByParc, type Equipement } from '@/services/equipements'
import { useEffect, useMemo, useState } from 'react'

export default function EquipementsList({ parcId }: { parcId: string }) {
  const [rows, setRows] = useState<Equipement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await listEquipementsByParc(parcId)
        if (ignore) return
        setRows(data)
      } catch (e: any) {
        if (ignore) return
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

  // Référentiels pour afficher des libellés
  const [modeles, setModeles] = useState<Record<string, string>>({})
  const [types, setTypes] = useState<Record<string, string>>({})
  const [etats, setEtats] = useState<Record<string, string>>({})
  const [statuts, setStatuts] = useState<Record<string, string>>({})
  const [usagers, setUsagers] = useState<Record<string, string>>({})

  useEffect(() => {
    const loadRefs = async () => {
      try {
        const [
          { data: ms, error: em },
          { data: ts, error: et },
          { data: es, error: ee },
          { data: ss, error: es2 },
          { data: us, error: eu },
        ] = await Promise.all([
          supabase.from('modeles_equipement').select('id, nom'),
          supabase.from('types_equipement').select('id, nom'),
          supabase.from('etats_equipement').select('id, nom'),
          supabase.from('statuts_equipement').select('id, nom'),
          supabase.from('usagers').select('id, nom, prenom'),
        ])
        if (em) throw em
        if (et) throw et
        if (ee) throw ee
        if (es2) throw es2
        if (eu) throw eu
        setModeles(Object.fromEntries((ms ?? []).map((m: any) => [m.id, m.nom])))
        setTypes(Object.fromEntries((ts ?? []).map((t: any) => [t.id, t.nom])))
        setEtats(Object.fromEntries((es ?? []).map((e: any) => [e.id, e.nom])))
        setStatuts(Object.fromEntries((ss ?? []).map((s: any) => [s.id, s.nom])))
        setUsagers(
          Object.fromEntries((us ?? []).map((u: any) => [u.id, `${u.nom ?? ''} ${u.prenom ?? ''}`.trim()]))
        )
      } catch (err: any) {
        console.warn(mapPgErrorToMessage(err) || err?.message)
      }
    }
    loadRefs()
  }, [])

  const enhanced = useMemo(
    () =>
      rows.map((r) => ({
        ...r,
        type_nom: types[r.type_id] ?? r.type_id,
        modele_nom: modeles[r.modele_id] ?? r.modele_id,
        etat_nom: (r as any).etat_id ? etats[(r as any).etat_id] ?? (r as any).etat_id : '',
        statut_nom: r.statut_id ? statuts[r.statut_id] ?? r.statut_id : '',
        usager_nom: r.usager_id ? usagers[r.usager_id] ?? r.usager_id : '',
      })),
    [rows, types, modeles, etats, statuts, usagers]
  )

  // Filtres par colonne
  const [fType, setFType] = useState('')
  const [fModele, setFModele] = useState('')
  const [fCID, setFCID] = useState('')
  const [fVID, setFVID] = useState('')
  const [fEtat, setFEtat] = useState('')
  const [fStatut, setFStatut] = useState('')
  const [fUsager, setFUsager] = useState('')
  const [fCom, setFCom] = useState('')

  const filtered = useMemo(() => {
    const inc = (a: any, b: string) => String(a ?? '').toLowerCase().includes(b.toLowerCase())
    return enhanced.filter((r: any) =>
      inc(r.type_nom, fType) &&
      inc(r.modele_nom, fModele) &&
      inc(r.cid_contrat, fCID) &&
      inc(r.vid_reference, fVID) &&
      inc(r.etat_nom, fEtat) &&
      inc(r.statut_nom, fStatut) &&
      inc(r.usager_nom, fUsager) &&
      inc(r.commentaires, fCom)
    )
  }, [enhanced, fType, fModele, fCID, fVID, fEtat, fStatut, fUsager, fCom])

  if (loading) return <div className="text-sm opacity-70">Chargement…</div>
  if (error) return <div className="text-sm text-red-600">{error}</div>
  if (!filtered.length)
    return <div className="text-sm opacity-70">Aucun équipement pour ce parc.</div>

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50 text-left">
            <th className="p-2">Type</th>
            <th className="p-2">Modèle</th>
            <th className="p-2">CID / Contrat</th>
            <th className="p-2">VID / Référence</th>
            <th className="p-2">État</th>
            <th className="p-2">Statut</th>
            <th className="p-2">Usager</th>
            <th className="p-2">Commentaire</th>
          </tr>
          <tr className="border-b text-left">
            <th className="p-1"><input className="w-full rounded border p-1" value={fType} onChange={(e) => setFType(e.target.value)} /></th>
            <th className="p-1"><input className="w-full rounded border p-1" value={fModele} onChange={(e) => setFModele(e.target.value)} /></th>
            <th className="p-1"><input className="w-full rounded border p-1" value={fCID} onChange={(e) => setFCID(e.target.value)} /></th>
            <th className="p-1"><input className="w-full rounded border p-1" value={fVID} onChange={(e) => setFVID(e.target.value)} /></th>
            <th className="p-1"><input className="w-full rounded border p-1" value={fEtat} onChange={(e) => setFEtat(e.target.value)} /></th>
            <th className="p-1"><input className="w-full rounded border p-1" value={fStatut} onChange={(e) => setFStatut(e.target.value)} /></th>
            <th className="p-1"><input className="w-full rounded border p-1" value={fUsager} onChange={(e) => setFUsager(e.target.value)} /></th>
            <th className="p-1"><input className="w-full rounded border p-1" value={fCom} onChange={(e) => setFCom(e.target.value)} /></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r: any) => (
            <tr key={r.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{r.type_nom}</td>
              <td className="p-2">{r.modele_nom}</td>
              <td className="p-2 font-mono">{r.cid_contrat}</td>
              <td className="p-2 font-mono">{r.vid_reference}</td>
              <td className="p-2">{r.etat_nom || '—'}</td>
              <td className="p-2">{r.statut_nom || '—'}</td>
              <td className="p-2">{r.usager_nom || '—'}</td>
              <td className="p-2">{r.commentaires || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}