/**
 * Data processing and pipeline utilities for deterministic rule engine
 */

import type { Decision } from '../types';

/**
 * Get color class for decision type
 */
export function getDecisionColor(decision: Decision): string {
  switch (decision) {
    case 'PASS':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'REVIEW':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'BLOCK':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

/**
 * Get badge style for decision type
 */
export function getDecisionBadgeClass(decision: Decision): string {
  switch (decision) {
    case 'PASS':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'REVIEW':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'BLOCK':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

/**
 * Get check status color
 */
export function getCheckStatusColor(status: 'PASS' | 'FLAG'): string {
  switch (status) {
    case 'PASS':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'FLAG':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

/**
 * Check if decision requires immediate attention
 */
export function requiresImmediateAttention(decision: Decision): boolean {
  return decision === 'BLOCK' || decision === 'REVIEW';
}
