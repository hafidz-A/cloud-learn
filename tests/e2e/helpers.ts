import { expect, type Page } from '@playwright/test'
import { readFileSync, readdirSync } from 'node:fs'

// Test helpers that read the course JSON and answer any exercise the way a
// player would: by tapping the visible controls.

type Item = { id: string; type: string; [key: string]: unknown }
type Lesson = { id: string; title: string; items: Item[] }
type Unit = { id: string; path: number; lessons: Lesson[] }

const DIR = 'src/content/units'
export const UNITS: Unit[] = readdirSync(DIR)
  .filter((f) => f.endsWith('.json'))
  .sort()
  .map((f) => JSON.parse(readFileSync(`${DIR}/${f}`, 'utf8')))

export const ITEMS = new Map<string, Item>(UNITS.flatMap((u) => u.lessons.flatMap((l) => l.items.map((i) => [i.id, i] as const))))

/** Learn and intro cards teach; everything else is an exercise. */
export const isCard = (item: Item) => item.type === 'learn' || item.type === 'intro'

/** The exercises a lesson plays, in order (retired ones are skipped by the app). */
export const exercisesOf = (l: Lesson) => l.items.filter((i) => !isCard(i) && !i.retired)

export function lesson(id: string): Lesson {
  for (const u of UNITS) for (const l of u.lessons) if (l.id === id) return l
  throw new Error(`no lesson ${id}`)
}

export const PRAISE = /Benar!|Mantap!|Tepat sekali!|Keren!/

const exact = (page: Page, name: string) => page.getByRole('button', { name, exact: true })

async function check(page: Page) {
  await page.getByRole('button', { name: 'Periksa' }).click()
}

/** Answers the exercise on screen. With `wrong`, it answers wrong on purpose (where that is easy to do). */
export async function answer(page: Page, item: Item, { wrong = false, submit = true } = {}) {
  const e = item as Record<string, never> & Item
  switch (item.type) {
    case 'truefalse': {
      const pick = wrong ? !e.answer : e.answer
      await exact(page, pick ? 'Benar' : 'Salah').click()
      return
    }
    case 'choice':
    case 'fix': {
      const options = e.options as string[]
      const pick = wrong ? ((e.answer as number) + 1) % options.length : (e.answer as number)
      await exact(page, options[pick]).click()
      break
    }
    case 'multi': {
      const options = e.options as string[]
      const answers = e.answers as number[]
      const picks = wrong ? options.map((_, i) => i).filter((i) => !answers.includes(i)).slice(0, answers.length) : answers
      for (const i of picks) await exact(page, options[i]).click()
      break
    }
    case 'yesno': {
      const statements = e.statements as { answer: boolean }[]
      for (const [i, st] of statements.entries()) {
        const value = wrong && i === 0 ? !st.answer : st.answer
        await page.getByRole('group', { name: `Pernyataan ${i + 1}` }).getByRole('button', { name: value ? 'Yes' : 'No' }).click()
      }
      break
    }
    case 'match': {
      const pairs = e.pairs as [string, string][]
      if (wrong) {
        await exact(page, pairs[0][0]).click()
        await exact(page, pairs[1][1]).click()
      }
      for (const [l, r] of pairs) {
        await exact(page, l).click()
        await exact(page, r).click()
      }
      return // the lesson match checks itself
    }
    case 'sort':
    case 'place': {
      const labels = item.type === 'sort' ? (e.items as { text: string }[]).map((i) => i.text) : (e.pieces as { text: string }[]).map((p) => p.text)
      const containers = item.type === 'sort' ? (e.buckets as string[]) : (e.zones as string[])
      const target = (i: number) => {
        if (item.type === 'sort') return (e.items as { bucket: number }[])[i].bucket
        const piece = (e.pieces as { validZones: number[] }[])[i]
        return e.rule === 'one-per-zone' ? piece.validZones[i % piece.validZones.length] : piece.validZones[0]
      }
      for (const [i, text] of labels.entries()) {
        let to = target(i)
        if (wrong && i === 0) to = (to + 1) % containers.length
        await exact(page, text).click()
        await page.getByRole('button', { name: `Taruh di sini: ${containers[to]}` }).click()
      }
      break
    }
    case 'order': {
      const items = e.items as string[]
      if (!wrong) {
        for (const [t, text] of items.entries()) {
          const rows = await page.locator('ol[aria-label="Urutan jawaban"] > li').allTextContents()
          const at = rows.findIndex((r) => r.trim() === text)
          for (let k = at; k > t; k--) await page.getByRole('button', { name: `Naikkan ${text}` }).click()
        }
      }
      break
    }
    case 'fill': {
      const answers = e.answers as string[]
      const bank = e.bank as string[]
      const picks = wrong ? [bank.find((w) => !answers.includes(w))!, ...answers.slice(1)] : answers
      for (const w of picks) await page.getByLabel('Bank kata').getByRole('button', { name: w, exact: true }).click()
      break
    }
    case 'shell': {
      const tokens = wrong ? [(e.answer as string[])[0]] : (e.answer as string[])
      for (const t of tokens) await page.getByLabel('Potongan perintah').getByRole('button', { name: t, exact: true }).click()
      break
    }
    default:
      throw new Error(`unknown type ${item.type}`)
  }
  if (submit) await check(page)
}

