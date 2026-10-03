import type { FC } from 'react'
import { DeviceIcon } from './NetDiagram'
import { label, quiet } from './styles'

/** Port roles in a triangle: root bridge SW1, root ports, designated ports, one alternate port. */
export const StpRoles: FC = () => (
  <svg
    viewBox="0 0 300 210"
    role="img"
    aria-label="Segitiga tiga switch dengan link 1 Gbps. SW1 adalah root bridge, jadi kedua port-nya designated, ditandai DP. SW2 dan SW3 masing-masing punya root port, RP, menghadap SW1 karena biayanya paling rendah, yaitu 4. Di link SW2 ke SW3, port SW2 menjadi designated karena bridge ID SW2 lebih rendah, dan port SW3 menjadi alternate port, ALT, dalam state discarding."
    className="w-full font-display"
  >
    <DeviceIcon kind="switch" x={150} y={30} />
    <DeviceIcon kind="switch" x={50} y={140} />
    <DeviceIcon kind="switch" x={250} y={140} />
    <text x={150} y={14} fontSize={12} textAnchor="middle" {...label}>
      SW1 (root)
    </text>
    <text x={50} y={172} fontSize={12} textAnchor="middle" {...label}>
      SW2
    </text>
    <text x={250} y={172} fontSize={12} textAnchor="middle" {...label}>
      SW3
    </text>
    <line x1={136} y1={44} x2={64} y2={126} stroke="var(--color-biru-dalam)" strokeWidth={2.5} />
    <line x1={164} y1={44} x2={236} y2={126} stroke="var(--color-biru-dalam)" strokeWidth={2.5} />
    <line x1={74} y1={140} x2={226} y2={140} stroke="var(--color-tinta-lembut)" strokeWidth={2} strokeDasharray="6 4" />
    <text x={112} y={58} fontSize={12} {...label}>
      DP
    </text>
    <text x={172} y={58} fontSize={12} {...label}>
      DP
    </text>
    <text x={62} y={110} fontSize={12} {...label}>
      RP
    </text>
    <text x={220} y={110} fontSize={12} {...label}>
      RP
    </text>
    <text x={84} y={132} fontSize={12} {...label}>
      DP
    </text>
    <text x={190} y={132} fontSize={12} fill="var(--color-koral-dalam)" fontWeight={700}>
      ALT
    </text>
    <text x={4} y={192} fontSize={12} {...quiet}>
      RP: jalan termurah ke root. DP: satu per segmen.
    </text>
    <text x={4} y={207} fontSize={12} {...quiet}>
      ALT: cadangan, discarding
    </text>
  </svg>
)
