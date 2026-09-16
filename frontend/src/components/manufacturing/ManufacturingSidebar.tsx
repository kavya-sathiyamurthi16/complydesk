import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  FileText, 
  Building2, 
  AlertTriangle, 
  BarChart3, 
  Settings,
  ChevronRight,
  Upload,
  Clock
} from 'lucide-react'
import { useState } from 'react'

function BrandLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="ComplyDesk brand mark">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M26 25H72L94 48V72L72 95H26L8 72V48L26 25Z" strokeWidth="6" opacity="0.95" />
        <path d="M35 35H68L84 52V67L68 84H35L19 67V52L35 35Z" strokeWidth="5.2" opacity="0.8" />
        <path d="M30 70L46 55L57 64L70 50L90 66" strokeWidth="5.2" />
        <path d="M44 73V51" strokeWidth="5.2" opacity="0.8" />
      </g>
    </svg>
  )
}

interface SidebarProps {
  isCollapsed?: boolean
  onToggle?: () => void
}

const navigationSections = [
  {
    title: 'Main',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: Home },
    ],
  },
  {
    title: 'Invoice Management',
    items: [
      { name: 'All Invoices', href: '/invoices', icon: FileText },
      { name: 'Upload Invoice', href: '/upload-invoice', icon: Upload },
      { name: 'Review Queue', href: '/review-queue', icon: Clock },
    ],
  },
  {
    title: 'Operations',
    items: [
      { name: 'Vendors', href: '/vendors', icon: Building2 },
      { name: 'Companies', href: '/companies', icon: Building2 },
    ],
  },
  {
    title: 'Compliance',
    items: [
      { name: 'Compliance Center', href: '/compliance', icon: AlertTriangle },
      { name: 'Reports', href: '/reports', icon: BarChart3 },
    ],
  },
  {
    title: 'System',
    items: [
      { name: 'Settings', href: '/settings', icon: Settings },
    ],
  },
]

export function ManufacturingSidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <span>✕</span> : <span>☰</span>}
      </button>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white text-slate-700 border-r border-slate-200 z-50 flex flex-col
          transition-all duration-300 ease-in-out shadow-[0_15px_40px_rgba(15,23,42,0.05)]
          ${isCollapsed ? 'w-16' : 'w-64'}
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-slate-200 px-4 flex-shrink-0 bg-white">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100">
                <BrandLogo className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900">COMPLYDESK</h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Finance control</p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100">
              <BrandLogo className="h-6 w-6" />
            </div>
          )}
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto overflow-x-hidden">
          {navigationSections.map((section) => (
            <div key={section.title}>
              {!isCollapsed && (
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.href

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`
                        flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200
                        ${isActive
                          ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100 shadow-[0_0_0_1px_rgba(99,102,241,0.06)]'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon size={18} />
                      {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
                      {!isCollapsed && isActive && <ChevronRight size={16} className="ml-auto text-indigo-500" />}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Collapse toggle */}
        {onToggle && (
          <div className="p-4 flex-shrink-0 border-t border-slate-200">
            <button
              onClick={() => {
                onToggle()
                setMobileMenuOpen(false)
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-sm text-slate-600 transition hover:border-indigo-200 hover:text-slate-900"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <span>→</span> : <span>←</span>}
            </button>
          </div>
        )}
      </aside>
    </>
  )
}