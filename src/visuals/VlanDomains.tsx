import type { FC } from 'react'
import { DeviceIcon } from './NetDiagram'
import { label, quiet } from './styles'

/** One switch, two VLANs: a broadcast from a VLAN 10 PC reaches only VLAN 10 ports. */
export const VlanDomains: FC = () => (
  <svg
    viewBox="0 0 300 200"
    role="img"
    aria-label="Satu switch dibagi menjadi dua VLAN. PC1 dan PC2 di VLAN 10, PC3 dan PC4 di VLAN 20. Broadcast dari PC1 hanya sampai ke PC2 di VLAN yang sama, tidak ke PC3 dan PC4. Setiap VLAN adalah broadcast domain sendiri, dan untuk berpindah VLAN dibutuhkan router atau switch layer 3."
    className="w-full font-display"
  >
    <rect x={4} y={110} width={140} height={86} rx={10} fill="var(--color-biru-muda)" />
    <rect x={156} y={110} width={140} height={86} rx={10} fill="var(--color-mint-muda)" />
    <DeviceIcon kind="switch" x={150} y={40} />
    <text x={150} y={20} fontSize={12} textAnchor="middle" {...label}>
      SW1
    </text>
    {[40, 110, 190, 260].map((x, i) => (
      <g key={x}>
        <line x1={150} y1={52} x2={x} y2={130} stroke={i === 1 ? 'var(--color-koral-dalam)' : 'var(--color-tinta-lembut)'} strokeWidth={i < 2 ? 2 : 1.2} strokeDasharray={i === 1 ? '5 3' : undefined} />
        <DeviceIcon kind="pc" x={x} y={140} />
        <text x={x} y={172} fontSize={12} textAnchor="middle" {...label}>
          PC{i + 1}
        </text>
      </g>
    ))}
    <text x={74} y={190} fontSize={12} textAnchor="middle" {...quiet}>
      VLAN 10
    </text>
    <text x={226} y={190} fontSize={12} textAnchor="middle" {...quiet}>
      VLAN 20
    </text>
    <text x={4} y={84} fontSize={12} {...label}>
      Broadcast PC1
    </text>
    <text x={4} y={100} fontSize={12} {...quiet}>
      hanya ke VLAN 10
    </text>
  </svg>
)
