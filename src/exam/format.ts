import type { ExamMode, PathId } from '../lib/types'
import { EXAM_MODES } from './examLogic'

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getDate()} ${MONTH_SHORT[d.getMonth()]} ${d.getFullYear()}`
}

export function modeLabel(mode: ExamMode, domain?: PathId): string {
  return mode === 'domain' && domain ? `${EXAM_MODES.domain.title} · jalur ${domain}` : EXAM_MODES[mode].title
}
