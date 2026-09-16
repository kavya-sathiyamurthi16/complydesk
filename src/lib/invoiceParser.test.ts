import test from 'node:test'
import assert from 'node:assert/strict'

import { parseInvoiceText } from './invoiceParser.ts'

test('extracts invoice fields from OCR text', () => {
  const text = `
    TAX INVOICE
    Invoice No: INV-2024-NEW
    Date: 09/15/2026
    Seller: ABC Manufacturing Pvt Ltd
    GSTIN: 29ABCDE1234F1Z5
    Buyer: Complydesk Industries
    Buyer GSTIN: 29XYZDE5678F1Z2
    PO No: PO-3001
    Taxable Value: 950000
    GST Rate: 18%
    CGST: 85500
    SGST: 85500
    Total: 1121000
    E-Way Bill No: EWB-9876543210
  `

  const parsed = parseInvoiceText(text)

  assert.equal(parsed.invoiceNumber, 'INV-2024-NEW')
  assert.equal(parsed.invoiceDate, '2026-09-15')
  assert.equal(parsed.sellerLegalName, 'ABC Manufacturing Pvt Ltd')
  assert.equal(parsed.sellerGstin, '29ABCDE1234F1Z5')
  assert.equal(parsed.buyerLegalName, 'Complydesk Industries')
  assert.equal(parsed.buyerGstin, '29XYZDE5678F1Z2')
  assert.equal(parsed.poNumber, 'PO-3001')
  assert.equal(parsed.taxableValue, '950000')
  assert.equal(parsed.gstRate, '18')
  assert.equal(parsed.cgstValue, '85500')
  assert.equal(parsed.sgstValue, '85500')
  assert.equal(parsed.totalInvoiceValue, '1121000')
  assert.equal(parsed.ewayBillNo, 'EWB-9876543210')
})

test('handles common OCR punctuation and date formats from PDF scans', () => {
  const text = `
    TAX INVOICE
    Invoice No. INV-2024-NEW
    Bill Date: 15.09.2026
    Seller Legal Name: ABC Manufacturing Pvt Ltd
    GSTIN: 29ABCDE1234F1Z5
    Buyer Name: Complydesk Industries
    Buyer GSTIN: 29XYZDE5678F1Z2
    Total Amount: 11,21,000
    E-Way Bill No: EWB-9876543210
  `

  const parsed = parseInvoiceText(text)

  assert.equal(parsed.invoiceNumber, 'INV-2024-NEW')
  assert.equal(parsed.invoiceDate, '2026-09-15')
  assert.equal(parsed.sellerLegalName, 'ABC Manufacturing Pvt Ltd')
  assert.equal(parsed.buyerLegalName, 'Complydesk Industries')
  assert.equal(parsed.totalInvoiceValue, '1121000')
  assert.equal(parsed.ewayBillNo, 'EWB-9876543210')
})

test('extracts the attached freight bill layout', () => {
  const text = `
    SELLER (SUPPLIER) DETAILS BUYER (RECIPIENT) DETAILS
    Legal Name : Apex Logistics India Pvt Ltd Legal Name : Precision Machinery Corp
    GSTIN : 33AAACA1234Z1 GSTIN : 29BBBCC56782Z2
    INVOICE DETAILS SUPPLY DETAILS
    Invoice No : INV/2026/FTL-089 Invoice Date : 16/09/2026
    HSN Code : 996511 1 TRIP
    Desc : Interstate Heavy Goods Transport (24ft Container Truck)
    Taxable Value: ₹45,000.00 GST Rate : 12%
    CGST Value : ₹0.00 SGST Value : ₹0.00
    TOTAL Value: ₹5,400.00 TOTAL VALUE : ₹50,400.00
    E-Way Bill No : 181044928102
  `

  const parsed = parseInvoiceText(text)

  assert.equal(parsed.invoiceNumber, 'INV/2026/FTL-089')
  assert.equal(parsed.invoiceDate, '2026-09-16')
  assert.equal(parsed.sellerLegalName, 'Apex Logistics India Pvt Ltd')
  assert.equal(parsed.buyerLegalName, 'Precision Machinery Corp')
  assert.equal(parsed.sellerGstin, '33AAACA1234Z1')
  assert.equal(parsed.buyerGstin, '29BBBCC56782Z2')
  assert.equal(parsed.taxableValue, '45000.00')
  assert.equal(parsed.gstRate, '12')
  assert.equal(parsed.totalInvoiceValue, '50400.00')
  assert.equal(parsed.ewayBillNo, '181044928102')
})
