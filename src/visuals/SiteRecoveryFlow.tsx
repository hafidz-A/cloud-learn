import type { FC } from 'react'
import { useSvgId } from './ids'
import { ArrowMarker } from './parts'
import { label, quiet } from './styles'

const STEPS = [
  { title: '1. Test failover', note: 'VM uji di VNet non-produksi, lalu cleanup', fill: 'var(--color-matahari-muda)' },
  { title: '2. Failover', note: 'VM dibuat di region target', fill: 'var(--color-koral-muda)' },
  { title: '3. Commit', note: 'recovery point lain dihapus', fill: 'var(--color-biru-muda)' },
  { title: '4. Re-protect', note: 'replikasi balik: target ke primer', fill: 'var(--color-mint-muda)' },
  { title: '5. Failback', note: 'failover lagi ke region primer', fill: '#fff' },
]

/**
 * The Azure Site Recovery sequence for Azure VMs: drill first, then fail
 * over, commit, reprotect so the VM replicates back, and finally fail back.
 */
export const SiteRecoveryFlow: FC = () => {
  const arrow = useSvgId('asr-arrow')
  return (
    <svg
      viewBox="0 0 300 276"
      role="img"
      aria-label="Urutan Azure Site Recovery untuk VM Azure. Satu, test failover membuat VM uji di virtual network non-produksi tanpa mengganggu produksi, lalu dibersihkan dengan cleanup test failover. Dua, failover membuat VM di region target dari recovery point. Tiga, commit menyelesaikan failover dan menghapus recovery point lain, sehingga recovery point tidak bisa diganti lagi. Empat, re-protect membuat VM di region target mereplikasi balik ke region primer. Lima, failback adalah failover lagi ke region primer."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={arrow} />
      </defs>
      {STEPS.map((s, i) => {
        const y = 1 + i * 56
        return (
          <g key={s.title}>
            <rect x={1} y={y} width={298} height={44} rx={10} fill={s.fill} stroke="var(--color-biru-dalam)" strokeWidth={1.5} />
            <text x={12} y={y + 18} fontSize={12} {...label}>
              {s.title}
            </text>
            <text x={12} y={y + 35} fontSize={12} {...quiet}>
              {s.note}
            </text>
            {i < STEPS.length - 1 && <path d={`M150 ${y + 45} V${y + 54}`} stroke="var(--color-biru-dalam)" strokeWidth={2} markerEnd={`url(#${arrow})`} />}
          </g>
        )
      })}
    </svg>
  )
}
