import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getOrderById } from '../lib/supabaseAPI'
import { ClipboardList, ChefHat, CheckCircle, CheckCheck, Loader2 } from 'lucide-react'

const TrackOrder = () => {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      const { data, error } = await getOrderById(orderId)
      if (error) {
        console.error('Error fetching order:', error)
      } else {
        setOrder(data)
      }
      setLoading(false)
    }
    fetchOrder()
  }, [orderId])

  const statusSteps = [
    { id: 1, name: 'Order Placed', icon: <ClipboardList className="w-6 h-6" /> },
    { id: 2, name: 'Preparing', icon: <ChefHat className="w-6 h-6" /> },
    { id: 3, name: 'Ready', icon: <CheckCircle className="w-6 h-6" /> },
    { id: 4, name: 'Completed', icon: <CheckCheck className="w-6 h-6" /> },
  ]

  const getStatusIndex = (status) => {
    const statusMap = {
      'Order Placed': 1,
      'Preparing': 2,
      'Ready': 3,
      'Completed': 4
    }
    return statusMap[status] || 1
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-food-surface flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-food-orange animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-lg">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-food-surface flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-food-dark mb-2">Order not found</h2>
          <p className="text-gray-600">Could not find order #{orderId}</p>
        </div>
      </div>
    )
  }

  const currentStep = getStatusIndex(order.status)
  const formattedDate = new Date(order.order_date).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  const items = (order.order_items || []).map(oi => ({
    name: oi.menu?.item_name || 'Unknown Item',
    quantity: oi.quantity,
    price: Number(oi.price_at_time)
  }))

  return (
    <div className="min-h-screen bg-food-surface py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-food-dark mb-8">Track Order #{order.order_id}</h1>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-food-dark mb-4">Order Details</h2>
            <div className="space-y-2 text-gray-700">
              <p><span className="font-semibold">Order ID:</span> {order.order_id}</p>
              <p><span className="font-semibold">Date:</span> {formattedDate}</p>
              <p><span className="font-semibold">Total:</span> <span className="text-food-orange font-bold text-xl">₹{order.total_price}</span></p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-food-dark mb-3">Items:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {items.map((item, idx) => (
                <li key={idx}>
                  {item.name} x{item.quantity} - ₹{item.price * item.quantity}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-food-dark mb-8">Order Status</h2>
          
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200">
              <div
                className="absolute top-0 left-0 w-full bg-food-orange transition-all duration-500"
                style={{ height: `${((currentStep - 1) / (statusSteps.length - 1)) * 100}%` }}
              />
            </div>

            {/* Status Steps */}
            <div className="relative space-y-8">
              {statusSteps.map((step, idx) => {
                const isCompleted = step.id <= currentStep
                const isCurrent = step.id === currentStep

                return (
                  <div key={step.id} className="flex items-start gap-6">
                    <div
                      className={`w-16 h-16 rounded-md flex items-center justify-center text-2xl font-bold transition-all ${
                        isCompleted
                          ? 'bg-food-orange text-white font-medium shadow-lg scale-110'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {step.icon}
                    </div>
                    <div className="flex-grow pt-2">
                      <h3
                        className={`text-xl font-bold mb-1 ${
                          isCompleted ? 'text-food-dark' : 'text-gray-400'
                        }`}
                      >
                        {step.name}
                      </h3>
                      {isCurrent && (
                        <p className="text-food-orange font-semibold">In Progress...</p>
                      )}
                      {isCompleted && !isCurrent && (
                        <p className="text-green-600 font-semibold">✓ Completed</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrackOrder
