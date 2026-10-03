import type { FC } from 'react'
import { DeviceIcon } from './NetDiagram'
import { label, quiet } from './styles'

/** A trunk carries many VLANs with tags; only the native VLAN crosses untagged. */
export const TrunkNative: FC = () => (
  <svg
    viewBox="0 0 300 190"
    role="img"
    aria-label="Trunk antara SW1 dan SW2 membawa beberapa VLAN dalam satu link. Frame VLAN 10 dan VLAN 20 diberi tag 802.1Q. Frame native VLAN, bawaannya VLAN 1, dikirim tanpa tag. Native VLAN di kedua ujung harus sama; kalau berbeda, frame tanpa tag masuk ke VLAN yang salah."
    className="w-full font-display"
  >
    <DeviceIcon kind="switch" x={36} y={50} />
    <DeviceIcon kind="switch" x={264} y={50} />
    <text x={36} y={80} fontSize={12} textAnchor="middle" {...label}>
      SW1
    </text>
    <text x={264} y={80} fontSize={12} textAnchor="middle" {...label}>
      SW2
    </text>
    <line x1={60} y1={42} x2={240} y2={42} stroke="var(--color-biru-dalam)" strokeWidth={3} />
    <line x1={60} y1={50} x2={240} y2={50} stroke="var(--color-mint-dalam)" strokeWidth={3} />
    <line x1={60} y1={58} x2={240} y2={58} stroke="var(--color-tinta-lembut)" strokeWidth={3} strokeDasharray="6 4" />
    <text x={150} y={30} fontSize={12} textAnchor="middle" {...quiet}>
      trunk 802.1Q
    </text>
    <rect x={4} y={100} width={292} height={26} rx={6} fill="var(--color-biru-muda)" />
    <text x={12} y={118} fontSize={12} {...label}>
      VLAN 10, VLAN 20: frame diberi tag
    </text>
    <rect x={4} y={132} width={292} height={26} rx={6} fill="var(--color-kabut)" />
    <text x={12} y={150} fontSize={12} {...label}>
      Native VLAN (bawaan 1): tanpa tag
    </text>
    <text x={4} y={180} fontSize={12} {...quiet}>
      Native VLAN di kedua ujung harus sama
    </text>
  </svg>
)
