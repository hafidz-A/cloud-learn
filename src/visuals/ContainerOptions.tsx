import type { FC } from 'react'
import { label, quiet } from './styles'

const COLUMNS = [
  {
    name: 'Container Instances',
    fill: 'var(--color-matahari-muda)',
    stroke: 'var(--color-matahari-dalam)',
    rows: ['CPU dan memori', 'per container', 'restart policy', 'bayar per detik', 'tugas sekali jalan'],
  },
  {
    name: 'Container Apps',
    fill: 'var(--color-biru-muda)',
    stroke: 'var(--color-biru-dalam)',
    rows: ['replica min dan max', 'scale rule HTTP,', 'TCP, atau custom', 'bisa turun ke 0', 'revision dan ingress'],
  },
]

/**
 * What you set when you size and scale containers: Container Instances takes
 * CPU, memory, and a restart policy per container group; Container Apps takes
 * replica limits and scale rules.
 */
export const ContainerOptions: FC = () => (
  <svg
    viewBox="0 0 300 206"
    role="img"
    aria-label="Perbandingan pengaturan sizing dan scaling. Container Instances: CPU dan memori per container, restart policy, dibayar per detik, cocok untuk tugas sekali jalan. Container Apps: jumlah replica minimal dan maksimal, scale rule berbasis HTTP, TCP, atau custom seperti CPU dan memori, bisa turun ke 0 replica, serta punya revision dan ingress."
    className="w-full font-display"
  >
    {COLUMNS.map((c, i) => (
      <g key={c.name}>
        <rect x={1 + i * 152} y={1} width={146} height={200} rx={12} fill={c.fill} stroke={c.stroke} strokeWidth={2} />
        <text x={74 + i * 152} y={24} fontSize={12} textAnchor="middle" {...label}>
          {c.name}
        </text>
        {c.rows.map((r, j) => (
          <text key={r} x={74 + i * 152} y={56 + j * 30} fontSize={12} textAnchor="middle" {...quiet}>
            {r}
          </text>
        ))}
      </g>
    ))}
  </svg>
)
