import { ManufacturingSidebar } from './ManufacturingSidebar'
import { ManufacturingHeader } from './ManufacturingHeader'
import { useState } from 'react'

interface ManufacturingLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  showUploadButton?: boolean
  notificationSummary?: {
    totalInvoices?: number
    pass?: number
    review?: number
    block?: number
    clear?: number
  } | null
}

export function ManufacturingLayout({ children, title, subtitle, showUploadButton, notificationSummary = null }: ManufacturingLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),transparent_30%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] text-slate-900">
      <ManufacturingSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <ManufacturingHeader
          title={title}
          subtitle={subtitle}
          showUploadButton={showUploadButton}
          notificationSummary={notificationSummary}
        />

        <main className="p-6 lg:p-8">
          <div className="mx-auto max-w-[1500px]">{children}</div>
        </main>
      </div>
    </div>
  )
}