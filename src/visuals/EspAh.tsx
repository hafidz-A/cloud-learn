import type { FC } from 'react'
import { label, quiet } from './styles'

const ROWS = [
  ['', 'AH', 'ESP'],
  ['Protokol IP', '51', '50'],
  ['Enkripsi', 'Tidak', 'Ya'],
  ['Integritas', 'Ya', 'Ya'],
  ['Autentikasi', 'Ya', 'Ya'],
]

/** AH compared with ESP. */
export const EspAh: FC = () => (
  <svg
    viewBox="0 0 300 180"
    role="img"
    aria-label="AH dibandingkan ESP. AH memakai nomor protokol IP 51 dan memberi integritas serta autentikasi asal data tanpa enkripsi. ESP memakai nomor protokol IP 50 dan memberi enkripsi, ditambah integritas dan autentikasi."
    className="w-full font-display"
  >
    {ROWS.map((r, i) => (
      <g key={r[0] || 'head'}>
        <rect x={4} y={4 + i * 34} width={292} height={30} rx={6} fill={i === 0 ? 'var(--color-biru-muda)' : i % 2 ? 'var(--color-kabut)' : '#ffffff00'} />
        {r.map((c, j) => (
          <text key={j} x={[10, 130, 210][j]} y={24 + i * 34} fontSize={12} {...(i === 0 || j === 0 ? label : quiet)}>
            {c}
          </text>
        ))}
      </g>
    ))}
  </svg>
)
