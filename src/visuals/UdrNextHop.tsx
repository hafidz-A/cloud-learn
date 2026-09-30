import type { FC } from 'react'
import { useSvgId } from './ids'
import { ArrowMarker, Cloud } from './parts'
import { label, quiet } from './styles'

/**
 * A route table on snet-app sends 0.0.0.0/0 to a firewall VM (next hop type
 * Virtual appliance) instead of straight to the internet. The firewall's NIC
 * needs IP forwarding, and it sits in its own subnet.
 */
export const UdrNextHop: FC = () => {
  const arrow = useSvgId('udr-arrow')
  const line = { stroke: 'var(--color-biru-dalam)', strokeWidth: 2, fill: 'none', markerEnd: `url(#${arrow})` }
  return (
    <svg
      viewBox="0 0 300 232"
      role="img"
      aria-label="Diagram user-defined route: route table di subnet snet-app berisi route 0.0.0.0/0 dengan next hop type Virtual appliance ke 10.0.100.4. Trafik internet dari VM di snet-app lewat dulu ke firewall di subnet snet-fw, yang NIC-nya mengaktifkan IP forwarding, baru ke internet. Tanpa route itu, system route 0.0.0.0/0 mengirim trafik langsung ke internet."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={arrow} />
      </defs>
      {/* Source subnet */}
      <rect x={1} y={1} width={120} height={60} rx={10} fill="#fff" stroke="var(--color-biru)" strokeWidth={2} />
      <text x={61} y={24} fontSize={12} textAnchor="middle" {...label}>
        snet-app
      </text>
      <text x={61} y={44} fontSize={12} textAnchor="middle" {...quiet}>
        VM 10.0.1.4
      </text>
      {/* Route table */}
      <rect x={1} y={80} width={298} height={50} rx={10} fill="var(--color-matahari-muda)" stroke="var(--color-matahari-dalam)" strokeWidth={2} />
      <text x={12} y={100} fontSize={12} {...label}>
        Route table rt-app (di snet-app)
      </text>
      <text x={12} y={119} fontSize={12} {...quiet}>
        0.0.0.0/0 → Virtual appliance 10.0.100.4
      </text>
      <path d="M61 62 V76" {...line} />
      {/* Firewall */}
      <rect x={1} y={150} width={140} height={78} rx={10} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={2} />
      <text x={71} y={171} fontSize={12} textAnchor="middle" {...label}>
        snet-fw: firewall
      </text>
      <text x={71} y={190} fontSize={12} textAnchor="middle" {...quiet}>
        10.0.100.4
      </text>
      <text x={71} y={208} fontSize={12} textAnchor="middle" {...quiet}>
        IP forwarding aktif
      </text>
      <path d="M61 131 V146" {...line} />
      {/* Internet */}
      <path d="M142 189 H196" {...line} />
      <Cloud x={202} y={164} w={92} />
      <text x={250} y={204} fontSize={12} textAnchor="middle" {...label}>
        Internet
      </text>
      {/* Overridden system route */}
      <text x={210} y={24} fontSize={12} textAnchor="middle" {...quiet}>
        system route
      </text>
      <text x={210} y={42} fontSize={12} textAnchor="middle" {...quiet} textDecoration="line-through">
        0.0.0.0/0 → Internet
      </text>
      <text x={210} y={60} fontSize={12} textAnchor="middle" {...quiet}>
        kalah oleh UDR
      </text>
    </svg>
  )
}
