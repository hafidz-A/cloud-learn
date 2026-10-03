import type { FC } from 'react'
import { label, quiet } from './styles'

const ROWS = [
  { name: 'PoE (802.3af)', watt: 15.4 },
  { name: 'PoE+ (802.3at)', watt: 30 },
  { name: 'UPOE', watt: 60 },
  { name: '802.3bt / UPOE+', watt: 90 },
]

/** Maximum power per switch port for each PoE standard. */
export const PoeClasses: FC = () => (
  <svg
    viewBox="0 0 300 190"
    role="img"
    aria-label="Daya maksimum per port switch. PoE, 802.3af: 15,4 watt. PoE plus, 802.3at: 30 watt. Cisco UPOE: 60 watt. 802.3bt atau Cisco UPOE plus: 90 watt."
    className="w-full font-display"
  >
    {ROWS.map((r, i) => (
      <g key={r.name}>
        <text x={4} y={24 + i * 40} fontSize={12} {...label}>
          {r.name}
        </text>
        <rect x={4} y={30 + i * 40} width={(r.watt / 90) * 230} height={14} rx={4} fill={['var(--color-biru-muda)', 'var(--color-mint-muda)', 'var(--color-matahari-muda)', 'var(--color-koral-muda)'][i]} stroke="var(--color-kabut-dalam)" />
        <text x={(r.watt / 90) * 230 + 10} y={42 + i * 40} fontSize={12} {...quiet}>
          {String(r.watt).replace('.', ',')} W
        </text>
      </g>
    ))}
    <text x={4} y={186} fontSize={12} {...quiet}>
      Maksimum di port switch
    </text>
  </svg>
)
