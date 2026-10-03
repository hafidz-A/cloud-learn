import type { FC } from 'react'
import { DeviceIcon } from './NetDiagram'
import { label, quiet } from './styles'

/** One router interface split into subinterfaces, one per VLAN, over a trunk. */
export const RouterOnAStick: FC = () => (
  <svg
    viewBox="0 0 300 210"
    role="img"
    aria-label="Router-on-a-stick. R1 tersambung ke SW1 dengan satu kabel trunk. Interface G0/0/1 dibagi menjadi subinterface G0/0/1.10 dengan encapsulation dot1Q 10 dan alamat 192.168.10.1, serta G0/0/1.20 dengan encapsulation dot1Q 20 dan alamat 192.168.20.1. Setiap subinterface menjadi gateway VLAN-nya. Trafik dari VLAN 10 ke VLAN 20 naik ke router lalu turun lagi lewat kabel yang sama."
    className="w-full font-display"
  >
    <DeviceIcon kind="router" x={150} y={24} />
    <text x={190} y={28} fontSize={12} {...label}>
      R1 G0/0/1
    </text>
    <line x1={150} y1={38} x2={150} y2={92} stroke="var(--color-biru-dalam)" strokeWidth={3} />
    <text x={158} y={70} fontSize={12} {...quiet}>
      trunk
    </text>
    <DeviceIcon kind="switch" x={150} y={104} />
    <text x={190} y={108} fontSize={12} {...label}>
      SW1
    </text>
    <line x1={150} y1={116} x2={60} y2={150} stroke="var(--color-tinta-lembut)" strokeWidth={1.5} />
    <line x1={150} y1={116} x2={240} y2={150} stroke="var(--color-tinta-lembut)" strokeWidth={1.5} />
    <DeviceIcon kind="pc" x={60} y={160} />
    <DeviceIcon kind="pc" x={240} y={160} />
    <text x={60} y={190} fontSize={12} textAnchor="middle" {...label}>
      VLAN 10
    </text>
    <text x={240} y={190} fontSize={12} textAnchor="middle" {...label}>
      VLAN 20
    </text>
    <text x={4} y={14} fontSize={12} {...quiet}>
      .10: dot1Q 10, .10.1
    </text>
    <text x={4} y={30} fontSize={12} {...quiet}>
      .20: dot1Q 20, .20.1
    </text>
    <text x={4} y={206} fontSize={12} {...quiet}>
      Satu kabel, satu subinterface per VLAN
    </text>
  </svg>
)
