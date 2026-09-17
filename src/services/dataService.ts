import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { mockInvoices as fallbackInvoices } from '../data/manufacturingMockData'

const INVOICES_URL = 'https://api.agents.snsihub.ai/webhook/ef923670-b874-4a1d-8c22-69f37e64bdc9'
const SCREEN_URL = 'https://api.agents.snsihub.ai/webhook/1cb557ea-39ae-4da6-bad6-bb74d8eaed03'

// ─── sessionStorage cache ───
function cacheKey(id: string) { return 'invoice:' + id }
function cacheGet(id: string): any | null {
  try {
    const raw = sessionStorage.getItem(cacheKey(id))
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}
function cacheSet(invoice: any) {
  try {
    sessionStorage.setItem(cacheKey(invoice.id), JSON.stringify(invoice))
    sessionStorage.setItem('latest_screening', JSON.stringify(invoice))
  } catch { /* ignore */ }
}

export type DerivedStatus = 'PASS' | 'REVIEW' | 'BLOCK' | 'PENDING'

export interface GovernmentComplianceRecord {
  record_id: string
  invoice_no: string
  invoice_date: string
  seller_legal_name: string
  seller_gstin: string
  seller_location: string
  seller_pincode: number | null
  seller_state_code: number | null
  buyer_legal_name: string
  buyer_gstin: string
  buyer_location: string
  buyer_pincode: number | null
  buyer_state_code: number | null
  place_of_supply: number | null
  supply_type: string
  document_type: string
  reverse_charge: string
  hsn_code: number | null
  item_description: string
  quantity: number | null
  qty_unit: string
  taxable_value: number | null
  gst_rate: number | null
  cgst_value: number | null
  sgst_value: number | null
  igst_value: number | null
  total_invoice_value: number | null
  transporter_name: string
  transporter_gstin: string
  transport_mode: number | null
  transport_distance_km: number | null
  transport_document_no: string
  transport_document_date: string
  vehicle_no: string
  eway_bill_no: number | null
  eway_status: string
  eway_doc_no: string
  eway_from_gstin: string
  eway_to_gstin: string
  eway_total_value: number | null
  eway_vehicle_no: string
  rule_issue: string
  expected_result: string
  data_type: string
}

export interface Invoice extends GovernmentComplianceRecord {
  id: string
  invoiceNumber: string
  invoiceDate: string
  vendorId: string
  vendorName: string
  amount: number
  currency: string
  status: DerivedStatus
  decision?: Exclude<DerivedStatus, 'PENDING'>
  sellerLegalName: string
  sellerGstin: string
  buyerLegalName: string
  buyerGstin: string
  taxableValue: number
  gstRate: number
  cgstValue: number
  sgstValue: number
  igstValue: number
  totalInvoiceValue: number
  transportDocumentNo: string
  ewayBillNo: string
  ruleIssue: string
  expectedResult: string
  shipmentId?: string
  aiExplanation?: string
  reason?: string
  screenedAt?: string
}

export interface Vendor {
  id: string
  vendorId: string
  vendorName: string
  status: 'Approved' | 'Blocked' | 'Pending'
  taxId?: string
  gstNumber?: string
  address?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  invoiceCount: number
  totalValue: number
}

export interface Company {
  id: string
  companyName: string
  gstin: string
  role: 'seller' | 'buyer'
  invoiceCount: number
  totalValue: number
}

export interface PurchaseOrder {
  id: string
  poId: string
  poNumber: string
  sku: string
  orderQty: number
  weightGrams: number | null
  warehousePincode: number | null
  customerPincode: number | null
  zone: string
  vendorName?: string
  poValue?: number
  balanceRemaining?: number
  validFrom?: string
}

export interface Contract { id: string; contractId: string; vendorId: string; vendorName: string; contractNumber: string; agreedRate: number; rateUnit: string; validFrom?: string; validTo?: string }
export interface Shipment { id: string; shipmentId: string; vendorId: string; vendorName: string; podStatus: 'Available' | 'Missing'; alreadyBilled: boolean }
export interface DashboardStats { totalInvoices: number; pass: number; review: number; block: number; pending: number; potentialOverbilling: number }
export interface IssueAggregate { issue: string; count: number; value: number }
export interface StatusAggregate { status: string; count: number; value: number }
export interface ComplianceAnalytics { issues: IssueAggregate[]; ewayStatuses: StatusAggregate[]; gstTotals: { taxable: number; cgst: number; sgst: number; igst: number; total: number } }
export interface VendorMonthlyAggregate { vendorId: string; vendorName: string; month: string; invoiceCount: number; invoiceValue: number; violations: number }
export interface RuleEvaluation { blocked: number; reviewed: number; passed: number; total: number; explanation: string }

function requireSupabase() {
  if (!isSupabaseConfigured || !supabase) throw new Error('Supabase is not configured.')
  return supabase
}
function text(value: unknown) { return value == null ? '' : String(value) }
function number(value: unknown) { return value == null || value === '' ? 0 : Number(value) || 0 }

export function deriveStatus(record: Pick<GovernmentComplianceRecord, 'eway_status' | 'rule_issue' | 'expected_result'>): DerivedStatus {
  const expected = text(record.expected_result).trim().toUpperCase()
  const issue = text(record.rule_issue).trim().toUpperCase()
  const eway = text(record.eway_status).trim().toUpperCase()
  if (/(BLOCK|REJECT|FAIL)/.test(expected) || /(BLOCK|REJECT|FAIL)/.test(issue)) return 'BLOCK'
  if (/(REVIEW|HOLD|WARN)/.test(expected) || /(REVIEW|HOLD|WARN)/.test(issue)) return 'REVIEW'
  if (issue) return 'REVIEW'
  if (/(INVALID|CANCEL|FAIL|REJECT)/.test(eway)) return 'REVIEW'
  if (/(PASS|CLEAR|APPROV|VALID|ACTIVE)/.test(expected) || /(VALID|ACTIVE|GENERATED|DELIVERED)/.test(eway)) return 'PASS'
  return 'PENDING'
}

export function evaluateRules(record: Pick<GovernmentComplianceRecord, 'eway_status' | 'rule_issue' | 'expected_result'>): RuleEvaluation {
  const issueText = text(record.rule_issue).trim()
  const rules = issueText.split(/[,;|]+/).map((rule) => rule.trim()).filter(Boolean)
  const status = deriveStatus(record)
  const blocked = status === 'BLOCK' ? Math.max(1, rules.length) : 0
  const reviewed = status === 'REVIEW' ? Math.max(1, rules.length) : 0
  const passed = status === 'PASS' ? Math.max(1, rules.length || 1) : 0
  const total = Math.max(1, blocked + reviewed + passed)
  const explanation = status === 'BLOCK'
    ? `Blocked because ${rules.length ? rules.join(', ') : 'a blocking compliance condition'} was detected.`
    : status === 'REVIEW'
      ? `Needs review because ${rules.length ? rules.join(', ') : 'a compliance condition requires attention'}.`
      : status === 'PASS'
        ? 'All available compliance checks passed.'
        : 'The invoice is pending because no definitive compliance result was recorded.'
  return { blocked, reviewed, passed, total, explanation }
}

function toInvoice(record: GovernmentComplianceRecord): Invoice {
  const status = deriveStatus(record)
  return {
    ...record,
    id: record.record_id,
    invoiceNumber: text(record.invoice_no),
    invoiceDate: text(record.invoice_date),
    vendorId: text(record.seller_gstin) || text(record.seller_legal_name),
    vendorName: text(record.seller_legal_name) || text(record.seller_gstin) || 'Unknown seller',
    amount: number(record.total_invoice_value),
    currency: 'INR',
    status,
    decision: status === 'PENDING' ? undefined : status,
    sellerLegalName: text(record.seller_legal_name),
    sellerGstin: text(record.seller_gstin),
    buyerLegalName: text(record.buyer_legal_name),
    buyerGstin: text(record.buyer_gstin),
    taxableValue: number(record.taxable_value),
    gstRate: number(record.gst_rate),
    cgstValue: number(record.cgst_value),
    sgstValue: number(record.sgst_value),
    igstValue: number(record.igst_value),
    totalInvoiceValue: number(record.total_invoice_value),
    transportDocumentNo: text(record.transport_document_no),
    ewayBillNo: record.eway_bill_no == null ? '' : String(record.eway_bill_no),
    ruleIssue: text(record.rule_issue),
    expectedResult: text(record.expected_result),
  }
}

async function getComplianceRows(): Promise<GovernmentComplianceRecord[]> {
  try {
    const client = requireSupabase()
    const { data, error } = await client.from('government_compliance').select('*').order('invoice_date', { ascending: false })
    if (error) throw error
    const rows = (data || []) as GovernmentComplianceRecord[]
    if (rows.length > 0) return rows
  } catch (err) { console.warn('Supabase fallback failed:', err) }

  return fallbackInvoices.map((invoice) => ({
    record_id: invoice.invoiceId, invoice_no: invoice.invoiceId, invoice_date: invoice.date,
    seller_legal_name: invoice.vendorName, seller_gstin: invoice.vendorId, seller_location: '',
    seller_pincode: null, seller_state_code: null, buyer_legal_name: '', buyer_gstin: '', buyer_location: '',
    buyer_pincode: null, buyer_state_code: null, place_of_supply: null, supply_type: '',
    document_type: 'Invoice', reverse_charge: 'N', hsn_code: null, item_description: '',
    quantity: null, qty_unit: '', taxable_value: invoice.amount, gst_rate: null,
    cgst_value: 0, sgst_value: 0, igst_value: 0, total_invoice_value: invoice.amount,
    transporter_name: '', transporter_gstin: '', transport_mode: null, transport_distance_km: null,
    transport_document_no: invoice.shipmentId || '', transport_document_date: invoice.date,
    vehicle_no: '', eway_bill_no: null, eway_status: invoice.status === 'CLEAR' ? 'VALID' : '',
    eway_doc_no: '', eway_from_gstin: '', eway_to_gstin: '', eway_total_value: invoice.amount,
    eway_vehicle_no: '', rule_issue: invoice.triggeredRule || '',
    expected_result: invoice.status === 'BLOCKED' ? 'BLOCK' : invoice.status,
    data_type: 'demo_fallback',
  }))
}

function rowToInvoice(row: any): Invoice {
  const dec = String(row.decision || '').toUpperCase()
  const status: DerivedStatus = dec === 'CLEAR' ? 'PASS' : dec === 'BLOCK' ? 'BLOCK' : dec === 'REVIEW' ? 'REVIEW' : 'PENDING'
  const amt = Number(row.amount || 0)
  return {
    id: row.screening_id || '', record_id: row.screening_id || '',
    invoice_no: row.invoice_number || '', invoice_date: row.screened_at || '',
    seller_legal_name: row.vendor_name || '', seller_gstin: row.vendor_id || '',
    seller_location: '', seller_pincode: null, seller_state_code: null,
    buyer_legal_name: '', buyer_gstin: '', buyer_location: '',
    buyer_pincode: null, buyer_state_code: null, place_of_supply: null, supply_type: '',
    document_type: 'Invoice', reverse_charge: 'N', hsn_code: null, item_description: '',
    quantity: null, qty_unit: '', taxable_value: amt, gst_rate: 0,
    cgst_value: 0, sgst_value: 0, igst_value: 0, total_invoice_value: amt,
    transporter_name: '', transporter_gstin: '', transport_mode: null, transport_distance_km: null,
    transport_document_no: row.shipment_id || '', transport_document_date: '',
    vehicle_no: '', eway_bill_no: null, eway_status: '', eway_doc_no: '',
    eway_from_gstin: '', eway_to_gstin: '', eway_total_value: null, eway_vehicle_no: '',
    rule_issue: row.reason || '', expected_result: dec, data_type: 'workflow',
    invoiceNumber: row.invoice_number || '', invoiceDate: row.screened_at || '',
    vendorId: row.vendor_id || '', vendorName: row.vendor_name || '',
    amount: amt, currency: 'INR', status, decision: status === 'PENDING' ? undefined : status,
    sellerLegalName: row.vendor_name || '', sellerGstin: row.vendor_id || '',
    buyerLegalName: '', buyerGstin: '', taxableValue: amt, gstRate: 0,
    cgstValue: 0, sgstValue: 0, igstValue: 0, totalInvoiceValue: amt,
    transportDocumentNo: row.shipment_id || '', ewayBillNo: '',
    ruleIssue: row.reason || '', expectedResult: dec, shipmentId: row.shipment_id,
    aiExplanation: row.ai_explanation || '', reason: row.reason || '',
    screenedAt: row.screened_at || '',
  }
}

function extractRows(data: any): any[] {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.items)) return data.items.map((i: any) => i.json || i)
  if (data.data && Array.isArray(data.data.items)) return data.data.items.map((i: any) => i.json || i)
  if (data.data && Array.isArray(data.data)) return data.data
  if (data.screening_id || data.invoice_number) return [data]
  if (data.data && (data.data.screening_id || data.data.invoice_number)) return [data.data]
  return []
}

