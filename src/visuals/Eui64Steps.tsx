import type { FC } from 'react'
import { label, quiet } from './styles'

const STEPS = [
  { title: 'MAC address', text: '00:50:79:66:68:00' },
  { title: '1. Belah dua, sisipkan fffe di tengah', text: '0050:79ff:fe66:6800' },
  { title: '2. Balik bit ke-7 (00 jadi 02)', text: '0250:79ff:fe66:6800' },
  { title: 'Interface ID dengan prefix 2001:db8:1::/64', text: '2001:db8:1::250:79ff:fe66:6800' },
]

/** Modified EUI-64: split the MAC, insert fffe, flip the universal/local bit. */
export const Eui64Steps: FC = () => (
  <svg
    viewBox="0 0 300 210"
    role="img"
    aria-label="Modified EUI-64. MAC address 00:50:79:66:68:00 dibelah dua dan fffe disisipkan di tengah menjadi 0050:79ff:fe66:6800. Lalu bit ketujuh dibalik, sehingga byte pertama 00 menjadi 02: 0250:79ff:fe66:6800. Digabung dengan prefix 2001:db8:1::/64, alamatnya menjadi 2001:db8:1::250:79ff:fe66:6800."
    className="w-full font-display"
  >
    {STEPS.map((s, i) => (
      <g key={s.title}>
        <text x={6} y={16 + i * 50} fontSize={12} {...quiet}>
          {s.title}
        </text>
        <rect x={6} y={22 + i * 50} width={288} height={24} rx={6} fill={i === 3 ? 'var(--color-mint-muda)' : 'var(--color-biru-muda)'} />
        <text x={150} y={39 + i * 50} fontSize={12.5} textAnchor="middle" fontFamily="monospace" {...label}>
          {s.text}
        </text>
      </g>
    ))}
  </svg>
)
