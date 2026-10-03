import type { FC } from 'react'
import { label, quiet } from './styles'

const LAYERS = [
  { name: 'Aplikasi', note: 'skrip, dashboard', fill: 'var(--color-biru-muda)' },
  { name: 'Controller', note: 'control plane terpusat', fill: 'var(--color-matahari-muda)' },
  { name: 'Perangkat', note: 'data plane: meneruskan', fill: 'var(--color-mint-muda)' },
]

/** SDN layers: applications talk northbound to the controller, which talks southbound to devices. */
export const SdnLayers: FC = () => (
  <svg
    viewBox="0 0 300 190"
    role="img"
    aria-label="Arsitektur SDN dalam tiga lapis. Paling atas aplikasi, misalnya skrip atau dashboard. Di tengah controller yang memegang control plane secara terpusat. Paling bawah perangkat jaringan yang menjalankan data plane, yaitu meneruskan paket. Aplikasi bicara ke controller lewat northbound API, sering REST. Controller bicara ke perangkat lewat southbound API, misalnya OpenFlow, NETCONF, atau SSH."
    className="w-full font-display"
  >
    {LAYERS.map((l, i) => (
      <g key={l.name}>
        <rect x={4} y={4 + i * 66} width={292} height={42} rx={8} fill={l.fill} />
        <text x={14} y={30 + i * 66} fontSize={12} {...label}>
          {l.name}
        </text>
        <text x={110} y={30 + i * 66} fontSize={12} {...quiet}>
          {l.note}
        </text>
      </g>
    ))}
    <path d="M60 46 V70 M60 112 V136" stroke="var(--color-tinta-lembut)" strokeWidth={1.5} />
    <text x={70} y={63} fontSize={12} {...quiet}>
      northbound API (REST)
    </text>
    <text x={70} y={129} fontSize={12} {...quiet}>
      southbound API
    </text>
  </svg>
)
