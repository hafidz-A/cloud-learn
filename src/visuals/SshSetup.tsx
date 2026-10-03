import type { FC } from 'react'
import { label, quiet } from './styles'

const STEPS = [
  'hostname R1',
  'ip domain name kantor.local',
  'crypto key generate rsa modulus 2048',
  'ip ssh version 2',
  'username admin secret <password>',
  'line vty 0 4: login local',
  'line vty 0 4: transport input ssh',
]

/** The steps to enable SSH on IOS. */
export const SshSetup: FC = () => (
  <svg
    viewBox="0 0 300 220"
    role="img"
    aria-label="Langkah menyalakan SSH di IOS. Satu, ganti hostname dari bawaannya. Dua, isi ip domain name. Tiga, buat kunci RSA dengan crypto key generate rsa modulus 2048. Empat, ip ssh version 2. Lima, buat user lokal dengan username dan secret. Enam, di line vty pasang login local. Tujuh, transport input ssh supaya Telnet ditolak."
    className="w-full font-display"
  >
    {STEPS.map((s, i) => (
      <g key={s}>
        <rect x={4} y={4 + i * 30} width={292} height={26} rx={5} fill={i < 3 ? 'var(--color-biru-muda)' : i < 5 ? 'var(--color-mint-muda)' : 'var(--color-matahari-muda)'} />
        <text x={12} y={21 + i * 30} fontSize={12} {...quiet}>
          {i + 1}
        </text>
        <text x={30} y={21 + i * 30} fontSize={12} fontFamily="monospace" {...label}>
          {s}
        </text>
      </g>
    ))}
    <text x={4} y={218} fontSize={12} {...quiet}>
      RSA butuh hostname dan domain dulu
    </text>
  </svg>
)
