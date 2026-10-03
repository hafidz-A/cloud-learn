import type { FC } from 'react'
import { label, quiet } from './styles'

/** /26: 26 network bits then 6 host bits; the mask is 255.255.255.192. */
export const SubnetMaskBits: FC = () => (
  <svg
    viewBox="0 0 300 170"
    role="img"
    aria-label="Prefix /26 berarti 26 bit pertama adalah bagian network dan 6 bit sisanya bagian host. Subnet mask-nya 255.255.255.192: bit network bernilai 1 dan bit host bernilai 0. Dengan 6 bit host ada 64 alamat, 62 di antaranya bisa dipakai host."
    className="w-full font-display"
  >
    {[0, 1, 2, 3].map((o) => (
      <g key={o}>
        {Array.from({ length: 8 }, (_, b) => {
          const bit = o * 8 + b
          const net = bit < 26
          return <rect key={b} x={6 + o * 72 + b * 8.5} y={30} width={7} height={30} rx={1.5} fill={net ? 'var(--color-biru)' : 'var(--color-matahari)'} />
        })}
        <text x={6 + o * 72 + 34} y={80} fontSize={12} textAnchor="middle" {...label}>
          {['255', '255', '255', '192'][o]}
        </text>
      </g>
    ))}
    <text x={6} y={20} fontSize={12} {...quiet}>
      32 bit alamat, prefix /26
    </text>
    <rect x={6} y={100} width={14} height={14} rx={3} fill="var(--color-biru)" />
    <text x={26} y={112} fontSize={12} {...label}>
      26 bit network (mask = 1)
    </text>
    <rect x={6} y={124} width={14} height={14} rx={3} fill="var(--color-matahari)" />
    <text x={26} y={136} fontSize={12} {...label}>
      6 bit host (mask = 0)
    </text>
    <text x={6} y={162} fontSize={12} {...quiet}>
      2 pangkat 6 = 64 alamat, 62 untuk host
    </text>
  </svg>
)
