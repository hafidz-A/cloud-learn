import type { FC } from 'react'
import { label, quiet } from './styles'

const ROUTES = [
  { p: '0.0.0.0/0', ok: true, win: false },
  { p: '10.1.0.0/16', ok: true, win: false },
  { p: '10.1.1.0/24', ok: true, win: false },
  { p: '10.1.1.128/25', ok: true, win: true },
  { p: '10.1.2.0/24', ok: false, win: false },
]

/** For destination 10.1.1.200, every matching route is a candidate; the longest prefix wins. */
export const LongestPrefix: FC = () => (
  <svg
    viewBox="0 0 300 210"
    role="img"
    aria-label="Tujuan 10.1.1.200. Route yang cocok: 0.0.0.0/0, 10.1.0.0/16, 10.1.1.0/24, dan 10.1.1.128/25. Route 10.1.2.0/24 tidak cocok. Dari yang cocok, router memilih prefix terpanjang, /25, karena paling spesifik."
    className="w-full font-display"
  >
    <text x={4} y={16} fontSize={12} {...label}>
      Tujuan: 10.1.1.200
    </text>
    {ROUTES.map((r, i) => (
      <g key={r.p}>
        <rect x={4} y={26 + i * 34} width={292} height={30} rx={6} fill={r.win ? 'var(--color-mint-muda)' : r.ok ? 'var(--color-biru-muda)' : 'var(--color-kabut)'} />
        <text x={12} y={46 + i * 34} fontSize={13} fontFamily="monospace" {...label}>
          {r.p}
        </text>
        <text x={288} y={46 + i * 34} fontSize={12} textAnchor="end" {...quiet}>
          {r.win ? 'terpanjang, dipakai' : r.ok ? 'cocok' : 'tidak cocok'}
        </text>
      </g>
    ))}
    <text x={4} y={206} fontSize={12} {...quiet}>
      Prefix terpanjang dulu, baru AD dan metric
    </text>
  </svg>
)
