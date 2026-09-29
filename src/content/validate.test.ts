import { describe, expect, it } from 'vitest'
import { UNITS } from './course'
import { unexpandedAbbreviations, validateUnits } from './validate'

describe('course content', () => {
  const issues = validateUnits(UNITS)

  it('has all 12 units in order', () => {
    expect(UNITS.map((u) => Number(u.id.slice(1, 3)))).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  })

  it('has no content errors', () => {
    const warnings = issues.filter((i) => i.level === 'warn')
    if (warnings.length) console.warn(warnings.map((w) => `warn  ${w.where}: ${w.message}`).join('\n'))
    expect(issues.filter((i) => i.level === 'error')).toEqual([])
  })

  it('has no abbreviation warnings in lessons that already have content', () => {
    expect(issues.filter((i) => i.message.startsWith('expand on first use'))).toEqual([])
  })
})

describe('unexpandedAbbreviations', () => {
  it('accepts both expansion styles', () => {
    expect(unexpandedAbbreviations(['Use an NSG (Network Security Group).'])).toEqual([])
    expect(unexpandedAbbreviations(['Use a Network Security Group (NSG).'])).toEqual([])
  })

  it('only checks the first use, and handles plurals', () => {
    expect(unexpandedAbbreviations(['Two VMs (Virtual Machines).', 'Then VM A and VM B.'])).toEqual([])
  })

  it('flags a bare abbreviation, including mixed case ones', () => {
    expect(unexpandedAbbreviations(['Deploy a VM to IaaS.'])).toEqual(['VM', 'IaaS'])
  })

  it('does not flag product names such as Entra ID', () => {
    expect(unexpandedAbbreviations(['Sign in with Microsoft Entra ID.'])).toEqual([])
  })
})
