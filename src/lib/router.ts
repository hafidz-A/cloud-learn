import { useSyncExternalStore } from 'react'

// Tiny hash router. Hash URLs keep working when the app is served from any
// static host (GitHub Pages, an installed PWA) without server rewrites.

export type Tab = 'home' | 'latihan' | 'ujian' | 'statistik' | 'glosarium' | 'pengaturan'

export type Route =
  | { name: 'tab'; tab: Tab }
  | { name: 'lesson'; lessonId: string }
  | { name: 'checkpoint'; checkpointId: string }
  | { name: 'practice' }
  | { name: 'exam' }
  | { name: 'exam-result'; attemptId: string }
  | { name: 'exam-review'; attemptId: string }

const TABS: readonly Tab[] = ['home', 'latihan', 'ujian', 'statistik', 'glosarium', 'pengaturan']

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  const arg = parts[1] ? decodeURIComponent(parts[1]) : ''
  switch (parts[0]) {
    case 'lesson':
      if (arg) return { name: 'lesson', lessonId: arg }
      break
    case 'checkpoint':
      if (arg) return { name: 'checkpoint', checkpointId: arg }
      break
    case 'practice':
      return { name: 'practice' }
    case 'exam':
      if (parts[1] === 'result' && parts[2]) return { name: 'exam-result', attemptId: decodeURIComponent(parts[2]) }
      if (parts[1] === 'review' && parts[2]) return { name: 'exam-review', attemptId: decodeURIComponent(parts[2]) }
      return { name: 'exam' }
  }
  const tab = TABS.find((t) => t === parts[0])
  return { name: 'tab', tab: tab ?? 'home' }
}

export function hrefFor(route: Route): string {
  switch (route.name) {
    case 'lesson':
      return `#/lesson/${encodeURIComponent(route.lessonId)}`
    case 'checkpoint':
      return `#/checkpoint/${encodeURIComponent(route.checkpointId)}`
    case 'practice':
      return '#/practice'
    case 'exam':
      return '#/exam'
    case 'exam-result':
      return `#/exam/result/${encodeURIComponent(route.attemptId)}`
    case 'exam-review':
      return `#/exam/review/${encodeURIComponent(route.attemptId)}`
    case 'tab':
      return route.tab === 'home' ? '#/' : `#/${route.tab}`
  }
}

// Set when a full-screen flow was opened from inside the app, so leaving it can
// pop the history entry instead of stacking a second tab entry.
let openedFlowInApp = false

export function navigate(route: Route, { replace = false } = {}): void {
  const href = hrefFor(route)
  if (route.name !== 'tab' && !replace) openedFlowInApp = true
  if (replace) window.location.replace(href)
  else window.location.hash = href
}

/** Back to where a full-screen flow (lesson, practice, checkpoint) was opened from. */
export function leaveFlow(fallback: Tab = 'home'): void {
  if (openedFlowInApp) {
    openedFlowInApp = false
    window.history.back()
  } else {
    navigate({ name: 'tab', tab: fallback }, { replace: true })
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash)
  return parseHash(hash)
}
