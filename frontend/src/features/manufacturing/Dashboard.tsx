import { ManufacturingLayout } from '../../components/manufacturing/ManufacturingLayout'
import { StatusBadge } from '../../components/manufacturing/StatusBadge'
import { KPISkeleton, ChartSkeleton, TableSkeleton } from '../../components/manufacturing/Skeleton'
import { TrendingUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { getInvoices } from '../../services/dataService'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import type { DashboardStats, Invoice } from '../../services/dataService'

export function ManufacturingDashboard() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [kpiAnimationComplete, setKpiAnimationComplete] = useState(false)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([])
  const [issueData, setIssueData] = useState<{ issue: string; count: number }[]>([])

  // Fetch data from data service
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const invoicesData = await getInvoices()
        const statsData = {
          totalInvoices: invoicesData.length,
          pass: invoicesData.filter((invoice) => invoice.status === 'PASS').length,
          review: invoicesData.filter((invoice) => invoice.status === 'REVIEW').length,
          block: invoicesData.filter((invoice) => invoice.status === 'BLOCK').length,
          pending: invoicesData.filter((invoice) => invoice.status === 'PENDING').length,
          potentialOverbilling: invoicesData
            .filter((invoice) => invoice.status === 'REVIEW' || invoice.status === 'BLOCK')
            .reduce((sum, invoice) => sum + invoice.amount, 0),
        }
        const issues = new Map<string, number>()
        invoicesData.forEach((invoice) => {
          const issue = String(invoice.ruleIssue || '').trim()
          if (issue) issues.set(issue, (issues.get(issue) || 0) + 1)
        })

        setDashboardStats(statsData)
        setRecentInvoices(invoicesData)
        setIssueData(Array.from(issues, ([issue, count]) => ({ issue, count })).sort((a, b) => b.count - a.count))
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const passPercentage = dashboardStats?.totalInvoices ? ((dashboardStats.pass / dashboardStats.totalInvoices) * 100).toFixed(1) : '0'
  const reviewPercentage = dashboardStats?.totalInvoices ? ((dashboardStats.review / dashboardStats.totalInvoices) * 100).toFixed(1) : '0'
  const blockPercentage = dashboardStats?.totalInvoices ? ((dashboardStats.block / dashboardStats.totalInvoices) * 100).toFixed(1) : '0'

  // Count-up animation effect
  useEffect(() => {
    setKpiAnimationComplete(false)
    const timer = setTimeout(() => setKpiAnimationComplete(true), 500)
    return () => clearTimeout(timer)
  }, [])

  // Donut chart data
  const decisionData = dashboardStats ? [
    { name: 'PASS', value: dashboardStats.pass, color: '#22c55e' },
    { name: 'REVIEW', value: dashboardStats.review, color: '#f59e0b' },
    { name: 'BLOCK', value: dashboardStats.block, color: '#ef4444' },
  ] : []

  if (error) {
    return (
      <ManufacturingLayout 
        title="Dashboard" 
        subtitle="Compliance overview for today"
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
      title="Dashboard" 
      subtitle="Compliance overview for today"
      showUploadButton={true}
      notificationSummary={dashboardStats ? {
        totalInvoices: dashboardStats.totalInvoices,
        pass: dashboardStats.pass,
        review: dashboardStats.review,
        block: dashboardStats.block,
        clear: dashboardStats.pass,
      } : null}
    >
      <div className="space-y-6">
        {isLoading ? (
          <>
            <KPISkeleton />
            <ChartSkeleton />
            <ChartSkeleton />
            <TableSkeleton />
          </>
        ) : (
          <>
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-white via-indigo-50/40 to-slate-50 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
              <h2 className="mb-2 text-2xl font-semibold tracking-tight text-slate-900">
                Good morning, Finance Team — here is your compliance overview for today.
              </h2>
              <p className="text-slate-600">
                Review invoice screening results and take action on the highest-risk exceptions.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
                    <TrendingUp size={24} />
                  </div>
                  <span className="text-sm font-medium text-slate-500">Total</span>
                </div>
                <p className={`text-3xl font-bold text-slate-900 font-mono transition-all ${kpiAnimationComplete ? 'scale-100' : 'scale-95'}`}>
                  {dashboardStats?.totalInvoices ?? '—'}
                </p>
                <p className="mt-1 text-sm text-slate-600">Invoices Screened</p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                    <CheckCircle size={24} />
                  </div>
                  <span className="text-sm font-medium text-emerald-700">{passPercentage}%</span>
                </div>
                <p className={`text-3xl font-bold text-emerald-700 font-mono transition-all ${kpiAnimationComplete ? 'scale-100' : 'scale-95'}`}>
                  {dashboardStats?.pass ?? '—'}
                </p>
                <p className="mt-1 text-sm text-emerald-700">CLEARED</p>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
                    <AlertTriangle size={24} />
                  </div>
                  <span className="text-sm font-medium text-amber-700">{reviewPercentage}%</span>
                </div>
                <p className={`text-3xl font-bold text-amber-700 font-mono transition-all ${kpiAnimationComplete ? 'scale-100' : 'scale-95'}`}>
                  {dashboardStats?.review ?? '—'}
                </p>
                <p className="mt-1 text-sm text-amber-700">REVIEWED</p>
              </div>

              <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-xl bg-red-100 p-3 text-red-700">
                    <XCircle size={24} />
                  </div>
                  <span className="text-sm font-medium text-red-700">{blockPercentage}%</span>
                </div>
                <p className={`text-3xl font-bold text-red-700 font-mono transition-all ${kpiAnimationComplete ? 'scale-100' : 'scale-95'}`}>
                  {dashboardStats?.block ?? '—'}
                </p>
                <p className="mt-1 text-sm text-red-700">BLOCKED</p>
              </div>
            </div>

        {/* Compliance Overview - Donut Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Decision Breakdown</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={decisionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {decisionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-center mb-4">
                <p className="text-4xl font-bold text-gray-900 font-mono">{dashboardStats?.totalInvoices ?? '—'}</p>
                <p className="text-sm text-gray-600">Total Invoices</p>
              </div>
              <div className="space-y-2">
                {decisionData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-mono font-semibold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Compliance Issues */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Compliance Issues</h3>
          <div className="space-y-3">
            {issueData.slice(0, 5).map((item) => {
              return (
                <div key={item.issue} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-700">{item.issue}</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600 font-mono">{item.count}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Invoice Screenings */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Invoice Screenings</h3>
            <button 
              onClick={() => navigate('/invoices')}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Invoice</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Vendor</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">E-Way Status</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Decision Basis</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No invoice data available
                    </td>
                  </tr>
                ) : (
                  recentInvoices.slice(0, 5).map((invoice) => (
                    <tr 
                      key={invoice.id} 
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/screening-result/${invoice.id}`)}
                    >
                      <td className="py-3 px-4 text-sm font-mono text-gray-900">{invoice.invoiceNumber}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{invoice.vendorName || 'Unknown'}</td>
                      <td className="py-3 px-4 text-sm font-mono text-gray-700">{invoice.eway_status || 'Not provided'}</td>
                      <td className="py-3 px-4 text-sm font-mono text-right text-gray-900">₹{invoice.amount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                          {invoice.ruleIssue || invoice.expectedResult || 'E-way/status fields'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={invoice.decision || invoice.status} size="sm" />
                      </td>
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