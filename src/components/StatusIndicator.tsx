import type { Decision } from '../types'
import { getDecisionColor } from '../lib/pipeline'

interface StatusIndicatorProps {
  decision: Decision
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function StatusIndicator({ decision, size = 'md', className = '' }: StatusIndicatorProps) {
  const sizeStyles = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  }

  const colorStyles = getDecisionColor(decision)

  return (
    <div className={`rounded-full ${sizeStyles[size]} ${colorStyles} ${className}`} />
  )
}
