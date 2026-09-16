import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { mockInvoices as fallbackInvoices } from '../data/manufacturingMockData'

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
}

export interface Vendor {
  id: string
  vendorId: string
  vendorName: string
  status: 'Approved' | 'Blocked' | 'Pending'
  taxId?: string
  gstNumber?: string
  address?: string
  invoiceCount: number
  totalValue: number
  contactEmail?: string
  contactPhone?: string
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
  if (!isSupabaseConfigured || !supabase) throw new Error('Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
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
  const ruleIssue = text(record.rule_issue)
  const expectedResult = text(record.expected_result)
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
    ruleIssue,
    expectedResult,
  }
}

async function getComplianceRows(): Promise<GovernmentComplianceRecord[]> {
  const client = requireSupabase()
  const { data, error } = await client.from('government_compliance').select('*').order('invoice_date', { ascending: false })
  if (error) throw error
  const rows = (data || []) as GovernmentComplianceRecord[]
  if (rows.length > 0) return rows

  // Keep the screens usable while the configured project is empty or RLS hides its rows.
  return fallbackInvoices.map((invoice) => ({
    record_id: invoice.invoiceId,
    invoice_no: invoice.invoiceId,
    invoice_date: invoice.date,
    seller_legal_name: invoice.vendorName,
    seller_gstin: invoice.vendorId,
    seller_location: '',
    seller_pincode: null,
    seller_state_code: null,
    buyer_legal_name: '',
    buyer_gstin: '',
    buyer_location: '',
    buyer_pincode: null,
    buyer_state_code: null,
    place_of_supply: null,
    supply_type: '',
    document_type: 'Invoice',
    reverse_charge: 'N',
    hsn_code: null,
    item_description: '',
    quantity: null,
    qty_unit: '',
    taxable_value: invoice.amount,
    gst_rate: null,
    cgst_value: 0,
    sgst_value: 0,
    igst_value: 0,
    total_invoice_value: invoice.amount,
    transporter_name: '',
    transporter_gstin: '',
    transport_mode: null,
    transport_distance_km: null,
    transport_document_no: invoice.shipmentId || '',
    transport_document_date: invoice.date,
    vehicle_no: '',
    eway_bill_no: null,
    eway_status: invoice.status === 'CLEAR' ? 'VALID' : '',
    eway_doc_no: '',
    eway_from_gstin: '',
    eway_to_gstin: '',
    eway_total_value: invoice.amount,
    eway_vehicle_no: '',
    rule_issue: invoice.triggeredRule || '',
    expected_result: invoice.status === 'BLOCKED' ? 'BLOCK' : invoice.status,
    data_type: 'demo_fallback',
  }))
}

export async function getInvoices(): Promise<Invoice[]> { return (await getComplianceRows()).map(toInvoice) }

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const client = requireSupabase()
  const { data, error } = await client.from('government_compliance').select('*').eq('record_id', id).maybeSingle()
  if (error) throw error
  if (data) return toInvoice(data as GovernmentComplianceRecord)
  const fallback = (await getComplianceRows()).find((row) => row.record_id === id)
  return fallback ? toInvoice(fallback) : null
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const invoices = await getInvoices()
  return {
    totalInvoices: invoices.length,
    pass: invoices.filter((invoice) => invoice.status === 'PASS').length,
    review: invoices.filter((invoice) => invoice.status === 'REVIEW').length,
    block: invoices.filter((invoice) => invoice.status === 'BLOCK').length,
    pending: invoices.filter((invoice) => invoice.status === 'PENDING').length,
    potentialOverbilling: invoices.filter((invoice) => invoice.status === 'REVIEW' || invoice.status === 'BLOCK').reduce((sum, invoice) => sum + invoice.amount, 0),
  }
}

export async function getVendors(): Promise<Vendor[]> {
  const invoices = await getInvoices()
  const vendors = new Map<string, Vendor>()
  invoices.forEach((invoice) => {
    const id = invoice.sellerGstin || invoice.sellerLegalName
    const current = vendors.get(id)
    if (current) {
      current.invoiceCount += 1
      current.totalValue += invoice.amount
      return
    }
    vendors.set(id, { id, vendorId: id, vendorName: invoice.sellerLegalName || id, status: 'Pending', taxId: invoice.sellerGstin, gstNumber: invoice.sellerGstin, address: invoice.seller_location, invoiceCount: 1, totalValue: invoice.amount })
  })
  return Array.from(vendors.values()).sort((a, b) => b.invoiceCount - a.invoiceCount)
}

export async function getVendorMonthlyAnalytics(): Promise<VendorMonthlyAggregate[]> {
  const invoices = await getInvoices()
  const grouped = new Map<string, VendorMonthlyAggregate>()

  invoices.forEach((invoice) => {
    const date = new Date(invoice.invoiceDate)
    if (Number.isNaN(date.getTime())) return
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const vendorId = invoice.sellerGstin || invoice.sellerLegalName || 'Unknown seller'
    const key = `${vendorId}:${month}`
    const current = grouped.get(key) || {
      vendorId,
      vendorName: invoice.sellerLegalName || vendorId,
      month,
      invoiceCount: 0,
      invoiceValue: 0,
      violations: 0,
    }
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
  const skus = Array.from(new Set(rows.map((row) => text(row.SKU)).filter(Boolean)))
  const { data: skuRows, error: skuError } = skus.length ? await client.from('sku_master').select('SKU, Weight_g').in('SKU', skus) : { data: [], error: null }
  if (skuError) throw skuError
  const weights = new Map<string, number>((skuRows || []).map((row: Record<string, unknown>) => [text(row.SKU), number(row.Weight_g)] as [string, number]))
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
      const current = issues.get(issue) || { issue, count: 0, value: 0 }
      current.count += 1
      current.value += invoice.amount
      issues.set(issue, current)
    }
    const eway = text(invoice.eway_status).trim() || 'Not provided'
    const currentStatus = ewayStatuses.get(eway) || { status: eway, count: 0, value: 0 }
    currentStatus.count += 1
    currentStatus.value += invoice.amount
    ewayStatuses.set(eway, currentStatus)
    gstTotals.taxable += invoice.taxableValue
    gstTotals.cgst += invoice.cgstValue
    gstTotals.sgst += invoice.sgstValue
    gstTotals.igst += invoice.igstValue
    gstTotals.total += invoice.totalInvoiceValue
  })
  return { issues: Array.from(issues.values()).sort((a, b) => b.count - a.count), ewayStatuses: Array.from(ewayStatuses.values()).sort((a, b) => b.count - a.count), gstTotals }
}

export async function createInvoice(fields: Partial<GovernmentComplianceRecord> & Record<string, unknown>): Promise<Invoice> {
  const client = requireSupabase()
  const record = { ...fields, record_id: fields.record_id || crypto.randomUUID(), data_type: fields.data_type || 'government_compliance' }
  const { data, error } = await client.from('government_compliance').insert(record).select('*').single()
  if (error) throw error
  return toInvoice(data as GovernmentComplianceRecord)
}

export async function getContracts(): Promise<Contract[]> { return [] }
export async function getShipments(): Promise<Shipment[]> { return [] }
