import type { FC } from 'react'
import { useSvgId } from './ids'
import { ArrowMarker, Hatch, Pill } from './parts'
import { label, quiet } from './styles'

/** Pricing Calculator estimates new Azure resources; the TCO Calculator compares on-premises costs with Azure. */
export const PricingVsTco: FC = () => {
  const priceArrow = useSvgId('price-arrow')
  const tcoOnprem = useSvgId('tco-onprem')
  return (
    <svg
      viewBox="0 0 300 226"
      role="img"
      aria-label="Diagram: Pricing Calculator mengubah daftar resource Azure baru menjadi estimasi biaya bulanan, sedangkan TCO Calculator membandingkan biaya on-premises, yaitu server, listrik, pendingin, dan tenaga kerja, dengan biaya di Azure untuk melihat potensi hemat."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={priceArrow} />
        <Hatch id={tcoOnprem} />
      </defs>
      <text x={0} y={16} fontSize={14} {...label}>
        Pricing Calculator
      </text>
      <Pill x={0} y={26} w={128} h={40} lines={['Resource baru:', 'VM, storage, region']} />
      <path d="M134 46 H162" stroke="var(--color-biru-dalam)" strokeWidth={2.5} markerEnd={`url(#${priceArrow})`} />
      <Pill x={170} y={26} w={130} h={40} lines={['Estimasi biaya', 'Azure per bulan']} fill="var(--color-biru-muda)" />

      <line x1={0} y1={84} x2={300} y2={84} stroke="var(--color-kabut)" strokeWidth={2} />

      <text x={0} y={108} fontSize={14} {...label}>
        TCO Calculator
      </text>
      <text x={0} y={134} fontSize={12} {...label}>
        On-premises
      </text>
      <rect x={84} y={121} width={212} height={20} rx={4} fill={`url(#${tcoOnprem})`} stroke="var(--color-kabut-dalam)" strokeWidth={1.5} />
      <text x={0} y={164} fontSize={12} {...label}>
        Azure
      </text>
      <rect x={84} y={151} width={130} height={20} rx={4} fill="var(--color-biru)" stroke="var(--color-biru-dalam)" strokeWidth={1.5} />
      <path d="M218 161 H296 M218 155 V167 M296 155 V167" stroke="var(--color-mint-dalam)" strokeWidth={2} fill="none" />
      <text x={257} y={186} fontSize={12} textAnchor="middle" {...label}>
        potensi hemat
      </text>
      <text x={0} y={206} fontSize={12} {...quiet}>
        On-premises: server, listrik,
      </text>
      <text x={0} y={220} fontSize={12} {...quiet}>
        pendingin, dan tenaga kerja
      </text>
    </svg>
  )
}
