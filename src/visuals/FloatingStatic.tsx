import type { FC } from 'react'
import { DeviceIcon } from './NetDiagram'
import { label, quiet } from './styles'

/** A primary default route via ISP1 (AD 1) and a floating backup via ISP2 (AD 200). */
export const FloatingStatic: FC = () => (
  <svg
    viewBox="0 0 300 200"
    role="img"
    aria-label="R1 punya dua jalur ke internet. Jalur utama ke ISP1 memakai default route dengan AD 1. Jalur cadangan ke ISP2 memakai default route dengan AD 200, disebut floating static. Selama jalur utama ada di tabel routing, route AD 200 tidak dipasang. Kalau link ke ISP1 putus, route utama hilang dan route cadangan masuk tabel."
    className="w-full font-display"
  >
    <DeviceIcon kind="router" x={50} y={80} />
    <text x={50} y={112} fontSize={12} textAnchor="middle" {...label}>
      R1
    </text>
    <DeviceIcon kind="cloud" x={240} y={34} />
    <DeviceIcon kind="cloud" x={240} y={130} />
    <text x={240} y={64} fontSize={12} textAnchor="middle" {...label}>
      ISP1
    </text>
    <text x={240} y={160} fontSize={12} textAnchor="middle" {...label}>
      ISP2
    </text>
    <line x1={72} y1={72} x2={212} y2={38} stroke="var(--color-mint-dalam)" strokeWidth={3} />
    <line x1={72} y1={88} x2={212} y2={128} stroke="var(--color-tinta-lembut)" strokeWidth={2} strokeDasharray="6 4" />
    <text x={140} y={44} fontSize={12} textAnchor="middle" {...label}>
      AD 1: dipakai
    </text>
    <text x={140} y={128} fontSize={12} textAnchor="middle" {...quiet}>
      AD 200: cadangan
    </text>
    <text x={4} y={186} fontSize={12} {...quiet}>
      Link ISP1 putus: route AD 200 masuk tabel
    </text>
  </svg>
)
