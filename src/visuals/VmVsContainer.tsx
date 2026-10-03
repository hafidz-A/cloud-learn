import type { FC } from 'react'
import { label, quiet } from './styles'

/** VMs each carry a guest OS on a hypervisor; containers share the host OS kernel through a container runtime. */
export const VmVsContainer: FC = () => {
  const box = (x: number, y: number, w: number, text: string, fill: string) => (
    <g key={`${x}-${y}-${text}`}>
      <rect x={x} y={y} width={w} height={26} rx={5} fill={fill} />
      <text x={x + w / 2} y={y + 17} fontSize={12} textAnchor="middle" {...label}>
        {text}
      </text>
    </g>
  )
  return (
    <svg
      viewBox="0 0 300 200"
      role="img"
      aria-label="VM dibandingkan container. Di kiri, dua VM masing-masing berisi aplikasi dan guest OS sendiri, berjalan di atas hypervisor dan hardware. Di kanan, tiga container berisi aplikasi dan dependensinya, berbagi satu kernel OS host melalui container runtime. Container lebih ringan dan lebih cepat menyala karena tidak membawa OS sendiri."
      className="w-full font-display"
    >
      <text x={70} y={14} fontSize={13} textAnchor="middle" {...label}>
        VM
      </text>
      {box(4, 22, 64, 'App', 'var(--color-mint-muda)')}
      {box(72, 22, 64, 'App', 'var(--color-mint-muda)')}
      {box(4, 52, 64, 'Guest OS', 'var(--color-matahari-muda)')}
      {box(72, 52, 64, 'Guest OS', 'var(--color-matahari-muda)')}
      {box(4, 82, 132, 'Hypervisor', 'var(--color-biru-muda)')}
      {box(4, 112, 132, 'Hardware', 'var(--color-kabut)')}
      <text x={230} y={14} fontSize={13} textAnchor="middle" {...label}>
        Container
      </text>
      {box(162, 22, 42, 'App', 'var(--color-mint-muda)')}
      {box(208, 22, 42, 'App', 'var(--color-mint-muda)')}
      {box(254, 22, 42, 'App', 'var(--color-mint-muda)')}
      {box(162, 52, 134, 'Container runtime', 'var(--color-koral-muda)')}
      {box(162, 82, 134, 'Host OS (kernel)', 'var(--color-matahari-muda)')}
      {box(162, 112, 134, 'Hardware', 'var(--color-kabut)')}
      <text x={4} y={168} fontSize={12} {...quiet}>
        VM: OS sendiri per VM
      </text>
      <text x={4} y={188} fontSize={12} {...quiet}>
        Container: berbagi kernel, ringan, cepat
      </text>
    </svg>
  )
}
