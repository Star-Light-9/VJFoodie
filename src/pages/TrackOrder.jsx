import { useParams } from 'react-router-dom'
import { orderHistory } from '../data/dummyData'
import { ClipboardList, ChefHat, CheckCircle, CheckCheck } from 'lucide-react'

const TrackOrder = () => {
  const { orderId } = useParams()
  const order = orderHistory.find(o => o.id === orderId) || {
    id: orderId,
    date: '2024-01-15',
    items: [{ name: 'Veg Biryani', quantity: 2, price: 120 }],
    total: 290,
    status: 'Preparing'
  }

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

  const currentStep = getStatusIndex(order.status)

  return (
    <div className="min-h-screen bg-food-surface py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-food-dark mb-8">Track Order #{order.id}</h1>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-food-dark mb-4">Order Details</h2>
            <div className="space-y-2 text-gray-700">
              <p><span className="font-semibold">Order ID:</span> {order.id}</p>
              <p><span className="font-semibold">Date:</span> {order.date}</p>
              <p><span className="font-semibold">Total:</span> <span className="text-food-orange font-bold text-xl">₹{order.total}</span></p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-food-dark mb-3">Items:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {order.items.map((item, idx) => (
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

