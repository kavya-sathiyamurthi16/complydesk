import { useState } from 'react'
import { Link } from 'react-router-dom'
import Badge from '../../components/Badge'
import Card from '../../components/Card'
import { CardHeader, CardContent } from '../../components/Card'
import type { Decision } from '../../types'

// Mock screening history data
const mockScreenings = [
  {
    screeningId: 'SCR-001',
    invoiceNumber: 'ABC-1004',
    vendor: 'ABC',
    invoiceDate: '05 Sep 2026',
    amount: 55000,
    decision: 'CLEAR' as Decision,
    triggeredRule: null,
    timestamp: '2026-09-05T10:30:00Z',
  },
  {
    screeningId: 'SCR-002',
    invoiceNumber: 'XYZ-2004',
    vendor: 'XYZ',
    invoiceDate: '05 Sep 2026',
    amount: 140000,
    decision: 'REVIEW' as Decision,
    triggeredRule: 'R-02',
    timestamp: '2026-09-05T14:45:00Z',
  },
  {
    screeningId: 'SCR-003',
    invoiceNumber: 'ABC-1002',
    vendor: 'ABC',
    invoiceDate: '04 Sep 2026',
    amount: 45000,
    decision: 'BLOCK' as Decision,
    triggeredRule: 'R-01',
    timestamp: '2026-09-04T09:15:00Z',
  },
  {
    screeningId: 'SCR-004',
    invoiceNumber: 'SJK-1001',
    vendor: 'SJK',
    invoiceDate: '03 Sep 2026',
    amount: 75000,
    decision: 'REVIEW' as Decision,
    triggeredRule: 'R-05',
    timestamp: '2026-09-03T16:20:00Z',
  },
  {
    screeningId: 'SCR-005',
    invoiceNumber: 'HJI-1003',
    vendor: 'HJI',
    invoiceDate: '02 Sep 2026',
    amount: 35000,
    decision: 'CLEAR' as Decision,
    triggeredRule: null,
    timestamp: '2026-09-02T11:10:00Z',
  },
]

export default function ScreeningHistory() {
  const [filter, setFilter] = useState<Decision | 'ALL'>('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const filteredScreenings = mockScreenings.filter(screening => {
    const matchesFilter = filter === 'ALL' || screening.decision === filter
    const matchesSearch = searchTerm === '' || 
      screening.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      screening.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (screening.triggeredRule && screening.triggeredRule.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesDate = dateFilter === '' || screening.invoiceDate.includes(dateFilter)
    return matchesFilter && matchesSearch && matchesDate
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Screening History</h1>
        <p className="text-gray-600 mt-1">View and search all invoice screenings</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Filter by status:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as Decision | 'ALL')}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All</option>
                <option value="CLEAR">CLEAR</option>
                <option value="REVIEW">REVIEW</option>
                <option value="BLOCK">BLOCK</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Date:</label>
              <input
                type="text"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                placeholder="e.g., Sep 2026"
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search invoice number, vendor, or rule ID..."
                className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Screening Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Screening Records</h2>
            <p className="text-sm text-gray-500">{filteredScreenings.length} records found</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Decision
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Triggered Rule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredScreenings.map((screening) => (
                  <tr key={screening.screeningId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {screening.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {screening.vendor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {screening.invoiceDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(screening.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge decision={screening.decision}>{screening.decision}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {screening.triggeredRule || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(screening.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/screening-result/${screening.screeningId}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredScreenings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No screening records found matching your filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}