import type { CourseId, ExamMode, PathId } from '../lib/types'
import { EXAM_MODES } from './examLogic'

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getDate()} ${MONTH_SHORT[d.getMonth()]} ${d.getFullYear()}`
}

export function modeLabel(mode: ExamMode, domain?: PathId): string {
  return mode === 'domain' && domain ? `${EXAM_MODES.az900.domain.title} · jalur ${domain}` : EXAM_MODES.az900[mode].title
}

/** Official practice for the real exam, from the certification page on Microsoft Learn. */
export const CERTIFICATION_PAGES: Record<CourseId, string> = {
  az900: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/',
  az104: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/',
  ccna: 'https://www.cisco.com/site/us/en/learn/training-certifications/certifications/enterprise/ccna/exams-and-training.html',
}
