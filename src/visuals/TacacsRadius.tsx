import type { FC } from 'react'
import { label, quiet } from './styles'

const ROWS = [
  ['', 'TACACS+', 'RADIUS'],
  ['Transport', 'TCP 49', 'UDP 1812/1813'],
  ['Enkripsi', 'Seluruh isi', 'Password saja'],
  ['AAA', 'Terpisah', 'Authn+authz satu'],
  ['Cocok untuk', 'Admin perangkat', 'Akses pengguna'],
]

/** TACACS+ compared with RADIUS. */
export const TacacsRadius: FC = () => (
  <svg
    viewBox="0 0 300 180"
    role="img"
    aria-label="TACACS+ dibandingkan RADIUS. TACACS+ memakai TCP port 49, mengenkripsi seluruh isi paket, memisahkan authentication, authorization, dan accounting, dan cocok untuk administrasi perangkat. RADIUS memakai UDP port 1812 dan 1813, hanya mengenkripsi password, menggabungkan authentication dan authorization, dan cocok untuk akses pengguna seperti 802.1X."
    className="w-full font-display"
  >
    {ROWS.map((r, i) => (
      <g key={r[0] || 'head'}>
        <rect x={4} y={4 + i * 34} width={292} height={30} rx={6} fill={i === 0 ? 'var(--color-biru-muda)' : i % 2 ? 'var(--color-kabut)' : '#ffffff00'} />
        <text x={10} y={24 + i * 34} fontSize={12} {...label}>
          {r[0]}
        </text>
        <text x={96} y={24 + i * 34} fontSize={12} {...(i === 0 ? label : quiet)}>
          {r[1]}
        </text>
        <text x={190} y={24 + i * 34} fontSize={12} {...(i === 0 ? label : quiet)}>
          {r[2]}
        </text>
      </g>
    ))}
  </svg>
)
