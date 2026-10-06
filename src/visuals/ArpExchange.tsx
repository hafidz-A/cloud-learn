import type { FC } from 'react'
import { ArrowMarker } from './parts'
import { useSvgId } from './ids'
import { DeviceIcon } from './NetDiagram'
import { label, quiet } from './styles'

/** ARP: a broadcast request asks who has an IPv4 address; the owner answers with a unicast reply that carries its MAC. */
export const ArpExchange: FC = () => {
  const req = useSvgId('arp-req')
  const rep = useSvgId('arp-rep')
  return (
    <svg
      viewBox="0 0 300 200"
      role="img"
      aria-label="ARP. PC1 dengan alamat 192.168.1.10 mengirim ARP request sebagai broadcast ke ffff.ffff.ffff untuk menanyakan siapa pemilik 192.168.1.20. PC2 menjawab dengan ARP reply unicast langsung ke PC1, berisi MAC address-nya. PC1 lalu menyimpan pasangan IP dan MAC itu di cache ARP."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={req} color="var(--color-koral-dalam)" />
        <ArrowMarker id={rep} />
      </defs>
      <DeviceIcon kind="pc" x={40} y={40} />
      <text x={40} y={72} fontSize={13} textAnchor="middle" {...label}>
        PC1
      </text>
      <text x={40} y={87} fontSize={12} textAnchor="middle" {...quiet}>
        .10
      </text>
      <DeviceIcon kind="pc" x={260} y={40} />
      <text x={260} y={72} fontSize={13} textAnchor="middle" {...label}>
        PC2
      </text>
      <text x={260} y={87} fontSize={12} textAnchor="middle" {...quiet}>
        .20
      </text>
      <path d="M68 32 H228" stroke="var(--color-koral-dalam)" strokeWidth={2} strokeDasharray="6 4" markerEnd={`url(#${req})`} />
      <path d="M232 52 H72" stroke="var(--color-biru-dalam)" strokeWidth={2.5} markerEnd={`url(#${rep})`} />
      <rect x={6} y={104} width={288} height={42} rx={8} fill="var(--color-koral-muda)" />
      <text x={14} y={121} fontSize={12} {...label}>
        1. Request, broadcast ke ffff.ffff.ffff:
      </text>
      <text x={14} y={138} fontSize={12} {...label}>
        "Siapa 192.168.1.20? Jawab ke .10"
      </text>
      <rect x={6} y={152} width={288} height={42} rx={8} fill="var(--color-biru-muda)" />
      <text x={14} y={169} fontSize={12} {...label}>
        2. Reply, unicast ke PC1:
      </text>
      <text x={14} y={186} fontSize={12} {...label}>
        "192.168.1.20 ada di MAC milik PC2"
      </text>
    </svg>
  )
}
