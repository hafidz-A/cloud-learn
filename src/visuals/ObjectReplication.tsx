import type { FC } from 'react'
import { useSvgId } from './ids'
import { ArrowMarker, Mark } from './parts'
import { label, quiet } from './styles'

function Row({ y, text, ok }: { y: number; text: string; ok: boolean }) {
  return (
    <g>
      <rect x={10} y={y} width={280} height={24} rx={6} fill={ok ? '#fff' : 'var(--color-koral-muda)'} />
      <text x={18} y={y + 16} fontSize={12} {...label}>
        {text}
      </text>
      <Mark cx={276} cy={y + 12} ok={ok} />
    </g>
  )
}

/**
 * Object replication copies block blobs from a container in the source account
 * to a container in the destination account, asynchronously. Versioning must be
 * on in both accounts and change feed on in the source; the destination
 * container is read-only while the rule exists.
 */
export const ObjectReplication: FC = () => {
  const arrow = useSvgId('or-arrow')
  return (
    <svg
      viewBox="0 0 300 250"
      role="img"
      aria-label="Object replication: akun sumber di region A punya container foto, dengan blob versioning dan change feed aktif. Sebuah policy dengan rule foto ke foto-dr menyalin block blob secara asinkron ke akun tujuan di region B. Akun tujuan juga harus mengaktifkan blob versioning, dan container foto-dr tidak bisa ditulisi selama rule aktif, dengan error 409. Hanya block blob yang disalin, akun dengan hierarchical namespace tidak didukung, dan blob yang sudah ada tidak disalin kecuali dipilih."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={arrow} />
      </defs>
      {/* Source account */}
      <rect x={1} y={1} width={298} height={86} rx={12} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={2} />
      <text x={12} y={20} fontSize={12} {...label}>
        Akun sumber (region A)
      </text>
      <text x={288} y={20} fontSize={12} textAnchor="end" {...quiet}>
        container foto
      </text>
      <Row y={28} text="Blob versioning aktif" ok />
      <Row y={56} text="Change feed aktif" ok />
      {/* Policy */}
      <path d="M40 88 V116" stroke="var(--color-biru-dalam)" strokeWidth={2} markerEnd={`url(#${arrow})`} />
      <text x={54} y={100} fontSize={12} {...label}>
        rule: foto → foto-dr
      </text>
      <text x={54} y={115} fontSize={12} {...quiet}>
        disalin asinkron, hanya block blob
      </text>
      {/* Destination account */}
      <rect x={1} y={120} width={298} height={86} rx={12} fill="#fff" stroke="var(--color-biru-dalam)" strokeWidth={2} />
      <text x={12} y={139} fontSize={12} {...label}>
        Akun tujuan (region B)
      </text>
      <text x={288} y={139} fontSize={12} textAnchor="end" {...quiet}>
        container foto-dr
      </text>
      <Row y={147} text="Blob versioning aktif" ok />
      <Row y={175} text="Tulis ke foto-dr: ditolak (409)" ok={false} />
      <text x={0} y={226} fontSize={12} {...label}>
        Tanpa hierarchical namespace.
      </text>
      <text x={0} y={244} fontSize={12} {...quiet}>
        Blob lama tidak disalin, kecuali dipilih.
      </text>
    </svg>
  )
}