function deepFind(data: any, fieldName: string): any {
  if (data == null) return undefined
  if (typeof data !== 'object') return undefined
  if (Array.isArray(data)) {
    for (const item of data) {
      const found = deepFind(item, fieldName)
      if (found !== undefined) return found
    }
    return undefined
  }
  if (data[fieldName] !== undefined && data[fieldName] !== null) return data[fieldName]
  for (const key of Object.keys(data)) {
    const found = deepFind(data[key], fieldName)
    if (found !== undefined) return found
  }
  return undefined
}

export async function getInvoices(): Promise<Invoice[]> {
  try {
    const res = await fetch(INVOICES_URL)
    if (!res.ok) throw new Error('Invoice list request failed: ' + res.status)
    const data = await res.json()
    const rows = extractRows(data)
    if (rows.length === 0) return (await getComplianceRows()).map(toInvoice)
    return rows.map(rowToInvoice)
  } catch (e) {
    console.error('Invoice webhook failed, falling back to mock:', e)
    return (await getComplianceRows()).map(toInvoice)
  }
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  console.log('getInvoiceById called with:', id)

  // 1. Cache
  const cached = cacheGet(id)
  if (cached) { console.log('✓ Cache hit:', id); return cached }

  // 2. Webhook list
  try {
    const invoices = await getInvoices()
    const found = invoices.find((inv) => inv.id === id)
    if (found) { console.log('✓ Found in webhook list:', id); return found }
  } catch (e) { console.warn('Webhook lookup failed:', e) }

  // 3. latest_screening fallback
  try {
    const latestRaw = sessionStorage.getItem('latest_screening')
    if (latestRaw) {
      const latest = JSON.parse(latestRaw)
      console.log('→ Using latest_screening fallback')
      return latest
    }
  } catch { /* ignore */ }

  // 4. Supabase
  try {
    const client = requireSupabase()
    const { data, error } = await client.from('government_compliance').select('*').eq('record_id', id).maybeSingle()
    if (error) throw error
    if (data) return toInvoice(data as GovernmentComplianceRecord)
  } catch (err) { console.warn('Supabase lookup failed:', err) }

  return null
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const invoices = await getInvoices()
  return {
    totalInvoices: invoices.length,
    pass: invoices.filter((i) => i.status === 'PASS').length,
    review: invoices.filter((i) => i.status === 'REVIEW').length,
    block: invoices.filter((i) => i.status === 'BLOCK').length,
    pending: invoices.filter((i) => i.status === 'PENDING').length,
    potentialOverbilling: invoices.filter((i) => i.status === 'REVIEW' || i.status === 'BLOCK').reduce((s, i) => s + i.amount, 0),
  }
}

