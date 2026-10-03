import type { FC } from 'react'
import { label, quiet } from './styles'

const ROWS = [
  ['10 Mbps', '10'],
  ['100 Mbps', '1'],
  ['1 Gbps', '1'],
  ['10 Gbps', '1'],
]

/** OSPF cost = reference bandwidth / interface bandwidth, with the default 100 Mbps reference. */
export const OspfCost: FC = () => (
  <svg
    viewBox="0 0 300 200"
    role="img"
    aria-label="Cost OSPF sama dengan reference bandwidth dibagi bandwidth interface. Dengan reference bawaan 100 Mbps, 10 Mbps bernilai 10, sedangkan 100 Mbps, 1 Gbps, dan 10 Gbps semuanya bernilai 1, karena cost minimal 1. Itu sebabnya reference bandwidth sering dinaikkan dengan auto-cost reference-bandwidth, di semua router."
    className="w-full font-display"
  >
    <text x={4} y={18} fontSize={12} {...label}>
      Cost = 100 Mbps / bandwidth (minimal 1)
    </text>
    {ROWS.map(([bw, c], i) => (
      <g key={bw}>
        <rect x={4} y={28 + i * 32} width={292} height={28} rx={6} fill={i === 0 ? 'var(--color-biru-muda)' : 'var(--color-koral-muda)'} />
        <text x={12} y={47 + i * 32} fontSize={12} {...label}>
          {bw}
        </text>
        <text x={288} y={47 + i * 32} fontSize={12} textAnchor="end" {...label}>
          cost {c}
        </text>
      </g>
    ))}
    <text x={4} y={174} fontSize={12} {...quiet}>
      100 Mbps ke atas: semua cost 1
    </text>
    <text x={4} y={192} fontSize={12} {...quiet}>
      Solusi: auto-cost reference-bandwidth
    </text>
  </svg>
)
