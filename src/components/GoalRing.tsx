/** Circular daily goal progress (plan section 4, "cincin progres di home"). */
export function GoalRing({ value, size = 64 }: { value: number; size?: number }) {
  const stroke = 7
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.min(1, Math.max(0, value))
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" className="shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-kabut)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={pct >= 1 ? 'var(--color-mint)' : 'var(--color-matahari)'}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        className="transition-[stroke-dashoffset] duration-700 motion-reduce:transition-none"
      />
    </svg>
  )
}
