// Core decision types
export type Decision = 'CLEAR' | 'REVIEW' | 'BLOCK'
export type InvoiceStatus = 'CLEAR' | 'REVIEW' | 'BLOCKED' | 'PAID' | 'PENDING'
export type VendorStatus = 'Approved' | 'Blocked' | 'Pending'
export type ContractStatus = 'Active' | 'Expired'
export type POStatus = 'Active' | 'Closed' | 'Partially Used'
export type ShipmentStatus = 'Delivered' | 'In Transit' | 'Pending'

// Indian logistics mock data
export const mockVendors = [
  {
    vendorId: 'V-101',
    vendorName: 'ABC Logistics Pvt Ltd',
    status: 'Approved' as VendorStatus,
    contractId: 'C-100',
    invoiceCount: 45,
    shipmentCount: 52,
    contact: { name: 'Rajesh Kumar', phone: '+91 98765 43210' },
    gstin: '27AABCU9603R1ZM',
  },
  {
    vendorId: 'V-102',
    vendorName: 'XYZ Transport Services',
    status: 'Approved' as VendorStatus,
    contractId: 'C-101',
    invoiceCount: 38,
    shipmentCount: 41,
    contact: { name: 'Priya Sharma', phone: '+91 98765 43211' },
    gstin: '27AABCU9603R1ZN',
  },
  {
    vendorId: 'V-103',
    vendorName: 'Global Freight Solutions',
    status: 'Approved' as VendorStatus,
    contractId: 'C-102',
    invoiceCount: 67,
    shipmentCount: 73,
    contact: { name: 'Amit Patel', phone: '+91 98765 43212' },
    gstin: '27AABCU9603R1ZP',
  },
  {
    vendorId: 'V-104',
    vendorName: 'FastTrack Carriers',
    status: 'Blocked' as VendorStatus,
    contractId: 'C-103',
    invoiceCount: 12,
    shipmentCount: 15,
    contact: { name: 'Suresh Reddy', phone: '+91 98765 43213' },
    gstin: '27AABCU9603R1ZQ',
  },
  {
    vendorId: 'V-105',
    vendorName: 'SafeHaul Logistics',
    status: 'Pending' as VendorStatus,
    contractId: null,
    invoiceCount: 3,
    shipmentCount: 4,
    contact: { name: 'Anita Desai', phone: '+91 98765 43214' },
    gstin: '27AABCU9603R1ZR',
  },
]

export const mockContracts = [
  {
    contractId: 'C-100',
    vendorId: 'V-101',
    vendorName: 'ABC Logistics Pvt Ltd',
    freightRate: 25,
    fuelSurchargePercent: 5,
    contractValue: 5000000,
    used: 3245000,
    remaining: 1755000,
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    status: 'Active' as ContractStatus,
  },
  {
    contractId: 'C-101',
    vendorId: 'V-102',
    vendorName: 'XYZ Transport Services',
    freightRate: 28,
    fuelSurchargePercent: 5,
    contractValue: 3500000,
    used: 2800000,
    remaining: 700000,
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    status: 'Active' as ContractStatus,
  },
  {
    contractId: 'C-102',
    vendorId: 'V-103',
    vendorName: 'Global Freight Solutions',
    freightRate: 22,
    fuelSurchargePercent: 4,
    contractValue: 7500000,
    used: 4500000,
    remaining: 3000000,
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    status: 'Active' as ContractStatus,
  },
  {
    contractId: 'C-103',
    vendorId: 'V-104',
    vendorName: 'FastTrack Carriers',
    freightRate: 30,
    fuelSurchargePercent: 6,
    contractValue: 2000000,
    used: 1800000,
    remaining: 200000,
    validFrom: '2023-01-01',
    validTo: '2023-12-31',
    status: 'Expired' as ContractStatus,
  },
]

