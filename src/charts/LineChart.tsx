import { useState } from 'react'

export type Point = { key: string; label: string; full: string; value: number }

// Single-series line (2px, 8px markers with a surface ring), labeled reference
// lines for thresholds, a crosshair readout on hover, focus, or tap, the last
// value labeled at the end, and a hidden table with every value.

const W = 320
const H = 170
const PAD = { top: 16, right: 34, bottom: 24, left: 34 }

export function LineChart({
  data,
  yMax,
  references = [],
  caption,
  unit,
}: {
  data: Point[]
  yMax: number
  references?: { value: number; label: string }[]
  caption: string
  unit: string
}) {
  const [active, setActive] = useState<number | null>(null)
  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const x = (i: number) => PAD.left + (data.length === 1 ? plotW / 2 : (plotW * i) / (data.length - 1))
  const y = (v: number) => PAD.top + plotH - (v / yMax) * plotH
  const shownIndex = active ?? data.length - 1
  const shown = data[shownIndex]
  const path = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i)} ${y(d.value)}`).join(' ')

  const nearest = (clientX: number, svg: SVGSVGElement) => {
    const rect = svg.getBoundingClientRect()
    const px = ((clientX - rect.left) / rect.width) * W
    let best = 0
    data.forEach((_, i) => {
      if (Math.abs(x(i) - px) < Math.abs(x(best) - px)) best = i
    })
    setActive(best)
  }

  return (
    <figure>
      <p className="font-display text-15 font-semibold" aria-live="polite">
        {shown.full}: <span className="text-20 font-bold">{shown.value}</span> {unit}
      </p>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-2 w-full touch-manipulation"
        role="group"
        aria-label={caption}
        onPointerMove={(e) => nearest(e.clientX, e.currentTarget)}
        onPointerDown={(e) => nearest(e.clientX, e.currentTarget)}
        onPointerLeave={() => setActive(null)}
      >
        {[0, yMax / 2, yMax].map((t) => (
          <g key={t} aria-hidden="true">
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--color-kabut)" strokeWidth={1} />
            <text x={PAD.left - 6} y={y(t) + 4} textAnchor="end" fontSize={11} fill="var(--color-tinta-lembut)" className="font-display tabular-nums">
              {t}
            </text>
          </g>
        ))}
        {references.map((r) => (
          <g key={r.value} aria-hidden="true">
            <line x1={PAD.left} x2={W - PAD.right} y1={y(r.value)} y2={y(r.value)} stroke="var(--color-kabut-dalam)" strokeWidth={1} strokeDasharray="4 4" />
            <text x={W - PAD.right + 4} y={y(r.value) + 4} fontSize={11} fill="var(--color-tinta-lembut)" className="font-display">
              {r.label}
            </text>
          </g>
        ))}
        {active !== null && (
          <line x1={x(shownIndex)} x2={x(shownIndex)} y1={PAD.top} y2={PAD.top + plotH} stroke="var(--color-kabut-dalam)" strokeWidth={1} aria-hidden="true" />
        )}
        <path d={path} fill="none" stroke="var(--color-biru)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {data.map((d, i) => (
          <circle
            key={d.key}
            cx={x(i)}
            cy={y(d.value)}
            r={i === shownIndex ? 5.5 : 4}
            fill="var(--color-biru)"
            stroke="#fff"
            strokeWidth={2}
            tabIndex={0}
            role="button"
            aria-label={`${d.full}: ${d.value} ${unit}`}
            onFocus={() => setActive(i)}
            className="outline-none"
          />
        ))}
        {data.length > 0 && (
          <text x={x(data.length - 1)} y={y(data[data.length - 1].value) - 10} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--color-tinta)" className="font-display" aria-hidden="true">
            {data[data.length - 1].value}
          </text>
        )}
        {data.map((d, i) =>
          i === 0 || i === data.length - 1 || i === shownIndex ? (
            <text key={`l-${d.key}`} x={x(i)} y={H - 6} textAnchor="middle" fontSize={11} fill="var(--color-tinta-lembut)" className="font-display" aria-hidden="true">
              {d.label}
            </text>
          ) : null,
        )}
      </svg>
      <table className="sr-only">
        <caption>{caption}</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.key}>
              <th scope="row">{d.full}</th>
              <td>
                {d.value} {unit}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
