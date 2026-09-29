import { HeartCrack } from 'lucide-react'
import { Button } from '../components/Button'
import { Mascot } from '../components/Mascot'
import { leaveFlow, navigate } from '../lib/router'
import { LessonFooter } from './LessonFooter'

/** Shown when a lesson runs out of hearts (plan section 4). */
export function OutOfHearts() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 pb-44 text-center">
      <Mascot mood="sedih" size={140} />
      <h1 className="mt-5 flex items-center gap-2 font-display text-28 font-bold">
        <HeartCrack size={30} className="text-koral-dalam" aria-hidden="true" />
        Hearts habis
      </h1>
      <p className="mt-2 text-17 text-tinta-lembut">
        Lesson ini berhenti dulu. Latihan ulang soal yang pernah salah untuk mengisi hearts, atau tunggu besok saat hearts
        terisi penuh lagi.
      </p>
      <LessonFooter>
        <Button block onClick={() => navigate({ name: 'practice' }, { replace: true })}>
          Latihan untuk isi hearts
        </Button>
        <Button variant="putih" block className="mt-3" onClick={() => leaveFlow('home')}>
          Kembali ke home
        </Button>
      </LessonFooter>
    </main>
  )
}
