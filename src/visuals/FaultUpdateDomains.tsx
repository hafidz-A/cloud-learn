import type { FC } from 'react'
import { label, quiet } from './styles'

// vm1..vm6 in an availability set with 3 fault domains and 5 update domains:
// fault domains repeat every 3 VMs, update domains every 5.
const VMS = [1, 2, 3, 4, 5, 6].map((n) => ({ name: `vm${n}`, fd: (n - 1) % 3, ud: (n - 1) % 5 }))

/**
 * An availability set: VMs spread over fault domains (racks that share power
 * and a network switch) and update domains (groups restarted one at a time
 * during planned maintenance).
 */
export const FaultUpdateDomains: FC = () => (
  <svg
    viewBox="0 0 300 256"
    role="img"
    aria-label="Availability set dengan 3 fault domain dan 5 update domain, berisi vm1 sampai vm6. Setiap fault domain adalah rak dengan sumber listrik dan switch jaringan sendiri: FD0 berisi vm1 dan vm4, FD1 berisi vm2 dan vm5, FD2 berisi vm3 dan vm6. Update domain di-restart satu per satu saat maintenance terencana: vm1 di UD0, vm2 di UD1, vm3 di UD2, vm4 di UD3, vm5 di UD4, dan vm6 kembali ke UD0 bersama vm1. Maksimal 3 fault domain dan 20 update domain, dan tidak bisa diubah setelah availability set dibuat."
    className="w-full font-display"
  >
    {[0, 1, 2].map((fd) => (
      <g key={fd}>
        <rect x={1 + fd * 100} y={1} width={98} height={150} rx={10} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={2} />
        <text x={50 + fd * 100} y={21} fontSize={12} textAnchor="middle" {...label}>
          FD{fd}
        </text>
        <text x={50 + fd * 100} y={37} fontSize={12} textAnchor="middle" {...quiet}>
          listrik + switch
        </text>
        {VMS.filter((v) => v.fd === fd).map((v, i) => (
          <g key={v.name}>
            <rect x={10 + fd * 100} y={48 + i * 48} width={80} height={40} rx={8} fill={v.ud === 0 ? 'var(--color-matahari-muda)' : '#fff'} stroke="var(--color-biru)" strokeWidth={1.5} />
            <text x={50 + fd * 100} y={64 + i * 48} fontSize={12} textAnchor="middle" {...label}>
              {v.name}
            </text>
            <text x={50 + fd * 100} y={80 + i * 48} fontSize={12} textAnchor="middle" {...quiet}>
              UD{v.ud}
            </text>
          </g>
        ))}
      </g>
    ))}
    <text x={0} y={174} fontSize={12} {...label}>
      FD (fault domain): maks. 3
    </text>
    <text x={0} y={192} fontSize={12} {...label}>
      UD (update domain): maks. 20
    </text>
    <text x={0} y={212} fontSize={12} {...quiet}>
      UD di-restart bergantian saat maintenance.
    </text>
    <text x={0} y={230} fontSize={12} {...quiet}>
      vm6 masuk UD0 lagi, bersama vm1.
    </text>
    <text x={0} y={248} fontSize={12} {...quiet}>
      Jumlah FD dan UD tetap setelah dibuat.
    </text>
  </svg>
)
