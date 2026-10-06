import type { FC } from 'react'
import { label, quiet } from './styles'

const PARTS = [
  { x: 4, w: 22, text: 'O', note: 'sumber' },
  { x: 30, w: 92, text: '10.1.1.0/24', note: 'prefix' },
  { x: 126, w: 58, text: '[110/30]', note: 'AD/metric' },
  { x: 188, w: 108, text: 'via 10.0.13.3', note: 'next hop' },
]

/** The parts of one line of show ip route. */
export const RouteEntry: FC = () => (
  <svg
    viewBox="0 0 300 190"
    role="img"
    aria-label="Satu baris tabel routing: O 10.1.1.0/24 [110/30] via 10.0.13.3, GigabitEthernet0/0/2. Huruf O adalah sumber route, yaitu OSPF. 10.1.1.0/24 adalah prefix tujuan. Angka 110 adalah administrative distance dan 30 adalah metric. via 10.0.13.3 adalah next hop, dan GigabitEthernet0/0/2 adalah interface keluar."
    className="w-full font-display"
  >
    {PARTS.map((p, i) => (
      <g key={p.text}>
        <rect x={p.x} y={30} width={p.w} height={30} rx={5} fill={['var(--color-koral-muda)', 'var(--color-biru-muda)', 'var(--color-matahari-muda)', 'var(--color-mint-muda)'][i]} />
        <text x={p.x + p.w / 2} y={50} fontSize={12} textAnchor="middle" fontFamily="monospace" {...label}>
          {p.text}
        </text>
        <text x={i === 0 ? p.x : p.x + p.w / 2} y={78} fontSize={12} textAnchor={i === 0 ? 'start' : 'middle'} {...quiet}>
          {p.note}
        </text>
      </g>
    ))}
    <rect x={150} y={92} width={146} height={30} rx={5} fill="var(--color-kabut)" />
    <text x={223} y={112} fontSize={12} textAnchor="middle" fontFamily="monospace" {...label}>
      Gi0/0/2
    </text>
    <text x={223} y={140} fontSize={12} textAnchor="middle" {...quiet}>
      interface keluar
    </text>
    <text x={4} y={16} fontSize={12} {...quiet}>
      Satu baris show ip route
    </text>
    <text x={4} y={170} fontSize={12} {...label}>
      C connected, L local, S static, O OSPF
    </text>
    <text x={4} y={186} fontSize={12} {...quiet}>
      * menandai default route
    </text>
  </svg>
)
