import { getDecisionBadgeClass } from '../lib/pipeline'
import type { Decision } from '../types'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  decision?: Decision
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function Badge({ children, variant = 'default', decision, className = '', size = 'md' }: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full font-medium border'
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  }
  
  let variantStyles = ''
  if (decision) {
    variantStyles = getDecisionBadgeClass(decision)
  } else {
    const variantMap = {
      default: 'bg-gray-100 text-gray-800 border-gray-300',
      success: 'bg-green-100 text-green-800 border-green-300',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      danger: 'bg-red-100 text-red-800 border-red-300',
      info: 'bg-blue-100 text-blue-800 border-blue-300',
    }
    variantStyles = variantMap[variant]
  }

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyles} ${className}`}>
      {children}
    </span>
  )
}
