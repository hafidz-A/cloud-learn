import { describe, expect, it } from 'vitest'
import { VISUALS } from '../visuals/registry'
import { AZ104_UNITS, CCNA_UNITS, UNITS } from './course'
import { answerBalance, courseCoverage, type UnitCoverage } from './coverage'
import { isVisualName } from './visuals'

// `npm run content:coverage` prints the material-coverage report
// (LANGIT_AZ900_PERBAIKAN_MATERI.md section 4). Under `npm test` it only checks
// that the report can be built.

const LIST_LIMIT = 12

function list(title: string, items: string[]): string[] {
  if (items.length === 0) return []
  const shown = items.slice(0, LIST_LIMIT).map((x) => `      - ${x}`)
  const more = items.length > LIST_LIMIT ? [`      - ... dan ${items.length - LIST_LIMIT} lagi`] : []
  return [`    ${title} (${items.length}):`, ...shown, ...more]
}

function unitReport(cov: UnitCoverage): string[] {
  const problems = cov.withoutRequires.length + cov.gaps.length + cov.untaughtFacts.length + cov.badSources.length
  const status = !cov.reworked ? 'BELUM DIPERBAIKI' : problems ? 'MERAH' : 'HIJAU'
  return [
    `[${status}] ${cov.unitId} · ${cov.title}`,
    `    fakta ${cov.facts} · kartu learn ${cov.learnCards} · kartu intro lama ${cov.introCards} · soal ${cov.exercises} · retired ${cov.retired.length}`,
    ...list('soal tanpa requires', cov.withoutRequires),
    ...list(
      'requires belum terpenuhi',
      cov.gaps.map((g) => `${g.exercise}: ${g.fact} (${g.kind === 'unknown' ? 'fakta tidak ada' : g.kind === 'taught-later' ? 'baru diajarkan sesudahnya' : 'tidak pernah diajarkan'})`),
    ),
    ...list('fakta belum diajarkan kartu learn', cov.untaughtFacts),
    ...list('fakta tanpa source Microsoft Learn', cov.badSources),
    ...list('fakta verify', cov.verifyFacts.map((f) => `${f.id}: ${f.statement}`)),
    ...list('soal retired', cov.retired.map((r) => `${r.id}${r.reason ? `: ${r.reason}` : ''}`)),
  ]
}

function report(): string {
  const coverage = courseCoverage(UNITS)
  const missingVisuals = new Set<string>()
  for (const unit of UNITS)
    for (const lesson of unit.lessons)
      for (const item of lesson.items)
        if ((item.type === 'learn' || item.type === 'intro') && item.visual && (!isVisualName(item.visual) || !VISUALS[item.visual])) missingVisuals.add(item.visual)
  const b = answerBalance(UNITS)
  const ccna = answerBalance(CCNA_UNITS)
  const pct = (a: number, total: number) => (total ? `${Math.round((a / total) * 100)}%` : '-')
  const totals = coverage.reduce(
    (t, c) => ({ facts: t.facts + c.facts, learn: t.learn + c.learnCards, exercises: t.exercises + c.exercises, green: t.green + (c.reworked && !c.withoutRequires.length && !c.gaps.length && !c.untaughtFacts.length && !c.badSources.length ? 1 : 0) }),
    { facts: 0, learn: 0, exercises: 0, green: 0 },
  )
  return [
    'Laporan cakupan materi (LANGIT_AZ900_PERBAIKAN_MATERI.md bagian 4)',
    '',
    ...coverage.flatMap((c) => [...unitReport(c), '']),
    `Total: ${totals.green}/${coverage.length} unit hijau · ${totals.facts} fakta · ${totals.learn} kartu learn · ${totals.exercises} soal aktif`,
    `Visual dipakai kartu tapi belum ada komponennya: ${missingVisuals.size ? [...missingVisuals].join(', ') : 'tidak ada'}`,
    '',
    'Sebaran jawaban (docs/BUGS_LOG.md):',
    `    benar/salah: ${b.truths} benar, ${b.falses} salah (${pct(b.truths, b.truths + b.falses)} benar)`,
    `    yes/no: ${b.yes} yes, ${b.no} no (${pct(b.yes, b.yes + b.no)} yes)`,
    `    pilihan ganda dengan jawaban benar paling panjang: ${b.longestRight} dari ${b.choices} (${pct(b.longestRight, b.choices)})`,
    '',
    'Course AZ-104 (LANGIT_AZ104_PLAN.md):',
    ...courseCoverage(AZ104_UNITS).map((c) => `    ${c.unitId}: ${c.facts} fakta · ${c.learnCards} kartu learn · ${c.exercises} soal`),
    '',
    'Course CCNA (LANGIT_CCNA_PLAN.md, daftar verify di docs/VERIFIKASI_MATERI.md):',
    ...courseCoverage(CCNA_UNITS).map((c) => {
      const verify = CCNA_UNITS.find((u) => u.id === c.unitId)?.facts?.filter((f) => f.verify).length ?? 0
      return `    ${c.unitId}: ${c.facts} fakta (${verify} verify) · ${c.learnCards} kartu learn · ${c.exercises} soal`
    }),
    `    sebaran jawaban: benar/salah ${ccna.truths} benar, ${ccna.falses} salah (${pct(ccna.truths, ccna.truths + ccna.falses)} benar); jawaban benar paling panjang ${ccna.longestRight} dari ${ccna.choices} (${pct(ccna.longestRight, ccna.choices)})`,
  ].join('\n')
}

describe('material coverage report', () => {
  it('can be built for every unit', () => {
    const text = report()
    expect(text).toContain('Total:')
    // npm names the running script in npm_lifecycle_event (read without Node's types, which the app does not load).
    const env = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env
    if (env?.npm_lifecycle_event === 'content:coverage') console.log(text)
  })
})
