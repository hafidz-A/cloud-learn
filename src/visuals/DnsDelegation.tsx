import type { FC } from 'react'
import { useSvgId } from './ids'
import { ArrowMarker } from './parts'
import { label, quiet } from './styles'

/**
 * Hosting contoso.com in Azure DNS: the zone gets four Azure name servers, and
 * the NS records at the registrar must point to all four (delegation).
 */
export const DnsDelegation: FC = () => {
  const arrow = useSvgId('dns-arrow')
  const line = { stroke: 'var(--color-biru-dalam)', strokeWidth: 2, fill: 'none', markerEnd: `url(#${arrow})` }
  return (
    <svg
      viewBox="0 0 300 232"
      role="img"
      aria-label="Delegasi domain ke Azure DNS: domain contoso.com dibeli di registrar. Di Azure DNS dibuat zone contoso.com yang otomatis mendapat record NS berisi empat name server Azure dan record SOA. Di registrar, record NS domain diganti ke keempat name server Azure itu. Setelah itu, query untuk www.contoso.com dijawab oleh Azure DNS."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={arrow} />
      </defs>
      {/* Registrar */}
      <rect x={1} y={1} width={298} height={62} rx={12} fill="#fff" stroke="var(--color-kabut-dalam)" strokeWidth={2} />
      <text x={12} y={21} fontSize={12} {...label}>
        Registrar domain contoso.com
      </text>
      <text x={12} y={39} fontSize={12} {...quiet}>
        NS → ns1-37.azure-dns.com, ns2-37…net,
      </text>
      <text x={12} y={55} fontSize={12} {...quiet}>
        ns3-37…org, ns4-37…info (keempatnya)
      </text>
      <path d="M150 64 V84" {...line} />
      <text x={160} y={79} fontSize={12} {...quiet}>
        delegasi
      </text>
      {/* Azure DNS zone */}
      <rect x={1} y={88} width={298} height={142} rx={12} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={2} />
      <text x={12} y={108} fontSize={12} {...label}>
        Azure DNS zone contoso.com
      </text>
      {[
        ['@', 'NS', '4 name server Azure'],
        ['@', 'SOA', 'otomatis, tidak bisa dihapus'],
        ['www', 'A', '20.40.1.5'],
        ['@', 'A (alias)', 'public IP web'],
      ].map(([name, type, value], i) => (
        <g key={name + type}>
          <rect x={10} y={116 + i * 27} width={280} height={24} rx={6} fill="#fff" />
          <text x={18} y={132 + i * 27} fontSize={12} {...label}>
            {name}
          </text>
          <text x={52} y={132 + i * 27} fontSize={12} {...label}>
            {type}
          </text>
          <text x={124} y={132 + i * 27} fontSize={12} {...quiet}>
            {value}
          </text>
        </g>
      ))}
    </svg>
  )
}
