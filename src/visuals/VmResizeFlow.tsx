import type { FC } from 'react'
import { useSvgId } from './ids'
import { ArrowMarker } from './parts'
import { label, quiet } from './styles'

/**
 * Resizing a VM: if the new size is on the current hardware cluster, the VM
 * only restarts; if not, it must be deallocated first. In an availability set,
 * every VM in the set is deallocated.
 */
export const VmResizeFlow: FC = () => {
  const arrow = useSvgId('resize-arrow')
  const line = { stroke: 'var(--color-biru-dalam)', strokeWidth: 2, fill: 'none', markerEnd: `url(#${arrow})` }
  return (
    <svg
      viewBox="0 0 300 244"
      role="img"
      aria-label="Alur resize VM. Pertanyaan pertama: apakah ukuran baru tersedia di cluster hardware yang sekarang menjalankan VM? Kalau ya, pilih ukuran baru dan VM di-restart. Kalau tidak, deallocate VM dulu, lalu resize dan start lagi. Kalau VM ada di availability set, semua VM di set itu harus di-deallocate. Resize selalu mengganggu, karena VM yang berjalan di-restart."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={arrow} />
      </defs>
      <rect x={30} y={1} width={240} height={44} rx={10} fill="var(--color-matahari-muda)" stroke="var(--color-matahari-dalam)" strokeWidth={2} />
      <text x={150} y={20} fontSize={12} textAnchor="middle" {...label}>
        Ukuran baru ada di cluster
      </text>
      <text x={150} y={36} fontSize={12} textAnchor="middle" {...label}>
        hardware yang sekarang?
      </text>
      <path d="M90 46 L66 70" {...line} />
      <path d="M210 46 L234 70" {...line} />
      <text x={60} y={60} fontSize={12} textAnchor="end" {...quiet}>
        ya
      </text>
      <text x={240} y={60} fontSize={12} {...quiet}>
        tidak
      </text>
      <rect x={1} y={74} width={134} height={62} rx={10} fill="#fff" stroke="var(--color-mint-dalam)" strokeWidth={2} />
      <text x={68} y={98} fontSize={12} textAnchor="middle" {...label}>
        Resize langsung
      </text>
      <text x={68} y={116} fontSize={12} textAnchor="middle" {...quiet}>
        VM di-restart
      </text>
      <rect x={145} y={74} width={154} height={62} rx={10} fill="#fff" stroke="var(--color-koral)" strokeWidth={2} />
      <text x={222} y={98} fontSize={12} textAnchor="middle" {...label}>
        Deallocate dulu
      </text>
      <text x={222} y={116} fontSize={12} textAnchor="middle" {...quiet}>
        lalu resize dan start
      </text>
      <path d="M222 137 V156" {...line} />
      <rect x={145} y={160} width={154} height={46} rx={10} fill="var(--color-koral-muda)" stroke="var(--color-koral)" strokeWidth={2} />
      <text x={222} y={179} fontSize={12} textAnchor="middle" {...label}>
        Di availability set:
      </text>
      <text x={222} y={196} fontSize={12} textAnchor="middle" {...quiet}>
        deallocate semua VM
      </text>
      <text x={0} y={234} fontSize={12} {...label}>
        Selalu ada restart: jadwalkan resize.
      </text>
    </svg>
  )
}
