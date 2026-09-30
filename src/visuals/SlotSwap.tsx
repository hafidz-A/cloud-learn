import type { FC } from 'react'
import { label, quiet } from './styles'

function Slot({ x, y, name, code, db }: { x: number; y: number; name: string; code: string; db: string }) {
  return (
    <g>
      <rect x={x} y={y} width={144} height={62} rx={10} fill="#fff" stroke="var(--color-biru-dalam)" strokeWidth={2} />
      <text x={x + 10} y={y + 19} fontSize={12} {...label}>
        {name}
      </text>
      <text x={x + 10} y={y + 37} fontSize={12} {...quiet}>
        kode {code}
      </text>
      <text x={x + 10} y={y + 54} fontSize={12} {...quiet}>
        database: {db}
      </text>
    </g>
  )
}

/**
 * A slot swap: the code moves between staging and production, while a
 * connection string marked as a deployment slot setting stays with its slot.
 */
export const SlotSwap: FC = () => (
  <svg
    viewBox="0 0 300 236"
    role="img"
    aria-label="Swap deployment slot. Sebelum swap, production menjalankan kode v1 dengan database prod-db, dan staging menjalankan kode v2 dengan database staging-db. Connection string kedua slot ditandai sebagai deployment slot setting. Sesudah swap, production menjalankan kode v2 tapi tetap memakai prod-db, dan staging menjalankan v1 dengan staging-db. Kalau connection string tidak ditandai slot setting, nilainya ikut pindah, sehingga production memakai staging-db."
    className="w-full font-display"
  >
    <text x={0} y={14} fontSize={12} {...label}>
      Sebelum swap
    </text>
    <Slot x={1} y={22} name="production" code="v1" db="prod-db" />
    <Slot x={155} y={22} name="staging" code="v2" db="staging-db" />
    <text x={0} y={108} fontSize={12} {...label}>
      Sesudah swap
    </text>
    <Slot x={1} y={116} name="production" code="v2" db="prod-db" />
    <Slot x={155} y={116} name="staging" code="v1" db="staging-db" />
    <text x={0} y={200} fontSize={12} {...quiet}>
      Connection string ditandai slot setting: tetap.
    </text>
    <text x={0} y={218} fontSize={12} {...label}>
      Tanpa tanda itu, production pakai staging-db.
    </text>
  </svg>
)