export const mockPurchaseOrders = [
  {
    poNumber: 'PO-3001',
    vendorId: 'V-101',
    vendorName: 'ABC Logistics Pvt Ltd',
    approved: 1500000,
    used: 1200000,
    remaining: 300000,
    status: 'Active' as POStatus,
  },
  {
    poNumber: 'PO-3002',
    vendorId: 'V-102',
    vendorName: 'XYZ Transport Services',
    approved: 800000,
    used: 750000,
    remaining: 50000,
    status: 'Active' as POStatus,
  },
  {
    poNumber: 'PO-3003',
    vendorId: 'V-103',
    vendorName: 'Global Freight Solutions',
    approved: 2000000,
    used: 1800000,
    remaining: 200000,
    status: 'Active' as POStatus,
  },
  {
    poNumber: 'PO-3004',
    vendorId: 'V-101',
    vendorName: 'ABC Logistics Pvt Ltd',
    approved: 1000000,
    used: 1000000,
    remaining: 0,
    status: 'Closed' as POStatus,
  },
]

export const mockShipments = [
  {
    shipmentId: 'SH-5001',
    vendorId: 'V-101',
    vendorName: 'ABC Logistics Pvt Ltd',
    origin: 'Mumbai',
    destination: 'Delhi',
    vehicle: 'MH-02-AB-1234',
    weight: 15000,
    quantity: 500,
    date: '2024-09-01',
    status: 'Delivered' as ShipmentStatus,
  },
  {
    shipmentId: 'SH-5002',
    vendorId: 'V-102',
    vendorName: 'XYZ Transport Services',
    origin: 'Chennai',
    destination: 'Bangalore',
    vehicle: 'TN-55-CD-5678',
    weight: 12000,
    quantity: 400,
    date: '2024-09-02',
    status: 'Delivered' as ShipmentStatus,
  },
  {
    shipmentId: 'SH-5003',
    vendorId: 'V-103',
    vendorName: 'Global Freight Solutions',
    origin: 'Pune',
    destination: 'Hyderabad',
    vehicle: 'MH-03-EF-9012',
    weight: 18000,
    quantity: 600,
    date: '2024-09-03',
    status: 'In Transit' as ShipmentStatus,
  },
  {
    shipmentId: 'SH-5004',
    vendorId: 'V-101',
    vendorName: 'ABC Logistics Pvt Ltd',
    origin: 'Ahmedabad',
    destination: 'Jaipur',
    vehicle: 'GJ-01-GH-3456',
    weight: 10000,
    quantity: 350,
    date: '2024-09-04',
    status: 'Pending' as ShipmentStatus,
  },
]

export const mockInvoices = [
  {
    invoiceId: 'INV-2024-0456',
    vendorId: 'V-101',
    vendorName: 'ABC Logistics Pvt Ltd',
    shipmentId: 'SH-5001',
    poNumber: 'PO-3001',
    amount: 125000,
    date: '2024-09-05',
    status: 'CLEAR' as InvoiceStatus,
    triggeredRule: null,
    paymentType: 'single' as 'single' | 'installments',
    numberOfInstallments: 1,
  },
  {
    invoiceId: 'INV-2024-0457',
    vendorId: 'V-102',
    vendorName: 'XYZ Transport Services',
    shipmentId: 'SH-5002',
    poNumber: 'PO-3002',
    amount: 145000,
    date: '2024-09-06',
    status: 'REVIEW' as InvoiceStatus,
    triggeredRule: 'R-02',
    paymentType: 'installments' as 'single' | 'installments',
    numberOfInstallments: 3,
  },
  {
    invoiceId: 'INV-2024-0458',
    vendorId: 'V-103',
    vendorName: 'Global Freight Solutions',
    shipmentId: 'SH-5003',
    poNumber: 'PO-3003',
    amount: 180000,
    date: '2024-09-07',
    status: 'BLOCKED' as InvoiceStatus,
    triggeredRule: 'R-09',
    paymentType: 'single' as 'single' | 'installments',
    numberOfInstallments: 1,
  },
  {
    invoiceId: 'INV-2024-0459',
    vendorId: 'V-101',
    vendorName: 'ABC Logistics Pvt Ltd',
    shipmentId: 'SH-5004',
    poNumber: 'PO-3001',
    amount: 95000,
    date: '2024-09-08',
    status: 'CLEAR' as InvoiceStatus,
    triggeredRule: null,
    paymentType: 'installments' as 'single' | 'installments',
    numberOfInstallments: 2,
  },
  {
    invoiceId: 'INV-2024-0460',
    vendorId: 'V-102',
    vendorName: 'XYZ Transport Services',
    shipmentId: 'SH-5002',
    poNumber: 'PO-3002',
    amount: 155000,
    date: '2024-09-09',
    status: 'BLOCKED' as InvoiceStatus,
    triggeredRule: 'R-01',
    paymentType: 'single' as 'single' | 'installments',
    numberOfInstallments: 1,
  },
]

