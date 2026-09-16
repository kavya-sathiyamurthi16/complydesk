import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type {
  Vendor,
  Contract,
  PurchaseOrder,
  Shipment,
  Invoice,
  Installment,
  Evidence,
  Screening,
  InvoiceWithDetails,
  VendorWithDetails,
  DashboardStats
} from '../types/supabase'

function checkSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Please check your .env file.')
  }
}

// ============================================================================
// VENDORS
// ============================================================================

export async function getVendors(): Promise<Vendor[]> {
  checkSupabase()
  
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getVendorById(vendorId: string): Promise<Vendor | null> {
  checkSupabase()
  
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('vendor_id', vendorId)
    .single()

  if (error) throw error
  return data
}

export async function createInvoice(invoiceData: Partial<Invoice>): Promise<Invoice> {
  const { data, error } = await supabase
    .from('invoices')
    .insert({
      invoice_id: invoiceData.invoice_id,
      invoice_number: invoiceData.invoice_number || invoiceData.invoice_id,
      invoice_date: invoiceData.invoice_date,
      vendor_id: invoiceData.vendor_id,
      shipment_id: invoiceData.shipment_id,
      po_id: invoiceData.po_id,
      po_number: invoiceData.po_number,
      currency: invoiceData.currency,
      origin: invoiceData.origin,
      destination: invoiceData.destination,
      vehicle_number: invoiceData.vehicle_number,
      shipment_date: invoiceData.shipment_date,
      weight_kg: invoiceData.weight_kg,
      quantity: invoiceData.quantity,
      freight_amount: invoiceData.freight_amount,
      fuel_surcharge_amount: invoiceData.fuel_surcharge_amount,
      toll_amount: invoiceData.toll_amount,
      detention_amount: invoiceData.detention_amount,
      loading_amount: invoiceData.loading_amount,
      redelivery_amount: invoiceData.redelivery_amount,
      total_amount: invoiceData.total_amount,
      payment_type: invoiceData.payment_type,
      status: invoiceData.status || 'pending',
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function createGovernmentComplianceInvoice(record: Record<string, unknown>) {
  checkSupabase()

  const { data, error } = await supabase
    .from('government_compliance')
    .insert(record)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getVendorsWithDetails(): Promise<VendorWithDetails[]> {
  const { data: vendors, error: vendorsError } = await supabase
    .from('vendors')
    .select('*')
    .order('created_at', { ascending: false })

  if (vendorsError) throw vendorsError

  // Get counts for each vendor
  const vendorsWithCounts = await Promise.all(
    (vendors || []).map(async (vendor: Vendor) => {
      const [invoicesCount, shipmentsCount] = await Promise.all([
        supabase.from('invoices').select('*', { count: 'exact', head: true }).eq('vendor_id', vendor.vendor_id),
        supabase.from('shipments').select('*', { count: 'exact', head: true }).eq('vendor_id', vendor.vendor_id),
      ])

      return {
        ...vendor,
        invoice_count: invoicesCount.count || 0,
        shipment_count: shipmentsCount.count || 0,
      }
    })
  )

  return vendorsWithCounts
}

// ============================================================================
// CONTRACTS
// ============================================================================

export async function getContracts(): Promise<Contract[]> {
  checkSupabase()
  
  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getContractById(contractId: string): Promise<Contract | null> {
  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .eq('contract_id', contractId)
    .single()

  if (error) throw error
  return data
}

export async function getContractsByVendor(vendorId: string): Promise<Contract[]> {
  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getContractsWithVendors(): Promise<Contract[]> {
  const { data, error } = await supabase
    .from('contracts')
    .select(`
      *,
      vendor:vendor_id(vendor_name)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// ============================================================================
// PURCHASE ORDERS
// ============================================================================

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  checkSupabase()
  
  const { data, error } = await supabase
    .from('purchase_orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getPurchaseOrderById(poId: string): Promise<PurchaseOrder | null> {
  const { data, error } = await supabase
    .from('purchase_orders')
    .select('*')
    .eq('po_id', poId)
    .single()

  if (error) throw error
  return data
}

export async function getPurchaseOrdersByVendor(vendorId: string): Promise<PurchaseOrder[]> {
  const { data, error } = await supabase
    .from('purchase_orders')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getPurchaseOrdersWithVendors(): Promise<PurchaseOrder[]> {
  const { data, error } = await supabase
    .from('purchase_orders')
    .select(`
      *,
      vendor:vendor_id(vendor_name)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// ============================================================================
// SHIPMENTS
// ============================================================================

export async function getShipments(): Promise<Shipment[]> {
  checkSupabase()
  
  const { data, error } = await supabase
    .from('shipments')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getShipmentById(shipmentId: string): Promise<Shipment | null> {
  const { data, error } = await supabase
    .from('shipments')
    .select('*')
    .eq('shipment_id', shipmentId)
    .single()

  if (error) throw error
  return data
}

export async function getShipmentsByVendor(vendorId: string): Promise<Shipment[]> {
  const { data, error } = await supabase
    .from('shipments')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// ============================================================================
// INVOICES
// ============================================================================

export async function getInvoices(): Promise<Invoice[]> {
  checkSupabase()
  
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getInvoiceById(invoiceId: string): Promise<Invoice | null> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('invoice_id', invoiceId)
    .single()

  if (error) throw error
  return data
}

export async function getInvoicesWithDetails(): Promise<InvoiceWithDetails[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      vendor:vendor_id(*),
      shipment:shipment_id(*),
      contract:contract_id(*),
      installments(*),
      screening:screenings(*)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getInvoicesByVendor(vendorId: string): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getInvoicesByShipment(shipmentId: string): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('shipment_id', shipmentId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function updateInvoice(invoiceId: string, updates: Partial<Invoice>): Promise<Invoice> {
  const { data, error } = await supabase
    .from('invoices')
    .update(updates)
    .eq('invoice_id', invoiceId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteInvoice(invoiceId: string): Promise<void> {
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('invoice_id', invoiceId)

  if (error) throw error
}

// ============================================================================
// INSTALLMENTS
// ============================================================================

export async function getInstallmentsByInvoice(invoiceId: string): Promise<Installment[]> {
  const { data, error } = await supabase
    .from('installments')
    .select('*')
    .eq('invoice_id', invoiceId)
    .order('installment_number', { ascending: true })

  if (error) throw error
  return data || []
}

export async function createInstallment(installment: Partial<Installment>): Promise<Installment> {
  const { data, error } = await supabase
    .from('installments')
    .insert(installment)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function createInstallmentsBatch(installments: Partial<Installment>[]): Promise<Installment[]> {
  const { data, error } = await supabase
    .from('installments')
    .insert(installments)
    .select()

  if (error) throw error
  return data || []
}

// ============================================================================
// EVIDENCE
// ============================================================================

export async function getEvidenceByInvoice(invoiceId: string): Promise<Evidence[]> {
  const { data, error } = await supabase
    .from('evidence')
    .select('*')
    .eq('invoice_id', invoiceId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createEvidence(evidence: Partial<Evidence>): Promise<Evidence> {
  const { data, error } = await supabase
    .from('evidence')
    .insert(evidence)
    .select()
    .single()

  if (error) throw error
  return data
}

// ============================================================================
// SCREENINGS
// ============================================================================

export async function getScreenings(): Promise<Screening[]> {
  const { data, error } = await supabase
    .from('screenings')
    .select('*')
    .order('screened_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getScreeningById(screeningId: string): Promise<Screening | null> {
  const { data, error } = await supabase
    .from('screenings')
    .select('*')
    .eq('screening_id', screeningId)
    .single()

  if (error) throw error
  return data
}

export async function getScreeningByInvoice(invoiceId: string): Promise<Screening | null> {
  const { data, error } = await supabase
    .from('screenings')
    .select('*')
    .eq('invoice_id', invoiceId)
    .single()

  if (error) throw error
  return data
}

export async function createScreening(screening: Partial<Screening>): Promise<Screening> {
  const { data, error } = await supabase
    .from('screenings')
    .insert(screening)
    .select()
    .single()

  if (error) throw error
  return data
}

// ============================================================================
// DASHBOARD STATS
// ============================================================================

export async function getDashboardStats(): Promise<DashboardStats> {
  // Get total invoices
  const { count: totalInvoices, error: totalError } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })

  if (totalError) throw totalError

  // Get screenings by decision
  const { data: screenings, error: screeningsError } = await supabase
    .from('screenings')
    .select('decision')

  if (screeningsError) throw screeningsError

  const clear = screenings?.filter((s: any) => s.decision === 'CLEAR').length || 0
  const review = screenings?.filter((s: any) => s.decision === 'REVIEW').length || 0
  const block = screenings?.filter((s: any) => s.decision === 'BLOCK').length || 0

  // Calculate potential overbilling (BLOCK and REVIEW decisions)
  const { data: blockedInvoices, error: blockedError } = await supabase
    .from('screenings')
    .select('invoice_id')
    .in('decision', ['BLOCK', 'REVIEW'])

  if (blockedError) throw blockedError

  const invoiceIds = blockedInvoices?.map((s: any) => s.invoice_id) || []
  let potentialOverbilling = 0

  if (invoiceIds.length > 0) {
    const { data: invoiceAmounts, error: amountsError } = await supabase
      .from('invoices')
      .select('total_amount')
      .in('invoice_id', invoiceIds)

    if (amountsError) throw amountsError
    potentialOverbilling = invoiceAmounts?.reduce((sum: number, inv: any) => sum + (inv.total_amount || 0), 0) || 0
  }

  return {
    total_invoices: totalInvoices || 0,
    clear,
    review,
    block,
    potential_overbilling: potentialOverbilling
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export async function getInvoiceWithFullDetails(invoiceId: string): Promise<InvoiceWithDetails | null> {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      vendor:vendor_id(*),
      shipment:shipment_id(*),
      contract:contract_id(*),
      installments(*),
      evidence:evidence(*),
      screening:screenings(*)
    `)
    .eq('invoice_id', invoiceId)
    .single()

  if (error) throw error
  return data
}