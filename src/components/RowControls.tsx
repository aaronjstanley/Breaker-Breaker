type Props = {
  busy: boolean
  canDelete: boolean
  onAdd: () => void
  onDelete: () => void
}

export function RowControls({ busy, canDelete, onAdd, onDelete }: Props) {
  return (
    <div className="mx-auto mt-6 flex w-full max-w-3xl items-stretch overflow-hidden rounded-xl border border-[#2a2108] bg-[var(--bb-yellow)] shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
      <button
        type="button"
        disabled={busy}
        onClick={onAdd}
        className="flex-1 px-4 py-3.5 text-center text-sm font-bold uppercase tracking-[0.12em] text-[#1a1400] transition hover:bg-[#ffd84a] disabled:opacity-50"
      >
        Add row
      </button>
      <div className="w-px bg-[#1a1400]/30" aria-hidden />
      <button
        type="button"
        disabled={busy || !canDelete}
        onClick={onDelete}
        className="flex-1 px-4 py-3.5 text-center text-sm font-bold uppercase tracking-[0.12em] text-[#1a1400] transition hover:bg-[#ffd84a] disabled:opacity-50"
      >
        Delete last row
      </button>
      <div
        className="hidden w-4 shrink-0 bg-[var(--bb-yellow)] sm:block"
        style={{
          clipPath: 'polygon(0 0, 100% 20%, 100% 80%, 0 100%)',
          marginRight: '-2px',
        }}
        aria-hidden
      />
    </div>
  )
}