// Compliance rules
export const complianceRules = [
  {
    id: 'R-01',
    name: 'Shipment Already Billed',
    description: 'Detects duplicate billing for the same shipment',
    severity: 'BLOCK' as Decision,
    threshold: null,
  },
  {
    id: 'R-02',
    name: 'Rate Mismatch',
    description: 'Invoice rate exceeds contract rate by allowed variance',
    severity: 'REVIEW' as Decision,
    threshold: 5,
  },
  {
    id: 'R-03',
    name: 'Unsupported Accessorial',
    description: 'Accessorial charges without supporting evidence',
    severity: 'REVIEW' as Decision,
    threshold: null,
  },
  {
    id: 'R-04',
    name: 'Cumulative Payment',
    description: 'Total payments exceed contract value',
    severity: 'BLOCK' as Decision,
    threshold: null,
  },
  {
    id: 'R-05',
    name: 'Shipment-Invoice Mismatch',
    description: 'Invoice details do not match shipment records',
    severity: 'BLOCK' as Decision,
    threshold: null,
  },
  {
    id: 'R-06',
    name: 'Weight / Quantity Mismatch',
    description: 'Weight/quantity variance exceeds tolerance',
    severity: 'REVIEW' as Decision,
    threshold: 5,
  },
  {
    id: 'R-07',
    name: 'Fuel Surcharge',
    description: 'Fuel surcharge exceeds allowed percentage',
    severity: 'REVIEW' as Decision,
    threshold: 3,
  },
  {
    id: 'R-08',
    name: 'Unverified Vendor',
    description: 'Invoice from unverified/blocked vendor',
    severity: 'BLOCK' as Decision,
    threshold: null,
  },
  {
    id: 'R-09',
    name: 'PO Balance',
    description: 'Invoice amount exceeds remaining PO balance',
    severity: 'BLOCK' as Decision,
    threshold: null,
  },
]

// Rule performance stats
export const rulePerformance = [
  { ruleId: 'R-01', violations: 3 },
  { ruleId: 'R-02', violations: 12 },
  { ruleId: 'R-03', violations: 8 },
  { ruleId: 'R-04', violations: 2 },
  { ruleId: 'R-05', violations: 4 },
  { ruleId: 'R-06', violations: 6 },
  { ruleId: 'R-07', violations: 3 },
  { ruleId: 'R-08', violations: 2 },
  { ruleId: 'R-09', violations: 5 },
]

// Dashboard stats
export const dashboardStats = {
  totalInvoices: 250,
  clear: 218,
  review: 24,
  blocked: 8,
  potentialOverbilling: 482500,
}

// Vendor risk data
export const vendorRiskData = [
  { vendorName: 'XYZ Transport Services', issues: 8, riskStatus: 'High' },
  { vendorName: 'FastTrack Carriers', issues: 5, riskStatus: 'Medium' },
  { vendorName: 'ABC Logistics Pvt Ltd', issues: 2, riskStatus: 'Low' },
  { vendorName: 'Global Freight Solutions', issues: 3, riskStatus: 'Low' },
]

