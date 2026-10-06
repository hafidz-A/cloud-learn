import type { FC } from 'react'
import { ArrowMarker } from './parts'
import { useSvgId } from './ids'
import { DeviceIcon } from './NetDiagram'
import { label, quiet } from './styles'

const STEPS = [
  { text: 'Discover (broadcast)', dir: 1 },
  { text: 'Offer: 192.168.10.11', dir: -1 },
  { text: 'Request: saya ambil .11', dir: 1 },
  { text: 'Ack: lease 1 hari', dir: -1 },
]

/** DHCP DORA: Discover, Offer, Request, Acknowledge between a client and a server. */
export const DhcpDora: FC = () => {
  const right = useSvgId('dora-r')
  const left = useSvgId('dora-l')
  return (
    <svg
      viewBox="0 0 300 210"
      role="img"
      aria-label="Empat pesan DHCP, disingkat DORA. Satu, klien mengirim Discover sebagai broadcast. Dua, server membalas Offer berisi alamat yang ditawarkan, 192.168.10.11. Tiga, klien mengirim Request untuk mengambil alamat itu. Empat, server mengirim Ack yang mengesahkan peminjaman alamat, misalnya selama satu hari."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={right} color="var(--color-koral-dalam)" />
        <ArrowMarker id={left} />
      </defs>
      <DeviceIcon kind="pc" x={30} y={26} />
      <text x={30} y={56} fontSize={12} textAnchor="middle" {...label}>
        Klien
      </text>
      <DeviceIcon kind="server" x={270} y={26} />
      <text x={270} y={56} fontSize={12} textAnchor="middle" {...label}>
        Server
      </text>
      {STEPS.map((s, i) => {
        const y = 82 + i * 34
        return (
          <g key={s.text}>
            <path
              d={s.dir > 0 ? `M34 ${y} H262` : `M266 ${y} H38`}
              stroke={s.dir > 0 ? 'var(--color-koral-dalam)' : 'var(--color-biru-dalam)'}
              strokeWidth={2}
              strokeDasharray={i === 0 ? '6 4' : undefined}
              markerEnd={`url(#${s.dir > 0 ? right : left})`}
            />
            <text x={150} y={y - 6} fontSize={12} textAnchor="middle" {...label}>
              {i + 1}. {s.text}
            </text>
          </g>
        )
      })}
      <text x={4} y={206} fontSize={12} {...quiet}>
        Klien: UDP 68, server: UDP 67
      </text>
    </svg>
  )
}
