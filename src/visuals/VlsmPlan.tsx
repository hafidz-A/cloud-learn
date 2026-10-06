import type { FC } from 'react'
import { label, quiet } from './styles'

const PARTS = [
  { name: 'LAN A: 100 host', prefix: '/25', start: 0, size: 128, fill: 'var(--color-biru-muda)' },
  { name: 'LAN B: 50 host', prefix: '/26', start: 128, size: 64, fill: 'var(--color-mint-muda)' },
  { name: 'LAN C: 20 host', prefix: '/27', start: 192, size: 32, fill: 'var(--color-matahari-muda)' },
  { name: 'Link R1-R2', prefix: '/30', start: 224, size: 4, fill: 'var(--color-koral-muda)' },
]

/** VLSM: one /24 cut into subnets of different sizes, largest first, so none overlap. */
export const VlsmPlan: FC = () => (
  <svg
    viewBox="0 0 300 210"
    role="img"
    aria-label="VLSM pada 192.168.1.0/24, dimulai dari subnet terbesar. LAN A dengan 100 host mendapat .0/25, LAN B dengan 50 host .128/26, LAN C dengan 20 host .192/27, dan link antar-router mendapat .224/30. Sisanya, .228 sampai .255, masih bebas untuk kebutuhan berikutnya."
    className="w-full font-display"
  >
    <text x={6} y={16} fontSize={12} {...quiet}>
      192.168.1.0/24, yang terbesar dulu
    </text>
    <rect x={6} y={24} width={288} height={26} rx={4} fill="var(--color-kabut)" />
    {PARTS.map((p) => (
      <rect key={p.name} x={6 + (p.start / 256) * 288} y={24} width={Math.max(4, (p.size / 256) * 288)} height={26} fill={p.fill} stroke="var(--color-tinta-lembut)" strokeWidth={1} />
    ))}
    {PARTS.map((p, i) => (
      <g key={`l-${p.name}`}>
        <rect x={6} y={64 + i * 34} width={14} height={14} rx={3} fill={p.fill} stroke="var(--color-tinta-lembut)" strokeWidth={1} />
        <text x={26} y={76 + i * 34} fontSize={12} {...label}>
          {p.name}
        </text>
        <text x={294} y={76 + i * 34} fontSize={12} textAnchor="end" {...label}>
          .{p.start}
          {p.prefix}
        </text>
      </g>
    ))}
    <text x={6} y={202} fontSize={12} {...quiet}>
      Sisa .228 - .255 masih bebas
    </text>
  </svg>
)
