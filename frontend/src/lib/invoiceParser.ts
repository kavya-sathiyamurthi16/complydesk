export type ExtractedInvoiceData = {
  invoiceNumber: string
  invoiceDate: string
  vendorId: string
  shipmentId: string
  poNumber: string
  currency: string
  sellerLegalName: string
  sellerGstin: string
  buyerLegalName: string
  buyerGstin: string
  taxableValue: string
  gstRate: string
  cgstValue: string
  sgstValue: string
  igstValue: string
  totalInvoiceValue: string
  transportDocumentNo: string
  ewayBillNo: string
  ruleIssue: string
  expectedResult: string
  dataType: string
  origin: string
  destination: string
  vehicleNumber: string
  shipmentDate: string
  weight: string
  quantity: string
  freight: string
  fuelSurcharge: string
  toll: string
  detention: string
  loading: string
  redelivery: string
  paymentType: 'single' | 'installments'
  numberOfInstallments: number
  installments: Array<{ amount: number; dueDate: string }>
}

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, ' ').trim()
const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const matchField = (text: string, labels: string[], pattern: string) => {
  return matchFieldOccurrence(text, labels, pattern, 0)
}

const matchFieldOccurrence = (text: string, labels: string[], pattern: string, occurrence: number) => {
  const orderedLabels = [...labels].sort((a, b) => b.length - a.length)

  for (const label of orderedLabels) {
    const regex = new RegExp(`${escapeRegex(label)}\\s*(?:[:.#₹$€-]\\s*)*(${pattern})`, 'i')
    const matches = [...text.matchAll(new RegExp(regex.source, `${regex.flags}g`))]
    const match = matches[occurrence]
    if (match) {
      const value = normalizeWhitespace(match[1].replace(/[|]+$/g, ''))
      return value
    }
  }

  return ''
}

const matchLastField = (text: string, labels: string[], pattern: string) => {
  const orderedLabels = [...labels].sort((a, b) => b.length - a.length)

  for (const label of orderedLabels) {
    const regex = new RegExp(`${escapeRegex(label)}\\s*(?:[:.#₹$€-]\\s*)*(${pattern})`, 'i')
    const matches = [...text.matchAll(new RegExp(regex.source, `${regex.flags}g`))]
    const match = matches[matches.length - 1]
    if (match) {
      return normalizeWhitespace(match[1].replace(/[|]+$/g, ''))
    }
  }

  return ''
}

const matchTextFieldOccurrence = (text: string, labels: string[], occurrence: number) => {
  const stopLabels = ['Legal Name', 'GSTIN', 'Invoice No', 'Invoice Date', 'HSN Code', 'Desc', 'Taxable Value', 'GST Rate', 'CGST Value', 'SGST Value', 'TOTAL Value', 'E-Way Bill No']
  const labelPattern = labels.map(escapeRegex).sort((a, b) => b.length - a.length).join('|')
  const stopPattern = stopLabels.map(escapeRegex).sort((a, b) => b.length - a.length).join('|')
  const matches = [...text.matchAll(new RegExp(`(?:${labelPattern})\\s*(?:[:.#-])?\\s*(.+?)(?=\\s+(?:${stopPattern})\\s*(?:[:.#-])?|$)`, 'gi'))]
  return matches[occurrence]?.[1] ? normalizeWhitespace(matches[occurrence][1]) : ''
}

