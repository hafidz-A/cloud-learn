import type { FC } from 'react'
import { DeviceIcon } from './NetDiagram'
import { label, quiet } from './styles'

/** Two APs with the same SSID: each AP and its clients is a BSS; together they form an ESS the client roams in. */
export const BssEss: FC = () => (
  <svg
    viewBox="0 0 300 200"
    role="img"
    aria-label="Dua access point memakai SSID yang sama, Kantor. Setiap AP bersama kliennya membentuk BSS, dikenali dari BSSID, yaitu MAC radio AP itu. Kedua BSS bersama-sama membentuk ESS, sehingga laptop bisa roaming dari AP1 ke AP2 tanpa ganti nama jaringan."
    className="w-full font-display"
  >
    <ellipse cx={85} cy={90} rx={78} ry={62} fill="var(--color-biru-muda)" fillOpacity={0.7} />
    <ellipse cx={215} cy={90} rx={78} ry={62} fill="var(--color-mint-muda)" fillOpacity={0.7} />
    <DeviceIcon kind="ap" x={70} y={70} />
    <DeviceIcon kind="ap" x={230} y={70} />
    <text x={70} y={102} fontSize={12} textAnchor="middle" {...label}>
      AP1
    </text>
    <text x={230} y={102} fontSize={12} textAnchor="middle" {...label}>
      AP2
    </text>
    <DeviceIcon kind="laptop" x={150} y={110} />
    <text x={150} y={142} fontSize={12} textAnchor="middle" {...quiet}>
      roaming
    </text>
    <text x={30} y={40} fontSize={12} {...quiet}>
      BSS 1
    </text>
    <text x={240} y={40} fontSize={12} {...quiet}>
      BSS 2
    </text>
    <text x={6} y={172} fontSize={12} {...label}>
      SSID sama "Kantor" = satu ESS
    </text>
    <text x={6} y={192} fontSize={12} {...quiet}>
      BSSID = MAC radio tiap AP
    </text>
  </svg>
)
