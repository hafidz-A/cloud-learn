import { useSyncExternalStore } from 'react'

// Tiny hash router. Hash URLs keep working when the app is served from any
// static host (and later as an installed PWA) without server rewrites.

export type Tab = 'home' | 'latihan' | 'statistik' | 'glosarium' | 'pengaturan'

export type Route = { name: 'tab'; tab: Tab } | { name: 'lesson'; lessonId: string }

const TABS: readonly Tab[] = ['home', 'latihan', 'statistik', 'glosarium', 'pengaturan']

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  if (parts[0] === 'lesson' && parts[1]) {
    return { name: 'lesson', lessonId: decodeURIComponent(parts[1]) }
  }
  const tab = TABS.find((t) => t === parts[0])
  return { name: 'tab', tab: tab ?? 'home' }
}

export function hrefFor(route: Route): string {
  if (route.name === 'lesson') return `#/lesson/${encodeURIComponent(route.lessonId)}`
  return route.tab === 'home' ? '#/' : `#/${route.tab}`
}

// Set when a lesson was opened from inside the app, so leaving it can pop the
// history entry instead of stacking a second home entry.
let openedLessonInApp = false

export function navigate(route: Route, { replace = false } = {}): void {
  const href = hrefFor(route)
  if (route.name === 'lesson' && !replace) openedLessonInApp = true
  if (replace) window.location.replace(href)
  else window.location.hash = href
}

/** Back to home after a lesson (finished or abandoned). */
export function leaveLesson(): void {
  if (openedLessonInApp) {
    openedLessonInApp = false
    window.history.back()
  } else {
    navigate({ name: 'tab', tab: 'home' }, { replace: true })
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
