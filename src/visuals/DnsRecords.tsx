import type { FC } from 'react'
import { label, quiet } from './styles'

const ROWS = [
  ['A', 'Nama ke IPv4'],
  ['AAAA', 'Nama ke IPv6'],
  ['CNAME', 'Alias ke nama lain'],
  ['MX', 'Server mail domain'],
  ['NS', 'Name server domain'],
  ['PTR', 'Alamat ke nama'],
]

/** Common DNS record types. */
export const DnsRecords: FC = () => (
  <svg
    viewBox="0 0 300 208"
    role="img"
    aria-label="Jenis record DNS. A memetakan nama ke alamat IPv4. AAAA memetakan nama ke alamat IPv6. CNAME membuat alias ke nama lain. MX menunjuk server mail untuk domain. NS menunjuk name server authoritative domain. PTR memetakan alamat kembali ke nama untuk reverse lookup."
    className="w-full font-display"
  >
    {ROWS.map((r, i) => (
      <g key={r[0]}>
        <rect x={4} y={4 + i * 34} width={292} height={30} rx={6} fill={i % 2 ? 'var(--color-kabut)' : 'var(--color-biru-muda)'} />
        <text x={14} y={24 + i * 34} fontSize={12} {...label}>
          {r[0]}
        </text>
        <text x={90} y={24 + i * 34} fontSize={12} {...quiet}>
          {r[1]}
        </text>
      </g>
    ))}
  </svg>
)
