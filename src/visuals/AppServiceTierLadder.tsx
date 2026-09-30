import type { FC } from 'react'
import { label, quiet } from './styles'

const TIERS = [
  { name: 'Free', lines: ['VM bersama, tanpa custom domain'] },
  { name: 'Shared', lines: ['custom domain, tanpa TLS binding'] },
  { name: 'Basic', lines: ['VM dedicated, scale manual s/d 3', 'TLS, backup, VNet integration'] },
  { name: 'Standard', lines: ['autoscale, s/d 10 instance', '5 deployment slot'] },
  { name: 'Premium v2-v4', lines: ['s/d 30 instance, 20 slot', 'automatic scaling'] },
  { name: 'Isolated v2', lines: ['jaringan terisolasi', 's/d 100 instance'] },
]

/**
 * App Service plan tiers from Free to Isolated v2, with the feature each tier
 * adds. Every tier keeps the features of the tiers below it.
 */
export const AppServiceTierLadder: FC = () => (
  <svg
    viewBox="0 0 300 300"
    role="img"
    aria-label="Tangga tier App Service plan. Free: VM bersama, tanpa custom domain. Shared: custom domain, tapi tanpa TLS binding. Basic: VM dedicated, scale out manual sampai 3 instance, TLS binding dan managed certificate, backup, dan VNet integration. Standard: autoscale, sampai 10 instance, dan 5 deployment slot. Premium v2 sampai v4: sampai 30 instance, 20 slot, dan automatic scaling. Isolated v2: jaringan terisolasi dan sampai 100 instance. Setiap tier juga punya fitur tier di bawahnya."
    className="w-full font-display"
  >
    {TIERS.map((t, i) => {
      const y = 1 + (TIERS.length - 1 - i) * 46
      const indent = i * 8
      return (
        <g key={t.name}>
          <rect x={1 + indent} y={y} width={298 - indent} height={42} rx={8} fill={i < 2 ? 'var(--color-kabut)' : 'var(--color-biru-muda)'} stroke="var(--color-biru-dalam)" strokeWidth={1.5} />
          <text x={10 + indent} y={y + 18} fontSize={12} {...label}>
            {t.name}
          </text>
          {t.lines.map((line, j) => (
            <text key={line} x={292} y={y + (t.lines.length === 1 ? 26 : 18 + j * 16)} fontSize={12} textAnchor="end" {...quiet}>
              {line}
            </text>
          ))}
        </g>
      )
    })}
    <text x={0} y={294} fontSize={12} {...label}>
      Tier yang lebih tinggi mewarisi fitur di bawahnya.
    </text>
  </svg>
)
