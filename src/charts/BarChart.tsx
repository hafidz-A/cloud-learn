import { useState } from 'react'

export type Bar = { key: string; label: string; full: string; value: number }

// Single-series columns (one color, no legend: the card title names the series).
// Thin bars with a rounded data end, a hairline baseline, an optional labeled
// reference line, a value only on the highlighted bar, and a readout that
// follows hover, focus, or tap. A visually hidden table carries every value.

const W = 320
const H = 150
const PAD = { top: 22, right: 8, bottom: 24, left: 8 }
const BAR_MAX = 24

export function BarChart({
  data,
  unit,
  highlight,
  reference,
  caption,
}: {
  data: Bar[]
  unit: string
  highlight?: string
  reference?: { value: number; label: string }
  caption: string
}) {
  const [active, setActive] = useState<string | null>(null)
  const max = Math.max(1, reference?.value ?? 0, ...data.map((d) => d.value))
  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const band = plotW / data.length
  const barW = Math.min(BAR_MAX, band * 0.6)
  const y = (v: number) => PAD.top + plotH - (v / max) * plotH
  const shown = data.find((d) => d.key === (active ?? highlight)) ?? data[data.length - 1]

  return (
    <figure>
      <p className="font-display text-15 font-semibold" aria-live="polite">
        {shown.full}: <span className="text-20 font-bold">{shown.value}</span> {unit}
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 w-full touch-manipulation" role="img" aria-label={caption} onPointerLeave={() => setActive(null)}>
        {reference && (
          <g aria-hidden="true">
            <line x1={PAD.left} x2={W - PAD.right} y1={y(reference.value)} y2={y(reference.value)} stroke="var(--color-kabut-dalam)" strokeWidth={1} strokeDasharray="4 4" />
            <text x={PAD.left} y={y(reference.value) - 4} textAnchor="start" fontSize={11} fill="var(--color-tinta-lembut)" className="font-display">
              {reference.label}
            </text>
          </g>
        )}
        <line x1={PAD.left} x2={W - PAD.right} y1={PAD.top + plotH} y2={PAD.top + plotH} stroke="var(--color-kabut)" strokeWidth={1} aria-hidden="true" />
        {data.map((d, i) => {
          const cx = PAD.left + band * i + band / 2
          const top = y(d.value)
          const h = PAD.top + plotH - top
          const isShown = d.key === shown.key
          const r = Math.min(4, h)
          return (
            <g
              key={d.key}
              tabIndex={0}
              role="button"
              aria-label={`${d.full}: ${d.value} ${unit}`}
              onPointerEnter={() => setActive(d.key)}
              onPointerDown={() => setActive(d.key)}
              onFocus={() => setActive(d.key)}
              className="cursor-pointer outline-none"
            >
              <rect x={PAD.left + band * i} y={PAD.top} width={band} height={plotH + PAD.bottom} fill="transparent" />
              {h > 0 && (
                <path
                  d={`M${cx - barW / 2} ${PAD.top + plotH} V${top + r} Q${cx - barW / 2} ${top} ${cx - barW / 2 + r} ${top} H${cx + barW / 2 - r} Q${cx + barW / 2} ${top} ${cx + barW / 2} ${top + r} V${PAD.top + plotH} Z`}
                  fill="var(--color-biru)"
                  opacity={isShown ? 1 : 0.55}
                />
              )}
              {isShown && d.value > 0 && (
                <text x={cx} y={top - 5} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--color-tinta)" className="font-display">
                  {d.value}
                </text>
              )}
              <text x={cx} y={H - 6} textAnchor="middle" fontSize={11} fontWeight={isShown ? 700 : 500} fill={isShown ? 'var(--color-tinta)' : 'var(--color-tinta-lembut)'} className="font-display">
                {d.label}
              </text>
            </g>
          )
        })}
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
