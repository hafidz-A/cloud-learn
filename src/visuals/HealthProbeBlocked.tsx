import type { FC } from 'react'
import { useSvgId } from './ids'
import { ArrowMarker, Mark } from './parts'
import { label, quiet } from './styles'

/**
 * Health probes come from 168.63.129.16 (service tag AzureLoadBalancer). A
 * custom deny rule with a higher priority than AllowAzureLoadBalancerInBound
 * blocks them, every backend is marked down, and no new flows are sent.
 */
export const HealthProbeBlocked: FC = () => {
  const arrow = useSvgId('probe-arrow')
  return (
    <svg
      viewBox="0 0 300 236"
      role="img"
      aria-label="Health probe diblokir: probe load balancer datang dari 168.63.129.16, yaitu service tag AzureLoadBalancer. NSG punya aturan buatan sendiri prioritas 200 yang menolak semua trafik masuk, sehingga aturan default AllowAzureLoadBalancerInBound di 65001 tidak pernah tercapai. Semua VM di backend dianggap tidak sehat, dan load balancer tidak mengirim koneksi baru."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={arrow} />
      </defs>
      <rect x={1} y={1} width={140} height={44} rx={10} fill="var(--color-matahari-muda)" stroke="var(--color-matahari-dalam)" strokeWidth={2} />
      <text x={71} y={20} fontSize={12} textAnchor="middle" {...label}>
        Health probe
      </text>
      <text x={71} y={37} fontSize={12} textAnchor="middle" {...quiet}>
        168.63.129.16
      </text>
      <path d="M71 46 V62" stroke="var(--color-biru-dalam)" strokeWidth={2} markerEnd={`url(#${arrow})`} />
      {/* NSG */}
      <rect x={1} y={66} width={298} height={80} rx={10} fill="#fff" stroke="var(--color-kabut-dalam)" strokeWidth={2} />
      <text x={12} y={85} fontSize={12} {...label}>
        NSG di subnet backend (masuk)
      </text>
      {[
        { y: 92, p: '200', name: 'Deny-All-Inbound (buatan)', ok: false, hit: true },
        { y: 118, p: '65001', name: 'AllowAzureLoadBalancerInBound', ok: true, hit: false },
      ].map((r) => (
        <g key={r.p} opacity={r.hit ? 1 : 0.5}>
          <rect x={8} y={r.y} width={284} height={22} rx={6} fill={r.hit ? 'var(--color-koral-muda)' : 'var(--color-biru-muda)'} />
          <text x={14} y={r.y + 15} fontSize={12} {...label}>
            {r.p}
          </text>
          <text x={60} y={r.y + 15} fontSize={12} {...label}>
            {r.name}
          </text>
          <Mark cx={278} cy={r.y + 11} ok={r.ok} />
        </g>
      ))}
      {/* Backend */}
      {['vm1', 'vm2'].map((v, i) => (
        <g key={v}>
          <rect x={1 + i * 152} y={160} width={146} height={34} rx={8} fill="var(--color-koral-muda)" stroke="var(--color-koral)" strokeWidth={2} />
          <text x={20 + i * 152} y={182} fontSize={12} {...label}>
            {v}: probe down
          </text>
          <Mark cx={128 + i * 152} cy={177} ok={false} />
        </g>
      ))}
      <text x={0} y={212} fontSize={12} {...label}>
        Semua backend dianggap mati: tidak ada flow baru.
      </text>
      <text x={0} y={228} fontSize={12} {...quiet}>
        Izinkan AzureLoadBalancer sebelum aturan deny.
      </text>
    </svg>
  )
}
