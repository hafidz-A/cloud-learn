import type { FC } from 'react'
import { useSvgId } from './ids'
import { ArrowMarker } from './parts'
import { label, quiet } from './styles'

/**
 * The parts of a Standard Load Balancer: frontend IP, a load-balancing rule
 * that spreads port 80 over the backend pool using a health probe, and an
 * inbound NAT rule that forwards one frontend port to one VM.
 */
export const LoadBalancerAnatomy: FC = () => {
  const arrow = useSvgId('lb-arrow')
  const line = { stroke: 'var(--color-biru-dalam)', strokeWidth: 2, fill: 'none', markerEnd: `url(#${arrow})` }
  return (
    <svg
      viewBox="0 0 300 236"
      role="img"
      aria-label="Bagian load balancer: frontend IP menerima trafik. Load-balancing rule port 80 membagi trafik ke semua VM di backend pool, yaitu vm1, vm2, dan vm3, dan memakai health probe untuk tahu VM mana yang sehat. Inbound NAT rule meneruskan port 50001 di frontend ke port 3389 di vm1 saja, tanpa health probe."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={arrow} />
      </defs>
      <rect x={90} y={1} width={120} height={40} rx={10} fill="var(--color-matahari-muda)" stroke="var(--color-matahari-dalam)" strokeWidth={2} />
      <text x={150} y={19} fontSize={12} textAnchor="middle" {...label}>
        Frontend IP
      </text>
      <text x={150} y={34} fontSize={12} textAnchor="middle" {...quiet}>
        20.30.40.50
      </text>
      {/* Inbound NAT rule: one port to one VM */}
      <path d="M100 42 L64 62" {...line} />
      <rect x={1} y={66} width={112} height={44} rx={10} fill="#fff" stroke="var(--color-biru)" strokeWidth={2} strokeDasharray="5 4" />
      <text x={57} y={84} fontSize={12} textAnchor="middle" {...label}>
        Inbound NAT
      </text>
      <text x={57} y={101} fontSize={12} textAnchor="middle" {...quiet}>
        50001 → vm1:3389
      </text>
      {/* Load-balancing rule: spread over the pool */}
      <path d="M190 42 L206 62" {...line} />
      <rect x={121} y={66} width={178} height={44} rx={10} fill="#fff" stroke="var(--color-biru)" strokeWidth={2} />
      <text x={210} y={84} fontSize={12} textAnchor="middle" {...label}>
        Load-balancing rule
      </text>
      <text x={210} y={101} fontSize={12} textAnchor="middle" {...quiet}>
        80 → 80, semua VM + probe
      </text>
      {/* Backend pool */}
      <rect x={1} y={128} width={298} height={84} rx={12} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={2} />
      {['vm1', 'vm2', 'vm3'].map((v, i) => (
        <g key={v}>
          <rect x={12 + i * 96} y={140} width={84} height={40} rx={8} fill="#fff" stroke="var(--color-biru)" strokeWidth={1.5} />
          <text x={54 + i * 96} y={165} fontSize={12} textAnchor="middle" {...label}>
            {v}
          </text>
        </g>
      ))}
      <text x={12} y={202} fontSize={12} {...label}>
        Backend pool
      </text>
      <path d="M40 111 V136" {...line} strokeDasharray="5 4" />
      {[
        [150, 78],
        [210, 150],
        [270, 246],
      ].map(([from, to]) => (
        <path key={to} d={`M${from} 111 L${to} 136`} {...line} />
      ))}
      <text x={0} y={230} fontSize={12} {...quiet}>
        Rule: dibagi ke pool. NAT: satu port ke satu VM.
      </text>
    </svg>
  )
}
