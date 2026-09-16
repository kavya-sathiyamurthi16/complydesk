// Supabase database types based on the provided schema

export type VendorStatus = 'active' | 'inactive' | 'suspended'
export type ContractStatus = 'active' | 'expired'
export type POStatus = 'active' | 'closed' | 'partially_used'
export type ShipmentStatus = 'Available' | 'Missing'
export type InvoiceStatus = 'pending' | 'screened'
export type PaymentType = 'single' | 'installments'
export type InstallmentStatus = 'pending' | 'paid'
export type EvidenceStatus = 'Available' | 'Missing' | 'Linked'
export type ScreeningDecision = 'CLEAR' | 'REVIEW' | 'BLOCK'

export interface Vendor {
  vendor_id: string
  vendor_name: string
  tax_id?: string
  gst_number?: string
  registration_status: VendorStatus
  approved: boolean
  onboarded_date?: string
  contact_email?: string
  contact_phone?: string
  address?: string
  created_at: string
}

export interface Contract {
  contract_id: string
  vendor_id: string
  contract_number: string
  agreed_rate: number
  rate_unit: 'per_km' | 'per_kg' | 'flat'
  fuel_surcharge_pct: number
  cumulative_limit?: number
  valid_from?: string
  valid_to?: string
  created_at: string
}

export interface PurchaseOrder {
  po_id: string
  contract_id?: string
  vendor_id: string
  po_number: string
  po_value: number
  balance_remaining: number
  valid_from?: string
  valid_to?: string
  created_at: string
}

export interface Shipment {
  shipment_id: string
  vendor_id: string
  po_id?: string
  origin?: string
  destination?: string
  vehicle_number?: string
  shipment_date?: string
  weight_kg?: number
  quantity?: number
  pod_status: ShipmentStatus
  already_billed: boolean
  created_at: string
}

export interface Invoice {
  invoice_id: string
  invoice_number: string
  invoice_date: string
  vendor_id: string
  shipment_id?: string
  po_id?: string
  po_number?: string
  currency: string
  origin?: string
  destination?: string
  vehicle_number?: string
  shipment_date?: string
  weight_kg?: number
  quantity?: number
  freight_amount: number
  fuel_surcharge_amount: number
  toll_amount: number
  detention_amount: number
  loading_amount: number
  redelivery_amount: number
  total_amount: number
  payment_type: PaymentType
  status: InvoiceStatus
  seed_note?: string
  created_at: string
}

export interface Installment {
  installment_id: string
  invoice_id: string
  installment_number: number
  amount: number
  due_date: string
  status: InstallmentStatus
}

export interface Evidence {
  evidence_id: string
  invoice_id: string
  evidence_type: 'POD Document' | 'Shipment Record' | 'Contract' | 'Toll Evidence' | 'Detention Evidence' | 'Loading Evidence'
  status: EvidenceStatus
  file_url?: string
  created_at: string
}

export interface Screening {
  screening_id: string
  invoice_id: string
  decision: ScreeningDecision
  triggered_rules: any
  primary_rule_id?: string
  evidence: any
  explanation?: string
  screened_at: string
  agent_run_id?: string
}

// Joined types for UI components
export interface VendorWithDetails extends Vendor {
  contracts?: Contract[]
  invoice_count?: number
  shipment_count?: number
  invoices?: Array<{ count: number }>
  shipments?: Array<{ count: number }>
}

export interface InvoiceWithDetails extends Invoice {
  vendor?: Vendor
  shipment?: Shipment
  contract?: Contract
  installments?: Installment[]
  screening?: Screening
}

export interface DashboardStats {
  total_invoices: number
  clear: number
  review: number
  block: number
  potential_overbilling: number
}