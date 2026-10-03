import type { FC } from 'react'
import { DeviceIcon } from './NetDiagram'
import { label, quiet } from './styles'

/** A DHCP relay: the router turns the client's broadcast into a unicast to the server and fills in giaddr. */
export const DhcpRelay: FC = () => (
  <svg
    viewBox="0 0 300 200"
    role="img"
    aria-label="DHCP relay. Klien di LAN 192.168.20.0/24 mengirim Discover sebagai broadcast. Router R1 menerima broadcast itu di G0/0/1, yang punya perintah ip helper-address 192.168.10.5. R1 meneruskannya sebagai unicast ke server DHCP 192.168.10.5 di subnet lain, dan mengisi field giaddr dengan 192.168.20.1 supaya server memilih pool yang tepat."
    className="w-full font-display"
  >
    <DeviceIcon kind="pc" x={30} y={40} />
    <text x={30} y={70} fontSize={12} textAnchor="middle" {...label}>
      Klien
    </text>
    <DeviceIcon kind="router" x={150} y={40} />
    <text x={150} y={70} fontSize={12} textAnchor="middle" {...label}>
      R1
    </text>
    <DeviceIcon kind="server" x={270} y={40} />
    <text x={270} y={70} fontSize={12} textAnchor="middle" {...label}>
      .10.5
    </text>
    <line x1={50} y1={40} x2={128} y2={40} stroke="var(--color-koral-dalam)" strokeWidth={2} strokeDasharray="6 4" />
    <line x1={172} y1={40} x2={250} y2={40} stroke="var(--color-biru-dalam)" strokeWidth={2.5} />
    <text x={89} y={30} fontSize={12} textAnchor="middle" {...quiet}>
      broadcast
    </text>
    <text x={211} y={30} fontSize={12} textAnchor="middle" {...quiet}>
      unicast
    </text>
    <rect x={4} y={88} width={292} height={50} rx={8} fill="var(--color-biru-muda)" />
    <text x={12} y={108} fontSize={12} {...label}>
      R1 G0/0/1 (192.168.20.1), sisi klien:
    </text>
    <text x={12} y={128} fontSize={12} fontFamily="monospace" {...label}>
      ip helper-address 192.168.10.5
    </text>
    <text x={4} y={162} fontSize={12} {...label}>
      giaddr = 192.168.20.1
    </text>
    <text x={4} y={182} fontSize={12} {...quiet}>
      Server memilih pool 192.168.20.0/24
    </text>
  </svg>
)
