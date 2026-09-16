import { ManufacturingLayout } from '../../components/manufacturing/ManufacturingLayout'
import { evaluateRules, getInvoiceById } from '../../services/dataService'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import type { Decision } from '../../types'

export function ManufacturingScreeningResult() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [invoiceData, setInvoiceData] = useState<any>(null)

  useEffect(() => {
    const fetchScreeningResult = async () => {
      if (!id) {
        setError('Invoice ID not provided')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const data = await getInvoiceById(id)
        if (!data) {
          setError('Invoice not found')
        } else {
          setInvoiceData(data)
        }
      } catch (err) {
        console.error('Error fetching screening result:', err)
        setError('Failed to load screening result. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchScreeningResult()
  }, [id])

  const getDecisionConfig = (decision: Decision) => {
    switch (decision) {
      case 'PASS':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-900',
          icon: '✓',
          iconBg: 'bg-green-100',
        }
      case 'REVIEW':
        return {
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          textColor: 'text-amber-900',
          icon: '⚠',
          iconBg: 'bg-amber-100',
        }
      case 'BLOCK':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-900',
          icon: '✕',
          iconBg: 'bg-red-100',
        }
      default:
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-900',
          icon: '?',
          iconBg: 'bg-gray-100',
        }
    }
  }

  if (error) {
    return (
      <ManufacturingLayout 
        title="Screening Result" 
        subtitle="Error loading result"
      >
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={() => navigate('/invoices')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Back to Invoices
          </button>
        </div>
      </ManufacturingLayout>
    )
  }

  if (isLoading) {
    return (
      <ManufacturingLayout 
        title="Screening Result" 
        subtitle="Screening invoice and evaluating compliance rules..."
      >
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </ManufacturingLayout>
    )
  }

  if (!invoiceData) {
    return (
      <ManufacturingLayout 
        title="Screening Result" 
        subtitle="Invoice not found"
      >
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p className="text-gray-600">No screening result data available. The invoice may not exist or no screening has been performed yet.</p>
          <button 
            onClick={() => navigate('/invoices')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Invoices
          </button>
        </div>
      </ManufacturingLayout>
    )
  }

  const decision: Decision = invoiceData.decision || 'PENDING'
  const decisionConfig = getDecisionConfig(decision)
  const ruleEvaluation = evaluateRules(invoiceData)
  const detailItems = [
    { label: 'Invoice Number', value: invoiceData.invoiceNumber || 'N/A' },
    { label: 'Invoice ID', value: invoiceData.id || 'N/A' },
    { label: 'Seller Legal Name', value: invoiceData.sellerLegalName || 'N/A' },
    { label: 'Seller GSTIN', value: invoiceData.sellerGstin || 'N/A' },
    { label: 'Buyer Legal Name', value: invoiceData.buyerLegalName || 'N/A' },
    { label: 'Buyer GSTIN', value: invoiceData.buyerGstin || 'N/A' },
    { label: 'Taxable Value', value: invoiceData.taxableValue ? `₹${Number(invoiceData.taxableValue).toLocaleString()}` : 'N/A' },
    { label: 'GST Rate', value: invoiceData.gstRate ? `${invoiceData.gstRate}%` : 'N/A' },
    { label: 'Total Invoice Value', value: invoiceData.totalInvoiceValue ? `₹${Number(invoiceData.totalInvoiceValue).toLocaleString()}` : 'N/A' },
    { label: 'E-Way Bill', value: invoiceData.ewayBillNo || 'N/A' },
    { label: 'Transport Doc', value: invoiceData.transportDocumentNo || 'N/A' },
  ]

  return (
    <ManufacturingLayout 
      title="Screening Result" 
      subtitle={`Invoice ${invoiceData.invoiceNumber}`}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Card - Prominent Decision */}
        <div className={`bg-white border ${decisionConfig.borderColor} rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow`}>
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center w-20 h-20 ${decisionConfig.iconBg} rounded-full mb-4`}>
              <span className="text-4xl">{decisionConfig.icon}</span>
            </div>
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${decisionConfig.bgColor} ${decisionConfig.textColor}`}>
              <span className="text-2xl">{decisionConfig.icon}</span>
              <span className="text-xl font-semibold">{decision}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {detailItems.map((item) => (
              <div key={item.label} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">{item.label}</p>
                <p className="mt-2 text-base font-semibold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rule Evaluation Checklist */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Screening Rule Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4"><p className="text-xs uppercase tracking-wide text-gray-500">Rules checked</p><p className="mt-2 text-2xl font-bold text-gray-900">{ruleEvaluation.total}</p></div>
            <div className="rounded-lg border border-red-200 bg-red-50 p-4"><p className="text-xs uppercase tracking-wide text-red-600">Blocked</p><p className="mt-2 text-2xl font-bold text-red-700">{ruleEvaluation.blocked}</p></div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4"><p className="text-xs uppercase tracking-wide text-amber-600">Reviewed</p><p className="mt-2 text-2xl font-bold text-amber-700">{ruleEvaluation.reviewed}</p></div>
            <div className="rounded-lg border border-green-200 bg-green-50 p-4"><p className="text-xs uppercase tracking-wide text-green-600">Passed</p><p className="mt-2 text-2xl font-bold text-green-700">{ruleEvaluation.passed}</p></div>
          </div>
          <div className="space-y-3">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">Rule Issue</p>
              <p className="mt-2 text-sm text-gray-900">{invoiceData.ruleIssue || 'No rule issue recorded.'}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">Expected Result</p>
              <p className="mt-2 text-sm text-gray-900">{invoiceData.expectedResult || 'No expected result recorded.'}</p>
            </div>
          </div>
        </div>

        {/* Explanation Panel */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Explanation</h3>
          <p className="mb-4 rounded-lg border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-900">{ruleEvaluation.explanation}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">CGST</p>
              <p className="mt-2 text-sm font-semibold text-gray-900">₹{Number(invoiceData.cgstValue || 0).toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">SGST</p>
              <p className="mt-2 text-sm font-semibold text-gray-900">₹{Number(invoiceData.sgstValue || 0).toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">IGST</p>
              <p className="mt-2 text-sm font-semibold text-gray-900">₹{Number(invoiceData.igstValue || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Evidence Checklist */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Supporting Evidence</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">Data Type</p>
              <p className="mt-2 text-sm text-gray-900">{invoiceData.dataType || 'Government compliance'}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">Vendor</p>
              <p className="mt-2 text-sm text-gray-900">{invoiceData.vendorName || 'Unknown'}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate('/invoices')}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    </ManufacturingLayout>
  )
}
