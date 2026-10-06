import type { FC } from 'react'
import { ArrowMarker } from './parts'
import { useSvgId } from './ids'
import { label, quiet } from './styles'

/** The TCP three-way handshake (RFC 9293): SYN, SYN-ACK, ACK, then data. */
export const TcpHandshake: FC = () => {
  const arrow = useSvgId('tcp-arrow')
  const steps = [
    { y: 50, from: 60, to: 240, text: '1. SYN' },
    { y: 90, from: 240, to: 60, text: '2. SYN-ACK' },
    { y: 130, from: 60, to: 240, text: '3. ACK' },
  ]
  return (
    <svg
      viewBox="0 0 300 190"
      role="img"
      aria-label="Three-way handshake TCP antara klien dan server. Klien mengirim SYN, server membalas SYN-ACK, lalu klien mengirim ACK. Setelah tiga pesan itu koneksi terbentuk dan data mulai dikirim."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={arrow} />
      </defs>
      <text x={60} y={18} fontSize={13} textAnchor="middle" {...label}>
        Klien
      </text>
      <text x={240} y={18} fontSize={13} textAnchor="middle" {...label}>
        Server
      </text>
      <path d="M60 26 V170" stroke="var(--color-kabut-dalam)" strokeWidth={3} />
      <path d="M240 26 V170" stroke="var(--color-kabut-dalam)" strokeWidth={3} />
      {steps.map((s) => (
        <g key={s.text}>
          <path d={`M${s.from} ${s.y} L${s.to + (s.to > s.from ? -6 : 6)} ${s.y + 22}`} stroke="var(--color-biru-dalam)" strokeWidth={2.5} markerEnd={`url(#${arrow})`} />
          <text x={150} y={s.y + 6} fontSize={12} textAnchor="middle" {...label}>
            {s.text}
          </text>
        </g>
      ))}
      <text x={150} y={180} fontSize={12} textAnchor="middle" {...quiet}>
        Koneksi terbentuk, data mulai dikirim
      </text>
    </svg>
  )
}
