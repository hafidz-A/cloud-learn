import type { FC } from 'react'
import { useSvgId } from './ids'
import { ArrowMarker } from './parts'
import { label, quiet } from './styles'

/**
 * A stored access policy on a container: two service SAS tokens point to it by
 * its identifier and take its permissions and expiry. Deleting or changing the
 * policy revokes both, without regenerating the account key.
 */
export const StoredAccessPolicy: FC = () => {
  const arrow = useSvgId('sap-arrow')
  return (
    <svg
      viewBox="0 0 300 236"
      role="img"
      aria-label="Stored access policy: container kontrak punya policy bernama mitra-baca, dengan izin read yang berlaku sampai 31 Oktober. Dua service SAS, untuk mitra A dan mitra B, merujuk ke policy itu dan mengikuti izin serta masa berlakunya. Kalau policy dihapus atau diubah, kedua SAS ikut dicabut tanpa merotasi account key. Satu container maksimal punya lima stored access policy."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={arrow} />
      </defs>
      <rect x={1} y={1} width={298} height={80} rx={12} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={2} />
      <text x={12} y={21} fontSize={12} {...label}>
        Container kontrak
      </text>
      <text x={288} y={21} fontSize={12} textAnchor="end" {...quiet}>
        maks. 5 policy
      </text>
      <rect x={10} y={30} width={280} height={42} rx={8} fill="#fff" stroke="var(--color-biru)" strokeWidth={1.5} />
      <text x={20} y={47} fontSize={12} {...label}>
        Policy: mitra-baca
      </text>
      <text x={20} y={64} fontSize={12} {...quiet}>
        izin read, berlaku sampai 31 Oktober
      </text>
      {[75, 225].map((x) => (
        <path key={x} d={`M${x} 112 V86`} stroke="var(--color-biru-dalam)" strokeWidth={2} markerEnd={`url(#${arrow})`} />
      ))}
      {['Mitra A', 'Mitra B'].map((n, i) => (
        <g key={n}>
          <rect x={1 + i * 152} y={114} width={146} height={48} rx={10} fill="#fff" stroke="var(--color-matahari-dalam)" strokeWidth={2} />
          <text x={74 + i * 152} y={134} fontSize={12} textAnchor="middle" {...label}>
            Service SAS {n}
          </text>
          <text x={74 + i * 152} y={152} fontSize={12} textAnchor="middle" {...quiet}>
            si=mitra-baca
          </text>
        </g>
      ))}
      <text x={0} y={188} fontSize={12} {...label}>
        Hapus atau ubah policy: kedua SAS dicabut,
      </text>
      <text x={0} y={206} fontSize={12} {...label}>
        tanpa merotasi account key.
      </text>
      <text x={0} y={226} fontSize={12} {...quiet}>
        Hanya untuk service SAS.
      </text>
    </svg>
  )
}
