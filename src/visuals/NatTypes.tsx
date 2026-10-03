import type { FC } from 'react'
import { label, quiet } from './styles'

const ROWS = [
  ['', 'Dalam', 'Publik', 'Arah'],
  ['Static', '1', '1 tetap', 'Dua arah'],
  ['Dynamic', 'Banyak', 'Pool', 'Keluar dulu'],
  ['PAT', 'Banyak', '1 + port', 'Keluar dulu'],
]

/** Static NAT, dynamic NAT, and PAT side by side. */
export const NatTypes: FC = () => (
  <svg
    viewBox="0 0 300 146"
    role="img"
    aria-label="Tiga jenis NAT. Static NAT memetakan satu alamat dalam ke satu alamat publik yang tetap, dan koneksi bisa dimulai dari dua arah. Dynamic NAT memetakan banyak alamat dalam ke alamat dari pool, satu alamat publik per host selama dipakai, dan koneksi dimulai dari dalam. PAT memetakan banyak alamat dalam ke satu alamat publik dengan nomor port yang berbeda, dan koneksi dimulai dari dalam."
    className="w-full font-display"
  >
    {ROWS.map((r, i) => (
      <g key={r[0] || 'head'}>
        <rect x={4} y={4 + i * 34} width={292} height={30} rx={6} fill={i === 0 ? 'var(--color-biru-muda)' : i % 2 ? 'var(--color-kabut)' : '#ffffff00'} />
        {r.map((c, j) => (
          <text key={j} x={[10, 82, 146, 216][j]} y={24 + i * 34} fontSize={12} {...(i === 0 || j === 0 ? label : quiet)}>
            {c}
          </text>
        ))}
      </g>
    ))}
  </svg>
)
