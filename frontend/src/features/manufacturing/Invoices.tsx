import { ManufacturingLayout } from '../../components/manufacturing/ManufacturingLayout'
import { StatusBadge } from '../../components/manufacturing/StatusBadge'
import { TableSkeleton } from '../../components/manufacturing/Skeleton'
import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getInvoices } from '../../services/dataService'
import { useNavigate } from 'react-router-dom'
import type { Invoice } from '../../services/dataService'

type StatusFilter = 'All' | 'PASS' | 'REVIEW' | 'BLOCK' | 'PENDING'

export function ManufacturingInvoices() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')
  const [invoices, setInvoices] = useState<Invoice[]>([])

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getInvoices()
        setInvoices(data)
      } catch (err) {
        console.error('Error fetching invoices:', err)
        setError('Failed to load invoices. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  const filteredInvoices = invoices.filter((invoice) => {
    const query = searchTerm.toLowerCase()
    const matchesSearch =
      String(invoice.invoiceNumber || '').toLowerCase().includes(query) ||
      String(invoice.vendorName || '').toLowerCase().includes(query) ||
      String(invoice.ewayBillNo || '').toLowerCase().includes(query)
    
    const matchesStatus = statusFilter === 'All' || 
      (statusFilter === 'PASS' && invoice.decision === 'PASS') ||
      (statusFilter === 'REVIEW' && invoice.decision === 'REVIEW') ||
      (statusFilter === 'BLOCK' && invoice.decision === 'BLOCK') ||
      (statusFilter === 'PENDING' && !invoice.decision)
    
    return matchesSearch && matchesStatus
  })

  if (error) {
    return (
      <ManufacturingLayout 
        title="Invoices" 
        subtitle="All invoice screenings and results"
        showUploadButton={true}
      >
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </ManufacturingLayout>
    )
  }

  return (
    <ManufacturingLayout 
      title="Invoices" 
      subtitle="All invoice screenings and results"
      showUploadButton={true}
    >
      <div className="space-y-6">
        {isLoading ? (
          <TableSkeleton rows={10} />
        ) : (
          <>
            {/* Search and Filters */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoice/company/e-way..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Status Filters */}
            <div className="flex gap-2">
              {(['All', 'PASS', 'REVIEW', 'BLOCK', 'PENDING'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

            {/* Invoices Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Invoice</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Seller / GSTIN</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Buyer GSTIN</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">E-Way</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Date</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Rule</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      No invoices match the current search or status filter.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <tr 
                      key={invoice.id} 
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/screening-result/${invoice.id}`)}
                    >
                      <td className="py-4 px-6 text-sm font-mono text-gray-900">{invoice.invoiceNumber}</td>
                      <td className="py-4 px-6 text-sm text-gray-700">
                        <div className="font-medium text-gray-900">{invoice.sellerLegalName || invoice.vendorName || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">{invoice.sellerGstin || 'Seller GSTIN not provided'}</div>
                      </td>
                      <td className="py-4 px-6 text-sm font-mono text-gray-700">{invoice.buyerGstin || 'Buyer GSTIN not provided'}</td>
                      <td className="py-4 px-6 text-sm font-mono text-right text-gray-900">₹{invoice.amount.toLocaleString()}</td>
                      <td className="py-4 px-6 text-sm text-gray-700 font-mono">{invoice.ewayBillNo || invoice.eway_status || 'E-way not provided'}</td>
                      <td className="py-4 px-6 text-sm text-gray-700">{invoice.invoiceDate}</td>
                      <td className="py-4 px-6">
                        <StatusBadge status={invoice.decision || invoice.status} size="sm" />
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">{invoice.ruleIssue || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
          </>
        )}
      </div>
    </ManufacturingLayout>
  )
}