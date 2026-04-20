import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import { getAllOrders, updateOrderStatus } from '../../lib/supabaseAPI'
import { ClipboardList, Loader2 } from 'lucide-react'

const StaffOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await getAllOrders()
      if (error) {
        console.error('Error fetching orders:', error)
      } else {
        setOrders(data)
      }
      setLoading(false)
    }
    fetchOrders()
  }, [])

  const handleUpdateStatus = async (orderId, newStatus) => {
    const { data, error } = await updateOrderStatus(orderId, newStatus)
    if (error) {
      console.error('Error updating order status:', error)
      return
    }
    // Update the local state
    setOrders(orders.map(order =>
      order.order_id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Placed':
        return 'bg-blue-100 text-blue-800'
      case 'Preparing':
        return 'bg-yellow-100 text-yellow-800'
      case 'Ready':
        return 'bg-green-100 text-green-800'
      case 'Completed':
        return 'bg-gray-100 text-gray-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'Order Placed':
        return 'Preparing'
      case 'Preparing':
        return 'Ready'
      case 'Ready':
        return 'Completed'
      default:
        return currentStatus
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-food-surface">
        <Sidebar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-food-orange animate-spin mx-auto mb-4" />
            <p className="text-slate-500 text-lg">Loading orders...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-food-surface">
      <Sidebar />
      <div className="flex-grow p-8">
        <h1 className="text-4xl font-bold text-food-dark mb-8">Order Queue</h1>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-food-orange text-white font-medium">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Order ID</th>
                  <th className="px-6 py-4 text-left font-semibold">Customer</th>
                  <th className="px-6 py-4 text-left font-semibold">Items</th>
                  <th className="px-6 py-4 text-left font-semibold">Time</th>
                  <th className="px-6 py-4 text-left font-semibold">Total</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => {
                  const itemNames = (order.order_items || [])
                    .map(oi => `${oi.menu?.item_name || 'Item'} x${oi.quantity}`)
                    .join(', ')
                  const formattedTime = new Date(order.order_date).toLocaleTimeString('en-IN', {
                    hour: '2-digit', minute: '2-digit'
                  })

                  return (
                    <tr key={order.order_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-food-dark">
                        #{order.order_id}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {order.profiles?.name || 'Customer'}
                      </td>
                      <td className="px-6 py-4 text-gray-700 max-w-xs truncate">
                        {itemNames || 'No items'}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{formattedTime}</td>
                      <td className="px-6 py-4 font-semibold text-food-orange">
                        ₹{order.total_price}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-md text-sm font-semibold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {order.status !== 'Completed' && order.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleUpdateStatus(order.order_id, getNextStatus(order.status))}
                            className="bg-food-green hover:bg-food-green/80 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                          >
                            {order.status === 'Order Placed' && 'Accept'}
                            {order.status === 'Preparing' && 'Mark Ready'}
                            {order.status === 'Ready' && 'Complete'}
                          </button>
                        )}
                        {(order.status === 'Completed' || order.status === 'Cancelled') && (
                          <span className="text-gray-400 text-sm">{order.status}</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {orders.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center mt-8">
            <ClipboardList className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h2 className="text-3xl font-bold text-food-dark mb-4">No orders</h2>
            <p className="text-gray-600">No orders in the queue at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StaffOrders
