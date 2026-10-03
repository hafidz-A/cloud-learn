import type { FC } from 'react'
import { label, quiet } from './styles'

/** A wildcard mask is the inverse of the subnet mask: 0 bits must match, 1 bits are ignored. */
export const WildcardMask: FC = () => (
  <svg
    viewBox="0 0 300 190"
    role="img"
    aria-label="Wildcard mask adalah kebalikan subnet mask. Bit 0 berarti harus cocok, bit 1 berarti boleh apa saja. Untuk subnet 255.255.255.0, wildcard-nya 0.0.0.255, karena 255 dikurangi setiap oktet mask. Untuk /30 atau 255.255.255.252, wildcard-nya 0.0.0.3. Wildcard 0.0.0.0 berarti satu alamat saja."
    className="w-full font-display"
  >
    <text x={4} y={18} fontSize={12} {...quiet}>
      Wildcard = 255.255.255.255 dikurangi mask
    </text>
    {[
      ['255.255.255.0', '0.0.0.255'],
      ['255.255.255.252', '0.0.0.3'],
      ['255.255.240.0', '0.0.15.255'],
      ['255.255.255.255', '0.0.0.0'],
    ].map(([m, w], i) => (
      <g key={m}>
        <rect x={4} y={28 + i * 34} width={140} height={28} rx={6} fill="var(--color-biru-muda)" />
        <text x={74} y={47 + i * 34} fontSize={12} textAnchor="middle" fontFamily="monospace" {...label}>
          {m}
        </text>
        <text x={150} y={47 + i * 34} fontSize={12} {...quiet}>
          =&gt;
        </text>
        <rect x={170} y={28 + i * 34} width={126} height={28} rx={6} fill="var(--color-matahari-muda)" />
        <text x={233} y={47 + i * 34} fontSize={12} textAnchor="middle" fontFamily="monospace" {...label}>
          {w}
        </text>
      </g>
    ))}
    <text x={4} y={184} fontSize={12} {...label}>
      Bit 0: harus cocok. Bit 1: abaikan.
    </text>
  </svg>
)
