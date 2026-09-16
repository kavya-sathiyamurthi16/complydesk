import type { InvoiceStatus, VendorStatus, ContractStatus, POStatus, ShipmentStatus, Decision } from '../../types'

interface StatusBadgeProps {
  status: InvoiceStatus | VendorStatus | ContractStatus | POStatus | ShipmentStatus | Decision | 'PASS'
  size?: 'sm' | 'md' | 'lg'
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  }

  const getStatusConfig = (status: string) => {
    // Invoice Status / Decision
    if (status === 'PASS') return { bgColor: 'bg-green-100', textColor: 'text-green-700', icon: '✓' }
    if (status === 'CLEAR') return { bgColor: 'bg-green-100', textColor: 'text-green-700', icon: '✓' }
    if (status === 'REVIEW') return { bgColor: 'bg-amber-100', textColor: 'text-amber-700', icon: '⚠' }
    if (status === 'BLOCK') return { bgColor: 'bg-red-100', textColor: 'text-red-700', icon: '✕' }
    if (status === 'BLOCKED') return { bgColor: 'bg-red-100', textColor: 'text-red-700', icon: '✕' }
    if (status === 'PAID') return { bgColor: 'bg-green-100', textColor: 'text-green-700', icon: '✓' }
    if (status === 'PENDING') return { bgColor: 'bg-gray-100', textColor: 'text-gray-700', icon: '○' }
    
    // Vendor Status
    if (status === 'Approved') return { bgColor: 'bg-green-100', textColor: 'text-green-700', icon: '✓' }
    if (status === 'Blocked') return { bgColor: 'bg-red-100', textColor: 'text-red-700', icon: '✕' }
    if (status === 'Pending') return { bgColor: 'bg-gray-100', textColor: 'text-gray-700', icon: '○' }
    
    // Contract Status
    if (status === 'Active') return { bgColor: 'bg-green-100', textColor: 'text-green-700', icon: '✓' }
    if (status === 'Expired') return { bgColor: 'bg-red-100', textColor: 'text-red-700', icon: '✕' }
    
    // PO Status
    if (status === 'Active') return { bgColor: 'bg-green-100', textColor: 'text-green-700', icon: '✓' }
    if (status === 'Closed') return { bgColor: 'bg-gray-100', textColor: 'text-gray-700', icon: '✓' }
    if (status === 'Partially Used') return { bgColor: 'bg-amber-100', textColor: 'text-amber-700', icon: '⚠' }
    
    // Shipment Status
    if (status === 'Delivered') return { bgColor: 'bg-green-100', textColor: 'text-green-700', icon: '✓' }
    if (status === 'In Transit') return { bgColor: 'bg-blue-100', textColor: 'text-blue-700', icon: '→' }
    if (status === 'Pending') return { bgColor: 'bg-gray-100', textColor: 'text-gray-700', icon: '○' }
    
    // Default
    return { bgColor: 'bg-gray-100', textColor: 'text-gray-700', icon: '○' }
  }

  const config = getStatusConfig(status)

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md font-medium ${config.bgColor} ${config.textColor} ${sizeClasses[size]}`}
    >
      <span>{config.icon}</span>
      <span>{status}</span>
    </span>
  )
}