// ─── Vendors: read from Supabase `vendors` table + enrich with invoice stats ───
export async function getVendors(): Promise<Vendor[]> {
  try {
    const client = requireSupabase()
    const { data: vendors, error } = await client.from('vendors').select('*').order('vendor_id')
    if (error) throw error

    const invoices = await getInvoices()

    return (vendors || []).map((v: any) => {
      const vendorInvoices = invoices.filter((inv) => {
        const byId = String(inv.vendorId).toUpperCase() === String(v.vendor_id).toUpperCase()
        const byGstin = String(inv.sellerGstin).toUpperCase() === String(v.gstin).toUpperCase()
        return byId || byGstin
      })

      return {
        id: v.vendor_id,
        vendorId: v.vendor_id,
        vendorName: v.vendor_name,
        status: v.status === 'APPROVED' ? 'Approved'
              : v.status === 'BLOCKED'  ? 'Blocked'
              : 'Pending',
        taxId: v.gstin,
        gstNumber: v.gstin,
        address: v.contact_name || '',
        contactName: v.contact_name,
        contactEmail: v.email,
        contactPhone: v.phone,
        invoiceCount: vendorInvoices.length,
        totalValue: vendorInvoices.reduce((s, i) => s + i.amount, 0),
      }
    })
  } catch (err) {
    console.error('Vendor fetch failed:', err)
    // Fallback: derive from invoices
    const invoices = await getInvoices()
    const map = new Map<string, Vendor>()
    invoices.forEach((inv) => {
      const id = inv.vendorId || inv.sellerGstin
      const cur = map.get(id)
      if (cur) { cur.invoiceCount += 1; cur.totalValue += inv.amount; return }
      map.set(id, {
        id, vendorId: id, vendorName: inv.sellerLegalName || id,
        status: 'Pending', taxId: inv.sellerGstin, gstNumber: inv.sellerGstin,
        invoiceCount: 1, totalValue: inv.amount,
      })
    })
    return Array.from(map.values())
  }
}

