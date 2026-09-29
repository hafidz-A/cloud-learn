import { useState } from 'react'
import { findCheckpoint, type Checkpoint } from '../content/course'
import { formatDuration } from '../lib/date'
import { leaveFlow, navigate } from '../lib/router'
import { XP_CHECKPOINT, CHECKPOINT_PASS } from '../lib/scoring'
import { useProgress } from '../store/progress'
import { Unavailable } from './LessonScreen'
import { Player } from './Player'
import { checkpointPlan } from './plans'

function CheckpointRun({ cp }: { cp: Checkpoint }) {
  const completeCheckpoint = useProgress((s) => s.completeCheckpoint)
  const [plan] = useState(() => checkpointPlan(cp))

  return (
    <Player
      plan={plan}
      onFinish={(results, durationMs) => {
        const right = results.filter(Boolean).length
        const score = results.length ? right / results.length : 0
        const passed = score >= CHECKPOINT_PASS
        const xp = passed ? XP_CHECKPOINT : 0
        completeCheckpoint(cp.id, score, passed, xp)
        return {
          heading: passed ? 'Checkpoint lulus!' : 'Belum lulus',
          subtitle: cp.title,
          mood: passed ? 'gembira' : 'sedih',
          celebrate: passed,
          xp,
          stats: [
            { kind: 'xp', label: 'XP', value: `+${xp}` },
            { kind: 'score', label: 'Skor', value: `${Math.round(score * 100)}%` },
            { kind: 'time', label: 'Waktu', value: formatDuration(durationMs) },
          ],
          note: passed
            ? `${right} dari ${results.length} benar. Jalur berikutnya sudah terbuka.`
            : `${right} dari ${results.length} benar. Butuh minimal ${Math.round(CHECKPOINT_PASS * 100)}%. Soal yang salah sudah masuk antrean latihan.`,
          primary: { label: 'Lanjut', onClick: () => leaveFlow() },
          secondary: passed ? undefined : { label: 'Latihan dulu', onClick: () => navigate({ name: 'practice' }, { replace: true }) },
        }
      }}
    />
  )
}

export function CheckpointScreen({ checkpointId }: { checkpointId: string }) {
  const cp = findCheckpoint(checkpointId)
  if (!cp) return <Unavailable title="Checkpoint tidak ditemukan" body="Kembali ke home dan pilih checkpoint dari peta." />
  return <CheckpointRun cp={cp} />
}
