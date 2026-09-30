import type { FC } from 'react'
import { Mark } from './parts'
import { label, quiet } from './styles'

const RULES: { priority: string; name: string; allow: boolean; custom: boolean }[] = [
  { priority: '100', name: 'Allow-HTTPS (443)', allow: true, custom: true },
  { priority: '200', name: 'Deny-Web (80, 443)', allow: false, custom: true },
  { priority: '65000', name: 'AllowVNetInBound', allow: true, custom: false },
  { priority: '65001', name: 'AllowAzureLoadBalancerInBound', allow: true, custom: false },
  { priority: '65500', name: 'DenyAllInBound', allow: false, custom: false },
]

/**
 * NSG inbound rules run from the lowest priority number up, and stop at the
 * first match. Here a packet to port 443 matches priority 100, so the deny at
 * 200 is never reached. Default rules sit at the bottom and can't be removed.
 */
export const NsgRuleTable: FC = () => (
  <svg
    viewBox="0 0 300 222"
    role="img"
    aria-label="Tabel aturan masuk NSG diurutkan dari prioritas terkecil: 100 Allow-HTTPS port 443 allow, 200 Deny-Web port 80 dan 443 deny, lalu aturan default 65000 AllowVNetInBound allow, 65001 AllowAzureLoadBalancerInBound allow, dan 65500 DenyAllInBound deny. Paket dari internet ke port 443 cocok di aturan 100 dan diizinkan; aturan sesudahnya tidak dicek lagi."
    className="w-full font-display"
  >
    <text x={4} y={14} fontSize={12} {...quiet}>
      Prioritas
    </text>
    <text x={66} y={14} fontSize={12} {...quiet}>
      Aturan masuk
    </text>
    <text x={296} y={14} fontSize={12} textAnchor="end" {...quiet}>
      Aksi
    </text>
    {RULES.map((r, i) => {
      const y = 22 + i * 30 + (r.custom ? 0 : 18)
      const hit = i === 0
      return (
        <g key={r.priority} opacity={i === 0 || !r.custom ? 1 : 0.55}>
          <rect
            x={0}
            y={y}
            width={300}
            height={26}
            rx={6}
            fill={hit ? 'var(--color-mint-muda)' : i % 2 ? '#fff' : 'var(--color-biru-muda)'}
            stroke={hit ? 'var(--color-mint-dalam)' : 'none'}
            strokeWidth={2}
          />
          <text x={6} y={y + 17} fontSize={12} {...label}>
            {r.priority}
          </text>
          <text x={66} y={y + 17} fontSize={12} {...(r.custom ? label : quiet)}>
            {r.name}
          </text>
          <Mark cx={284} cy={y + 13} ok={r.allow} />
        </g>
      )
    })}
    <text x={4} y={96} fontSize={12} {...quiet}>
      Aturan default, tidak bisa dihapus:
    </text>
    <text x={0} y={196} fontSize={12} {...label}>
      Paket ke port 443 cocok di 100: diizinkan.
    </text>
    <text x={0} y={214} fontSize={12} {...quiet}>
      Angka kecil dicek dulu, berhenti di yang pertama cocok.
    </text>
  </svg>
)
