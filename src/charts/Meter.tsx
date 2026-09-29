/** Labeled horizontal meter: light track, Biru langit fill, value in text ink. */
export function Meter({ label, detail, value, valueText }: { label: string; detail?: string; value: number; valueText: string }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100)
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="min-w-0 truncate font-display text-15 font-bold">{label}</p>
        <p className="shrink-0 font-display text-15 font-bold tabular-nums">{valueText}</p>
      </div>
      {detail && <p className="text-13 text-tinta-lembut">{detail}</p>}
      <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-biru-muda" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-valuetext={valueText}>
        <div className="h-full rounded-full bg-biru" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
