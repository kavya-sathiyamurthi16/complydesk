// Core decision types - Deterministic rule engine
export type Decision = 'PASS' | 'REVIEW' | 'BLOCK' | 'PENDING'
export type InvoiceStatus = 'PASS' | 'REVIEW' | 'BLOCK' | 'PAID' | 'PENDING'
export type VendorStatus = 'Approved' | 'Blocked' | 'Pending'
export type ContractStatus = 'Active' | 'Expired'
export type POStatus = 'Active' | 'Closed' | 'Partially Used'
export type ShipmentStatus = 'Delivered' | 'In Transit' | 'Pending'

// Manufacturing finance vendor
export interface Vendor {
  vendorId: string
  vendorName: string
  status: VendorStatus
  contractId: string | null
  invoiceCount: number
  shipmentCount: number
  contact: {
    name: string
    phone: string
  }
  gstin: string
}

// Contract information
export interface Contract {
  contractId: string
  vendorId: string
  vendorName: string
  freightRate: number
  fuelSurchargePercent: number
  contractValue: number
  used: number
  remaining: number
  validFrom: string
  validTo: string
  status: ContractStatus
}

// Purchase order
export interface PurchaseOrder {
  poNumber: string
  vendorId: string
  vendorName: string
  approved: number
  used: number
  remaining: number
  status: POStatus
}

// Shipment
export interface Shipment {
  shipmentId: string
  vendorId: string
  vendorName: string
  origin: string
  destination: string
  vehicle: string
  weight: number
  quantity: number
  date: string
  status: ShipmentStatus
}

// Invoice
export interface Invoice {
  invoiceId: string
  vendorId: string
  vendorName: string
  shipmentId: string
  poNumber: string
  amount: number
  date: string
  status: InvoiceStatus
  triggeredRule: string | null
}

// Compliance rule
export interface ComplianceRule {
  id: string
  name: string
  description: string
  severity: Decision
  threshold: number | null
}

// Rule evaluation result
export interface RuleEvaluation {
  ruleId: string
  status: 'PASS' | 'REVIEW' | 'BLOCK'
}

// Screening result
export interface ScreeningResult {
  invoiceId: string
  shipmentId: string
  vendorId: string
  vendorName: string
  decision: Decision
  triggeredRule: string
  ruleEvaluation: RuleEvaluation[]
  explanation: {
    ruleId: string
    ruleName: string
    invoiceRate: number
    contractRate: number
    allowedVariance: number
    actualVariance: number
    decision: Decision
  }
  evidence: Array<{
    type: string
    id: string
    status: string
  }>
}

// Rule performance
export interface RulePerformance {
  ruleId: string
  violations: number
}

// Vendor risk
export interface VendorRisk {
  vendorName: string
  issues: number
  riskStatus: 'Low' | 'Medium' | 'High'
}

// Database connection
export interface DBConnection {
  name: string
  status: 'Connected' | 'Disconnected'
}

// External service
export interface ExternalService {
  name: string
  status: 'Connected' | 'Not configured'
}

// User
export interface User {
  name: string
  role: string
  email: string
}