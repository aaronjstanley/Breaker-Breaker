import type { DbBreaker } from '../lib/supabase'

type Props = {
  slotNumber: number
  breaker?: DbBreaker
  onClick: () => void
}

export function BreakerSlot({ slotNumber, breaker, onClick }: Props) {
  const isOdd = slotNumber % 2 === 1
  const title = breaker?.title?.trim() ?? ''
  const amps = breaker?.amps

  return (
    <div className="flex items-center gap-2">
      {isOdd && (
        <span className="w-6 shrink-0 text-right text-sm font-semibold tabular-nums text-[var(--bb-muted)]">
          {slotNumber}
        </span>
      )}

      <button
        type="button"
        onClick={onClick}
        className="group flex h-12 min-w-0 flex-1 overflow-hidden rounded-md border border-[var(--bb-slot-edge)] bg-[var(--bb-slot)] text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:border-[var(--bb-yellow)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bb-yellow)]"
        aria-label={`Breaker ${slotNumber}${title ? `: ${title}` : ''}`}
      >
        <span className="flex w-9 shrink-0 items-center justify-center border-r border-[var(--bb-slot-edge)] bg-[#14171c]">
          <span
            className="origin-center text-xs font-bold tabular-nums tracking-wide text-[var(--bb-amp)]"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            {amps === null || amps === undefined ? '' : amps}
          </span>
        </span>
        <span className="flex min-w-0 flex-1 items-center px-3 text-sm font-medium text-[var(--bb-ink)]">
          <span className="truncate">{title || <span className="text-[var(--bb-muted)] opacity-60">—</span>}</span>
        </span>
      </button>

      {!isOdd && (
        <span className="w-6 shrink-0 text-left text-sm font-semibold tabular-nums text-[var(--bb-muted)]">
          {slotNumber}
        </span>
      )}
    </div>
  )
}
