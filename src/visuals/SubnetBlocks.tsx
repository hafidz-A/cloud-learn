import type { FC } from 'react'
import { label, quiet } from './styles'

const BLOCKS = [0, 64, 128, 192]

/** 192.168.1.0/24 cut into four /26 blocks of 64: each has a network address, usable hosts, and a broadcast address. */
export const SubnetBlocks: FC = () => (
  <svg
    viewBox="0 0 300 200"
    role="img"
    aria-label="Jaringan 192.168.1.0/24 dibagi menjadi empat subnet /26 dengan block size 64: .0 sampai .63, .64 sampai .127, .128 sampai .191, dan .192 sampai .255. Di setiap blok, alamat pertama adalah network, alamat terakhir broadcast, dan sisanya untuk host, misalnya .65 sampai .126."
    className="w-full font-display"
  >
    <text x={6} y={16} fontSize={12} {...quiet}>
      192.168.1.0/24 dibagi /26 (block size 64)
    </text>
    {BLOCKS.map((b, i) => (
      <g key={b}>
        <rect x={6} y={26 + i * 40} width={288} height={34} rx={6} fill={i % 2 ? 'var(--color-mint-muda)' : 'var(--color-biru-muda)'} stroke="var(--color-kabut-dalam)" strokeWidth={1} />
        <text x={14} y={41 + i * 40} fontSize={12} {...label}>
          .{b}/26
        </text>
        <text x={14} y={55 + i * 40} fontSize={12} {...quiet}>
          network .{b}
        </text>
        <text x={150} y={41 + i * 40} fontSize={12} textAnchor="middle" {...label}>
          host .{b + 1} - .{b + 62}
        </text>
        <text x={286} y={48 + i * 40} fontSize={12} textAnchor="end" {...quiet}>
          broadcast .{b + 63}
        </text>
      </g>
    ))}
  </svg>
)
