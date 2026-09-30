import type { FC } from 'react'
import { label, quiet } from './styles'

const ROWS = [
  { name: 'Melindungi', soft: 'hapus, timpa', ver: 'hapus, timpa' },
  { name: 'Disimpan', soft: '1–365 hari', ver: 'sampai dihapus' },
  { name: 'Ditimpa', soft: 'jadi snapshot', ver: 'jadi versi lama' },
  { name: 'Memulihkan', soft: 'undelete', ver: 'salin versi lama' },
]

/**
 * Blob soft delete vs blob versioning, and where container soft delete fits:
 * the first two protect single blobs, the third only whole containers.
 */
export const SoftDeleteVsVersioning: FC = () => (
  <svg
    viewBox="0 0 300 240"
    role="img"
    aria-label="Perbandingan blob soft delete dan blob versioning. Keduanya melindungi blob dari dihapus dan ditimpa. Soft delete menyimpan data 1 sampai 365 hari, menyimpan isi lama sebagai snapshot terhapus saat blob ditimpa, dan dipulihkan dengan undelete. Versioning menyimpan versi sebelumnya sampai dihapus, dan blob dipulihkan dengan menyalin versi lama menjadi versi saat ini. Container soft delete hanya memulihkan container utuh, dengan masa simpan default 7 hari."
    className="w-full font-display"
  >
    <text x={150} y={16} fontSize={12} textAnchor="middle" {...label}>
      Soft delete
    </text>
    <text x={248} y={16} fontSize={12} textAnchor="middle" {...label}>
      Versioning
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
            {r.soft}
          </text>
          <text x={248} y={y + 18} fontSize={12} textAnchor="middle" {...quiet}>
            {r.ver}
          </text>
        </g>
      )
    })}
    <rect x={1} y={164} width={298} height={46} rx={10} fill="#fff" stroke="var(--color-matahari-dalam)" strokeWidth={2} />
    <text x={12} y={183} fontSize={12} {...label}>
      Container soft delete (default 7 hari)
    </text>
    <text x={12} y={200} fontSize={12} {...quiet}>
      hanya memulihkan container utuh
    </text>
    <text x={0} y={234} fontSize={12} {...label}>
      Data penting: aktifkan keduanya.
    </text>
  </svg>
)