// Sample screening result data for R-04 (installment check)
export const sampleInstallmentScreeningResult = {
  invoiceId: 'INV-2024-0461',
  shipmentId: 'SH-5002',
  vendorId: 'V-102',
  vendorName: 'XYZ Transport Services',
  decision: 'BLOCK' as Decision,
  paymentType: 'installments' as 'single' | 'installments',
  numberOfInstallments: 3,
  triggeredRule: 'R-04',
  ruleEvaluation: [
    { ruleId: 'R-01', status: 'PASS' },
    { ruleId: 'R-02', status: 'PASS' },
    { ruleId: 'R-03', status: 'PASS' },
    { ruleId: 'R-04', status: 'BLOCK' },
    { ruleId: 'R-05', status: 'PASS' },
    { ruleId: 'R-06', status: 'PASS' },
    { ruleId: 'R-07', status: 'PASS' },
    { ruleId: 'R-08', status: 'PASS' },
    { ruleId: 'R-09', status: 'PASS' },
  ],
  explanation: {
    ruleId: 'R-04',
    ruleName: 'Cumulative Payment Check',
    installmentsDeclared: 3,
    installmentAmounts: [11266, 11267, 11267],
    sumOfInstallments: 33800,
    priorPaymentsOnContract: 420000,
    contractValue: 450000,
    remainingAfterThisInvoice: -3800,
    decision: 'BLOCK',
  },
  evidence: [
    { type: 'Contract', id: 'C-101', status: 'Available' },
    { type: 'Shipment', id: 'SH-5002', status: 'Available' },
    { type: 'Vendor', id: 'V-102', status: 'Available' },
    { type: 'PO', id: 'PO-3002', status: 'Available' },
  ],
}

// Sample screening result data
export const sampleScreeningResult = {
  invoiceId: 'INV-2024-0457',
  shipmentId: 'SH-5002',
  vendorId: 'V-102',
  vendorName: 'XYZ Transport Services',
  decision: 'REVIEW' as Decision,
  paymentType: 'single' as 'single' | 'installments',
  numberOfInstallments: 1,
  triggeredRule: 'R-02',
  ruleEvaluation: [
    { ruleId: 'R-01', status: 'PASS' },
    { ruleId: 'R-02', status: 'REVIEW' },
    { ruleId: 'R-03', status: 'PASS' },
    { ruleId: 'R-04', status: 'PASS' },
    { ruleId: 'R-05', status: 'PASS' },
    { ruleId: 'R-06', status: 'PASS' },
    { ruleId: 'R-07', status: 'PASS' },
    { ruleId: 'R-08', status: 'PASS' },
    { ruleId: 'R-09', status: 'PASS' },
  ],
  explanation: {
    ruleId: 'R-02',
    ruleName: 'Rate Mismatch',
    invoiceRate: 28,
    contractRate: 25,
    allowedVariance: 5,
    actualVariance: 12,
    decision: 'REVIEW',
  },
  evidence: [
    { type: 'Contract', id: 'C-101', status: 'Available' },
    { type: 'Shipment', id: 'SH-5002', status: 'Available' },
    { type: 'Vendor', id: 'V-102', status: 'Available' },
    { type: 'PO', id: 'PO-3002', status: 'Available' },
  ],
}

// Database connection status
export const dbConnections = [
  { name: 'Vendor Master', status: 'Connected' },
  { name: 'Shipment/TMS', status: 'Connected' },
  { name: 'Contract/PO', status: 'Connected' },
  { name: 'Payment History', status: 'Connected' },
]

// External services status
export const externalServices = [
  { name: 'Fuel Price API', status: 'Not configured' },
  { name: 'E-way Bill', status: 'Not configured' },
  { name: 'Document Verification', status: 'Not configured' },
]

// Users
export const users = [
  { name: 'Finance Team', role: 'Finance Team', email: 'finance@company.com' },
  { name: 'Compliance Team', role: 'Compliance Team', email: 'compliance@company.com' },
  { name: 'Admin User', role: 'Admin', email: 'admin@company.com' },
]