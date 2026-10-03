import type { FC } from 'react'
import { label, quiet } from './styles'

const PINS = [1, 2, 3, 6]

function Cable({ x, title, cross, note }: { x: number; title: string; cross: boolean; note: string }) {
  const top = 46
  const gap = 26
  const map: Record<number, number> = cross ? { 1: 3, 2: 6, 3: 1, 6: 2 } : { 1: 1, 2: 2, 3: 3, 6: 6 }
  const row = (p: number) => top + PINS.indexOf(p) * gap
  return (
    <g>
      <text x={x + 64} y={18} fontSize={13} textAnchor="middle" {...label}>
        {title}
      </text>
      <text x={x + 64} y={34} fontSize={12} textAnchor="middle" {...quiet}>
        {note}
      </text>
      {PINS.map((p) => (
        <g key={p}>
          <rect x={x} y={row(p) - 9} width={22} height={18} rx={4} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={1.2} />
          <text x={x + 11} y={row(p) + 4} fontSize={12} textAnchor="middle" {...label}>
            {p}
          </text>
          <rect x={x + 106} y={row(map[p]) - 9} width={22} height={18} rx={4} fill="var(--color-mint-muda)" stroke="var(--color-mint-dalam)" strokeWidth={1.2} />
          <text x={x + 117} y={row(map[p]) + 4} fontSize={12} textAnchor="middle" {...label}>
            {map[p]}
          </text>
          <path d={`M${x + 22} ${row(p)} L${x + 106} ${row(map[p])}`} stroke={cross ? 'var(--color-koral-dalam)' : 'var(--color-tinta-lembut)'} strokeWidth={2} />
        </g>
      ))}
    </g>
  )
}

/** Pins used by 10/100 Ethernet: straight-through keeps 1-2 and 3-6, crossover swaps them. Auto-MDIX makes either work. */
export const StraightVsCrossover: FC = () => (
  <svg
    viewBox="0 0 300 190"
    role="img"
    aria-label="Kabel straight-through menyambung pin 1 ke 1, 2 ke 2, 3 ke 3, dan 6 ke 6. Kabel crossover menukar pasangan: pin 1 ke 3, 2 ke 6, 3 ke 1, dan 6 ke 2. Ethernet 10 dan 100 Mbps memakai pin 1, 2, 3, dan 6. Dengan auto-MDIX, port menyesuaikan sendiri sehingga kedua kabel bisa dipakai."
    className="w-full font-display"
  >
    <Cable x={6} title="Straight-through" cross={false} note="pin sama" />
    <Cable x={166} title="Crossover" cross note="1-2 ditukar 3-6" />
    <text x={150} y={172} fontSize={12} textAnchor="middle" {...quiet}>
      Auto-MDIX: port memperbaiki sendiri jenis kabelnya
    </text>
  </svg>
)
