import { ManufacturingLayout } from '../../components/manufacturing/ManufacturingLayout'
import { useState, useEffect } from 'react'
import { getContracts } from '../../services/dataService'
import type { Contract } from '../../services/dataService'

export function ManufacturingContracts() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [contracts, setContracts] = useState<Contract[]>([])

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        setContracts(await getContracts())
      } catch (err) {
        console.error('Error fetching contracts:', err)
        setError('Failed to load contracts. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchContracts()
  }, [])

  if (error) {
    return (
      <ManufacturingLayout title="Contracts" subtitle="Manage vendor contracts">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">{error}</p>
        </div>
      </ManufacturingLayout>
    )
  }

  if (isLoading) {
    return (
      <ManufacturingLayout title="Contracts" subtitle="Manage vendor contracts">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </ManufacturingLayout>
    )
  }

  return (
    <ManufacturingLayout title="Contracts" subtitle="Unavailable for the connected schema">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {contracts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">The connected schema has no contracts table or contract columns.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Contract</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Vendor</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Rate</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Valid Until</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract) => (
                  <tr key={contract.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm font-mono text-gray-900">{contract.contractNumber}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{contract.vendorName}</td>
                    <td className="py-4 px-6 text-sm text-right text-gray-900">
                      {contract.agreedRate.toLocaleString()} / {contract.rateUnit.replace('_', ' ')}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">{contract.validTo || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ManufacturingLayout>
  )
}
