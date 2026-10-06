import type { Lab } from '../lib/types'
import data from './ccna/labs.json'

// Packet Tracer labs of the CCNA hands-on lessons (LANGIT_CCNA_PLAN.md section 8).

export const LABS: Lab[] = (data as { labs: Lab[] }).labs

const BY_LESSON = new Map(LABS.map((lab) => [lab.lesson, lab]))

export function labFor(lessonId: string): Lab | undefined {
  return BY_LESSON.get(lessonId)
}

export const LAB_TOOLS: Record<Lab['tool'], string> = {
  'packet-tracer': 'Cisco Packet Tracer',
  'cml-free': 'Cisco Modeling Labs Free',
  linux: 'Linux',
  any: 'Packet Tracer atau perangkat asli',
}
