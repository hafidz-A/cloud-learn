import type { FC } from 'react'
import { useSvgId } from './ids'
import { ArrowMarker, Person } from './parts'
import { label, quiet } from './styles'

/**
 * Identity-based access to an Azure file share over SMB: the identity source
 * signs the user in with Kerberos, then two permission layers apply. The share
 * level uses Azure RBAC, the folders and files use Windows ACLs, and the most
 * restrictive result wins.
 */
export const FilesPermissionLayers: FC = () => {
  const arrow = useSvgId('files-arrow')
  const layers = [
    { y: 58, title: '1. Level share: Azure RBAC', note: 'Storage File Data SMB Share Contributor', fill: 'var(--color-biru-muda)' },
    { y: 124, title: '2. Folder dan file: Windows ACL', note: 'folder \\laporan: hanya baca', fill: 'var(--color-matahari-muda)' },
  ]
  return (
    <svg
      viewBox="0 0 300 236"
      role="img"
      aria-label="Akses berbasis identitas ke file share Azure lewat SMB. Budi login lewat identity source dengan Kerberos. Lalu dua lapis izin berlaku: di level share memakai Azure RBAC, misalnya Storage File Data SMB Share Contributor, dan di folder serta file memakai Windows ACL, misalnya folder laporan hanya baca. Yang paling ketat yang berlaku, jadi Budi hanya bisa membaca folder laporan."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={arrow} />
      </defs>
      <Person x={20} y={8} />
      <text x={44} y={20} fontSize={12} {...label}>
        Budi login dengan Kerberos
      </text>
      <text x={44} y={37} fontSize={12} {...quiet}>
        lewat identity source akun storage
      </text>
      {layers.map((l) => (
        <g key={l.title}>
          <path d={`M150 ${l.y - 12} V${l.y - 2}`} stroke="var(--color-biru-dalam)" strokeWidth={2} markerEnd={`url(#${arrow})`} />
          <rect x={1} y={l.y} width={298} height={52} rx={10} fill={l.fill} stroke="var(--color-biru-dalam)" strokeWidth={2} />
          <text x={12} y={l.y + 21} fontSize={12} {...label}>
            {l.title}
          </text>
          <text x={12} y={l.y + 40} fontSize={12} {...quiet}>
            {l.note}
          </text>
        </g>
      ))}
      <text x={0} y={202} fontSize={12} {...label}>
        Yang paling ketat yang berlaku:
      </text>
      <text x={0} y={220} fontSize={12} {...quiet}>
        Budi hanya bisa membaca \laporan.
      </text>
    </svg>
  )
}
