import { FileText, Truck, Package, DollarSign, AlertCircle } from 'lucide-react'

interface EvidenceCardProps {
  title: string
  icon: 'file' | 'truck' | 'package' | 'dollar' | 'alert'
  children: React.ReactNode
}

export function EvidenceCard({ title, icon, children }: EvidenceCardProps) {
  const iconConfig = {
    file: FileText,
    truck: Truck,
    package: Package,
    dollar: DollarSign,
    alert: AlertCircle,
  }

  const Icon = iconConfig[icon]

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={20} className="text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  )
}