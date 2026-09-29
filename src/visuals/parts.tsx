// Shared pieces for the diagrams in this folder (text styles are in styles.ts).
import type { ReactNode } from 'react'
import { label } from './styles'

export function ServerStack({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {[0, 11, 22].map((dy) => (
        <g key={dy}>
          <rect x={x} y={y + dy} width={36} height={8} rx={2.5} fill="var(--color-kabut)" stroke="var(--color-tinta-lembut)" strokeWidth={1.5} />
          <circle cx={x + 6} cy={y + dy + 4} r={1.6} fill="var(--color-mint-dalam)" />
        </g>
      ))}
    </g>
  )
}

export function Bolt({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x + 5} ${y} L${x} ${y + 9} H${x + 4} L${x + 2} ${y + 16} L${x + 9} ${y + 6} H${x + 5} L${x + 7} ${y} Z`}
      fill="var(--color-matahari)"
      stroke="var(--color-matahari-dalam)"
      strokeWidth={1}
      strokeLinejoin="round"
    />
  )
}

/** An arrowhead marker. `id` must be unique on the page, so each diagram passes its own. */
export function ArrowMarker({ id, color = 'var(--color-biru-dalam)' }: { id: string; color?: string }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 Z" fill={color} />
    </marker>
  )
}

/**
 * Diagonal stripes for the "provider looks after this" cells, so those cells
 * differ from the customer cells by pattern as well as by color. `id` must be
 * unique on the page.
 */
export function Hatch({ id, color = 'var(--color-kabut-dalam)', background = 'var(--color-kabut)' }: { id: string; color?: string; background?: string }) {
  return (
    <pattern id={id} width={6} height={6} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width={6} height={6} fill={background} />
      <line x1={0} y1={0} x2={0} y2={6} stroke={color} strokeWidth={2.5} />
    </pattern>
  )
}

/** A cloud drawn in a 60 x 36 box, scaled to width `w`. */
export function Cloud({ x, y, w = 60, fill = 'var(--color-biru-muda)', stroke = 'var(--color-biru-dalam)', dashed = false }: { x: number; y: number; w?: number; fill?: string; stroke?: string; dashed?: boolean }) {
  const s = w / 60
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M14 34 H47 A11 11 0 0 0 48 12 A16 16 0 0 0 20 9 A12.5 12.5 0 0 0 14 34 Z"
      fill={fill}
      stroke={stroke}
      strokeWidth={2 / s}
      strokeDasharray={dashed ? `${5 / s} ${4 / s}` : undefined}
      strokeLinejoin="round"
    />
  )
}

/** An office building, 34 wide and 40 tall. */
export function Building({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width={34} height={40} rx={3} fill="#fff" stroke="var(--color-tinta-lembut)" strokeWidth={2} />
      {[0, 1, 2].map((r) =>
        [0, 1].map((c) => <rect key={`${r}-${c}`} x={x + 7 + c * 13} y={y + 6 + r * 10} width={7} height={6} rx={1} fill="var(--color-kabut-dalam)" />),
      )}
      <rect x={x + 13} y={y + 32} width={8} height={8} fill="var(--color-kabut-dalam)" />
    </g>
  )
}

/** A person: head and shoulders, 14 wide and 16 tall. */
export function Person({ x, y, color = 'var(--color-biru-dalam)' }: { x: number; y: number; color?: string }) {
  return (
    <g fill={color}>
      <circle cx={x + 7} cy={y + 4.5} r={4.5} />
      <path d={`M${x} ${y + 16} Q${x} ${y + 9} ${x + 7} ${y + 9} Q${x + 14} ${y + 9} ${x + 14} ${y + 16} Z`} />
    </g>
  )
}

/** A single server box with two drive lines, `w` wide and `h` tall. */
export function Server({ x, y, w = 26, h = 32 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4} fill="#fff" stroke="var(--color-biru-dalam)" strokeWidth={2} />
      {[0.3, 0.6].map((f) => (
        <line key={f} x1={x + 5} y1={y + h * f} x2={x + w - 5} y2={y + h * f} stroke="var(--color-kabut-dalam)" strokeWidth={2} strokeLinecap="round" />
      ))}
      <circle cx={x + w - 7} cy={y + h - 6} r={2} fill="var(--color-mint-dalam)" />
    </g>
  )
}

/** A round badge with a check mark (good) or a cross (bad), radius 8. */
export function Mark({ cx, cy, ok }: { cx: number; cy: number; ok: boolean }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={8} fill={ok ? 'var(--color-mint)' : 'var(--color-koral)'} />
      {ok ? (
        <path d={`M${cx - 4} ${cy} L${cx - 1} ${cy + 3} L${cx + 4.5} ${cy - 3.5}`} fill="none" stroke="var(--color-tinta)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d={`M${cx - 3.5} ${cy - 3.5} L${cx + 3.5} ${cy + 3.5} M${cx + 3.5} ${cy - 3.5} L${cx - 3.5} ${cy + 3.5}`} stroke="var(--color-tinta)" strokeWidth={2.2} strokeLinecap="round" />
      )}
    </g>
  )
}

/** A padlock, 16 wide and 18 tall. */
export function Padlock({ x, y, color = 'var(--color-tinta-lembut)' }: { x: number; y: number; color?: string }) {
  return (
    <g>
      <path d={`M${x + 4} ${y + 8} V${y + 5} A4 4 0 0 1 ${x + 12} ${y + 5} V${y + 8}`} fill="none" stroke={color} strokeWidth={2} />
      <rect x={x} y={y + 8} width={16} height={10} rx={2} fill={color} />
    </g>
  )
}

/** A rounded box with centered text lines (12px or more). */
export function Pill({
  x,
  y,
  w,
  h = 26,
  lines,
  fill = '#fff',
  stroke = 'var(--color-biru)',
  dashed = false,
  size = 12,
  children,
}: {
  x: number
  y: number
  w: number
  h?: number
  lines: string[]
  fill?: string
  stroke?: string
  dashed?: boolean
  size?: number
  children?: ReactNode
}) {
  const lead = size + 3
  const top = y + h / 2 - ((lines.length - 1) * lead) / 2 + size * 0.36
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={fill} stroke={stroke} strokeWidth={2} strokeDasharray={dashed ? '5 4' : undefined} />
      {lines.map((line, i) => (
        <text key={line} x={x + w / 2} y={top + i * lead} fontSize={size} textAnchor="middle" {...label}>
          {line}
        </text>
      ))}
      {children}
    </g>
  )
}
