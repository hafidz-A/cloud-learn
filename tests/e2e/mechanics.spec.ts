import { expect, test, type Page } from '@playwright/test'
import { ITEMS, answer, isCard, lesson, main, next, play } from './helpers'

test.use({ reducedMotion: 'reduce' })

/** Seeds saved progress before the app starts. */
async function seed(page: Page, state: Record<string, unknown>) {
  await page.addInitScript((s) => {
    if (!sessionStorage.getItem('seeded')) {
      localStorage.setItem('langit-progress', JSON.stringify({ state: s, version: 2 }))
      sessionStorage.setItem('seeded', '1')
    }
  }, state)
}

const today = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

test('every exercise type can be played to the end of its lesson', async ({ page }) => {
  // Together these lessons use all 11 exercise types.
  for (const id of ['u01-l1', 'u03-l3', 'u04-l1', 'u11-l2']) {
    await page.goto(`/#/lesson/${id}`)
    await play(page)
    await expect(page.getByRole('heading', { name: 'Lesson selesai!' })).toBeVisible()
  }
})

test('five wrong answers use up the hearts and stop the lesson', async ({ page }) => {
  await page.goto('/#/lesson/u01-l1')
  let wrong = 0
  for (let guard = 0; guard < 30 && wrong < 5; guard++) {
    const item = ITEMS.get((await main(page).getAttribute('data-item-id'))!)!
    if (!isCard(item)) {
      await answer(page, item, { wrong: true })
      await expect(page.getByRole('region', { name: 'Kurang tepat' })).toBeVisible()
      wrong++
    }
    if (wrong < 5) await next(page)
  }
  await page.getByRole('button', { name: 'Lanjut' }).click()
  await expect(page.getByRole('heading', { name: 'Hearts habis' })).toBeVisible()
  await page.getByRole('button', { name: 'Kembali ke home' }).click()
  await expect(page.getByLabel('0 hearts')).toBeVisible()
})

test('running out of hearts on the very first lesson can still be refilled in practice', async ({ page }) => {
  await page.goto('/#/lesson/u01-l1')
  for (let guard = 0; guard < 30; guard++) {
    if (await page.getByRole('heading', { name: 'Hearts habis' }).isVisible()) break
    const item = ITEMS.get((await main(page).getAttribute('data-item-id'))!)!
    if (!isCard(item)) await answer(page, item, { wrong: true })
    await next(page)
  }
  await page.getByRole('button', { name: 'Latihan untuk isi hearts' }).click()
  await play(page, { finish: 'Latihan selesai!' })
  await page.getByRole('button', { name: 'Lanjut' }).click()
  await expect(page.getByLabel(/^[1-5] hearts?$/)).toBeVisible()
})

test('passing checkpoint 1 opens path 2', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-node="u04-l1"]')).toHaveAttribute('data-node-state', 'locked')
  await page.goto('/#/checkpoint/cp1')
  await play(page, { finish: 'Checkpoint lulus!' })
  await expect(page.getByLabel('20 XP')).toBeVisible()
  await page.getByRole('button', { name: 'Lanjut' }).click()
  await expect(page.locator('[data-node="u04-l1"]')).toHaveAttribute('data-node-state', 'open')
})

test('practice plays due review items and refills hearts', async ({ page }) => {
  const reviewId = 'u01-l1-e2'
  await seed(page, {
    hearts: 3,
    heartsDay: today(),
    lessonsDone: { 'u01-l1': { bestAccuracy: 0.8, completedAt: new Date().toISOString(), count: 1 } },
    review: { [reviewId]: { dueDay: today(), correctStreak: 0 } },
  })
  await page.goto('/#/latihan')
  await expect(page.getByText('1 soal siap diulang')).toBeVisible()
  await page.getByRole('button', { name: 'Mulai latihan' }).click()
  await expect(main(page)).toHaveAttribute('data-item-id', reviewId)
  await expect(page.getByRole('button', { name: 'Lihat materi' })).toBeVisible()
  await play(page, { finish: 'Latihan selesai!' })
  await page.getByRole('button', { name: 'Lanjut' }).click()
  await expect(page.getByText('Tidak ada soal jatuh tempo')).toBeVisible()
  await expect(page.getByLabel('5 hearts')).toBeVisible()
})

