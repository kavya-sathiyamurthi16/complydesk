import { ManufacturingLayout } from '../../components/manufacturing/ManufacturingLayout'
import { getPurchaseOrders } from '../../services/dataService'
import type { PurchaseOrder } from '../../services/dataService'
import { useEffect, useState } from 'react'

export function ManufacturingPurchaseOrders() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => { getPurchaseOrders().then(setOrders).catch(() => setError('Failed to load orders.')).finally(() => setLoading(false)) }, [])
  return <ManufacturingLayout title="Orders" subtitle="Orders, SKU weights, and fulfillment data">
    {loading ? <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">Loading orders...</div> : error ? <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">{error}</div> : <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {orders.length === 0 ? <p className="text-gray-500 text-center py-8">No order rows found.</p> : <table className="w-full"><thead><tr className="border-b bg-gray-50"><th className="text-left py-4 px-6">Order No</th><th className="text-left py-4 px-6">SKU</th><th className="text-right py-4 px-6">Order Qty</th><th className="text-right py-4 px-6">Weight (g)</th><th className="text-left py-4 px-6">Zone</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id} className="border-b hover:bg-gray-50"><td className="py-4 px-6 font-mono">{order.poNumber}</td><td className="py-4 px-6 font-mono">{order.sku}</td><td className="py-4 px-6 text-right">{order.orderQty.toLocaleString()}</td><td className="py-4 px-6 text-right">{order.weightGrams == null ? 'N/A' : order.weightGrams.toLocaleString()}</td><td className="py-4 px-6">{order.zone || 'N/A'}</td></tr>)}</tbody></table>}
    </div>}
  </ManufacturingLayout>
}
