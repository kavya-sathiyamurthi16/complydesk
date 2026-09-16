import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  FileCheck2,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

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

const stats = [
  { label: 'Invoices processed', value: '2,486', icon: FileCheck2 },
  { label: 'Rules tracked', value: '18.7k', icon: BarChart3 },
  { label: 'Risk identified', value: '94.2%', icon: CircleDollarSign },
]

const featureCards = [
  {
    title: 'Enterprise invoice screening',
    description: 'Automate risk checks across supplier, tax, and policy rules without slowing down AP workflows.',
    icon: Building2,
  },
  {
    title: 'Finance-grade reporting',
    description: 'Turn fragmented invoice data into board-ready visibility across volumes, exceptions, and spending health.',
    icon: TrendingUp,
  },
  {
    title: 'Operational accountability',
    description: 'Assign review tasks, document decisions, and keep teams aligned around the same evidence trail.',
    icon: CheckCircle2,
  },
]

const processSteps = [
  'Connect your invoice flow and compliance policies',
  'Review exceptions with rule-backed recommendations',
  'Approve, escalate, or block with full audit visibility',
]

export function Landing() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.20),transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),transparent_32%)]" />

        <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
          <button onClick={() => navigate('/')} className="flex items-center gap-3" aria-label="ComplyDesk home">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-indigo-700 shadow-lg shadow-indigo-200/60 ring-1 ring-slate-200">
              <BrandLogo className="h-9 w-9" />
            </span>
            <span>
              <span className="block text-lg font-bold tracking-tight text-slate-950">COMPLYDESK</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Finance control</span>
            </span>
          </button>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <button className="transition-colors hover:text-slate-950">Platform</button>
            <button className="transition-colors hover:text-slate-950">Solutions</button>
            <button className="transition-colors hover:text-slate-950">Customers</button>
            <button className="transition-colors hover:text-slate-950">Resources</button>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700"
          >
            Open dashboard <ArrowRight size={16} />
          </button>
        </nav>

        <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 pb-16 pt-10 lg:grid-cols-[1.08fr_0.92fr] lg:px-10 lg:pb-24 lg:pt-14">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-700 shadow-sm">
              <Sparkles size={12} /> Built for modern finance teams
            </div>

            <h1 className="text-5xl font-semibold leading-[0.96] tracking-[-0.06em] text-slate-950 sm:text-6xl lg:text-7xl">
              Keep every invoice compliant and every payment on track.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
              ComplyDesk centralizes supplier checks, invoice intelligence, and approval workflows so finance leaders can reduce risk, accelerate processing, and stay audit-ready.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="group inline-flex items-center justify-center gap-3 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-600/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15">
                  <ArrowRight size={17} />
                </span>
                Start now
              </button>

              <button
                onClick={() => navigate('/upload-invoice')}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-300 hover:text-indigo-700"
              >
                Screen an invoice
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-600" /> Supplier risk visibility</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-600" /> Audit-ready workflows</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-600" /> Enterprise controls</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-14 h-28 w-28 rounded-full border-[14px] border-indigo-100" />
            <div className="absolute -right-3 bottom-6 h-20 w-20 rounded-full border-[10px] border-cyan-100" />

            <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_30px_90px_rgba(15,23,42,0.15)] sm:p-7">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Live overview</p>
                  <p className="mt-1 text-xl font-semibold text-slate-900">Finance command center</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                  <Building2 size={20} />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {stats.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-2xl bg-slate-50 p-3.5">
                    <Icon size={16} className="text-indigo-600" />
                    <p className="mt-4 text-2xl font-semibold text-slate-900">{value}</p>
                    <p className="mt-1 text-[10px] leading-4 text-slate-500">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Compliance momentum</p>
                    <p className="mt-1 text-xs text-slate-500">This month</p>
                  </div>
                  <BarChart3 size={18} className="text-indigo-600" />
                </div>

                <div className="mt-6 flex h-28 items-end gap-2.5">
                  {[42, 58, 48, 76, 64, 88, 80, 100, 90].map((height, index) => (
                    <div key={index} className="flex-1 rounded-t-md bg-gradient-to-t from-indigo-600 to-cyan-400" style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <CheckCircle2 size={17} />
                <span><strong>96.4%</strong> of invoices are cleared without manual intervention.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="relative mx-auto max-w-7xl px-6 pb-20 lg:px-10">
          <div className="grid gap-5 md:grid-cols-3">
            {featureCards.map(({ title, description, icon: Icon }) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                  <Icon size={22} />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-slate-900">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative mx-auto max-w-7xl px-6 pb-20 lg:px-10">
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                <BrandLogo className="h-7 w-7" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">How it works</p>
                <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Control risk from intake to approval.</h2>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {processSteps.map((step, index) => (
                <div key={step} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="text-base font-medium leading-7 text-slate-800">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative mx-auto max-w-7xl px-6 pb-24 lg:px-10">
          <div className="rounded-[30px] border border-indigo-100 bg-gradient-to-r from-indigo-600 to-indigo-500 p-8 text-white shadow-[0_20px_60px_rgba(79,70,229,0.25)] sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-100">Trusted finance operations</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Build a cleaner, safer invoice process.
                </h2>
              </div>

              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-indigo-700 transition-transform hover:-translate-y-0.5"
              >
                Launch workspace <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
