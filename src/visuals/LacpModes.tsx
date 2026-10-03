import type { FC } from 'react'
import { label, quiet } from './styles'

const ROWS = [
  { a: 'active', b: 'active', ok: true },
  { a: 'active', b: 'passive', ok: true },
  { a: 'passive', b: 'passive', ok: false },
  { a: 'desirable', b: 'auto', ok: true },
  { a: 'auto', b: 'auto', ok: false },
  { a: 'on', b: 'on', ok: true },
]

/** Which channel-group mode pairs form an EtherChannel. */
export const LacpModes: FC = () => (
  <svg
    viewBox="0 0 300 210"
    role="img"
    aria-label="Pasangan mode channel-group. LACP: active dengan active terbentuk, active dengan passive terbentuk, passive dengan passive tidak terbentuk. PAgP: desirable dengan auto terbentuk, auto dengan auto tidak terbentuk. Mode on dengan on terbentuk tanpa protokol negosiasi."
    className="w-full font-display"
  >
    <text x={8} y={16} fontSize={12} {...quiet}>
      Sisi A
    </text>
    <text x={110} y={16} fontSize={12} {...quiet}>
      Sisi B
    </text>
    <text x={212} y={16} fontSize={12} {...quiet}>
      Hasil
    </text>
    {ROWS.map((r, i) => (
      <g key={`${r.a}-${r.b}`}>
        <rect x={4} y={24 + i * 30} width={292} height={26} rx={6} fill={r.ok ? 'var(--color-mint-muda)' : 'var(--color-koral-muda)'} />
        <text x={10} y={42 + i * 30} fontSize={12} {...label}>
          {r.a}
        </text>
        <text x={112} y={42 + i * 30} fontSize={12} {...label}>
          {r.b}
        </text>
        <text x={214} y={42 + i * 30} fontSize={12} {...label}>
          {r.ok ? 'terbentuk' : 'tidak'}
        </text>
      </g>
    ))}
    <text x={4} y={206} fontSize={12} {...quiet}>
      LACP: active/passive. PAgP: desirable/auto.
    </text>
  </svg>
)
