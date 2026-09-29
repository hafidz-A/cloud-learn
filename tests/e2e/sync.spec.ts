import { expect, test, type BrowserContext, type Page } from '@playwright/test'
import { play, startFromMap } from './helpers'

test.use({ reducedMotion: 'reduce' })

/**
 * Stands in for the Supabase functions (supabase/migrations): rows keyed by
 * code, a version per row, and writes that only land on the latest version.
 */
function fakeServer() {
  const rows = new Map<string, { data: unknown; version: number }>()
  const attach = (context: BrowserContext) =>
    context.route('**/rest/v1/rpc/*', async (route) => {
      const fn = route.request().url().split('/').pop()
      const body = route.request().postDataJSON() as { p_code: string; p_data?: unknown; p_version?: number }
      const row = rows.get(body.p_code)
      if (fn === 'sync_pull') return route.fulfill({ json: row ? [row] : [] })
      if (body.p_version === 0) {
        if (row) return route.fulfill({ json: null })
        rows.set(body.p_code, { data: body.p_data, version: 1 })
        return route.fulfill({ json: 1 })
      }
      if (!row || row.version !== body.p_version) return route.fulfill({ json: null })
      rows.set(body.p_code, { data: body.p_data, version: row.version + 1 })
      return route.fulfill({ json: row.version + 1 })
    })
  return { rows, attach }
}

async function openSettings(page: Page) {
  await page.goto('/#/pengaturan')
  await expect(page.getByRole('heading', { name: 'Pengaturan' })).toBeVisible()
}

test('two devices share progress through a sync code', async ({ browser }) => {
  const server = fakeServer()
  const phone = await browser.newContext()
  const pc = await browser.newContext()
  await server.attach(phone)
  await server.attach(pc)
  const a = await phone.newPage()
  const b = await pc.newPage()

  // The phone finishes a lesson, then makes a sync code.
  await startFromMap(a, 'u01-l1')
  await play(a)
  await a.getByRole('button', { name: 'Lanjut' }).click()
  await openSettings(a)
  await a.getByRole('button', { name: 'Buat kode sinkron' }).click()
  const code = (await a.getByLabel(/^Kode sinkron /).textContent())!.trim()
  expect(code).toMatch(/^[A-Z2-9]{4}(-[A-Z2-9]{4}){3}$/)
  await expect(a.getByRole('status')).toContainText('Tersinkron')

  // The PC already has its own lesson and a different goal, then enters the code.
  await startFromMap(b, 'u01-l1')
  await play(b, { wrongFirst: new Set(['u01-l1-e2']) })
  await b.getByRole('button', { name: 'Lanjut' }).click()
  await openSettings(b)
  await b.getByRole('radio', { name: /100 XP/ }).click()
  await b.getByRole('button', { name: 'Saya sudah punya kode' }).click()
  await b.getByLabel('Kode dari perangkat lain').fill(code.toLowerCase().replaceAll('-', ' '))
  await b.getByRole('button', { name: 'Sambungkan' }).click()
  await expect(b.getByRole('status')).toContainText('Tersinkron')

  // Both lessons count once, the best result is kept, and the PC's newer goal wins.
  await b.goto('/')
  await expect(b.getByLabel('XP hari ini 15 dari target 100')).toBeVisible()
  await expect(b.locator('[data-node="u01-l2"]')).toHaveAttribute('data-node-state', 'active')

  // The phone picks up the merge when it comes back to the app.
  await a.reload()
  await expect(a.getByLabel('XP hari ini 15 dari target 100')).toBeVisible()

  // A lesson on the PC reaches the phone.
  await b.locator('[data-node="u01-l2"]').click()
  await b.getByRole('dialog').getByRole('button', { name: /^Mulai/ }).click()
  await play(b)
  await b.getByRole('button', { name: 'Lanjut' }).click()
  await expect(b.getByLabel('XP hari ini 30 dari target 100')).toBeVisible()
  await openSettings(b)
  await b.getByRole('button', { name: 'Sinkronkan sekarang' }).click()
  await expect(b.getByRole('status')).toContainText('Tersinkron')
  await a.reload()
  await expect(a.getByLabel('XP hari ini 30 dari target 100')).toBeVisible()
  await a.goto('/')
  await expect(a.locator('[data-node="u01-l2"]')).toHaveAttribute('data-node-state', 'done')

  // A reset on one device resets the other.
  await openSettings(a)
  await expect(a.getByText('di semua perangkat yang tersinkron')).toBeVisible()
  await a.getByRole('button', { name: 'Reset progres' }).click()
  await a.getByRole('button', { name: 'Ya, reset' }).click()
  await a.getByRole('button', { name: 'Sinkronkan sekarang' }).click()
  await expect(a.getByRole('status')).toContainText('Tersinkron')
  await b.reload()
  await expect(b.getByLabel('XP hari ini 0 dari target 50')).toBeVisible()

  await phone.close()
  await pc.close()
})

test('a wrong code is refused, and no internet is reported without losing progress', async ({ page, context }) => {
  const server = fakeServer()
  await server.attach(context)
  await openSettings(page)
  await page.getByRole('button', { name: 'Saya sudah punya kode' }).click()
  await page.getByLabel('Kode dari perangkat lain').fill('ABCD-EFGH')
  await page.getByRole('button', { name: 'Sambungkan' }).click()
  await expect(page.getByRole('alert')).toContainText('16 huruf dan angka')
  await page.getByLabel('Kode dari perangkat lain').fill('ABCD-EFGH-JKLM-NPQR')
  await page.getByRole('button', { name: 'Sambungkan' }).click()
  await expect(page.getByRole('alert')).toContainText('tidak ditemukan')

  await page.getByRole('button', { name: 'Batal' }).click()
  await page.getByRole('button', { name: 'Buat kode sinkron' }).click()
  await expect(page.getByRole('status')).toContainText('Tersinkron')
  await context.unroute('**/rest/v1/rpc/*')
  await context.route('**/rest/v1/rpc/*', (route) => route.abort('internetdisconnected'))
  await page.getByRole('button', { name: 'Sinkronkan sekarang' }).click()
  await expect(page.getByRole('status')).toContainText(/internet/)
})
