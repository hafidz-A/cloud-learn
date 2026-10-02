import { describe, expect, it } from 'vitest'
import { AZ104_UNITS } from './course'
import { GLOSSARY } from './glossary'
import { PRACTICE, missionFor, tipFor } from './practice'
import { abbreviationsIn, unexpandedAbbreviations } from './validate'

// Practice tips and unit missions (LANGIT_AZ104_PLAN.md section 8).

const missionTexts = (unitId: string) => {
  const m = missionFor(unitId)!
  return [m.goal, ...m.steps, m.check, m.cleanup]
}

describe('AZ-104 practice', () => {
  it('has one tip for every lesson and one mission for every unit', () => {
    for (const unit of AZ104_UNITS) {
      const mission = missionFor(unit.id)
      expect(mission, unit.id).toBeDefined()
      expect(mission!.steps.length, unit.id).toBeGreaterThanOrEqual(4)
      expect(mission!.minutes).toBeGreaterThanOrEqual(20)
      expect(mission!.minutes).toBeLessThanOrEqual(40)
      for (const lesson of unit.lessons) expect(tipFor(lesson.id)?.text, lesson.id).toBeTruthy()
    }
    const lessons = new Set(AZ104_UNITS.flatMap((u) => u.lessons.map((l) => l.id)))
    expect(Object.values(PRACTICE).flatMap((u) => Object.keys(u.tips)).filter((id) => !lessons.has(id))).toEqual([])
  })

  it('marks the costly items of the plan as "hati-hati"', () => {
    const costly = /Standard Load Balancer|Site Recovery|Entra ID P1|VPN gateway|tier Basic|tier Standard|plan Basic|plan Standard|SKU Basic/i
    for (const unit of AZ104_UNITS) {
      if (missionTexts(unit.id).some((t) => costly.test(t) && !/tidak tersedia|SKU lain/.test(t))) expect(missionFor(unit.id)!.careful, unit.id).toBe(true)
      for (const lesson of unit.lessons) if (costly.test(tipFor(lesson.id)!.text)) expect(tipFor(lesson.id)!.careful, lesson.id).toBe(true)
    }
  })

  it('expands abbreviations on first use, and explains them in the glossary', () => {
    const terms = new Set(GLOSSARY.map((g) => g.term))
    for (const unit of AZ104_UNITS) {
      expect(unexpandedAbbreviations(missionTexts(unit.id)), unit.id).toEqual([])
      for (const lesson of unit.lessons) expect(unexpandedAbbreviations([tipFor(lesson.id)!.text]), lesson.id).toEqual([])
    }
    const all = AZ104_UNITS.flatMap((u) => [...missionTexts(u.id), u.lessons.map((l) => tipFor(l.id)!.text)].flat())
    expect([...abbreviationsIn(all)].filter((a) => !terms.has(a))).toEqual([])
  })
})
