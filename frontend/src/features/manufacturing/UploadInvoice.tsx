import { ManufacturingLayout } from '../../components/manufacturing/ManufacturingLayout'
import { createInvoice } from '../../services/dataService'
import { parseInvoiceText } from '../../lib/invoiceParser'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Tesseract from 'tesseract.js'
import * as pdfjsLib from 'pdfjs-dist'
import { AlertTriangle, FileText, Upload, UploadCloud } from 'lucide-react'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

const fieldSections = [
  { title: 'Invoice Details', fields: [
    ['invoice_no', 'Invoice Number', 'text'], ['invoice_date', 'Invoice Date', 'date'], ['document_type', 'Document Type', 'text'], ['supply_type', 'Supply Type', 'text'], ['reverse_charge', 'Reverse Charge (Y/N)', 'text'],
  ] },
  { title: 'Seller / Buyer Details', fields: [
    ['seller_legal_name', 'Seller Legal Name', 'text'], ['seller_gstin', 'Seller GSTIN', 'text'], ['seller_location', 'Seller Location', 'text'], ['seller_pincode', 'Seller Pincode', 'number'], ['seller_state_code', 'Seller State Code', 'number'],
    ['buyer_legal_name', 'Buyer Legal Name', 'text'], ['buyer_gstin', 'Buyer GSTIN', 'text'], ['buyer_location', 'Buyer Location', 'text'], ['buyer_pincode', 'Buyer Pincode', 'number'], ['buyer_state_code', 'Buyer State Code', 'number'], ['place_of_supply', 'Place of Supply', 'number'],
  ] },
  { title: 'Tax Values', fields: [
    ['hsn_code', 'HSN Code', 'number'], ['item_description', 'Item Description', 'text'], ['quantity', 'Quantity', 'number'], ['qty_unit', 'Qty Unit', 'text'], ['taxable_value', 'Taxable Value', 'number'], ['gst_rate', 'GST Rate (%)', 'number'], ['cgst_value', 'CGST Value', 'number'], ['sgst_value', 'SGST Value', 'number'], ['igst_value', 'IGST Value', 'number'], ['total_invoice_value', 'Total Invoice Value', 'number'],
  ] },
  { title: 'Transport & E-Way Bill Details', fields: [
    ['transporter_name', 'Transporter Name', 'text'], ['transporter_gstin', 'Transporter GSTIN', 'text'], ['transport_mode', 'Transport Mode', 'number'], ['transport_distance_km', 'Transport Distance (km)', 'number'], ['transport_document_no', 'Transport Document No', 'text'], ['transport_document_date', 'Transport Document Date', 'date'], ['vehicle_no', 'Vehicle No', 'text'], ['eway_bill_no', 'E-Way Bill No', 'number'], ['eway_status', 'E-Way Status', 'text'], ['eway_doc_no', 'E-Way Doc No', 'text'], ['eway_from_gstin', 'E-Way From GSTIN', 'text'], ['eway_to_gstin', 'E-Way To GSTIN', 'text'], ['eway_total_value', 'E-Way Total Value', 'number'], ['eway_vehicle_no', 'E-Way Vehicle No', 'text'],
  ] },
] as const

type FieldName = typeof fieldSections[number]['fields'][number][0]
type FormState = Partial<Record<FieldName, string>>

const initialData: FormState = { reverse_charge: 'N' }
const numericFields = new Set<string>(fieldSections.flatMap((section) => section.fields.filter((field) => field[2] === 'number').map((field) => field[0])))
const cleanNumber = (value: string) => value.replace(/[^0-9.-]/g, '')
const ocrLabels = [
  'Invoice No', 'Invoice Number', 'Invoice Date', 'Date', 'Doc Type', 'Document Type', 'Supply Type', 'Reverse Charge',
  'Legal Name', 'Seller', 'Supplier', 'Buyer', 'Customer', 'GSTIN', 'Address', 'Pincode', 'State Code', 'Place of Supply',
  'HSN Code', 'Desc', 'Description', 'Quantity', 'Qty Unit', 'Taxable Value', 'GST Rate', 'CGST Value', 'SGST Value', 'IGST Value',
  'TOTAL VALUE', 'Total Amount', 'Transporter Name', 'Transporter GSTIN', 'Transport Mode', 'Distance (km)', 'Transport Doc No',
  'Vehicle No', 'E-Way Bill No', 'E-Way Status', 'E-Way Date', 'E-Way Total', 'E-Way From GSTIN', 'E-Way To GSTIN', 'E-Way Vehicle',
]

