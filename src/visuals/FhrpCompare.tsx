import type { FC } from 'react'
import { label, quiet } from './styles'

const ROWS = [
  ['', 'HSRP', 'VRRP', 'GLBP'],
  ['Pemilik', 'Cisco', 'Standar', 'Cisco'],
  ['Utama', 'Active', 'Master', 'AVG'],
  ['Preempt', 'Mati', 'Aktif', 'Mati'],
  ['Bagi beban', 'Tidak', 'Tidak', 'Ya'],
]

/** HSRP, VRRP, and GLBP side by side. */
export const FhrpCompare: FC = () => (
  <svg
    viewBox="0 0 300 180"
    role="img"
    aria-label="Perbandingan FHRP. HSRP milik Cisco, router utamanya active, preempt mati secara bawaan, tidak membagi beban. VRRP standar terbuka, router utamanya master, preempt aktif secara bawaan, tidak membagi beban. GLBP milik Cisco, router utamanya AVG, preempt mati secara bawaan, dan membagi beban ke beberapa router."
    className="w-full font-display"
  >
    {ROWS.map((r, i) => (
      <g key={r[0] || 'head'}>
        <rect x={4} y={4 + i * 34} width={292} height={30} rx={6} fill={i === 0 ? 'var(--color-biru-muda)' : i % 2 ? 'var(--color-kabut)' : '#ffffff00'} />
        {r.map((c, j) => (
          <text key={j} x={j === 0 ? 10 : 70 + (j - 1) * 78} y={24 + i * 34} fontSize={12} {...(i === 0 || j === 0 ? label : quiet)}>
            {c}
          </text>
        ))}
      </g>
    ))}
  </svg>
)
