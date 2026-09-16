import { ManufacturingLayout } from '../../components/manufacturing/ManufacturingLayout'
import { getComplianceAnalytics, getDashboardStats } from '../../services/dataService'
import type { ComplianceAnalytics, DashboardStats } from '../../services/dataService'
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ManufacturingCompliance() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [analytics, setAnalytics] = useState<ComplianceAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => { Promise.all([getDashboardStats(), getComplianceAnalytics()]).then(([summary, data]) => { setStats(summary); setAnalytics(data) }).catch(() => setError('Failed to load compliance analytics.')).finally(() => setLoading(false)) }, [])
  return <ManufacturingLayout title="Compliance Center" subtitle={stats ? `${stats.totalInvoices} invoices from government_compliance` : 'Loading...'}>
    {loading ? <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">Loading compliance analytics...</div> : error ? <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">{error}</div> : <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center gap-3"><CheckCircle size={24} className="text-green-600" /><div><p className="text-2xl font-bold">{stats?.pass || 0}</p><p className="text-green-600">PASS</p></div></div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center gap-3"><AlertTriangle size={24} className="text-amber-600" /><div><p className="text-2xl font-bold">{stats?.review || 0}</p><p className="text-amber-600">REVIEW</p></div></div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center gap-3"><XCircle size={24} className="text-red-600" /><div><p className="text-2xl font-bold">{stats?.block || 0}</p><p className="text-red-600">BLOCK</p></div></div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6"><h3 className="text-lg font-semibold mb-4">Top Compliance Issues</h3>{analytics?.issues.length ? <div className="space-y-3">{analytics.issues.map((issue) => <div key={issue.issue} className="flex justify-between border-b pb-3"><span>{issue.issue}</span><span className="font-mono">{issue.count}</span></div>)}</div> : <p className="text-gray-500">No rule issues found.</p>}</div>
      <div className="bg-white border border-gray-200 rounded-lg p-6"><h3 className="text-lg font-semibold mb-4">E-Way Status Breakdown</h3>{analytics?.ewayStatuses.length ? <div className="space-y-3">{analytics.ewayStatuses.map((item) => <div key={item.status} className="flex justify-between border-b pb-3"><span>{item.status}</span><span className="font-mono">{item.count}</span></div>)}</div> : <p className="text-gray-500">No e-way statuses found.</p>}</div>
    </div>}
  </ManufacturingLayout>
}
