import type { FC } from 'react'
import { DeviceIcon } from './NetDiagram'
import { label, quiet } from './styles'

/** OSPF areas: area 0 is the backbone; an ABR joins another area to it. CCNA config stays in a single area. */
export const OspfAreas: FC = () => (
  <svg
    viewBox="0 0 300 200"
    role="img"
    aria-label="Area OSPF. Area 0 adalah backbone, berisi R1 dan R2. R2 juga punya interface di area 1, jadi R2 adalah ABR, area border router. Semua area lain harus tersambung ke area 0. Setiap router dalam satu area punya database link-state yang sama. Di CCNA, konfigurasi difokuskan pada single area, biasanya area 0."
    className="w-full font-display"
  >
    <ellipse cx={100} cy={70} rx={92} ry={56} fill="var(--color-biru-muda)" />
    <ellipse cx={232} cy={70} rx={64} ry={50} fill="var(--color-mint-muda)" />
    <text x={44} y={30} fontSize={12} {...label}>
      Area 0 (backbone)
    </text>
    <text x={226} y={34} fontSize={12} {...label}>
      Area 1
    </text>
    <DeviceIcon kind="router" x={60} y={80} />
    <DeviceIcon kind="router" x={170} y={80} />
    <DeviceIcon kind="router" x={250} y={80} />
    <line x1={82} y1={80} x2={148} y2={80} stroke="var(--color-tinta-lembut)" strokeWidth={1.5} />
    <line x1={192} y1={80} x2={228} y2={80} stroke="var(--color-tinta-lembut)" strokeWidth={1.5} />
    <text x={60} y={110} fontSize={12} textAnchor="middle" {...label}>
      R1
    </text>
    <text x={170} y={110} fontSize={12} textAnchor="middle" {...label}>
      R2 (ABR)
    </text>
    <text x={250} y={110} fontSize={12} textAnchor="middle" {...label}>
      R3
    </text>
    <text x={4} y={150} fontSize={12} {...quiet}>
      Satu area: database link-state sama
    </text>
    <text x={4} y={168} fontSize={12} {...quiet}>
      Area lain harus tersambung ke area 0
    </text>
    <text x={4} y={190} fontSize={12} {...label}>
      CCNA: single area (area 0)
    </text>
  </svg>
)
