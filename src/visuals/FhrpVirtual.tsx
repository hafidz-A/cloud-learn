import type { FC } from 'react'
import { DeviceIcon } from './NetDiagram'
import { label, quiet } from './styles'

/** Two routers share one virtual gateway address; hosts never change their gateway. */
export const FhrpVirtual: FC = () => (
  <svg
    viewBox="0 0 300 200"
    role="img"
    aria-label="R1 dengan alamat 192.168.1.2 dan R2 dengan alamat 192.168.1.3 berbagi satu alamat virtual 192.168.1.1 dan satu MAC virtual. R1 active, meneruskan trafik. R2 standby, siap mengambil alih. PC memakai 192.168.1.1 sebagai default gateway, jadi saat R1 mati dan R2 mengambil alih, setelan PC tidak perlu diubah."
    className="w-full font-display"
  >
    <DeviceIcon kind="router" x={80} y={36} />
    <DeviceIcon kind="router" x={220} y={36} />
    <text x={80} y={14} fontSize={12} textAnchor="middle" {...label}>
      R1 .2 (active)
    </text>
    <text x={220} y={14} fontSize={12} textAnchor="middle" {...label}>
      R2 .3 (standby)
    </text>
    <rect x={70} y={64} width={160} height={30} rx={15} fill="var(--color-mint-muda)" stroke="var(--color-mint-dalam)" strokeDasharray="5 3" />
    <text x={150} y={84} fontSize={12} textAnchor="middle" {...label}>
      Virtual 192.168.1.1
    </text>
    <line x1={80} y1={50} x2={110} y2={64} stroke="var(--color-mint-dalam)" strokeWidth={2.5} />
    <line x1={220} y1={50} x2={190} y2={64} stroke="var(--color-tinta-lembut)" strokeWidth={1.5} strokeDasharray="4 3" />
    <line x1={150} y1={94} x2={150} y2={120} stroke="var(--color-tinta-lembut)" strokeWidth={1.5} />
    <DeviceIcon kind="pc" x={150} y={134} />
    <text x={150} y={166} fontSize={12} textAnchor="middle" {...label}>
      PC, gateway 192.168.1.1
    </text>
    <text x={4} y={192} fontSize={12} {...quiet}>
      R1 mati: R2 ambil alih IP dan MAC virtual
    </text>
  </svg>
)