// ─── Companies: union of sellers & buyers from invoices ───
export async function getCompanies(): Promise<Company[]> {
  const invoices = await getInvoices()
  const map = new Map<string, Company>()

  invoices.forEach((inv) => {
    const sellerKey = (inv.sellerGstin || inv.sellerLegalName || '').toUpperCase()
    if (sellerKey) {
      const cur = map.get('S:' + sellerKey)
      if (cur) { cur.invoiceCount += 1; cur.totalValue += inv.amount }
      else map.set('S:' + sellerKey, {
        id: 'S:' + sellerKey,
        companyName: inv.sellerLegalName || sellerKey,
        gstin: inv.sellerGstin || '',
        role: 'seller',
        invoiceCount: 1,
        totalValue: inv.amount,
      })
    }

    const buyerKey = (inv.buyerGstin || inv.buyerLegalName || '').toUpperCase()
    if (buyerKey) {
      const cur = map.get('B:' + buyerKey)
      if (cur) { cur.invoiceCount += 1; cur.totalValue += inv.amount }
      else map.set('B:' + buyerKey, {
        id: 'B:' + buyerKey,
        companyName: inv.buyerLegalName || buyerKey,
        gstin: inv.buyerGstin || '',
        role: 'buyer',
        invoiceCount: 1,
        totalValue: inv.amount,
      })
    }
  })

  return Array.from(map.values()).sort((a, b) => b.invoiceCount - a.invoiceCount)
}