test('a domain mini exam can be flagged, submitted, scored, and reviewed', async ({ page }) => {
  await page.goto('/#/ujian')
  await page.getByRole('radio', { name: /Jalur 1/ }).click()
  await page.getByRole('button', { name: 'Mulai' }).nth(1).click()
  await expect(page.getByRole('timer')).toBeVisible()

  const id = (await page.locator('main[data-exam-question]').getAttribute('data-exam-question'))!
  await answer(page, ITEMS.get(id)!, { submit: false })
  await page.getByRole('button', { name: 'Tandai' }).click()

  // Progress and time survive closing the app.
  await page.reload()
  await expect(page.getByRole('button', { name: 'Ditandai' })).toBeVisible()

  await page.getByRole('button', { name: 'Daftar nomor soal' }).click()
  await expect(page.getByRole('button', { name: 'Soal 1, sudah dijawab, ditandai' })).toBeVisible()
  await page.getByRole('dialog').getByRole('button', { name: 'Kumpulkan' }).click()
  await expect(page.getByText('14', { exact: true })).toBeVisible() // unanswered
  await page.getByRole('button', { name: 'Kumpulkan sekarang' }).click()

  await expect(page.getByRole('heading', { name: 'Skor kamu' })).toBeVisible()
  await expect(page.getByText('Skor ini perkiraan.', { exact: false })).toBeVisible()
  await page.getByRole('button', { name: 'Lihat pembahasan' }).click()
  await page.getByRole('radio', { name: 'Ditandai (1)' }).click()
  await expect(page.locator('article')).toHaveCount(1)
  await expect(page.locator('article')).toHaveAttribute('data-result', 'correct')

  // Wrong and unanswered questions link to the material that teaches them.
  await page.getByRole('radio', { name: /^Salah saja/ }).click()
  await page.getByRole('button', { name: /^Pelajari lagi: / }).first().click()
  await expect(page.getByRole('dialog', { name: 'Materi' })).toBeVisible()
  await page.getByRole('button', { name: 'Kembali ke pembahasan' }).click()
  await expect(page.getByRole('dialog', { name: 'Materi' })).toHaveCount(0)

  // The 14 unanswered questions count in the score but not in the review queue.
  const review = await page.evaluate(() => JSON.parse(localStorage.getItem('langit-progress')!).state.review)
  expect(Object.keys(review)).toEqual([])
})

test('long-pressing an abbreviation opens its glossary card', async ({ page }) => {
  await page.goto('/#/lesson/u01-l2')
  const abbr = page.locator('abbr[data-term="SaaS"]').first()
  // Play until a card or question mentions SaaS.
  for (let guard = 0; guard < 12 && !(await abbr.isVisible()); guard++) {
    const item = ITEMS.get((await main(page).getAttribute('data-item-id'))!)!
    if (!isCard(item)) await answer(page, item)
    await next(page)
  }
  await expect(abbr).toBeVisible()
  const box = (await abbr.boundingBox())!
  await page.mouse.move(box.x + 4, box.y + 4)
  await page.mouse.down()
  await page.waitForTimeout(600)
  await page.mouse.up()
  await expect(page.getByRole('dialog', { name: 'SaaS' })).toBeVisible()
  await expect(page.getByText('Software as a Service').first()).toBeVisible()
})

test('hearts can be turned off in settings', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Pengaturan' }).click()
  await page.getByRole('switch', { name: 'Hearts' }).click()
  await expect(page.getByLabel('Hearts dimatikan')).toBeVisible()
  await page.getByRole('radio', { name: /100 XP/ }).click()
  await expect(page.getByLabel('XP hari ini 0 dari target 100')).toBeVisible()
})

test.describe('on a 320px phone', () => {
  test.use({ viewport: { width: 320, height: 640 } })

  /** Text that sticks out of its card, or past the screen edge. */
  const overflow = (page: Page) =>
    page.evaluate(async () => {
      await document.fonts.ready // the display font is wider than the fallback
      const out: string[] = []
      const W = document.documentElement.clientWidth
      if (document.documentElement.scrollWidth > W) out.push(`page is ${document.documentElement.scrollWidth}px wide`)
      const walker = document.createTreeWalker(document.querySelector('main')!, NodeFilter.SHOW_TEXT)
      const range = document.createRange()
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const box = n.parentElement?.closest('button') ?? document.querySelector('main')!
        const b = box.getBoundingClientRect()
        range.selectNodeContents(n)
        for (const r of range.getClientRects()) if (r.width && (r.right > b.right + 1 || r.right > W)) out.push(n.textContent!.trim())
      }
      return out
    })

  test('match cards with abbreviations keep their text inside the card', async ({ page }) => {
    await page.goto('/#/lesson/u07-l4')
    for (let guard = 0; guard < 20; guard++) {
      const id = (await main(page).getAttribute('data-item-id'))!
      if (id === 'u07-l4-e4') break
      const item = ITEMS.get(id)!
      if (!isCard(item)) await answer(page, item)
      await next(page)
    }
    await expect(page.locator('abbr[data-term="SMB"]').first()).toBeVisible()
    expect(await overflow(page)).toEqual([])
  })

  test('long card titles fit on a narrow phone', async ({ page }) => {
    await page.goto('/#/lesson/u01-l2')
    const title = (lesson('u01-l2').items[0] as unknown as { title: string }).title
    await expect(page.getByRole('heading', { name: title })).toBeVisible()
    expect(await overflow(page)).toEqual([])
  })
})
