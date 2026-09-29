import type { FC } from 'react'
import { useSvgId } from './ids'
import { ArrowMarker, Mark, Person, Server } from './parts'
import { label, quiet } from './styles'

/** High availability keeps serving when one instance fails; reliability recovers when a whole region fails. */
export const AvailabilityVsReliability: FC = () => {
  const availArrow = useSvgId('avail-arrow')
  const region = { rx: 10, strokeWidth: 2, strokeDasharray: '5 4' }
  return (
    <svg
      viewBox="0 0 300 172"
      role="img"
      aria-label="Diagram: high availability tetap melayani pengguna saat satu instance mati karena ada instance lain; reliability memulihkan aplikasi di region B saat region A lumpuh."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={availArrow} />
      </defs>
      <text x={0} y={16} fontSize={14} {...label}>
        High availability
      </text>
      <Person x={60} y={28} />
      <path d="M67 48 V58 M67 58 L36 72 M67 58 L98 72" fill="none" stroke="var(--color-kabut-dalam)" strokeWidth={2} />
      <Server x={22} y={74} />
      <Mark cx={48} cy={76} ok={false} />
      <Server x={84} y={74} />
      <Mark cx={110} cy={76} ok />
      <text x={66} y={128} fontSize={12} textAnchor="middle" {...quiet}>
        satu instance mati,
      </text>
      <text x={66} y={144} fontSize={12} textAnchor="middle" {...label}>
        aplikasi tetap hidup
      </text>

      <line x1={146} y1={8} x2={146} y2={160} stroke="var(--color-kabut)" strokeWidth={2} />

      <text x={158} y={16} fontSize={14} {...label}>
        Reliability
      </text>
      <rect x={158} y={34} width={60} height={70} fill="var(--color-koral-muda)" stroke="var(--color-koral-dalam)" {...region} />
      <text x={188} y={54} fontSize={12} textAnchor="middle" {...label}>
        Region A
      </text>
      <Mark cx={188} cy={80} ok={false} />
      <path d="M222 70 H236" stroke="var(--color-biru-dalam)" strokeWidth={2.5} markerEnd={`url(#${availArrow})`} />
      <rect x={240} y={34} width={58} height={70} fill="var(--color-mint-muda)" stroke="var(--color-mint-dalam)" {...region} />
      <text x={269} y={54} fontSize={12} textAnchor="middle" {...label}>
        Region B
      </text>
      <Mark cx={269} cy={80} ok />
      <text x={228} y={128} fontSize={12} textAnchor="middle" {...quiet}>
        satu region lumpuh,
      </text>
      <text x={228} y={144} fontSize={12} textAnchor="middle" {...label}>
        pulih di region lain
      </text>
    </svg>
  )
}
