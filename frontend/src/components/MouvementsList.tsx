import { supabase } from '@/lib/supabaseClient'
import { listMouvementsByParc, type Mouvement } from '@/services/mouvements'
import { useEffect, useMemo, useState } from 'react'

type EquipLight = {
  id: string
  modele_id: string
  cid_contrat: string
  vid_reference: string
}

export default function MouvementsList({ parcId }: { parcId: string }) {
  const [rows, setRows] = useState<Mouvement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // maps de libellés
  const [types, setTypes] = useState<Record<string, string>>({})
  const [modeles, setModeles] = useState<Record<string, string>>({})
  const [equips, setEquips] = useState<Record<string, EquipLight>>({})

  useEffect(() => {
    let ignore = false
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        // données principales
        const data = await listMouvementsByParc(parcId)
        if (ignore) return
        setRows(data)

        // références (types mouvement, modèles, équipements du parc)
        const [
          { data: tm, error: etm },
          { data: me, error: eme },
          { data: eq, error: eeq },
        ] = await Promise.all([
          supabase.from('types_mouvement').select('id, nom'),
          supabase.from('modeles_equipement').select('id, nom'),
          supabase
            .from('equipements')
            .select('id, modele_id, cid_contrat, vid_reference')
            .eq('parc_id', parcId),
        ])
        if (etm) throw etm
        if (eme) throw eme
        if (eeq) throw eeq

        setTypes(Object.fromEntries((tm ?? []).map((t: any) => [t.id, t.nom])))
        setModeles(Object.fromEntries((me ?? []).map((m: any) => [m.id, m.nom])))
        setEquips(
          Object.fromEntries(
            (eq ?? []).map((e: any) => [
              e.id,
              {
                id: e.id,
                modele_id: e.modele_id,
                cid_contrat: e.cid_contrat,
                vid_reference: e.vid_reference,
              },
            ]),
          ),
        )
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

  // Filtres
  const [fType, setFType] = useState('')
  const [fEquip, setFEquip] = useState('')
  const [fDesc, setFDesc] = useState('')
  const [fDate, setFDate] = useState('')

  const rowsEnhanced = useMemo(() => {
    return rows.map((r) => {
      const eq = equips[r.equipement_id]
      const modele = eq ? modeles[eq.modele_id] ?? eq.modele_id : ''
      const equipLabel = eq
        ? `${modele} (${eq.cid_contrat} / ${eq.vid_reference})`
        : r.equipement_id
      return {
        ...r,
        type_nom: types[r.type_id] ?? r.type_id,
        equip_label: equipLabel,
        date_iso: r.date,
      }
    })
  }, [rows, equips, modeles, types])

  const filtered = useMemo(() => {
    const inc = (a: any, b: string) => String(a ?? '').toLowerCase().includes(b.toLowerCase())
    return rowsEnhanced.filter(
      (r) =>
        inc(r.type_nom, fType) &&
        inc(r.equip_label, fEquip) &&
        inc(r.description, fDesc) &&
        inc(r.date_iso, fDate),
    )
  }, [rowsEnhanced, fType, fEquip, fDesc, fDate])

  if (loading) return <div className="text-sm opacity-70">Chargement…</div>
  if (error) return <div className="text-sm text-red-600">{error}</div>
  if (!filtered.length) return <div className="text-sm opacity-70">Aucun mouvement.</div>

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50 text-left">
            <th className="p-2">Type</th>
            <th className="p-2">Équipement</th>
            <th className="p-2">Description</th>
            <th className="p-2">Date</th>
          </tr>
          <tr className="border-b text-left">
            <th className="p-1">
              <input className="w-full rounded border p-1" value={fType} onChange={(e) => setFType(e.target.value)} />
            </th>
            <th className="p-1">
              <input className="w-full rounded border p-1" value={fEquip} onChange={(e) => setFEquip(e.target.value)} />
            </th>
            <th className="p-1">
              <input className="w-full rounded border p-1" value={fDesc} onChange={(e) => setFDesc(e.target.value)} />
            </th>
            <th className="p-1">
              <input className="w-full rounded border p-1" value={fDate} onChange={(e) => setFDate(e.target.value)} />
            </th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{r.type_nom}</td>
              <td className="p-2">{r.equip_label}</td>
              <td className="p-2">{r.description ?? '—'}</td>
              <td className="p-2">{new Date(r.date_iso).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}