import type { FC } from 'react'
import { label, quiet } from './styles'

// Address, what it is for, chip x and width (the widths follow the label lengths).
const RESERVED: [string, string, number, number][] = [
  ['.0', 'jaringan', 0, 60],
  ['.1', 'gateway', 65, 56],
  ['.2', 'DNS', 126, 44],
  ['.3', 'DNS', 175, 44],
  ['.31', 'broadcast', 224, 76],
]

/**
 * A VNet address space split into subnets, with the five addresses Azure keeps
 * in every subnet (first four and the last), shown for a /27.
 */
export const VNetAddressPlan: FC = () => (
  <svg
    viewBox="0 0 300 226"
    role="img"
    aria-label="Rencana alamat: VNet 10.0.0.0/16 dibagi menjadi subnet snet-web 10.0.1.0/24 dengan 256 dikurangi 5, yaitu 251 alamat terpakai, dan subnet snet-db 10.0.2.0/27 dengan 32 dikurangi 5, yaitu 27 alamat terpakai. Di subnet /27 itu, Azure mencadangkan 10.0.2.0 untuk alamat jaringan, .1 untuk default gateway, .2 dan .3 untuk DNS Azure, dan .31 untuk broadcast. Subnet terkecil adalah /29 dengan 3 alamat terpakai."
    className="w-full font-display"
  >
    <rect x={1} y={1} width={298} height={104} rx={12} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={2} />
    <text x={12} y={20} fontSize={12} {...label}>
      VNet 10.0.0.0/16
    </text>
    {[
      { x: 10, name: 'snet-web', cidr: '10.0.1.0/24', math: '256 − 5 = 251' },
      { x: 154, name: 'snet-db', cidr: '10.0.2.0/27', math: '32 − 5 = 27' },
    ].map((s) => (
      <g key={s.name}>
        <rect x={s.x} y={30} width={136} height={66} rx={10} fill="#fff" stroke="var(--color-biru)" strokeWidth={2} />
        <text x={s.x + 68} y={50} fontSize={12} textAnchor="middle" {...label}>
          {s.name}
        </text>
        <text x={s.x + 68} y={67} fontSize={12} textAnchor="middle" {...quiet}>
          {s.cidr}
        </text>
        <text x={s.x + 68} y={85} fontSize={12} textAnchor="middle" {...label}>
          {s.math}
        </text>
      </g>
    ))}
    <text x={0} y={126} fontSize={12} {...label}>
      5 alamat dicadangkan, contoh 10.0.2.0/27:
    </text>
    {RESERVED.map(([addr, role, x, w]) => (
      <g key={addr}>
        <rect x={x} y={136} width={w} height={44} rx={8} fill="var(--color-kabut)" stroke="var(--color-kabut-dalam)" strokeWidth={1.5} />
        <text x={x + w / 2} y={154} fontSize={12} textAnchor="middle" {...label}>
          {addr}
        </text>
        <text x={x + w / 2} y={171} fontSize={12} textAnchor="middle" {...quiet}>
          {role}
        </text>
      </g>
    ))}
    <text x={0} y={202} fontSize={12} {...quiet}>
      .4 sampai .30 bisa dipakai VM dan resource lain.
    </text>
    <text x={0} y={220} fontSize={12} {...quiet}>
      Subnet terkecil /29: 8 − 5 = 3 alamat.
    </text>
  </svg>
)
