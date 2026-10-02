import data from './az104/practice.json'

// Practice in a real Azure subscription (LANGIT_AZ104_PLAN.md section 8): one tip
// per AZ-104 lesson and one longer mission per unit. `careful` ("hati-hati")
// marks what can cost real money, from the list in the plan.

export type PracticeTip = { text: string; careful?: boolean }

export type UnitMission = {
  title: string
  minutes: number
  goal: string
  steps: string[]
  /** How the player proves the mission worked. */
  check: string
  /** What to delete afterwards. */
  cleanup: string
  careful?: boolean
}

export type UnitPractice = { mission: UnitMission; tips: Record<string, PracticeTip> }

export const PRACTICE: Record<string, UnitPractice> = (data as { units: Record<string, UnitPractice> }).units

export function missionFor(unitId: string): UnitMission | undefined {
  return PRACTICE[unitId]?.mission
}

export function tipFor(lessonId: string): PracticeTip | undefined {
  for (const unit of Object.values(PRACTICE)) if (unit.tips[lessonId]) return unit.tips[lessonId]
  return undefined
}
