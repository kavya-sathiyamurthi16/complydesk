import { ManufacturingLayout } from '../../components/manufacturing/ManufacturingLayout'
import { getInvoices } from '../../services/dataService'
import type { Invoice } from '../../services/dataService'
import { BarChart3, Building2, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type CompanySummary = {
  id: string
  name: string
  gstin: string
  invoices: number
  totalValue: number
  pass: number
  review: number
  block: number
  pending: number
}

const summarizeCompanies = (invoices: Invoice[]) => {
  const summaries = new Map<string, CompanySummary>()

  invoices.forEach((invoice) => {
    const name = invoice.sellerLegalName || invoice.vendorName || 'Unknown company'
    const gstin = invoice.sellerGstin || ''
    const id = gstin || name
    const current = summaries.get(id) || {
      id,
      name,
      gstin,
      invoices: 0,
      totalValue: 0,
      pass: 0,
      review: 0,
      block: 0,
      pending: 0,
    }

    current.invoices += 1
    current.totalValue += invoice.amount
    if (invoice.status === 'PASS') current.pass += 1
    else if (invoice.status === 'REVIEW') current.review += 1
    else if (invoice.status === 'BLOCK') current.block += 1
    else current.pending += 1
    summaries.set(id, current)
  })

  return Array.from(summaries.values()).sort((a, b) => b.totalValue - a.totalValue)
}

export function ManufacturingCompanies() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getInvoices()
      .then((data) => {
        setInvoices(data)
        const firstCompany = summarizeCompanies(data)[0]
        if (firstCompany) setSelectedCompanyId(firstCompany.id)
      })
      .catch(() => setError('Failed to load companies.'))
      .finally(() => setLoading(false))
  }, [])

  const companies = useMemo(() => summarizeCompanies(invoices), [invoices])
  const filteredCompanies = companies.filter((company) =>
    `${company.name} ${company.gstin}`.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  const selectedCompany = companies.find((company) => company.id === selectedCompanyId) || filteredCompanies[0]

  const chartData = selectedCompany
    ? [
        { metric: 'Invoices', value: selectedCompany.invoices, color: '#4f46e5' },
        { metric: 'Value (₹)', value: selectedCompany.totalValue, color: '#0891b2' },
        { metric: 'Pass', value: selectedCompany.pass, color: '#16a34a' },
        { metric: 'Review', value: selectedCompany.review, color: '#d97706' },
        { metric: 'Block', value: selectedCompany.block, color: '#dc2626' },
        { metric: 'Pending', value: selectedCompany.pending, color: '#64748b' },
      ]
    : []

  return (
    <ManufacturingLayout title="Companies" subtitle="Review each company independently">
      {loading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">Loading companies...</div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800">{error}</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Building2 size={20} className="text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">All companies</h2>
              <span className="ml-auto text-sm text-gray-500">{companies.length}</span>
            </div>
            <div className="relative mb-4">
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search companies"
                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="max-h-[520px] space-y-2 overflow-y-auto">
              {filteredCompanies.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-500">No companies found.</p>
              ) : filteredCompanies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => setSelectedCompanyId(company.id)}
                  className={`w-full rounded-lg border p-3 text-left transition ${selectedCompany?.id === company.id ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50'}`}
                >
                  <p className="truncate text-sm font-semibold text-gray-900">{company.name}</p>
                  <div className="mt-1 flex justify-between gap-2 text-xs text-gray-500">
                    <span>{company.gstin || 'GSTIN not provided'}</span>
                    <span>{company.invoices} invoice{company.invoices === 1 ? '' : 's'}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            {selectedCompany ? (
              <>
                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <BarChart3 size={20} className="text-indigo-600" />
                      <h2 className="text-xl font-semibold text-gray-900">{selectedCompany.name}</h2>
                    </div>
                    <p className="text-sm text-gray-500">{selectedCompany.gstin || 'GSTIN not provided'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Total invoice value</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">₹{selectedCompany.totalValue.toLocaleString()}</p>
                  </div>
                </div>
                <div className="h-[360px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 8, right: 12, left: 8, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                      <Tooltip formatter={(value) => [Number(value || 0).toLocaleString(), 'Company metric']} />
                      <Bar dataKey="value" name="Company metrics" radius={[5, 5, 0, 0]} fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <div className="flex h-full min-h-[360px] items-center justify-center text-gray-500">No company data available.</div>
            )}
          </section>
        </div>
      )}
    </ManufacturingLayout>
  )
}
