import { ManufacturingLayout } from '../../components/manufacturing/ManufacturingLayout'
import { useState, useEffect } from 'react'
import { getShipments } from '../../services/dataService'

export function ManufacturingShipments() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        setIsLoading(true)
        setError(null)
        await getShipments()
      } catch (err) {
        console.error('Error fetching shipments:', err)
        setError('Failed to load shipments. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchShipments()
  }, [])

  if (error) {
    return (
      <ManufacturingLayout title="Shipments" subtitle="Manage logistics shipments">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">{error}</p>
        </div>
      </ManufacturingLayout>
    )
  }

  if (isLoading) {
    return (
      <ManufacturingLayout title="Shipments" subtitle="Manage logistics shipments">
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
    <ManufacturingLayout title="Shipments" subtitle="Unavailable for the connected schema">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <p className="text-gray-500 text-center py-8">The connected schema has no shipments table or shipment columns.</p>
      </div>
    </ManufacturingLayout>
  )
}
