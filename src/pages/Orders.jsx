import { useState, useEffect } from 'react'
import { getUserOrders } from '../lib/supabaseAPI'
import OrderCard from '../components/OrderCard'
import { Package, Loader2 } from 'lucide-react'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await getUserOrders()
      if (error) {
        console.error('Error fetching orders:', error)
      } else {
        setOrders(data)
      }
      setLoading(false)
    }
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-food-surface flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-food-orange animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-lg">Loading your orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-food-surface py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-food-dark mb-8">Order History</h1>
        
        {orders.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {orders.map((order) => (
              <OrderCard key={order.order_id} order={order} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <Package className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h2 className="text-3xl font-bold text-food-dark mb-4">No orders yet</h2>
            <p className="text-gray-600">Start ordering to see your order history here!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
