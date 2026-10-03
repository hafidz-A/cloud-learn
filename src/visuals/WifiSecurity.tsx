import type { FC } from 'react'
import { label, quiet } from './styles'

const ROWS = [
  { name: 'WEP', text: 'kunci statis, sudah tidak aman', fill: 'var(--color-koral-muda)' },
  { name: 'WPA', text: 'TKIP, pengganti sementara WEP', fill: 'var(--color-matahari-muda)' },
  { name: 'WPA2', text: 'AES-CCMP; PSK atau 802.1X', fill: 'var(--color-biru-muda)' },
  { name: 'WPA3', text: 'SAE atau 802.1X; PMF wajib', fill: 'var(--color-mint-muda)' },
]

/** Wi-Fi security from weakest to strongest. */
export const WifiSecurity: FC = () => (
  <svg
    viewBox="0 0 300 190"
    role="img"
    aria-label="Keamanan Wi-Fi dari yang terlemah. WEP memakai kunci statis dan sudah tidak aman. WPA memakai TKIP sebagai pengganti sementara WEP. WPA2 memakai AES-CCMP, dengan mode Personal memakai pre-shared key atau Enterprise memakai 802.1X. WPA3 Personal memakai SAE, Enterprise memakai 802.1X, dan Protected Management Frames wajib."
    className="w-full font-display"
  >
    {ROWS.map((r, i) => (
      <g key={r.name}>
        <rect x={6} y={6 + i * 42} width={288} height={36} rx={6} fill={r.fill} />
        <text x={14} y={29 + i * 42} fontSize={14} {...label}>
          {r.name}
        </text>
        <text x={66} y={29 + i * 42} fontSize={12} {...quiet}>
          {r.text}
        </text>
      </g>
    ))}
    <text x={6} y={184} fontSize={12} {...quiet}>
      Makin ke bawah, makin kuat
    </text>
  </svg>
)