export async function getVendorMonthlyAnalytics(): Promise<VendorMonthlyAggregate[]> {
  const invoices = await getInvoices()
  const grouped = new Map<string, VendorMonthlyAggregate>()
  invoices.forEach((invoice) => {
    const date = new Date(invoice.invoiceDate)
    if (Number.isNaN(date.getTime())) return
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const vendorId = invoice.sellerGstin || invoice.sellerLegalName || 'Unknown'
    const key = `${vendorId}:${month}`
    const current = grouped.get(key) || { vendorId, vendorName: invoice.sellerLegalName || vendorId, month, invoiceCount: 0, invoiceValue: 0, violations: 0 }
    current.invoiceCount += 1
    current.invoiceValue += invoice.amount
    if (invoice.status === 'REVIEW' || invoice.status === 'BLOCK') current.violations += 1
    grouped.set(key, current)
  })
  return Array.from(grouped.values()).sort((a, b) => a.month.localeCompare(b.month))
}

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  const client = requireSupabase()
  const { data, error } = await client.from('orders').select('Orderno, SKU, order_qty')
  if (error) throw error
  const rows = (data || []) as Array<Record<string, unknown>>
  const skus = Array.from(new Set(rows.map((r) => text(r.SKU)).filter(Boolean)))
  const { data: skuRows, error: skuError } = skus.length ? await client.from('sku_master').select('SKU, Weight_g').in('SKU', skus) : { data: [], error: null }
  if (skuError) throw skuError
  const weights = new Map<string, number>((skuRows || []).map((r: Record<string, unknown>) => [text(r.SKU), number(r.Weight_g)] as [string, number]))
  return rows.map((row, index) => ({ id: `${text(row.Orderno)}-${index}`, poId: text(row.Orderno), poNumber: text(row.Orderno), sku: text(row.SKU), orderQty: number(row.order_qty), weightGrams: weights.get(text(row.SKU)) ?? null, warehousePincode: null, customerPincode: null, zone: '' }))
}