const parseDate = (value: string) => {
  if (!value) return ''

  const match = value.match(/(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/)
  if (!match) return ''

  const [first, second, third] = match[1].split(/[./-]/)
  if (!first || !second || !third) return ''

  const yearRaw = Number(third)
  const year = third.length === 2 ? (yearRaw > 50 ? 1900 + yearRaw : 2000 + yearRaw) : yearRaw
  const month = Number(first) > 12 ? Number(second) : Number(first)
  const day = Number(first) > 12 ? Number(first) : Number(second)

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

const parseAmount = (value: string) => {
  if (!value) return ''
  const match = value.match(/(\d[\d,]*(?:\.\d+)?)/)
  return match ? match[1].replace(/,/g, '') : ''
}

export function parseInvoiceText(rawText: string): Partial<ExtractedInvoiceData> {
  const text = rawText.replace(/\r/g, ' ')

  const invoiceNumber = matchField(text, ['Invoice No', 'Invoice Number', 'Invoice #', 'Invoice'], '[A-Z0-9/-]+')
  const invoiceDate = parseDate(matchField(text, ['Invoice Date', 'Date', 'Bill Date'], '[0-9]{1,2}[./-][0-9]{1,2}[./-][0-9]{2,4}') || '')
  const poNumberRaw = matchField(text, ['PO No', 'PO Number', 'Purchase Order'], '(?:PO[- ]?)?[A-Z0-9-]+')
  const poNumber = poNumberRaw ? (poNumberRaw.toUpperCase().startsWith('PO') ? poNumberRaw : `PO-${poNumberRaw}`) : ''
  const namePattern = '[A-Za-z][A-Za-z0-9.,/&()\\- ]{2,}'
  const sellerLegalName = matchField(text, ['Seller Legal Name', 'Seller Name', 'Seller', 'Sold By', 'Supplier', 'Vendor Name'], namePattern) || matchTextFieldOccurrence(text, ['Legal Name'], 0)
  const buyerLegalName = matchField(text, ['Buyer Legal Name', 'Buyer Name', 'Buyer', 'Bill To', 'Customer'], namePattern) || matchTextFieldOccurrence(text, ['Legal Name'], 1)
  const sellerGstin = matchField(text, ['Seller GSTIN', 'Supplier GSTIN'], '[A-Z0-9]{10,15}') || matchFieldOccurrence(text, ['GSTIN'], '[A-Z0-9]{10,15}', 0)
  const buyerGstin = matchField(text, ['Buyer GSTIN', 'Customer GSTIN'], '[A-Z0-9]{10,15}') || matchFieldOccurrence(text, ['GSTIN'], '[A-Z0-9]{10,15}', 1)
  const taxableValue = parseAmount(matchField(text, ['Taxable Value', 'Taxable Amount', 'Subtotal'], '[0-9,]+(?:\\.[0-9]+)?') || '')
  const gstRate = parseAmount(matchField(text, ['GST Rate', 'Rate', 'GST%'], '[0-9,]+(?:\\.[0-9]+)?%?') || '')
  const cgstValue = parseAmount(matchField(text, ['CGST Value', 'CGST Amount', 'CGST'], '[0-9,]+(?:\\.[0-9]+)?') || '')
  const sgstValue = parseAmount(matchField(text, ['SGST Value', 'SGST Amount', 'SGST'], '[0-9,]+(?:\\.[0-9]+)?') || '')
  const igstValue = parseAmount(matchField(text, ['IGST', 'IGST Amount'], '[0-9,]+(?:\\.[0-9]+)?') || '')
  const totalInvoiceValue = parseAmount(matchLastField(text, ['TOTAL VALUE'], '[0-9,]+(?:\\.[0-9]+)?') || matchField(text, ['Total Invoice Value', 'Invoice Total', 'Total Amount', 'Total'], '[0-9,]+(?:\\.[0-9]+)?') || '')
  const ewayBillNo = matchField(text, ['E-Way Bill No', 'Eway Bill', 'E-Way Bill'], '[A-Z0-9-]+')

  return {
    invoiceNumber: invoiceNumber.replace(/^Invoice\s*[:\-]?\s*/i, '').trim() || invoiceNumber,
    invoiceDate,
    poNumber,
    sellerLegalName: sellerLegalName.replace(/^(Seller|Sold By|Supplier|Vendor Name)\s*[:\-]?\s*/i, '').trim() || sellerLegalName,
    buyerLegalName: buyerLegalName.replace(/^(Buyer|Bill To|Customer)\s*[:\-]?\s*/i, '').trim() || buyerLegalName,
    sellerGstin: sellerGstin.replace(/[^A-Z0-9]/g, '').toUpperCase(),
    buyerGstin: buyerGstin.replace(/[^A-Z0-9]/g, '').toUpperCase(),
    taxableValue,
    gstRate: gstRate.replace(/%/g, ''),
    cgstValue,
    sgstValue,
    igstValue,
    totalInvoiceValue,
    ewayBillNo: ewayBillNo.replace(/^E-Way\s*Bill\s*No\s*[:\-]?\s*/i, '').trim() || ewayBillNo,
    transportDocumentNo: ewayBillNo,
    currency: 'INR',
    vendorId: '',
    shipmentId: '',
    ruleIssue: '',
    expectedResult: '',
    dataType: 'government_compliance',
    origin: '',
    destination: '',
    vehicleNumber: '',
    shipmentDate: '',
    weight: '',
    quantity: '',
    freight: '',
    fuelSurcharge: '',
    toll: '',
    detention: '',
    loading: '',
    redelivery: '',
    paymentType: 'single',
    numberOfInstallments: 1,
    installments: [],
  }
}
