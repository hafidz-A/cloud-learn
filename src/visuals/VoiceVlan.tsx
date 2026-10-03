import type { FC } from 'react'
import { DeviceIcon } from './NetDiagram'
import { label, quiet } from './styles'

/** An IP phone with a PC behind it: voice tagged in the voice VLAN, data untagged in the access VLAN. */
export const VoiceVlan: FC = () => (
  <svg
    viewBox="0 0 300 200"
    role="img"
    aria-label="Satu port switch, Fa0/5, tersambung ke IP phone, dan PC tersambung ke port di belakang phone. Suara dari phone dikirim dengan tag di voice VLAN 150. Data dari PC dikirim tanpa tag di access VLAN 10. Switch memberi tahu phone nomor voice VLAN lewat CDP atau LLDP."
    className="w-full font-display"
  >
    <DeviceIcon kind="switch" x={40} y={50} />
    <text x={40} y={80} fontSize={12} textAnchor="middle" {...label}>
      SW1 Fa0/5
    </text>
    <DeviceIcon kind="phone" x={150} y={50} />
    <text x={150} y={80} fontSize={12} textAnchor="middle" {...label}>
      IP phone
    </text>
    <DeviceIcon kind="pc" x={260} y={50} />
    <text x={260} y={80} fontSize={12} textAnchor="middle" {...label}>
      PC
    </text>
    <line x1={62} y1={44} x2={128} y2={44} stroke="var(--color-koral-dalam)" strokeWidth={2.5} />
    <line x1={62} y1={56} x2={128} y2={56} stroke="var(--color-biru-dalam)" strokeWidth={2.5} />
    <line x1={172} y1={56} x2={238} y2={56} stroke="var(--color-biru-dalam)" strokeWidth={2.5} />
    <rect x={4} y={100} width={292} height={36} rx={8} fill="var(--color-koral-muda)" />
    <text x={12} y={123} fontSize={12} {...label}>
      Suara: tag voice VLAN 150
    </text>
    <rect x={4} y={142} width={292} height={36} rx={8} fill="var(--color-biru-muda)" />
    <text x={12} y={165} fontSize={12} {...label}>
      Data PC: tanpa tag, access VLAN 10
    </text>
    <text x={4} y={196} fontSize={12} {...quiet}>
      VLAN suara dikirim ke phone lewat CDP atau LLDP
    </text>
  </svg>
)
