import { useState } from 'react'
import { BreakerModal } from './components/BreakerModal'
import { PanelGrid } from './components/PanelGrid'
import { RowControls } from './components/RowControls'
import { usePanel } from './hooks/usePanel'

export default function App() {
  const {
    panel,
    breakers,
    loading,
    error,
    busy,
    updateBreakerFields,
    addRow,
    deleteLastRow,
  } = usePanel()
  const [activeSlot, setActiveSlot] = useState<number | null>(null)

  return (
    <div className="mx-auto min-h-dvh w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8 flex items-center gap-4">
        <img
          src={`${import.meta.env.BASE_URL}icon.jpg`}
          alt=""
          className="h-14 w-14 rounded-2xl border border-white/10 shadow-lg"
        />
        <div>
          <h1
            className="text-3xl font-bold tracking-tight text-[var(--bb-ink)] sm:text-4xl"
            style={{ fontFamily: "'Breaker Display', 'Avenir Next Condensed', sans-serif" }}
          >
            Breaker Breaker
          </h1>
          <p className="mt-1 text-sm text-[var(--bb-muted)]">
            Label your panel. Click a breaker to edit — changes save as you go.
          </p>
        </div>
      </header>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-400/40 bg-red-950/50 px-4 py-3 text-sm text-red-100"
        >
          {error}
        </div>
      )}

      {loading || !panel ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-16 text-center text-[var(--bb-muted)]">
          Loading panel…
        </div>
      ) : (
        <>
          <PanelGrid
            rowCount={panel.row_count}
            breakers={breakers}
            onSelect={setActiveSlot}
          />
          <RowControls
            busy={busy}
            canDelete={panel.row_count > 1}
            onAdd={() => void addRow()}
            onDelete={() => void deleteLastRow()}
          />
        </>
      )}

      <BreakerModal
        slotNumber={activeSlot ?? 1}
        breaker={activeSlot ? breakers[activeSlot] : undefined}
        open={activeSlot !== null}
        onClose={() => setActiveSlot(null)}
        onChange={(patch) => {
          if (activeSlot !== null) updateBreakerFields(activeSlot, patch)
        }}
      />
    </div>
  )
}
