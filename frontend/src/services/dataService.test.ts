import test from 'node:test'
import assert from 'node:assert/strict'

import { getDashboardStats } from './dataService.ts'
import { mockInvoices } from '../data/manufacturingMockData.ts'

test('falls back to mock dataset when Supabase data is empty', async () => {
  const stats = await getDashboardStats()

  assert.equal(stats.totalInvoices, mockInvoices.length)
  assert.equal(stats.pass, 2)
  assert.equal(stats.review, 1)
  assert.equal(stats.block, 2)
})
