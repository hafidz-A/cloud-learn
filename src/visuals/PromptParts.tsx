import type { FC } from 'react'
import { label, quiet } from './styles'

const PARTS = [
  ['Peran', 'Engineer jaringan senior'],
  ['Konteks', 'R1 ISR4331, OSPF area 0'],
  ['Tugas', 'Kenapa tetangga tidak FULL?'],
  ['Data', 'show ip ospf interface'],
  ['Format', '3 poin + perintah cek'],
]

/** The parts of a useful prompt for network work. */
export const PromptParts: FC = () => (
  <svg
    viewBox="0 0 300 178"
    role="img"
    aria-label="Bagian prompt yang baik. Peran: kamu engineer jaringan senior. Konteks: R1 ISR4331, OSPF area 0. Tugas: jelaskan kenapa tetangga tidak mencapai FULL. Data: output show ip ospf interface, tanpa rahasia. Format: tiga poin, lalu perintah untuk mengecek."
    className="w-full font-display"
  >
    {PARTS.map(([k, v], i) => (
      <g key={k}>
        <rect x={4} y={4 + i * 34} width={66} height={30} rx={6} fill="var(--color-biru-muda)" />
        <text x={12} y={24 + i * 34} fontSize={12} {...label}>
          {k}
        </text>
        <text x={78} y={24 + i * 34} fontSize={12} {...quiet}>
          {v}
        </text>
      </g>
    ))}
  </svg>
)
