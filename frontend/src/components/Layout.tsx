import { Outlet, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

interface NavSection {
  title: string
  items: Array<{
    path: string
    label: string
    icon?: React.ReactNode
  }>
}

export default function Layout() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const navSections: NavSection[] = [
    {
      title: 'Main',
      items: [
        { path: '/dashboard', label: 'Dashboard' },
      ]
    },
    {
      title: 'Invoice Screening',
      items: [
        { path: '/screen-invoice', label: 'Screen Invoice' },
        { path: '/screening-history', label: 'Screening History' },
      ]
    },
    {
      title: 'Vendors',
      items: [
        { path: '/vendors', label: 'Vendor Management' },
      ]
    },
    {
      title: 'Compliance',
      items: [
        { path: '/rules', label: 'Compliance Rules' },
        { path: '/audit-trail', label: 'Audit Trail' },
      ]
    },
  ]

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path === '/screening-history' && location.pathname.startsWith('/screening-result')) ||
           (path === '/vendors' && location.pathname.startsWith('/vendors/')) ||
           (path === '/screening-history' && location.pathname.startsWith('/human-review'))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            {sidebarOpen && (
              <h1 className="text-lg font-bold text-gray-900">ComplyDesk</h1>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.title}>
              {sidebarOpen && (
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon && (
                      <span className={sidebarOpen ? '' : 'mx-auto'}>
                        {item.icon}
                      </span>
                    )}
                    {sidebarOpen && <span>{item.label}</span>}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Toggle Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className={`w-5 h-5 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {navSections
                  .flatMap(section => section.items)
                  .find(item => isActive(item.path))?.label || 'Dashboard'}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-medium">FM</span>
                </div>
                <span>Finance Manager</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
