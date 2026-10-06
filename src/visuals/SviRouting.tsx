import type { FC } from 'react'
import { label, quiet } from './styles'

/** A layer 3 switch routes between VLANs with one SVI per VLAN after ip routing is enabled. */
export const SviRouting: FC = () => (
  <svg
    viewBox="0 0 300 200"
    role="img"
    aria-label="Routing antar-VLAN di switch layer 3. Di dalam SW1 ada dua SVI: interface Vlan10 dengan alamat 192.168.10.1 dan interface Vlan20 dengan alamat 192.168.20.1, masing-masing menjadi gateway VLAN-nya. Perintah ip routing mengaktifkan routing di antara keduanya. Trafik dirutekan di dalam switch, tanpa router terpisah. Port juga bisa dijadikan routed port dengan no switchport."
    className="w-full font-display"
  >
    <rect x={4} y={4} width={292} height={130} rx={10} fill="var(--color-kabut)" />
    <text x={12} y={22} fontSize={12} {...quiet}>
      SW1, switch layer 3 (ip routing)
    </text>
    <rect x={20} y={34} width={120} height={40} rx={8} fill="var(--color-biru-muda)" />
    <rect x={160} y={34} width={120} height={40} rx={8} fill="var(--color-mint-muda)" />
    <text x={80} y={51} fontSize={12} textAnchor="middle" {...label}>
      interface Vlan10
    </text>
    <text x={80} y={67} fontSize={12} textAnchor="middle" {...quiet}>
      192.168.10.1
    </text>
    <text x={220} y={51} fontSize={12} textAnchor="middle" {...label}>
      interface Vlan20
    </text>
    <text x={220} y={67} fontSize={12} textAnchor="middle" {...quiet}>
      192.168.20.1
    </text>
    <path d="M140 54 H160" stroke="var(--color-koral-dalam)" strokeWidth={3} />
    <text x={150} y={96} fontSize={12} textAnchor="middle" {...label}>
      dirutekan di dalam switch
    </text>
    <text x={80} y={124} fontSize={12} textAnchor="middle" {...quiet}>
      port akses VLAN 10
    </text>
    <text x={220} y={124} fontSize={12} textAnchor="middle" {...quiet}>
      port akses VLAN 20
    </text>
    <text x={4} y={160} fontSize={12} {...label}>
      Satu SVI per VLAN = gateway VLAN itu
    </text>
    <text x={4} y={180} fontSize={12} {...quiet}>
      Routed port: no switchport
    </text>
  </svg>
)
