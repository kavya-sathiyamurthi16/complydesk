import { ManufacturingLayout } from '../../components/manufacturing/ManufacturingLayout'
import { StatusBadge } from '../../components/manufacturing/StatusBadge'
import { getInvoices } from '../../services/dataService'
import type { Invoice } from '../../services/dataService'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function ManufacturingReviewQueue() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  useEffect(() => { getInvoices().then((rows) => setInvoices(rows.filter((row) => row.status === 'REVIEW'))).catch(() => setError('Failed to load review queue.')).finally(() => setLoading(false)) }, [])
  return <ManufacturingLayout title="Review Queue" subtitle="Invoices requiring human review">
    {loading ? <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">Loading review queue...</div> : error ? <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">{error}</div> : <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {invoices.length === 0 ? <p className="text-gray-500 text-center py-8">No invoices currently require review.</p> : <table className="w-full"><thead><tr className="border-b bg-gray-50"><th className="text-left py-4 px-6">Invoice</th><th className="text-left py-4 px-6">Seller</th><th className="text-right py-4 px-6">Amount</th><th className="text-left py-4 px-6">Issue</th><th className="text-left py-4 px-6">Status</th></tr></thead><tbody>{invoices.map((invoice) => <tr key={invoice.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/screening-result/${invoice.id}`)}><td className="py-4 px-6 font-mono">{invoice.invoiceNumber}</td><td className="py-4 px-6">{invoice.sellerLegalName}</td><td className="py-4 px-6 text-right">₹{invoice.amount.toLocaleString()}</td><td className="py-4 px-6">{invoice.ruleIssue || invoice.expectedResult || 'Review flag'}</td><td className="py-4 px-6"><StatusBadge status="REVIEW" size="sm" /></td></tr>)}</tbody></table>}
    </div>}
  </ManufacturingLayout>
}
