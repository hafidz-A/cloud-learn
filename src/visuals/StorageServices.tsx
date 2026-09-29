import type { FC } from 'react'
import { useSvgId } from './ids'
import { ArrowMarker, Pill } from './parts'
import { label, quiet } from './styles'

const ROWS = [
  { who: 'Browser, aplikasi', service: 'Blob: object' },
  { who: 'Server (SMB, NFS)', service: 'Files: file share' },
  { who: 'Proses belakang', service: 'Queue: pesan' },
  { who: 'Aplikasi', service: 'Table: key-attribute' },
  { who: 'Virtual machine', service: 'Disks: disk VM' },
]

/** Who uses each storage service. Blob, Files, Queue, and Table live in a storage account; disks attach to VMs. */
export const StorageServices: FC = () => {
  const storageArrow = useSvgId('storage-arrow')
  const top = 30
  const rh = 34
  return (
    <svg
      viewBox="0 0 300 206"
      role="img"
      aria-label="Diagram layanan storage: browser dan aplikasi memakai Blob untuk object, server memakai Files lewat SMB atau NFS, proses belakang memakai Queue untuk pesan, aplikasi memakai Table untuk data key-attribute, dan virtual machine memakai Disks; Blob, Files, Queue, dan Table ada di dalam storage account."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={storageArrow} />
      </defs>
      <rect x={142} y={top - 8} width={156} height={4 * rh + 8} rx={12} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={1.5} strokeDasharray="5 4" />
      <text x={220} y={14} fontSize={12} textAnchor="middle" {...label}>
        Storage account
      </text>
      {ROWS.map((r, i) => {
        const y = top + i * rh + (i === 4 ? 10 : 0)
        return (
          <g key={r.service}>
            <text x={0} y={y + 17} fontSize={12} {...quiet}>
              {r.who}
            </text>
            <path d={`M112 ${y + 13} H144`} stroke="var(--color-biru-dalam)" strokeWidth={2} markerEnd={`url(#${storageArrow})`} />
            <Pill x={150} y={y} w={140} lines={[r.service]} />
          </g>
        )
      })}
    </svg>
  )
}
