import type { FC } from 'react'
import { useSvgId } from './ids'
import { ArrowMarker, Pill } from './parts'
import { label } from './styles'

const SIGNALS = ['Pengguna', 'Lokasi', 'Perangkat', 'Aplikasi']
const OUTCOMES = [
  { text: 'Izinkan', fill: 'var(--color-mint-muda)', stroke: 'var(--color-mint-dalam)' },
  { text: 'Minta MFA', fill: 'var(--color-matahari-muda)', stroke: 'var(--color-matahari-dalam)' },
  { text: 'Blokir', fill: 'var(--color-koral-muda)', stroke: 'var(--color-koral-dalam)' },
]

/** Signals go into a Conditional Access policy, which decides to allow, ask for MFA, or block. */
export const ConditionalAccessFlow: FC = () => {
  const caArrow = useSvgId('ca-arrow')
  const top = 24
  return (
    <svg
      viewBox="0 0 300 168"
      role="img"
      aria-label="Diagram Conditional Access: sinyal pengguna, lokasi, perangkat, dan aplikasi masuk ke policy, lalu policy memutuskan izinkan, minta MFA, atau blokir."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={caArrow} />
      </defs>
      <text x={40} y={14} fontSize={12} textAnchor="middle" {...label}>
        Sinyal
      </text>
      <text x={150} y={14} fontSize={12} textAnchor="middle" {...label}>
        Keputusan
      </text>
      <text x={258} y={14} fontSize={12} textAnchor="middle" {...label}>
        Penegakan
      </text>
      {SIGNALS.map((s, i) => {
        const y = top + i * 35
        return (
          <g key={s}>
            <Pill x={0} y={y} w={80} lines={[s]} />
            <path d={`M82 ${y + 13} L116 94`} stroke="var(--color-kabut-dalam)" strokeWidth={2} />
          </g>
        )
      })}
      <path d="M150 58 L186 94 L150 130 L114 94 Z" fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={2} />
      <text x={150} y={98} fontSize={12} textAnchor="middle" {...label}>
        Policy
      </text>
      {OUTCOMES.map((o, i) => {
        const y = top + 12 + i * 40
        return (
          <g key={o.text}>
            <path d={`M186 94 L212 ${y + 13}`} stroke="var(--color-biru-dalam)" strokeWidth={2} markerEnd={`url(#${caArrow})`} />
            <Pill x={218} y={y} w={82} lines={[o.text]} fill={o.fill} stroke={o.stroke} />
          </g>
        )
      })}
    </svg>
  )
}
