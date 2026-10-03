import type { FC } from 'react'
import { label, quiet } from './styles'

const ROWS = [
  ['Pemilik', 'Cisco', 'Standar IEEE 802.1AB'],
  ['Bawaan Catalyst', 'Aktif', 'Mati (lldp run)'],
  ['Kirim tiap', '60 detik', '30 detik'],
  ['Holdtime', '180 detik', '120 detik'],
  ['Tetangga', 'show cdp nei', 'show lldp nei'],
]

/** CDP and LLDP side by side. */
export const CdpVsLldp: FC = () => (
  <svg
    viewBox="0 0 300 200"
    role="img"
    aria-label="Perbandingan CDP dan LLDP. Pemilik: CDP milik Cisco, LLDP standar IEEE 802.1AB. Bawaan di switch Catalyst: CDP aktif, LLDP mati dan dinyalakan dengan lldp run. Interval kirim: CDP 60 detik, LLDP 30 detik. Holdtime: CDP 180 detik, LLDP 120 detik. Melihat tetangga: show cdp neighbors dan show lldp neighbors."
    className="w-full font-display"
  >
    <text x={110} y={16} fontSize={13} {...label}>
      CDP
    </text>
    <text x={200} y={16} fontSize={13} {...label}>
      LLDP
    </text>
    {ROWS.map((r, i) => (
      <g key={r[0]}>
        <rect x={4} y={24 + i * 34} width={292} height={30} rx={6} fill={i % 2 ? 'var(--color-kabut)' : 'var(--color-biru-muda)'} />
        <text x={10} y={43 + i * 34} fontSize={12} {...quiet}>
          {r[0]}
        </text>
        <text x={110} y={43 + i * 34} fontSize={12} {...label}>
          {r[1]}
        </text>
        <text x={200} y={43 + i * 34} fontSize={12} {...label}>
          {r[2]}
        </text>
      </g>
    ))}
  </svg>
)
