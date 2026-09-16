// Compliance rules service - These are deterministic rules stored in code
// They can be moved to a database table if needed

export type Decision = 'PASS' | 'REVIEW' | 'BLOCK'

export type RuleCategory = 'BUSINESS_OPERATIONAL' | 'GOVERNMENT_REGULATORY'

export interface ComplianceRule {
  id: string
  name: string
  description: string
  severity: Decision
  category: RuleCategory
  threshold: number | null
}

export const complianceRules: ComplianceRule[] = [
  // BUSINESS / OPERATIONAL RULES (R-01 to R-09)
  {
    id: 'R-01',
    name: 'Shipment Already Billed',
    description: 'Detect whether the same shipment has already been invoiced/billed',
    severity: 'BLOCK',
    category: 'BUSINESS_OPERATIONAL',
    threshold: null,
  },
  {
    id: 'R-02',
    name: 'Rate Mismatch',
    description: 'Compare invoice freight/rate against the approved contract or rate card',
    severity: 'REVIEW',
    category: 'BUSINESS_OPERATIONAL',
    threshold: null,
  },
  {
    id: 'R-03',
    name: 'Unsupported Accessorial Charge',
    description: 'Detect additional charges such as loading, detention, tolls, etc. without supporting records or approval',
    severity: 'REVIEW',
    category: 'BUSINESS_OPERATIONAL',
    threshold: null,
  },
  {
    id: 'R-04',
    name: 'Shipment / Invoice / Vendor ID / PO Mismatch or Missing',
    description: 'Check whether required identifiers exist and match the corresponding records',
    severity: 'BLOCK',
    category: 'BUSINESS_OPERATIONAL',
    threshold: null,
  },
  {
    id: 'R-05',
    name: 'Weight / Quantity Mismatch',
    description: 'Compare billed weight/quantity with shipment records and flag values beyond the permitted tolerance',
    severity: 'REVIEW',
    category: 'BUSINESS_OPERATIONAL',
    threshold: null,
  },
  {
    id: 'R-06',
    name: 'Fuel Surcharge Mismatch',
    description: 'Compare the fuel surcharge against the agreed contract/rate-card calculation',
    severity: 'REVIEW',
    category: 'BUSINESS_OPERATIONAL',
    threshold: null,
  },
  {
    id: 'R-07',
    name: 'Unverified Vendor',
    description: 'Verify the vendor against the approved vendor master',
    severity: 'BLOCK',
    category: 'BUSINESS_OPERATIONAL',
    threshold: null,
  },
  {
    id: 'R-08',
    name: 'Amount / PO Balance Mismatch',
    description: 'Check whether the invoice amount exceeds or conflicts with the available approved PO/contract balance',
    severity: 'REVIEW',
    category: 'BUSINESS_OPERATIONAL',
    threshold: null,
  },
  {
    id: 'R-09',
    name: 'Installment / Cumulative Payment Check',
    description: 'Check whether the current invoice causes cumulative billed/paid amount to exceed agreed payment/contract terms',
    severity: 'REVIEW',
    category: 'BUSINESS_OPERATIONAL',
    threshold: null,
  },
  // GOVERNMENT / REGULATORY RULES (R-10 to R-12)
  {
    id: 'R-10',
    name: 'GST Invoice Compliance',
    description: 'Check mandatory GST invoice information such as GSTIN, invoice number/date, HSN/SAC, taxable value and applicable tax details',
    severity: 'BLOCK',
    category: 'GOVERNMENT_REGULATORY',
    threshold: null,
  },
  {
    id: 'R-11',
    name: 'GTA / Transport Invoice Compliance',
    description: 'Check required transportation information such as consignor, consignee, vehicle number, goods details, origin, destination and applicable GST information',
    severity: 'BLOCK',
    category: 'GOVERNMENT_REGULATORY',
    threshold: null,
  },
  {
    id: 'R-12',
    name: 'E-Way Bill Compliance',
    description: 'Where applicable, verify that the e-way bill exists and that important details match the invoice/shipment',
    severity: 'BLOCK',
    category: 'GOVERNMENT_REGULATORY',
    threshold: null,
  },
]

export function getComplianceRules(): ComplianceRule[] {
  return complianceRules
}

export function getBusinessOperationalRules(): ComplianceRule[] {
  return complianceRules.filter(rule => rule.category === 'BUSINESS_OPERATIONAL')
}

export function getGovernmentRegulatoryRules(): ComplianceRule[] {
  return complianceRules.filter(rule => rule.category === 'GOVERNMENT_REGULATORY')
}

export function getRuleById(ruleId: string): ComplianceRule | undefined {
  return complianceRules.find(rule => rule.id === ruleId)
}

// Rule performance data - in production this would come from analytics/database
export interface RulePerformance {
  ruleId: string
  violations: number
}

export const rulePerformance: RulePerformance[] = [
  { ruleId: 'R-01', violations: 0 },
  { ruleId: 'R-02', violations: 0 },
  { ruleId: 'R-03', violations: 0 },
  { ruleId: 'R-04', violations: 0 },
  { ruleId: 'R-05', violations: 0 },
  { ruleId: 'R-06', violations: 0 },
  { ruleId: 'R-07', violations: 0 },
  { ruleId: 'R-08', violations: 0 },
  { ruleId: 'R-09', violations: 0 },
  { ruleId: 'R-10', violations: 0 },
  { ruleId: 'R-11', violations: 0 },
  { ruleId: 'R-12', violations: 0 },
]

export function getRulePerformance(): RulePerformance[] {
  return rulePerformance
}