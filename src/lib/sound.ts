import { useProgress } from '../store/progress'

// Small sounds made with the Web Audio API, so no audio files are needed.
// They respect the "Suara" setting.

type Note = { freq: number; at: number; dur: number; type?: OscillatorType; gain?: number }

let ctx: AudioContext | null = null

function play(notes: Note[]) {
  if (!useProgress.getState().soundEnabled || typeof window === 'undefined' || !('AudioContext' in window)) return
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    const now = ctx.currentTime
    for (const n of notes) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = n.type ?? 'sine'
      osc.frequency.value = n.freq
      const peak = n.gain ?? 0.12
      gain.gain.setValueAtTime(0.0001, now + n.at)
      gain.gain.exponentialRampToValueAtTime(peak, now + n.at + 0.015)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + n.at + n.dur)
      osc.connect(gain).connect(ctx.destination)
      osc.start(now + n.at)
      osc.stop(now + n.at + n.dur + 0.02)
    }
  } catch {
    // Audio is a nice-to-have; never let it break the lesson.
  }
}

export const sound = {
  correct: () => play([{ freq: 660, at: 0, dur: 0.12 }, { freq: 990, at: 0.09, dur: 0.18 }]),
  wrong: () => play([{ freq: 220, at: 0, dur: 0.22, type: 'triangle', gain: 0.14 }, { freq: 180, at: 0.12, dur: 0.25, type: 'triangle', gain: 0.12 }]),
  complete: () =>
    play([523, 659, 784, 1047].map((freq, i) => ({ freq, at: i * 0.11, dur: 0.22, type: 'triangle' as const, gain: 0.1 }))),
  heart: () => play([{ freq: 330, at: 0, dur: 0.12, type: 'square', gain: 0.05 }, { freq: 247, at: 0.1, dur: 0.18, type: 'square', gain: 0.05 }]),
}
