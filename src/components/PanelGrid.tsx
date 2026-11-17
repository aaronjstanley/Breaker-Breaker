import type { DbBreaker } from '../lib/supabase'
import { BreakerSlot } from './BreakerSlot'

type Props = {
  rowCount: number
  breakers: Record<number, DbBreaker>
  onSelect: (slotNumber: number) => void
}

export function PanelGrid({ rowCount, breakers, onSelect }: Props) {
  const rows = Array.from({ length: rowCount }, (_, i) => i + 1)

  return (
    <div className="mx-auto w-full max-w-3xl rounded-[1.75rem] border border-[#9aa3ad] bg-[var(--bb-panel)] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-4">
      <div className="rounded-[1.25rem] bg-[var(--bb-panel-inner)] p-3 sm:p-4">
        <div className="flex flex-col gap-2">
          {rows.map((row) => {
            const odd = row * 2 - 1
            const even = row * 2
            return (
              <div key={row} className="grid grid-cols-2 gap-2 sm:gap-3">
                <BreakerSlot
                  slotNumber={odd}
                  breaker={breakers[odd]}
                  onClick={() => onSelect(odd)}
                />
                <BreakerSlot
                  slotNumber={even}
                  breaker={breakers[even]}
                  onClick={() => onSelect(even)}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