export async function getComplianceAnalytics(): Promise<ComplianceAnalytics> {
  const invoices = await getInvoices()
  const issues = new Map<string, IssueAggregate>()
  const ewayStatuses = new Map<string, StatusAggregate>()
  const gstTotals = { taxable: 0, cgst: 0, sgst: 0, igst: 0, total: 0 }
  invoices.forEach((invoice) => {
    const issue = text(invoice.ruleIssue).trim()
    if (issue) {
      const cur = issues.get(issue) || { issue, count: 0, value: 0 }
      cur.count += 1; cur.value += invoice.amount; issues.set(issue, cur)
    }
    const eway = text(invoice.eway_status).trim() || 'Not provided'
    const cs = ewayStatuses.get(eway) || { status: eway, count: 0, value: 0 }
    cs.count += 1; cs.value += invoice.amount; ewayStatuses.set(eway, cs)
    gstTotals.taxable += invoice.taxableValue
    gstTotals.cgst += invoice.cgstValue
    gstTotals.sgst += invoice.sgstValue
    gstTotals.igst += invoice.igstValue
    gstTotals.total += invoice.totalInvoiceValue
  })
  return { issues: Array.from(issues.values()).sort((a, b) => b.count - a.count), ewayStatuses: Array.from(ewayStatuses.values()).sort((a, b) => b.count - a.count), gstTotals }
}

// ─── GSTIN → vendor mapping ───
const GSTIN_TO_VENDOR_ID: Record<string, string> = {
  '33LMNOP9012Q1Z7': 'V003', '33ABCDE1234F1Z5': 'V001', '33FGHIJ5678K1Z2': 'V002',
  '33RSTUV3456W1Z8': 'V004', '33XYZAB7890C1Z9': 'V005',
}
const VENDOR_TO_SHIPMENT: Record<string, string> = { 'V001': 'SH001', 'V002': 'SH002', 'V003': 'SH003', 'V004': 'SH005', 'V005': 'SH006' }
const VENDOR_TO_PO: Record<string, string> = { 'V001': 'PO001', 'V002': 'PO002', 'V003': 'PO003', 'V005': 'PO004' }

