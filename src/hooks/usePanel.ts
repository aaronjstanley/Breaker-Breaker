import { useCallback, useEffect, useRef, useState } from 'react'
import {
  supabase,
  type AmpValue,
  type DbBreaker,
  type DbBreakerPanel,
} from '../lib/supabase'

const PANEL_ID = '00000000-0000-4000-8000-000000000001'
const DEBOUNCE_MS = 300

export type BreakerFields = {
  title: string
  description: string
  amps: AmpValue | null
}

export function usePanel() {
  const [panel, setPanel] = useState<DbBreakerPanel | null>(null)
  const [breakers, setBreakers] = useState<Record<number, DbBreaker>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    const [panelRes, breakersRes] = await Promise.all([
      supabase.from('breaker_panels').select('*').eq('id', PANEL_ID).single(),
      supabase
        .from('breakers')
        .select('*')
        .eq('panel_id', PANEL_ID)
        .order('slot_number', { ascending: true }),
    ])

    if (panelRes.error) {
      setError(panelRes.error.message)
      setLoading(false)
      return
    }
    if (breakersRes.error) {
      setError(breakersRes.error.message)
      setLoading(false)
      return
    }

    const map: Record<number, DbBreaker> = {}
    for (const row of breakersRes.data as DbBreaker[]) {
      map[row.slot_number] = row
    }

    setPanel(panelRes.data as DbBreakerPanel)
    setBreakers(map)
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
    return () => {
      for (const timer of Object.values(timers.current)) clearTimeout(timer)
    }
  }, [load])

  const updateBreakerFields = useCallback(
    (slotNumber: number, patch: Partial<BreakerFields>) => {
      setBreakers((prev) => {
        const existing = prev[slotNumber]
        if (!existing) return prev
        return {
          ...prev,
          [slotNumber]: {
            ...existing,
            ...patch,
            amps:
              patch.amps === undefined
                ? existing.amps
                : patch.amps,
          },
        }
      })

      const key = `slot-${slotNumber}`
      if (timers.current[key]) clearTimeout(timers.current[key])

      timers.current[key] = setTimeout(async () => {
        const payload: Record<string, unknown> = {
          updated_at: new Date().toISOString(),
        }
        if (patch.title !== undefined) payload.title = patch.title
        if (patch.description !== undefined) payload.description = patch.description
        if (patch.amps !== undefined) payload.amps = patch.amps

        const { error: updateError } = await supabase
          .from('breakers')
          .update(payload)
          .eq('panel_id', PANEL_ID)
          .eq('slot_number', slotNumber)

        if (updateError) setError(updateError.message)
      }, DEBOUNCE_MS)
    },
    [],
  )

  const addRow = useCallback(async () => {
    if (!panel || busy) return
    setBusy(true)
    setError(null)

    const nextRow = panel.row_count + 1
    const odd = nextRow * 2 - 1
    const even = nextRow * 2

    const { error: insertError } = await supabase.from('breakers').insert([
      { panel_id: PANEL_ID, slot_number: odd },
      { panel_id: PANEL_ID, slot_number: even },
    ])

    if (insertError) {
      setError(insertError.message)
      setBusy(false)
      return
    }

    const { data, error: panelError } = await supabase
      .from('breaker_panels')
      .update({ row_count: nextRow, updated_at: new Date().toISOString() })
      .eq('id', PANEL_ID)
      .select('*')
      .single()

    if (panelError) {
      setError(panelError.message)
      setBusy(false)
      return
    }

    setPanel(data as DbBreakerPanel)
    await load()
    setBusy(false)
  }, [busy, load, panel])

  const deleteLastRow = useCallback(async () => {
    if (!panel || busy || panel.row_count <= 1) return
    setBusy(true)
    setError(null)

    const lastRow = panel.row_count
    const odd = lastRow * 2 - 1
    const even = lastRow * 2

    const { error: deleteError } = await supabase
      .from('breakers')
      .delete()
      .eq('panel_id', PANEL_ID)
      .in('slot_number', [odd, even])

    if (deleteError) {
      setError(deleteError.message)
      setBusy(false)
      return
    }

    const { data, error: panelError } = await supabase
      .from('breaker_panels')
      .update({
        row_count: lastRow - 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', PANEL_ID)
      .select('*')
      .single()

    if (panelError) {
      setError(panelError.message)
      setBusy(false)
      return
    }

    setPanel(data as DbBreakerPanel)
    setBreakers((prev) => {
      const next = { ...prev }
      delete next[odd]
      delete next[even]
      return next
    })
    setBusy(false)
  }, [busy, panel])

  return {
    panel,
    breakers,
    loading,
    error,
    busy,
    updateBreakerFields,
    addRow,
    deleteLastRow,
    reload: load,
  }
}