type Installment = { amount: string; dueDate: string }

const createInstallments = (count: number, total: string): Installment[] => {
  const amount = Number(total || 0) / count
  return Array.from({ length: count }, (_, index) => {
    const dueDate = new Date()
    dueDate.setMonth(dueDate.getMonth() + index + 1)
    return { amount: amount ? amount.toFixed(2) : '', dueDate: dueDate.toISOString().slice(0, 10) }
  })
}

export function ManufacturingUploadInvoice() {
  const navigate = useNavigate()
  const [entryMode, setEntryMode] = useState<'upload' | 'manual'>('manual')
  const [form, setForm] = useState<FormState>(initialData)
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentType, setPaymentType] = useState<'single' | 'installments'>('single')
  const [installments, setInstallments] = useState<Installment[]>([])

  const updateField = (name: FieldName, value: string) => setForm((current) => ({ ...current, [name]: value }))

  const updatePaymentType = (value: 'single' | 'installments') => {
    setPaymentType(value)
    if (value === 'installments' && installments.length === 0) setInstallments(createInstallments(2, form.total_invoice_value || ''))
  }

  const updateInstallmentCount = (value: number) => setInstallments(createInstallments(Math.max(2, Math.min(12, value || 2)), form.total_invoice_value || ''))

  const extractTextFromFile = async (selectedFile: File) => {
    const fileName = selectedFile.name.toLowerCase()

    if (selectedFile.type === 'application/pdf' || fileName.endsWith('.pdf')) {
      const fileBuffer = await selectedFile.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise
      const pageTexts: string[] = []

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber)
        const textContent = await page.getTextContent()
        const pageText = textContent.items
          .map((item) => ('str' in item ? item.str : ''))
          .join(' ')
        if (pageText.trim()) {
          pageTexts.push(pageText)
          continue
        }

        const viewport = page.getViewport({ scale: 2 })
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')

        if (!context) {
          continue
        }

        canvas.width = viewport.width
        canvas.height = viewport.height

        await page.render({ canvas, canvasContext: context, viewport }).promise

        try {
          const { data } = await Tesseract.recognize(canvas, 'eng', { logger: () => undefined })
          if (data.text.trim()) {
            pageTexts.push(data.text)
          }
        } catch {
          // Ignore OCR failures on empty pages; the next page or manual entry can still work.
        }
      }

      const combinedText = pageTexts.join('\n')
      if (combinedText.trim()) {
        return combinedText
      }
    }

    const image = await createOcrImage(selectedFile)
    const { data } = await Tesseract.recognize(image, 'eng', { logger: () => undefined })
    return data.text
  }

  const createOcrImage = async (selectedFile: File) => {
    const source = await createImageBitmap(selectedFile)
    const scale = Math.min(3, Math.max(1, 1800 / source.width))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(source.width * scale)
    canvas.height = Math.round(source.height * scale)
    const context = canvas.getContext('2d')
    if (!context) return selectedFile

    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = 'high'
    context.drawImage(source, 0, 0, canvas.width, canvas.height)
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    for (let index = 0; index < imageData.data.length; index += 4) {
      const gray = Math.round(imageData.data[index] * 0.299 + imageData.data[index + 1] * 0.587 + imageData.data[index + 2] * 0.114)
      const contrast = Math.max(0, Math.min(255, (gray - 128) * 1.35 + 128))
      imageData.data[index] = contrast
      imageData.data[index + 1] = contrast
      imageData.data[index + 2] = contrast
    }
    context.putImageData(imageData, 0, 0)
    source.close()
    return canvas
  }

  const processFile = async (selectedFile: File) => {
    setFile(selectedFile)
    setError(null)
    setIsProcessing(true)
    try {
      const text = await extractTextFromFile(selectedFile)
      const parsed = parseInvoiceText(text)
      const find = (labels: string[], occurrence = 0) => {
        const label = labels.map((item) => item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
        const stopLabels = ocrLabels.map((item) => item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
        const matches = [...text.matchAll(new RegExp(`(?:${label})\\s*(?:[:.#₹$€-]\\s*)*(.+?)(?=\\s+(?:${stopLabels})\\s*(?:[:.#₹$€-]|$)|[\\n|]|$)`, 'gi'))]
        return matches[occurrence]?.[1]?.trim() || ''
      }
      const numberFrom = (value: string) => cleanNumber(value)

      setForm((current) => ({
        ...current,
        invoice_no: parsed.invoiceNumber || find(['Invoice No', 'Invoice Number', 'Invoice']),
        invoice_date: parsed.invoiceDate || find(['Invoice Date', 'Date', 'Bill Date']),
        document_type: find(['Doc Type', 'Document Type']),
        supply_type: find(['Supply Type']),
        reverse_charge: find(['Reverse Charge']) || current.reverse_charge || 'N',
        seller_legal_name: parsed.sellerLegalName || find(['Seller', 'Supplier', 'Sold By', 'Vendor Name']),
        seller_gstin: parsed.sellerGstin || find(['Seller GSTIN', 'GSTIN', 'Supplier GSTIN']),
        seller_location: find(['Address'], 0),
        seller_pincode: numberFrom(find(['Pincode'], 0)),
        seller_state_code: numberFrom(find(['State Code'], 0)),
        buyer_legal_name: parsed.buyerLegalName || find(['Buyer', 'Customer', 'Bill To']),
        buyer_gstin: parsed.buyerGstin || find(['Buyer GSTIN', 'Customer GSTIN']),
        buyer_location: find(['Address'], 1),
        buyer_pincode: numberFrom(find(['Pincode'], 1)),
        buyer_state_code: numberFrom(find(['State Code'], 1)),
        place_of_supply: numberFrom(find(['Place of Supply'])),
        hsn_code: numberFrom(find(['HSN Code'])),
        item_description: find(['Desc', 'Description', 'Item Description']),
        quantity: numberFrom(find(['Quantity'])),
        qty_unit: find(['Qty Unit', 'Unit']),
        taxable_value: numberFrom(parsed.taxableValue || find(['Taxable Value', 'Taxable Amount', 'Subtotal'])),
        gst_rate: numberFrom(parsed.gstRate || find(['GST Rate', 'GST%', 'Rate'])),
        cgst_value: numberFrom(parsed.cgstValue || find(['CGST Value', 'CGST'])),
        sgst_value: numberFrom(parsed.sgstValue || find(['SGST Value', 'SGST'])),
        igst_value: numberFrom(parsed.igstValue || find(['IGST Value', 'IGST'])),
        total_invoice_value: numberFrom(parsed.totalInvoiceValue || find(['Total Invoice Value', 'Invoice Total', 'Total Amount', 'TOTAL VALUE', 'Total'])),
        transporter_name: find(['Transporter Name']),
        transporter_gstin: find(['Transporter GSTIN']),
        transport_distance_km: numberFrom(find(['Distance (km)', 'Transport Distance'])),
        transport_document_no: find(['Transport Doc No', 'Transport Document No']),
        transport_document_date: find(['Transport Document Date', 'Transport Date']),
        vehicle_no: find(['Vehicle No', 'Vehicle Number']),
        eway_bill_no: (parsed.ewayBillNo || find(['E-Way Bill No', 'Eway Bill', 'E-Way Bill'])).replace(/[^A-Z0-9-]/gi, ''),
        eway_status: find(['E-Way Status']),
        eway_doc_no: find(['E-Way Doc No']),
        eway_from_gstin: find(['E-Way From GSTIN']),
        eway_to_gstin: find(['E-Way To GSTIN']),
        eway_total_value: numberFrom(find(['E-Way Total'])),
        eway_vehicle_no: find(['E-Way Vehicle']),
      }))
    } catch {
      setError('Could not extract invoice data. Please enter the fields manually.')
    } finally {
      setIsProcessing(false)
    }
  }

  const saveInvoice = async () => {
    setError(null)
    setIsSubmitting(true)
    try {
      const record = Object.fromEntries(Object.entries(form).map(([key, value]) => {
        if (value === '') return [key, null]
        if (!numericFields.has(key)) return [key, value]
        const normalized = cleanNumber(value)
        const number = Number(normalized)
        return [key, normalized && Number.isFinite(number) ? number : null]
      }))
      const created = await createInvoice(record)
      navigate(`/screening-result/${created.id}`)
    } catch (submitError) {
      console.error('Failed to create invoice:', submitError)
      const structuredError = submitError as { message?: string; details?: string; hint?: string; code?: string }
      const message = structuredError.message || (submitError instanceof Error ? submitError.message : 'Unknown database error')
      const details = structuredError.details ? ` ${structuredError.details}` : ''
      if (/401|jwt|api key|unauthorized/i.test(message)) {
        setError('Supabase rejected the request (401). Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart the Vite server. If authentication is enabled, sign in before saving.')
      } else if (/row-level security|permission|42501|403/i.test(message)) {
        setError('Supabase blocked the insert. Add an INSERT policy for government_compliance for the signed-in user or anon role.')
      } else {
        setError(`Failed to save invoice${structuredError.code ? ` (${structuredError.code})` : ''}: ${message}${details}`)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ManufacturingLayout title="Upload Invoice" subtitle="Create and screen a government compliance invoice">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          {(['manual', 'upload'] as const).map((mode) => (
            <button key={mode} onClick={() => setEntryMode(mode)} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium ${entryMode === mode ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600'}`}>
              {mode === 'manual' ? <FileText size={20} /> : <UploadCloud size={20} />}
              {mode === 'manual' ? 'Manual Entry' : 'Upload File'}
            </button>
          ))}
        </div>

        {entryMode === 'upload' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <label className="flex flex-col items-center gap-3 border-2 border-dashed border-gray-300 rounded-lg p-10 cursor-pointer hover:border-indigo-400">
              <Upload size={36} className="text-gray-400" />
              <span className="font-medium text-gray-900">Choose an invoice file for extraction</span>
              <span className="text-sm text-gray-500">PDF, JPG, PNG, CSV, or Excel</span>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png,.csv,.xlsx,.xls" className="hidden" onChange={(event) => event.target.files?.[0] && processFile(event.target.files[0])} />
            </label>
            {file && <p className="mt-3 text-sm text-gray-600">{isProcessing ? 'Extracting data...' : `Loaded ${file.name}. Verify the fields below.`}</p>}
          </div>
        )}

        {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3"><AlertTriangle size={20} className="text-red-600" /><p className="text-sm text-red-900">{error}</p></div>}

        {fieldSections.map((section) => (
          <div key={section.title} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.fields.map(([name, label, type]) => (
                <label key={name} className={name === 'item_description' ? 'md:col-span-2' : ''}>
                  <span className="block text-sm font-medium text-gray-700 mb-2">{label}</span>
                  <input type={type} value={form[name] || ''} onChange={(event) => updateField(name, event.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </label>
              ))}
            </div>
          </div>
        ))}

        {entryMode === 'manual' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Installment Details</h3>
            <div className="flex flex-wrap items-center gap-6 mb-5">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="radio" name="paymentType" checked={paymentType === 'single'} onChange={() => updatePaymentType('single')} />
                Single payment
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="radio" name="paymentType" checked={paymentType === 'installments'} onChange={() => updatePaymentType('installments')} />
                Installments
              </label>
              {paymentType === 'installments' && (
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  Number of installments
                  <input type="number" min="2" max="12" value={installments.length || 2} onChange={(event) => updateInstallmentCount(Number(event.target.value))} className="w-20 px-2 py-1.5 border border-gray-300 rounded-lg" />
                </label>
              )}
            </div>
            {paymentType === 'single' ? (
              <p className="text-sm text-gray-600">The full invoice value is payable in one payment.</p>
            ) : (
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50"><tr><th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Installment</th><th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Amount</th><th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Due Date</th></tr></thead>
                  <tbody>{installments.map((installment, index) => <tr key={index} className="border-t border-gray-200"><td className="py-3 px-4 text-sm">{index + 1}</td><td className="py-3 px-4"><input type="number" value={installment.amount} onChange={(event) => setInstallments((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, amount: event.target.value } : item))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></td><td className="py-3 px-4"><input type="date" value={installment.dueDate} onChange={(event) => setInstallments((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, dueDate: event.target.value } : item))} className="px-3 py-2 border border-gray-300 rounded-lg" /></td></tr>)}</tbody>
                </table>
              </div>
            )}
            <p className="mt-3 text-xs text-gray-500">Installment details are for manual-entry review only; the current database schema has no installment columns.</p>
          </div>
        )}

        <div className="flex justify-end">
          <button onClick={saveInvoice} disabled={isSubmitting || isProcessing} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
            <Upload size={20} />{isSubmitting ? 'Saving...' : 'SCREEN INVOICE'}
          </button>
          <button onClick={saveInvoice} disabled={isSubmitting || isProcessing} className="flex items-center gap-2 px-6 py-3 border border-indigo-600 text-indigo-700 rounded-lg hover:bg-indigo-50 disabled:opacity-50">
            <FileText size={20} />{isSubmitting ? 'Saving...' : 'SAVE INVOICE'}
          </button>
        </div>
      </div>
    </ManufacturingLayout>
  )
}
