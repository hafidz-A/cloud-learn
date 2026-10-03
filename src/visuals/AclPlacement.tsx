import type { FC } from 'react'
import { label, quiet } from './styles'

/** Extended ACLs go near the source; standard ACLs near the destination. */
export const AclPlacement: FC = () => (
  <svg
    viewBox="0 0 300 150"
    role="img"
    aria-label="Penempatan ACL. Jalur dari LAN sumber lewat R1, R2, sampai server tujuan. ACL extended dipasang dekat sumber, di R1, karena bisa memilih tujuan dan port, sehingga lalu lintas yang ditolak tidak memakan bandwidth sepanjang jalan. ACL standard dipasang dekat tujuan, di R2, karena hanya melihat alamat sumber; kalau dipasang dekat sumber, ia akan memblokir sumber itu ke semua tujuan."
    className="w-full font-display"
  >
    <rect x={4} y={40} width={60} height={34} rx={6} fill="var(--color-mint-muda)" />
    <text x={34} y={61} fontSize={12} textAnchor="middle" {...label}>
      Sumber
    </text>
    <rect x={90} y={42} width={40} height={30} rx={6} fill="var(--color-matahari-muda)" />
    <text x={110} y={61} fontSize={12} textAnchor="middle" {...label}>
      R1
    </text>
    <rect x={170} y={42} width={40} height={30} rx={6} fill="var(--color-matahari-muda)" />
    <text x={190} y={61} fontSize={12} textAnchor="middle" {...label}>
      R2
    </text>
    <rect x={236} y={40} width={60} height={34} rx={6} fill="var(--color-biru-muda)" />
    <text x={266} y={61} fontSize={12} textAnchor="middle" {...label}>
      Tujuan
    </text>
    <path d="M64 57 H90 M130 57 H170 M210 57 H236" stroke="var(--color-tinta-lembut)" strokeWidth={1.5} />
    <text x={110} y={22} fontSize={12} textAnchor="middle" {...label}>
      Extended
    </text>
    <path d="M110 28 V40" stroke="var(--color-koral-dalam)" strokeWidth={2} />
    <text x={190} y={22} fontSize={12} textAnchor="middle" {...label}>
      Standard
    </text>
    <path d="M190 28 V40" stroke="var(--color-koral-dalam)" strokeWidth={2} />
    <text x={4} y={104} fontSize={12} {...quiet}>
      Extended dekat sumber: tolak lebih awal.
    </text>
    <text x={4} y={124} fontSize={12} {...quiet}>
      Standard dekat tujuan: hanya lihat sumber,
    </text>
    <text x={4} y={140} fontSize={12} {...quiet}>
      jadi jangan blokir semua tujuan lain.
    </text>
  </svg>
)
