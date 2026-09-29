import type { FC } from 'react'
import { useSvgId } from './ids'
import { ArrowMarker, Mark, Person } from './parts'
import { label, quiet } from './styles'

/** Step 1 proves who you are; step 2 decides what you may do. */
export const AuthNvsAuthZ: FC = () => {
  const authzArrow = useSvgId('authz-arrow')
  return (
    <svg
      viewBox="0 0 300 170"
      role="img"
      aria-label="Diagram dua langkah: autentikasi membuktikan siapa kamu dengan password dan MFA, lalu otorisasi menentukan apa yang boleh kamu lakukan, misalnya boleh membaca tapi tidak boleh menghapus."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={authzArrow} />
      </defs>
      <rect x={0} y={0} width={130} height={170} rx={12} fill="var(--color-biru-muda)" stroke="var(--color-biru)" strokeWidth={2} />
      <text x={12} y={22} fontSize={13} {...label}>
        1 · Autentikasi
      </text>
      <text x={12} y={40} fontSize={12} {...quiet}>
        Siapa kamu?
      </text>
      <Person x={12} y={56} />
      <rect x={34} y={54} width={84} height={22} rx={5} fill="#fff" stroke="var(--color-kabut-dalam)" strokeWidth={1.5} />
      <text x={76} y={70} fontSize={12} textAnchor="middle" {...label}>
        password
      </text>
      <rect x={34} y={84} width={84} height={22} rx={5} fill="#fff" stroke="var(--color-kabut-dalam)" strokeWidth={1.5} />
      <text x={76} y={100} fontSize={12} textAnchor="middle" {...label}>
        + kode MFA
      </text>
      <text x={65} y={140} fontSize={12} textAnchor="middle" {...label}>
        Contoh: login
      </text>
      <text x={65} y={156} fontSize={12} textAnchor="middle" {...quiet}>
        dengan MFA
      </text>

      <path d="M136 85 H160" stroke="var(--color-biru-dalam)" strokeWidth={2.5} markerEnd={`url(#${authzArrow})`} />

      <rect x={168} y={0} width={132} height={170} rx={12} fill="var(--color-mint-muda)" stroke="var(--color-mint-dalam)" strokeWidth={2} />
      <text x={180} y={22} fontSize={13} {...label}>
        2 · Otorisasi
      </text>
      <text x={180} y={40} fontSize={12} {...quiet}>
        Boleh apa?
      </text>
      <Mark cx={190} cy={65} ok />
      <text x={204} y={69} fontSize={12} {...label}>
        baca resource
      </text>
      <Mark cx={190} cy={95} ok={false} />
      <text x={204} y={99} fontSize={12} {...label}>
        hapus resource
      </text>
      <text x={234} y={140} fontSize={12} textAnchor="middle" {...label}>
        Contoh: role
      </text>
      <text x={234} y={156} fontSize={12} textAnchor="middle" {...quiet}>
        Reader di RBAC
      </text>
    </svg>
  )
}
