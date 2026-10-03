import type { FC } from 'react'
import { label, quiet } from './styles'

const ROWS = [
  { prefix: '2000::/3', name: 'Global unicast', note: 'dirutekan di internet', fill: 'var(--color-biru-muda)' },
  { prefix: 'fc00::/7', name: 'Unique local', note: 'privat, biasanya fd', fill: 'var(--color-mint-muda)' },
  { prefix: 'fe80::/10', name: 'Link-local', note: 'hanya di satu link', fill: 'var(--color-matahari-muda)' },
  { prefix: 'ff00::/8', name: 'Multicast', note: 'ff02::1 semua node', fill: 'var(--color-koral-muda)' },
  { prefix: '::1/128', name: 'Loopback', note: 'host itu sendiri', fill: 'var(--color-kabut)' },
]

/** The IPv6 address types to know, by prefix. */
export const Ipv6AddressTypes: FC = () => (
  <svg
    viewBox="0 0 300 200"
    role="img"
    aria-label="Jenis alamat IPv6 menurut prefix. 2000::/3 global unicast, dirutekan di internet. fc00::/7 unique local, alamat privat yang biasanya diawali fd. fe80::/10 link-local, hanya berlaku di satu link. ff00::/8 multicast, misalnya ff02::1 untuk semua node. ::1/128 loopback, host itu sendiri."
    className="w-full font-display"
  >
    {ROWS.map((r, i) => (
      <g key={r.prefix}>
        <rect x={6} y={6 + i * 38} width={288} height={32} rx={6} fill={r.fill} />
        <text x={14} y={27 + i * 38} fontSize={13} fontFamily="monospace" {...label}>
          {r.prefix}
        </text>
        <text x={110} y={21 + i * 38} fontSize={12} {...label}>
          {r.name}
        </text>
        <text x={110} y={34 + i * 38} fontSize={12} {...quiet}>
          {r.note}
        </text>
      </g>
    ))}
  </svg>
)
