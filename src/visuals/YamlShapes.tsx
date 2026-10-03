import type { FC } from 'react'
import { label, quiet } from './styles'

const LINES = [
  { t: '---', n: 'awal dokumen' },
  { t: 'hostname: R1', n: 'kunci: nilai' },
  { t: 'vlans:', n: 'kunci berisi list' },
  { t: '  - 10', n: 'item list, menjorok' },
  { t: '  - 20', n: '' },
  { t: 'snmp:', n: 'kunci berisi dict' },
  { t: '  lokasi: Rak-2', n: 'dua spasi, bukan tab' },
]

/** The shapes of YAML: key-value pairs, lists, and nested dictionaries. */
export const YamlShapes: FC = () => (
  <svg
    viewBox="0 0 300 186"
    role="img"
    aria-label="Contoh YAML. Baris tiga tanda minus menandai awal dokumen. hostname: R1 adalah pasangan kunci dan nilai. vlans: berisi list, dengan item tanda minus 10 dan tanda minus 20 yang menjorok. snmp: berisi dictionary bersarang, lokasi: Rak-2, menjorok dua spasi, bukan tab."
    className="w-full font-display"
  >
    <rect x={4} y={4} width={136} height={178} rx={8} fill="var(--color-kabut)" />
    {LINES.map((l, i) => (
      <g key={l.t}>
        <text x={12} y={26 + i * 24} fontSize={12} fontFamily="ui-monospace, monospace" {...label}>
          {l.t}
        </text>
        <text x={150} y={26 + i * 24} fontSize={12} {...quiet}>
          {l.n}
        </text>
      </g>
    ))}
  </svg>
)
