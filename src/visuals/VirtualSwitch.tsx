import type { FC } from 'react'
import { DeviceIcon } from './NetDiagram'
import { label, quiet } from './styles'

/** Inside one server, VMs connect to a virtual switch; the physical NIC is its uplink to the real switch. */
export const VirtualSwitch: FC = () => (
  <svg
    viewBox="0 0 300 210"
    role="img"
    aria-label="Di dalam satu server fisik, tiga VM masing-masing punya NIC virtual yang tersambung ke virtual switch milik hypervisor. VM1 dan VM2 di VLAN 10, VM3 di VLAN 20. Virtual switch tersambung ke NIC fisik server, yang menjadi uplink trunk ke switch fisik, sehingga kedua VLAN bisa lewat."
    className="w-full font-display"
  >
    <rect x={4} y={4} width={200} height={150} rx={10} fill="var(--color-kabut)" />
    <text x={12} y={22} fontSize={12} {...quiet}>
      Server fisik
    </text>
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={14 + i * 62} y={30} width={56} height={30} rx={6} fill="var(--color-mint-muda)" />
        <text x={42 + i * 62} y={45} fontSize={12} textAnchor="middle" {...label}>
          VM{i + 1}
        </text>
        <text x={42 + i * 62} y={57} fontSize={12} textAnchor="middle" {...quiet}>
          {i < 2 ? 'VLAN 10' : 'VLAN 20'}
        </text>
        <line x1={42 + i * 62} y1={60} x2={42 + i * 62} y2={90} stroke="var(--color-tinta-lembut)" strokeWidth={1.5} />
      </g>
    ))}
    <rect x={14} y={90} width={180} height={28} rx={6} fill="var(--color-biru-muda)" />
    <text x={104} y={109} fontSize={12} textAnchor="middle" {...label}>
      Virtual switch
    </text>
    <line x1={104} y1={118} x2={104} y2={140} stroke="var(--color-tinta-lembut)" strokeWidth={1.5} />
    <rect x={70} y={136} width={68} height={16} rx={4} fill="var(--color-matahari-muda)" />
    <text x={104} y={148} fontSize={12} textAnchor="middle" {...label}>
      NIC fisik
    </text>
    <line x1={138} y1={144} x2={244} y2={144} stroke="var(--color-biru-dalam)" strokeWidth={2.5} />
    <DeviceIcon kind="switch" x={262} y={144} />
    <text x={262} y={172} fontSize={12} textAnchor="middle" {...label}>
      SW1
    </text>
    <text x={190} y={136} fontSize={12} textAnchor="middle" {...quiet}>
      trunk
    </text>
    <text x={4} y={200} fontSize={12} {...quiet}>
      Uplink trunk membawa VLAN 10 dan 20
    </text>
  </svg>
)
