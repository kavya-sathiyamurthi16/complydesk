import { ManufacturingLayout } from '../../components/manufacturing/ManufacturingLayout'
import { StatusBadge } from '../../components/manufacturing/StatusBadge'
import { Plus, Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getVendors } from '../../services/dataService'
import type { Vendor } from '../../services/dataService'

export function ManufacturingVendors() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null)
  const [vendors, setVendors] = useState<Vendor[]>([])

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getVendors()
        setVendors(data)
      } catch (err) {
        console.error('Error fetching vendors:', err)
        setError('Failed to load vendors. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchVendors()
  }, [])

  const filteredVendors = vendors.filter((vendor) =>
    vendor.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.vendorId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedVendorData = selectedVendor 
    ? vendors.find(v => v.vendorId === selectedVendor)
    : null

  if (error) {
    return (
      <ManufacturingLayout 
        title="Vendors" 
        subtitle="Manage logistics service providers"
      >
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </ManufacturingLayout>
    )
  }

  if (isLoading) {
    return (
      <ManufacturingLayout 
        title="Vendors" 
        subtitle="Manage logistics service providers"
      >
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
    <ManufacturingLayout 
      title="Vendors" 
      subtitle="Manage logistics service providers"
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
              <Plus size={18} />
              Add Vendor
            </button>
          </div>
        </div>

        {/* Vendor Detail View */}
        {selectedVendorData && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Vendor Details</h3>
              <button
                onClick={() => setSelectedVendor(null)}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                ← Back to List
              </button>
            </div>

            {/* Header */}
            <div className="border-b border-gray-200 pb-4 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600">Vendor Name</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedVendorData.vendorName}</p>
                  <p className="text-sm font-mono text-gray-600 mt-1">{selectedVendorData.vendorId}</p>
                </div>
                <StatusBadge status={selectedVendorData.status} />
              </div>
            </div>

            {/* Contact Block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-gray-600 mb-1">Seller Location</p>
                <p className="text-sm text-gray-900">{selectedVendorData.address || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Seller GSTIN</p>
                <p className="text-sm text-gray-900">{selectedVendorData.gstNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Tax ID</p>
                <p className="text-sm text-gray-900">{selectedVendorData.taxId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Source</p>
                <p className="text-sm text-gray-900">government_compliance</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Contracts</p>
                <p className="text-sm font-medium text-gray-500">Not in schema</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Invoices</p>
                <p className="text-2xl font-bold text-gray-900">{selectedVendorData.invoiceCount}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Total Value</p>
                <p className="text-lg font-bold text-gray-900">₹{selectedVendorData.totalValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Vendors Table */}
        {!selectedVendor && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Vendor ID</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Vendor Name</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Contracts</th>
                    <th className="text-right py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Invoices</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVendors.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        No seller company matches the current search.
                      </td>
                    </tr>
                  ) : (
                    filteredVendors.map((vendor) => (
                      <tr 
                        key={vendor.vendorId} 
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedVendor(vendor.vendorId)}
                      >
                        <td className="py-4 px-6 text-sm font-mono text-gray-900">{vendor.vendorId}</td>
                        <td className="py-4 px-6 text-sm text-gray-700">{vendor.vendorName}</td>
                        <td className="py-4 px-6">
                          <StatusBadge status={vendor.status} size="sm" />
                        </td>
                        <td className="py-4 px-6 text-sm font-mono text-gray-600">Not in schema</td>
                        <td className="py-4 px-6 text-sm font-mono text-right text-gray-900">{vendor.invoiceCount}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ManufacturingLayout>
  )
}