export const main = (page: Page) => page.locator('main[data-item-id]')

/** Clicks "Lanjut" (or "Paham, lanjut" on a learn card) and waits for the next step (or the finish screen). */
export async function next(page: Page) {
  const step = await main(page).getAttribute('data-step')
  await page.getByRole('button', { name: /^(Paham, l|L)anjut$/ }).click()
  await page.waitForFunction((prev) => {
    const m = document.querySelector<HTMLElement>('main[data-step]')
    return !m || m.dataset.step !== prev
  }, step)
}

/** Reads learn and intro cards until an exercise is on screen, and returns that exercise. */
export async function skipCards(page: Page): Promise<Item> {
  for (let guard = 0; guard < 10; guard++) {
    const item = ITEMS.get((await main(page).getAttribute('data-item-id'))!)!
    if (!isCard(item)) return item
    await next(page)
  }
  throw new Error('no exercise after the cards')
}

/**
 * Plays the run on screen (lesson, practice, or checkpoint) to its finish
 * screen. Exercises listed in `wrongFirst` are answered wrong the first time.
 * Returns the ids in the order they appeared.
 */
export async function play(page: Page, { wrongFirst = new Set<string>(), finish = 'Lesson selesai!' as string | RegExp } = {}) {
  const seen: string[] = []
  const missed = new Set<string>()
  for (let guard = 0; guard < 80; guard++) {
    if (await page.getByRole('heading', { name: finish }).isVisible()) return seen
    const m = main(page)
    await expect(m).toBeVisible()
    const id = (await m.getAttribute('data-item-id'))!
    const retry = (await m.getAttribute('data-retry')) !== null
    seen.push(retry ? `${id} (retry)` : id)
    const item = ITEMS.get(id)!
    if (!isCard(item)) {
      const wrong = wrongFirst.has(id) && !missed.has(id)
      if (wrong) missed.add(id)
      await answer(page, item, { wrong })
      await expect(page.getByRole('region', { name: wrong ? 'Kurang tepat' : PRAISE })).toBeVisible()
    }
    await next(page)
  }
  throw new Error('run did not finish')
}

/** Opens a node on the home path map and presses its start button. */
export async function startFromMap(page: Page, nodeId: string, button: string | RegExp = /^Mulai/) {
  await page.goto('/')
  await page.locator(`[data-node="${nodeId}"]`).click()
  await page.getByRole('dialog').getByRole('button', { name: button }).click()
}
