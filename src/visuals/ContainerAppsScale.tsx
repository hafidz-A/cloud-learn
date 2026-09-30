import type { FC } from 'react'
import { label, quiet } from './styles'

// Replicas over a day with the default HTTP rule (min 0, max 10).
const BARS = [0, 0, 2, 6, 10, 10, 7, 3, 1, 0, 0]

/**
 * A container app scaling with HTTP traffic: from 0 replicas when idle up to
 * the maximum of 10 at peak, and back to 0. At 0 replicas there are no usage
 * charges.
 */
export const ContainerAppsScale: FC = () => (
  <svg
    viewBox="0 0 300 228"
    role="img"
    aria-label="Jumlah replica container app sepanjang hari dengan aturan default HTTP, minimal 0 dan maksimal 10. Saat tidak ada trafik, replica 0 dan tidak ada biaya pemakaian. Saat trafik naik, replica bertambah sampai 10, lalu turun lagi ke 0. Untuk selalu punya satu instance yang berjalan, set minimal replica ke 1."
    className="w-full font-display"
  >
    <text x={0} y={14} fontSize={12} {...quiet}>
      Replica, aturan default HTTP
    </text>
    <path d="M24 26 V150 H298" stroke="var(--color-tinta-lembut)" strokeWidth={1.5} fill="none" />
    <path d="M24 38 H298" stroke="var(--color-koral)" strokeWidth={1.5} strokeDasharray="5 4" />
    <text x={20} y={42} fontSize={12} textAnchor="end" {...quiet}>
      10
    </text>
    <text x={20} y={154} fontSize={12} textAnchor="end" {...quiet}>
      0
    </text>
    <text x={296} y={34} fontSize={12} textAnchor="end" {...quiet}>
      maksimal 10
    </text>
    {BARS.map((n, i) => {
      const x = 32 + i * 24
      const h = n * 11.2
      return n === 0 ? (
        <circle key={i} cx={x + 8} cy={146} r={3} fill="var(--color-mint-dalam)" />
      ) : (
        <rect key={i} x={x} y={150 - h} width={16} height={h} rx={3} fill="var(--color-biru)" />
      )
    })}
    <text x={40} y={170} fontSize={12} textAnchor="middle" {...quiet}>
      malam
    </text>
    <text x={150} y={170} fontSize={12} textAnchor="middle" {...quiet}>
      jam sibuk
    </text>
    <text x={270} y={170} fontSize={12} textAnchor="middle" {...quiet}>
      malam
    </text>
    <text x={0} y={196} fontSize={12} {...label}>
      0 replica: tidak ada biaya pemakaian.
    </text>
    <text x={0} y={214} fontSize={12} {...label}>
      Selalu siap: set minimal replica 1.
    </text>
  </svg>
)
