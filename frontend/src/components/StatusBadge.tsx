interface StatusBadgeProps {
  status: string
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
  }

  const statusConfig: Record<string, { bgColor: string; textColor: string }> = {
    Verified: { bgColor: 'bg-green-100', textColor: 'text-green-700' },
    Pending: { bgColor: 'bg-amber-100', textColor: 'text-amber-700' },
    Unverified: { bgColor: 'bg-red-100', textColor: 'text-red-700' },
    Active: { bgColor: 'bg-green-100', textColor: 'text-green-700' },
    Inactive: { bgColor: 'bg-gray-100', textColor: 'text-gray-700' },
    Paid: { bgColor: 'bg-green-100', textColor: 'text-green-700' },
    'Partially Billed': { bgColor: 'bg-amber-100', textColor: 'text-amber-700' },
    'Not Billed': { bgColor: 'bg-gray-100', textColor: 'text-gray-700' },
    'Fully Billed': { bgColor: 'bg-green-100', textColor: 'text-green-700' },
    Rejected: { bgColor: 'bg-red-100', textColor: 'text-red-700' },
  }

  const config = statusConfig[status] || { bgColor: 'bg-gray-100', textColor: 'text-gray-700' }

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-md font-medium ${config.bgColor} ${config.textColor} ${sizeClasses[size]}`}
    >
      {status}
    </span>
  )
}