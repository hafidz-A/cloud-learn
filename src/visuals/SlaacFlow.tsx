import type { FC } from 'react'
import { ArrowMarker } from './parts'
import { useSvgId } from './ids'
import { DeviceIcon } from './NetDiagram'
import { label, quiet } from './styles'

/** SLAAC: the host asks with a Router Solicitation, the router answers with a Router Advertisement carrying the prefix, the host builds its own address and checks it is unique. */
export const SlaacFlow: FC = () => {
  const a = useSvgId('slaac-rs')
  const b = useSvgId('slaac-ra')
  return (
    <svg
      viewBox="0 0 300 210"
      role="img"
      aria-label="SLAAC. Host mengirim Router Solicitation ke ff02::2, alamat semua router. Router menjawab dengan Router Advertisement ke ff02::1 yang berisi prefix 2001:db8:1::/64. Host membentuk alamatnya sendiri dari prefix itu ditambah interface ID, lalu menjalankan duplicate address detection untuk memastikan tidak ada yang memakai alamat yang sama."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={a} color="var(--color-koral-dalam)" />
        <ArrowMarker id={b} />
      </defs>
      <DeviceIcon kind="pc" x={40} y={40} />
      <text x={40} y={72} fontSize={13} textAnchor="middle" {...label}>
        Host
      </text>
      <DeviceIcon kind="router" x={260} y={40} />
      <text x={260} y={72} fontSize={13} textAnchor="middle" {...label}>
        R1
      </text>
      <path d="M68 32 H228" stroke="var(--color-koral-dalam)" strokeWidth={2} markerEnd={`url(#${a})`} />
      <path d="M232 52 H72" stroke="var(--color-biru-dalam)" strokeWidth={2.5} markerEnd={`url(#${b})`} />
      <text x={6} y={102} fontSize={12} {...label}>
        1. RS ke ff02::2: ada router?
      </text>
      <text x={6} y={124} fontSize={12} {...label}>
        2. RA ke ff02::1: prefix 2001:db8:1::/64
      </text>
      <text x={6} y={146} fontSize={12} {...label}>
        3. Host: prefix + interface ID
      </text>
      <text x={6} y={168} fontSize={12} {...label}>
        4. Cek duplikat (DAD), lalu pakai
      </text>
      <text x={6} y={196} fontSize={12} {...quiet}>
        Tanpa server DHCP
      </text>
    </svg>
  )
}
