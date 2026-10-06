import type { FC } from 'react'
import { ArrowMarker } from './parts'
import { useSvgId } from './ids'
import { label, quiet } from './styles'

/** running-config lives in RAM and changes with every command; startup-config lives in NVRAM and is loaded at boot. */
export const RunVsStartup: FC = () => {
  const save = useSvgId('cfg-save')
  const boot = useSvgId('cfg-boot')
  return (
    <svg
      viewBox="0 0 300 190"
      role="img"
      aria-label="Running-config ada di RAM dan langsung berubah setiap perintah diketik. Startup-config ada di NVRAM. Perintah copy running-config startup-config atau write memory menyalin running-config ke startup-config. Saat perangkat menyala atau reload, startup-config dimuat menjadi running-config, jadi perubahan yang belum disimpan hilang."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={save} />
        <ArrowMarker id={boot} color="var(--color-mint-dalam)" />
      </defs>
      <rect x={6} y={30} width={118} height={74} rx={10} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={2} />
      <text x={65} y={20} fontSize={13} textAnchor="middle" {...label}>
        RAM
      </text>
      <text x={65} y={64} fontSize={13} textAnchor="middle" {...label}>
        running-config
      </text>
      <text x={65} y={84} fontSize={12} textAnchor="middle" {...quiet}>
        berubah langsung
      </text>
      <rect x={176} y={30} width={118} height={74} rx={10} fill="var(--color-mint-muda)" stroke="var(--color-mint-dalam)" strokeWidth={2} />
      <text x={235} y={20} fontSize={13} textAnchor="middle" {...label}>
        NVRAM
      </text>
      <text x={235} y={64} fontSize={13} textAnchor="middle" {...label}>
        startup-config
      </text>
      <text x={235} y={84} fontSize={12} textAnchor="middle" {...quiet}>
        bertahan saat mati
      </text>
      <path d="M126 50 H172" stroke="var(--color-biru-dalam)" strokeWidth={2.5} markerEnd={`url(#${save})`} />
      <path d="M174 88 H128" stroke="var(--color-mint-dalam)" strokeWidth={2.5} markerEnd={`url(#${boot})`} />
      <text x={150} y={126} fontSize={12} textAnchor="middle" {...label}>
        Simpan: copy running-config startup-config
      </text>
      <text x={150} y={144} fontSize={12} textAnchor="middle" {...label}>
        atau write memory
      </text>
      <text x={150} y={168} fontSize={12} textAnchor="middle" {...quiet}>
        Saat boot atau reload: startup-config dimuat
      </text>
      <text x={150} y={184} fontSize={12} textAnchor="middle" {...quiet}>
        Yang belum disimpan hilang
      </text>
    </svg>
  )
}
