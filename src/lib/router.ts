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
  | { name: 'guide'; unitId: string }
  | { name: 'placement' }
  | { name: 'skip'; lessonId: string }
  | { name: 'lab'; lessonId: string }
  | { name: 'outline' }

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
    case 'placement':
      return { name: 'placement' }
    case 'kisi':
      return { name: 'outline' }
    case 'guide':
      if (arg) return { name: 'guide', unitId: arg }
      break
    case 'skip':
      if (arg) return { name: 'skip', lessonId: arg }
      break
    case 'lab':
      if (arg) return { name: 'lab', lessonId: arg }
      break
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
    case 'placement':
      return '#/placement'
    case 'outline':
      return '#/kisi'
    case 'exam':
      return '#/exam'
    case 'exam-result':
      return `#/exam/result/${encodeURIComponent(route.attemptId)}`
    case 'exam-review':
      return `#/exam/review/${encodeURIComponent(route.attemptId)}`
    case 'guide':
      return `#/guide/${encodeURIComponent(route.unitId)}`
    case 'skip':
      return `#/skip/${encodeURIComponent(route.lessonId)}`
    case 'lab':
      return `#/lab/${encodeURIComponent(route.lessonId)}`
    case 'tab':
      return route.tab === 'home' ? '#/' : `#/${route.tab}`
  }
}

// Set when a full-screen flow was opened from inside the app, so leaving it can
// pop the history entry instead of stacking a second tab entry.
let openedFlowInApp = false

// A screen with unsaved work can hold the browser back button (the Android back
// gesture): the hash change is undone and the screen is told instead, so it can
// ask first. Leaving through navigate() or leaveFlow() is never held.
let backBlocker: { href: string; onBlocked: () => void } | null = null

/** Holds the back button on the current screen until the returned function is called. */
export function blockBack(onBlocked: () => void): () => void {
  const entry = { href: window.location.hash, onBlocked }
  backBlocker = entry
  return () => {
    if (backBlocker === entry) backBlocker = null
  }
}

if (typeof window !== 'undefined') {
  // Registered before React subscribes, so a held change never reaches the router.
  window.addEventListener('hashchange', (e) => {
    if (!backBlocker || window.location.hash === backBlocker.href) return
    e.stopImmediatePropagation()
    // Going back popped the screen's entry; pushing it again restores the same history.
    window.history.pushState(null, '', backBlocker.href)
    backBlocker.onBlocked()
  })
}

export function navigate(route: Route, { replace = false } = {}): void {
  backBlocker = null
  const href = hrefFor(route)
  if (route.name !== 'tab' && !replace) openedFlowInApp = true
  if (replace) window.location.replace(href)
  else window.location.hash = href
}

/** Back to where a full-screen flow (lesson, practice, checkpoint) was opened from. */
export function leaveFlow(fallback: Tab = 'home'): void {
  backBlocker = null
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
