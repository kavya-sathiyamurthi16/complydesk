import { ManufacturingLayout } from '../../components/manufacturing/ManufacturingLayout'
import { getComplianceAnalytics, getDashboardStats } from '../../services/dataService'
import type { ComplianceAnalytics, DashboardStats } from '../../services/dataService'
import { AlertTriangle, BarChart3 } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ManufacturingReports() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [analytics, setAnalytics] = useState<ComplianceAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => { Promise.all([getDashboardStats(), getComplianceAnalytics()]).then(([summary, data]) => { setStats(summary); setAnalytics(data) }).catch(() => setError('Failed to load reports.')).finally(() => setLoading(false)) }, [])
  return <ManufacturingLayout title="Reports" subtitle="Government compliance aggregates">
    {loading ? <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">Loading reports...</div> : error ? <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">{error}</div> : <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[['Invoices', stats?.totalInvoices], ['Taxable Value', analytics?.gstTotals.taxable], ['GST Total', analytics?.gstTotals.total], ['Flagged Value', stats?.potentialOverbilling]].map(([label, value]) => <div key={String(label)} className="bg-white border border-gray-200 rounded-lg p-5"><p className="text-sm text-gray-500">{String(label)}</p><p className="text-2xl font-bold mt-2">{label === 'Invoices' ? String(value || 0) : `₹${Number(value || 0).toLocaleString()}`}</p></div>)}</div>
      <div className="bg-white border border-gray-200 rounded-lg p-6"><div className="flex items-center gap-2 mb-4"><AlertTriangle size={20} className="text-amber-600" /><h3 className="text-lg font-semibold">Rule Issue Breakdown</h3></div>{analytics?.issues.length ? analytics.issues.map((issue) => <div key={issue.issue} className="flex justify-between border-b py-3"><span>{issue.issue}</span><span>{issue.count} invoices · ₹{issue.value.toLocaleString()}</span></div>) : <p className="text-gray-500">No rule issues found.</p>}</div>
      <div className="bg-white border border-gray-200 rounded-lg p-6"><div className="flex items-center gap-2 mb-4"><BarChart3 size={20} className="text-indigo-600" /><h3 className="text-lg font-semibold">E-Way Status Breakdown</h3></div>{analytics?.ewayStatuses.length ? analytics.ewayStatuses.map((item) => <div key={item.status} className="flex justify-between border-b py-3"><span>{item.status}</span><span>{item.count} invoices · ₹{item.value.toLocaleString()}</span></div>) : <p className="text-gray-500">No e-way status data found.</p>}</div>
      <div className="bg-white border border-gray-200 rounded-lg p-6"><h3 className="text-lg font-semibold mb-4">GST Value Totals</h3><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Object.entries(analytics?.gstTotals || {}).filter(([key]) => key !== 'total').map(([key, value]) => <div key={key}><p className="text-sm text-gray-500 uppercase">{key}</p><p className="font-mono text-lg">₹{Number(value).toLocaleString()}</p></div>)}</div></div>
    </div>}
  </ManufacturingLayout>
}
