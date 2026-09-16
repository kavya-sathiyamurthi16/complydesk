import type { Decision } from '../types'
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react'

interface DecisionBadgeProps {
  decision: Decision
  size?: 'sm' | 'md' | 'lg'
  showSize?: boolean
}

export function DecisionBadge({ decision, size = 'md', showSize = true }: DecisionBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  }

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20,
  }

  const actualSize = showSize ? size : 'sm'

  const decisionConfig = {
    PASS: {
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      icon: CheckCircle,
      label: 'PASS',
    },
    REVIEW: {
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200',
      icon: AlertCircle,
      label: 'REVIEW',
    },
    BLOCK: {
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      icon: XCircle,
      label: 'BLOCK',
    },
    PENDING: {
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-200',
      icon: AlertCircle,
      label: 'PENDING',
    },
  }

  const config = decisionConfig[decision]
  const Icon = config.icon

  return (
    <div
      className={`
        inline-flex items-center gap-2 rounded-lg border ${config.bgColor} 
        ${config.textColor} ${config.borderColor} ${sizeClasses[actualSize]}
      `}
    >
      <Icon size={iconSizes[actualSize]} />
      <span className="font-semibold">{config.label}</span>
    </div>
  )
}