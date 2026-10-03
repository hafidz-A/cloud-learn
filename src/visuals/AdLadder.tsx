import type { FC } from 'react'
import { label, quiet } from './styles'

const ROWS = [
  ['Connected', '0'],
  ['Static', '1'],
  ['eBGP', '20'],
  ['EIGRP', '90'],
  ['OSPF', '110'],
  ['RIP', '120'],
  ['iBGP', '200'],
]

/** Default administrative distances, most trusted first. */
export const AdLadder: FC = () => (
  <svg
    viewBox="0 0 300 210"
    role="img"
    aria-label="Administrative distance bawaan, dari yang paling dipercaya: connected 0, static 1, eBGP 20, EIGRP internal 90, OSPF 110, RIP 120, dan iBGP 200. Untuk prefix yang sama, AD terendah yang masuk tabel routing."
    className="w-full font-display"
  >
    {ROWS.map(([n, v], i) => (
      <g key={n}>
        <rect x={4} y={4 + i * 27} width={80 + Number(v) * 0.8} height={23} rx={4} fill={i === 4 ? 'var(--color-mint-muda)' : 'var(--color-biru-muda)'} />
        <text x={12} y={20 + i * 27} fontSize={12} {...label}>
          {n}
        </text>
        <text x={292} y={20 + i * 27} fontSize={12} textAnchor="end" {...label}>
          {v}
        </text>
      </g>
    ))}
    <text x={4} y={204} fontSize={12} {...quiet}>
      Prefix sama: AD terendah menang
    </text>
  </svg>
)
