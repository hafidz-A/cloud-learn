import type { FC } from 'react'
import { label, quiet } from './styles'

const ROWS = [
  ['', 'Buang', 'Log', 'Port'],
  ['protect', 'Ya', 'Tidak', 'Tetap up'],
  ['restrict', 'Ya', 'Ya', 'Tetap up'],
  ['shutdown', 'Ya', 'Ya', 'err-disabled'],
]

/** What each port security violation mode does. */
export const PsecModes: FC = () => (
  <svg
    viewBox="0 0 300 146"
    role="img"
    aria-label="Mode pelanggaran port security. Protect membuang frame dari MAC yang tidak dikenal tanpa log, dan port tetap up. Restrict membuang frame, mencatat syslog, mengirim trap SNMP, dan menaikkan penghitung, dan port tetap up. Shutdown, mode bawaan, membuat port err-disabled dan mencatat log."
    className="w-full font-display"
  >
    {ROWS.map((r, i) => (
      <g key={r[0] || 'head'}>
        <rect x={4} y={4 + i * 34} width={292} height={30} rx={6} fill={i === 0 ? 'var(--color-biru-muda)' : i === 3 ? 'var(--color-koral-muda)' : 'var(--color-kabut)'} />
        {r.map((c, j) => (
          <text key={j} x={[10, 92, 150, 204][j]} y={24 + i * 34} fontSize={12} {...(i === 0 || j === 0 ? label : quiet)}>
            {c}
          </text>
        ))}
      </g>
    ))}
  </svg>
)