export async function createInvoice(fields: any): Promise<Invoice> {
  const sellerGstin = text(fields.seller_gstin).toUpperCase()
  const vendorId = GSTIN_TO_VENDOR_ID[sellerGstin] || 'V003'
  const shipmentId = VENDOR_TO_SHIPMENT[vendorId] || 'SH003'
  const poId = VENDOR_TO_PO[vendorId] || 'PO003'

  const payload = {
    invoice_number: text(fields.invoice_no),
    vendor_id: vendorId,
    vendor_name: text(fields.seller_legal_name),
    gstin: sellerGstin,
    shipment_id: shipmentId,
    po_number: poId,
    invoice_date: text(fields.invoice_date),
    invoice_amount: number(fields.total_invoice_value),
    freight_amount: number(fields.taxable_value),
    freight_rate: 28,
    weight: number(fields.quantity),
    quantity: number(fields.quantity),
    fuel_surcharge: number(fields.cgst_value) + number(fields.sgst_value) + number(fields.igst_value),
    accessorial_charges: [],
    current_payment_amount: 0,
    currency: 'INR',
    hsn_sac: String(fields.hsn_code || '996511'),
    taxable_value: number(fields.taxable_value),
    cgst: number(fields.cgst_value),
    sgst: number(fields.sgst_value),
    igst: number(fields.igst_value),
    consignor_name: text(fields.seller_legal_name),
    consignee_name: text(fields.buyer_legal_name) || 'XYZ Traders',
    vehicle_number: text(fields.vehicle_no),
    goods_description: text(fields.item_description) || 'Goods',
    origin: text(fields.seller_location) || 'Unknown',
    destination: text(fields.buyer_location) || 'Unknown',
    eway_bill_number: String(fields.eway_bill_no || 'EWB0000000000'),
    eway_bill_date: text(fields.invoice_date),
    eway_bill_valid_until: text(fields.invoice_date),
  }

  console.log('POST /screen →', payload)

  const res = await fetch(SCREEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) throw new Error('Screening failed: ' + res.status)
  const data = await res.json()
  console.log('Full webhook response:', JSON.stringify(data).slice(0, 500))

  const screeningId = String(deepFind(data, 'screening_id') || '')
  const finalDecision = String(deepFind(data, 'final_decision') || 'PENDING')
  const summary = String(deepFind(data, 'summary') || '')
  const aiExplanation = String(deepFind(data, 'ai_explanation') || '')
  const invoiceNumber = String(deepFind(data, 'invoice_number') || payload.invoice_number)

  if (!screeningId) throw new Error('Webhook did not return a screening_id')

  const invoice: Invoice = {
    ...rowToInvoice({
      screening_id: screeningId,
      invoice_number: invoiceNumber,
      vendor_id: vendorId,
      vendor_name: payload.vendor_name,
      shipment_id: shipmentId,
      amount: payload.invoice_amount,
      decision: finalDecision,
      reason: summary,
      ai_explanation: aiExplanation,
      screened_at: new Date().toISOString(),
    }),
    sellerLegalName: text(fields.seller_legal_name),
    sellerGstin: sellerGstin,
    buyerLegalName: text(fields.buyer_legal_name),
    buyerGstin: text(fields.buyer_gstin),
    taxableValue: payload.taxable_value,
    gstRate: Number(fields.gst_rate) || 0,
    cgstValue: payload.cgst,
    sgstValue: payload.sgst,
    igstValue: payload.igst,
    totalInvoiceValue: payload.invoice_amount,
    ewayBillNo: payload.eway_bill_number,
    transportDocumentNo: text(fields.transport_document_no),
  }

  cacheSet(invoice)
  console.log('✓ Cached invoice:', invoice.id)

  return invoice
}

export async function getContracts(): Promise<Contract[]> { return [] }
export async function getShipments(): Promise<Shipment[]> { return [] }