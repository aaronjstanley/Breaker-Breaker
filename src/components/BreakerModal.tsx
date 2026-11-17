import { useEffect } from 'react'
import { AMP_OPTIONS, type AmpValue, type DbBreaker } from '../lib/supabase'

type Props = {
  slotNumber: number
  breaker?: DbBreaker
  open: boolean
  onClose: () => void
  onChange: (patch: {
    title?: string
    description?: string
    amps?: AmpValue | null
  }) => void
}

export function BreakerModal({
  slotNumber,
  breaker,
  open,
  onClose,
  onChange,
}: Props) {
  const fromLeft = slotNumber % 2 === 1

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const ampsValue =
    breaker?.amps === null || breaker?.amps === undefined
      ? ''
      : String(breaker.amps)

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        aria-label="Close editor"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="breaker-modal-title"
        className={`absolute top-0 flex h-full w-full max-w-md flex-col border-[var(--bb-slot-edge)] bg-[#121820] shadow-2xl transition-transform duration-300 ease-out ${
          fromLeft ? 'left-0 border-r' : 'right-0 border-l'
        } ${
          open
            ? 'translate-x-0'
            : fromLeft
              ? '-translate-x-full'
              : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between gap-3 border-b border-[var(--bb-slot-edge)] px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bb-yellow)]">
              Slot {slotNumber}
            </p>
            <h2 id="breaker-modal-title" className="text-xl font-bold text-[var(--bb-ink)]">
              Edit breaker
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-1.5 text-sm text-[var(--bb-muted)] transition hover:bg-white/5 hover:text-white"
          >
            Close
          </button>
        </header>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 py-6">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-[var(--bb-muted)]">Title</span>
            <input
              type="text"
              value={breaker?.title ?? ''}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="e.g. Living Room"
              className="rounded-md border border-[var(--bb-slot-edge)] bg-[#0c1118] px-3 py-2.5 text-[var(--bb-ink)] outline-none ring-[var(--bb-yellow)] focus:ring-2"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-[var(--bb-muted)]">Description</span>
            <textarea
              value={breaker?.description ?? ''}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Optional notes"
              rows={5}
              className="resize-y rounded-md border border-[var(--bb-slot-edge)] bg-[#0c1118] px-3 py-2.5 text-[var(--bb-ink)] outline-none ring-[var(--bb-yellow)] focus:ring-2"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-[var(--bb-muted)]">Amps</span>
            <select
              value={ampsValue}
              onChange={(e) => {
                const raw = e.target.value
                onChange({
                  amps: raw === '' ? null : (Number(raw) as AmpValue),
                })
              }}
              className="rounded-md border border-[var(--bb-slot-edge)] bg-[#0c1118] px-3 py-2.5 text-[var(--bb-ink)] outline-none ring-[var(--bb-yellow)] focus:ring-2"
            >
              <option value="">—</option>
              {AMP_OPTIONS.map((amp) => (
                <option key={amp} value={amp}>
                  {amp}
                </option>
              ))}
            </select>
          </label>

          <p className="text-xs text-[var(--bb-muted)]">Changes save automatically.</p>
        </div>
      </aside>
    </div>
  )
}
