import type { FC } from 'react'
import { label, quiet } from './styles'

/** One router, two VRFs: each has its own routing table, so the same subnet can exist in both. */
export const VrfTables: FC = () => (
  <svg
    viewBox="0 0 300 200"
    role="img"
    aria-label="Satu router dengan dua VRF, Merah dan Biru. Interface G0/0/0 masuk VRF Merah dan G0/0/1 masuk VRF Biru. Setiap VRF punya tabel routing sendiri, jadi subnet 10.1.1.0/24 boleh ada di keduanya tanpa bentrok. Satu interface hanya boleh masuk satu VRF."
    className="w-full font-display"
  >
    <rect x={4} y={4} width={292} height={150} rx={10} fill="var(--color-kabut)" />
    <text x={12} y={22} fontSize={12} {...quiet}>
      R1, satu router fisik
    </text>
    <rect x={14} y={32} width={130} height={110} rx={8} fill="var(--color-koral-muda)" />
    <rect x={156} y={32} width={130} height={110} rx={8} fill="var(--color-biru-muda)" />
    <text x={79} y={52} fontSize={13} textAnchor="middle" {...label}>
      VRF Merah
    </text>
    <text x={221} y={52} fontSize={13} textAnchor="middle" {...label}>
      VRF Biru
    </text>
    <text x={79} y={76} fontSize={12} textAnchor="middle" {...quiet}>
      Tabel routing sendiri
    </text>
    <text x={221} y={76} fontSize={12} textAnchor="middle" {...quiet}>
      Tabel routing sendiri
    </text>
    <text x={79} y={100} fontSize={12} textAnchor="middle" {...label}>
      10.1.1.0/24
    </text>
    <text x={221} y={100} fontSize={12} textAnchor="middle" {...label}>
      10.1.1.0/24
    </text>
    <text x={79} y={126} fontSize={12} textAnchor="middle" {...quiet}>
      G0/0/0
    </text>
    <text x={221} y={126} fontSize={12} textAnchor="middle" {...quiet}>
      G0/0/1
    </text>
    <text x={4} y={176} fontSize={12} {...label}>
      Subnet sama, tidak bentrok
    </text>
    <text x={4} y={194} fontSize={12} {...quiet}>
      Satu interface hanya di satu VRF
    </text>
  </svg>
)
