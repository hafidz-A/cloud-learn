import type { FC } from 'react'
import { Mark } from './parts'
import { label, quiet } from './styles'

const VNETS = [
  { x: 0, name: 'VNet A', cidr: '10.1.0.0/16' },
  { x: 106, name: 'VNet B', cidr: '10.2.0.0/16' },
  { x: 212, name: 'VNet C', cidr: '10.3.0.0/16' },
]

/**
 * A peers with B, and B peers with C, but A still can't reach C: peering is
 * not transitive. Each pair needs its own peering (or a hub that forwards).
 */
export const PeeringNonTransitive: FC = () => (
  <svg
    viewBox="0 0 300 196"
    role="img"
    aria-label="Diagram peering tidak transitif: VNet A di-peering ke VNet B, dan VNet B di-peering ke VNet C. VM di VNet A tetap tidak bisa menjangkau VNet C. Untuk itu, buat peering A ke C sendiri, atau lewatkan trafik lewat hub dengan network virtual appliance atau gateway."
    className="w-full font-display"
  >
    {VNETS.map((v) => (
      <g key={v.name}>
        <rect x={v.x + 1} y={40} width={86} height={56} rx={12} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={2} />
        <text x={v.x + 44} y={63} fontSize={12} textAnchor="middle" {...label}>
          {v.name}
        </text>
        <text x={v.x + 44} y={81} fontSize={12} textAnchor="middle" {...quiet}>
          {v.cidr}
        </text>
      </g>
    ))}
    {[88, 194].map((x) => (
      <g key={x}>
        <path d={`M${x} 68 H${x + 18}`} stroke="var(--color-biru-dalam)" strokeWidth={3} />
        <Mark cx={x + 9} cy={30} ok />
      </g>
    ))}
    <text x={97} y={14} fontSize={12} textAnchor="middle" {...quiet}>
      peering
    </text>
    <text x={203} y={14} fontSize={12} textAnchor="middle" {...quiet}>
      peering
    </text>
    {/* No path from A to C */}
    <path d="M44 98 C44 140, 256 140, 256 98" fill="none" stroke="var(--color-koral)" strokeWidth={2} strokeDasharray="6 5" />
    <circle cx={150} cy={130} r={13} fill="#fff" />
    <Mark cx={150} cy={130} ok={false} />
    <text x={150} y={164} fontSize={12} textAnchor="middle" {...label}>
      A tidak bisa menjangkau C
    </text>
    <text x={150} y={184} fontSize={12} textAnchor="middle" {...quiet}>
      Buat peering A–C, atau lewat hub + UDR
    </text>
  </svg>
)
