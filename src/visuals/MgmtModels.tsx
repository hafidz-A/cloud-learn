import type { FC } from 'react'
import { label, quiet } from './styles'

const ROWS = [
  ['', 'Diatur dari', 'Contoh'],
  ['Per perangkat', 'CLI satu-satu', 'SSH ke R1, R2'],
  ['Controller', 'Server lokal', 'Catalyst Center'],
  ['Cloud', 'Dashboard web', 'Meraki'],
]

/** Three ways to manage a network. */
export const MgmtModels: FC = () => (
  <svg
    viewBox="0 0 300 146"
    role="img"
    aria-label="Tiga pendekatan manajemen. Per perangkat: diatur lewat CLI setiap perangkat, misalnya SSH ke R1 lalu ke R2. Berbasis controller: diatur dari server controller di jaringan sendiri, misalnya Cisco Catalyst Center. Berbasis cloud: diatur dari dashboard di internet, misalnya Cisco Meraki."
    className="w-full font-display"
  >
    {ROWS.map((r, i) => (
      <g key={r[0] || 'head'}>
        <rect x={4} y={4 + i * 34} width={292} height={30} rx={6} fill={i === 0 ? 'var(--color-biru-muda)' : i % 2 ? 'var(--color-kabut)' : '#ffffff00'} />
        {r.map((c, j) => (
          <text key={j} x={[10, 100, 196][j]} y={24 + i * 34} fontSize={12} {...(i === 0 || j === 0 ? label : quiet)}>
            {c}
          </text>
        ))}
      </g>
    ))}
  </svg>
)
