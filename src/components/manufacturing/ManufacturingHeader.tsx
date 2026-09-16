import { User, Bell, Upload, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

interface ManufacturingHeaderProps {
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

export function ManufacturingHeader({ title, subtitle, showUploadButton = false, notificationSummary = null }: ManufacturingHeaderProps) {
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const [userRole, setUserRole] = useState('Finance Team')
  const [userEmail, setUserEmail] = useState('')
  const notificationCount = (notificationSummary?.block ?? 0) + (notificationSummary?.review ?? 0)
  const notificationMessages = [
    notificationSummary?.block ? `${notificationSummary.block} blocked invoices` : null,
    notificationSummary?.review ? `${notificationSummary.review} reviewed invoices` : null,
    notificationSummary?.clear ? `${notificationSummary.clear} cleared invoices` : null,
  ].filter((message): message is string => Boolean(message))
  const hasNotifiedRef = useRef(false)

  useEffect(() => {
    // Set default user info since no login
    setUserRole('Finance Team')
    setUserEmail('finance@company.com')
  }, [])

  useEffect(() => {
    if (!notificationSummary || notificationCount === 0) {
      hasNotifiedRef.current = false
      setToastMessage(null)
      return
    }

    if (hasNotifiedRef.current) return

    const messageParts = [
      notificationSummary.block ? `${notificationSummary.block} blocked invoices` : null,
      notificationSummary.review ? `${notificationSummary.review} reviewed invoices` : null,
      notificationSummary.clear ? `${notificationSummary.clear} cleared invoices` : null,
    ].filter(Boolean)

    if (messageParts.length === 0) {
      hasNotifiedRef.current = false
      setToastMessage(null)
      return
    }

    const message = `Compliance alert: ${messageParts.join(', ')}`
    setToastMessage(message)
    hasNotifiedRef.current = true

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => undefined)
    }

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Complydesk compliance alert', {
        body: message,
      })
    }

    const timer = window.setTimeout(() => setToastMessage(null), 5000)
    return () => window.clearTimeout(timer)
  }, [notificationSummary, notificationCount])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleProfile = () => {
    setShowUserMenu(false)
    navigate('/settings')
  }

  return (
    <>
      {toastMessage && (
        <div className="fixed right-6 top-20 z-50 max-w-sm rounded-xl border border-blue-100 bg-white/95 px-4 py-3 shadow-[0_12px_32px_rgba(15,23,42,0.14)] backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Bell size={15} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900">Compliance alert</p>
              <p className="mt-0.5 text-sm leading-5 text-gray-600">{toastMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="ml-auto rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close compliance alert"
              title="Close compliance alert"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="flex h-full items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h1>
            {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-4">
            {showUploadButton && (
              <button
                onClick={() => navigate('/upload-invoice')}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
              >
                <Upload size={18} />
                <span>Upload Invoice</span>
              </button>
            )}

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications((visible) => !visible)}
                className="relative rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Notifications"
                aria-expanded={showNotifications}
              >
                <Bell size={20} />
                {notificationCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-14 z-50 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Compliance notifications</p>
                      <p className="text-xs text-slate-500">Current invoice summary</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      aria-label="Close notifications"
                      title="Close notifications"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="mt-3 space-y-2">
                    {notificationMessages.length > 0 ? notificationMessages.map((message) => (
                      <div key={message} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                        <Bell size={14} className="text-indigo-600" />
                        <span>{message}</span>
                      </div>
                    )) : (
                      <p className="py-2 text-sm text-slate-500">No compliance notifications.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-100"
                aria-label="User menu"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 shadow-lg shadow-indigo-600/20">
                  <User size={16} className="text-white" />
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-medium text-slate-900">{userRole}</p>
                  <p className="text-xs text-slate-500">{userEmail}</p>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-[0_18px_40px_rgba(15,23,42,0.12)] z-50">
                  <button
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                    onClick={handleProfile}
                  >
                    <User size={16} />
                    Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}