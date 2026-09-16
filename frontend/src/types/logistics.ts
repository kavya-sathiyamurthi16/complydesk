// Core decision types - Deterministic rule engine
export type Decision = 'CLEAR' | 'REVIEW' | 'BLOCK'

// Logistics invoice screening request
export interface LogisticsInvoiceScreeningRequest {
  invoiceFile?: File
  invoiceNumber?: string
  invoiceDate?: string
  vendorId?: string
  vendorName?: string
  shipmentId?: string
  poNumber?: string
  contractNumber?: string
}

// Standardized invoice data after extraction
export interface StandardizedInvoiceData {
  invoiceDetails: {
    invoiceNumber: string
    invoiceDate: string
    vendor: {
      vendorId: string
      vendorName: string
      gstin: string
    }
    invoiceAmount: number
    poNumber?: string
  }
  shipmentDetails: {
    shipmentId: string
    origin: string
    destination: string
    vehicle: string
    weight: number
    distance: number
  }
  charges: {
    freight: number
    fuelSurcharge: number
    accessorialCharges: number
    tax: number
    totalAmount: number
  }
  contractPO: {
    contractValue?: number
    poValue?: number
    agreedRate?: number
    remainingBalance?: number
  }
  payment: {
    previousPayments?: number
    currentInvoice: number
    cumulativePayment?: number
    installmentNumber?: number
  }
}

// Compliance screening check results
export interface ScreeningCheck {
  name: string
  status: 'PASS' | 'FLAG'
  evidence?: string
  details?: Record<string, unknown>
}

// Compliance rule definitions
export interface ComplianceRule {
  id: string
  name: string
  description: string
  condition: string
  severity: 'BLOCK' | 'REVIEW' | 'PASS'
  category: 'compliance' | 'validation'
  status: 'Active'
}

// Logistics invoice screening response
export interface LogisticsInvoiceScreeningResponse {
  screeningId: string
  decision: Decision
  triggeredRule: ComplianceRule | null
  explanation: string
  checks: ScreeningCheck[]
  standardizedData: StandardizedInvoiceData
  timestamp: string
}

// Vendor information
export interface LogisticsVendor {
  vendorId: string
  vendorName: string
  gstin: string
  status: 'Verified' | 'Pending' | 'Unverified'
  totalInvoices: number
  blockedInvoices: number
  lastInvoice?: string
  averageInvoiceAmount?: number
}

// Shipment information
export interface Shipment {
  shipmentId: string
  vendor: {
    vendorId: string
    vendorName: string
  }
  origin: string
  destination: string
  weight: number
  vehicle: string
  poNumber?: string
  billingStatus: 'Not Billed' | 'Partially Billed' | 'Fully Billed'
  shipmentDate: string
  deliveryDate?: string
}

// Invoice history record
export interface InvoiceHistoryRecord {
  screeningId: string
  invoiceNumber: string
  vendor: {
    vendorId: string
    vendorName: string
  }
  shipmentId: string
  invoiceDate: string
  invoiceAmount: number
  decision: Decision
  triggeredRule: ComplianceRule | null
  status: 'Paid' | 'Pending' | 'Rejected'
  timestamp: string
}

// Audit log record
export interface AuditLogRecord {
  timestamp: string
  invoiceNumber: string
  action: string
  rule: string
  decision: Decision
  evidence: string
  processedBy: string
}

// Processing stages
export type ProcessingStage = 
  | 'Invoice Uploaded'
  | 'Data Extracted'
  | 'Data Standardized'
  | 'Supporting Data Retrieved'
  | 'Compliance Rules Evaluated'
  | 'Decision Generated'

// Upload status
export type UploadStatus = 'idle' | 'uploading' | 'uploaded' | 'processing' | 'completed' | 'error'

// API configuration
export interface ApiConfig {
  baseUrl: string
  timeout: number
  headers: Record<string, string>
}