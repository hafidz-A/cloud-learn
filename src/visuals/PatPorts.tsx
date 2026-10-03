import type { FC } from 'react'
import { label, quiet } from './styles'

const ROWS = [
  ['192.168.1.10:51000', '203.0.113.5:51000'],
  ['192.168.1.11:51000', '203.0.113.5:51001'],
  ['192.168.1.12:49152', '203.0.113.5:49152'],
]

/** PAT keeps sessions apart by port number on one public address. */
export const PatPorts: FC = () => (
  <svg
    viewBox="0 0 300 150"
    role="img"
    aria-label="Tabel PAT. Tiga host dalam, 192.168.1.10, .11, dan .12, keluar memakai satu alamat publik 203.0.113.5. Router membedakan sesi lewat nomor port. Host .11 memakai port sumber 51000 yang sudah dipakai host .10, jadi router menggantinya menjadi 51001."
    className="w-full font-display"
  >
    <rect x={4} y={4} width={292} height={30} rx={6} fill="var(--color-biru-muda)" />
    <text x={10} y={24} fontSize={12} {...label}>
      Inside local
    </text>
    <text x={162} y={24} fontSize={12} {...label}>
      Inside global
    </text>
    {ROWS.map((r, i) => (
      <g key={r[0]}>
        <rect x={4} y={38 + i * 34} width={292} height={30} rx={6} fill={i === 1 ? 'var(--color-matahari-muda)' : 'var(--color-kabut)'} />
        <text x={10} y={58 + i * 34} fontSize={12} {...quiet}>
          {r[0]}
        </text>
        <text x={136} y={58 + i * 34} fontSize={12} {...label}>
          →
        </text>
        <text x={162} y={58 + i * 34} fontSize={12} {...quiet}>
          {r[1]}
        </text>
      </g>
    ))}
  </svg>
)
