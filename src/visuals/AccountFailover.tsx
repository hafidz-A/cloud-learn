import type { FC } from 'react'
import { Mark } from './parts'
import { label, quiet } from './styles'

const ROWS = [
  { name: 'Kapan', planned: 'uji pemulihan', unplanned: 'primary mati' },
  { name: 'Region lama', planned: 'jadi secondary', unplanned: 'datanya dihapus' },
  { name: 'Setelahnya', planned: 'geo tetap', unplanned: 'jadi LRS' },
]

/**
 * Customer-managed planned vs unplanned failover of a geo-redundant storage
 * account: what each is for, what happens to the old primary region, the
 * redundancy afterwards, and whether data can be lost.
 */
export const AccountFailover: FC = () => (
  <svg
    viewBox="0 0 300 226"
    role="img"
    aria-label="Perbandingan failover storage account yang dikelola pelanggan. Planned failover dipakai untuk menguji rencana disaster recovery saat kedua region hidup: region primary dan secondary bertukar, geo-redundancy tetap, dan tidak ada data yang hilang. Unplanned failover dipakai saat region primary tidak tersedia: secondary menjadi primary, salinan di region lama dihapus, akun menjadi LRS, dan data yang ditulis setelah Last Sync Time bisa hilang. Geo-redundancy bisa diaktifkan lagi dengan biaya."
    className="w-full font-display"
  >
    <text x={150} y={16} fontSize={12} textAnchor="middle" {...label}>
      Planned
    </text>
    <text x={248} y={16} fontSize={12} textAnchor="middle" {...label}>
      Unplanned
    </text>
    {ROWS.map((r, i) => {
      const y = 26 + i * 32
      return (
        <g key={r.name}>
          <rect x={1} y={y} width={298} height={28} rx={6} fill="var(--color-biru-muda)" />
          <text x={8} y={y + 18} fontSize={12} {...label}>
            {r.name}
          </text>
          <text x={150} y={y + 18} fontSize={12} textAnchor="middle" {...quiet}>
            {r.planned}
          </text>
          <text x={248} y={y + 18} fontSize={12} textAnchor="middle" {...quiet}>
            {r.unplanned}
          </text>
        </g>
      )
    })}
    <rect x={1} y={122} width={298} height={28} rx={6} fill="var(--color-biru-muda)" />
    <text x={8} y={140} fontSize={12} {...label}>
      Data hilang
    </text>
    <Mark cx={130} cy={136} ok />
    <text x={142} y={140} fontSize={12} {...quiet}>
      tidak
    </text>
    <Mark cx={218} cy={136} ok={false} />
    <text x={230} y={140} fontSize={12} {...quiet}>
      mungkin
    </text>
    <text x={0} y={176} fontSize={12} {...label}>
      Unplanned: tulisan setelah Last Sync Time
    </text>
    <text x={0} y={194} fontSize={12} {...label}>
      bisa hilang, karena salinan ke region kedua
    </text>
    <text x={0} y={212} fontSize={12} {...quiet}>
      asinkron. Geo bisa diaktifkan lagi (berbayar).
    </text>
  </svg>
)
