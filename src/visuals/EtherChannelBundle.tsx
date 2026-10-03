import type { FC } from 'react'
import { DeviceIcon } from './NetDiagram'
import { label, quiet } from './styles'

/** Four physical links bundled into one logical Port-channel. */
export const EtherChannelBundle: FC = () => (
  <svg
    viewBox="0 0 300 190"
    role="img"
    aria-label="Empat link fisik antara SW1 dan SW2, Gi0/1 sampai Gi0/4, digabung menjadi satu link logis bernama Port-channel 1. Bandwidth-nya bertambah, STP melihatnya sebagai satu link sehingga tidak ada link yang diblokir, dan kalau satu kabel putus trafik tetap lewat tiga link lainnya."
    className="w-full font-display"
  >
    <DeviceIcon kind="switch" x={36} y={60} />
    <DeviceIcon kind="switch" x={264} y={60} />
    <text x={36} y={92} fontSize={12} textAnchor="middle" {...label}>
      SW1
    </text>
    <text x={264} y={92} fontSize={12} textAnchor="middle" {...label}>
      SW2
    </text>
    <ellipse cx={150} cy={60} rx={70} ry={30} fill="var(--color-biru-muda)" />
    {[42, 54, 66, 78].map((y) => (
      <line key={y} x1={60} y1={y} x2={240} y2={y} stroke="var(--color-biru-dalam)" strokeWidth={2.5} />
    ))}
    <text x={150} y={20} fontSize={12} textAnchor="middle" {...label}>
      Port-channel 1
    </text>
    <text x={60} y={118} fontSize={12} {...quiet}>
      Gi0/1 - Gi0/4 di kedua sisi
    </text>
    <text x={4} y={146} fontSize={12} {...label}>
      Bandwidth naik, satu link logis
    </text>
    <text x={4} y={166} fontSize={12} {...quiet}>
      STP melihat satu link, tidak ada yang diblokir
    </text>
    <text x={4} y={184} fontSize={12} {...quiet}>
      Satu kabel putus: sisanya tetap jalan
    </text>
  </svg>
)
