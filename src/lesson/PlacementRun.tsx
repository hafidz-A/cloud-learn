import { useState } from 'react'
import { EXERCISES } from '../content/course'
import { formatDuration } from '../lib/date'
import { leaveFlow } from '../lib/router'
import type { PlacementResult } from '../lib/types'
import { placementPassed } from './placement'
import { useFollowCourse } from '../store/course'
import { useProgress } from '../store/progress'
import { Player } from './Player'
import { placementPlan } from './plans'

/** The optional AZ-104 placement test (LANGIT_AZ104_PLAN.md section 3): 30 questions, 2 per unit. */
export function PlacementRun() {
  useFollowCourse('az104-placement')
  const finishPlacement = useProgress((s) => s.finishPlacement)
  const [plan] = useState(() => placementPlan())

  return (
    <Player
      plan={plan}
      onFinish={(results, durationMs) => {
        const units: PlacementResult['units'] = {}
        plan.items.forEach(({ item }, i) => {
          const unit = EXERCISES.get(item.id)?.unit.id
          if (!unit) return
          const score = (units[unit] ??= { right: 0, total: 0 })
          score.total += 1
          if (results[i]) score.right += 1
        })
        finishPlacement(units)
        const right = results.filter(Boolean).length
        const passed = placementPassed(units).length
        return {
          heading: 'Placement test selesai',
          subtitle: 'AZ-104',
          mood: passed > 0 ? 'gembira' : 'netral',
          celebrate: false,
          xp: 0,
          stats: [
            { kind: 'score', label: 'Benar', value: `${right}/${results.length}` },
            { kind: 'time', label: 'Waktu', value: formatDuration(durationMs) },
          ],
          note:
            passed > 0
              ? `${passed} unit dengan skor minimal 80%. Pilih di home unit mana yang mau ditandai selesai.`
              : 'Belum ada unit dengan skor minimal 80%, jadi mulai dari Unit 1. Hasil ini tidak masuk statistik.',
          primary: { label: passed > 0 ? 'Pilih unit' : 'Mulai belajar', onClick: () => leaveFlow() },
        }
      }}
    />
  )
}
