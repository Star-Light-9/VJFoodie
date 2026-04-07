import { orderHistory } from '../data/dummyData'
import OrderCard from '../components/OrderCard'
import { Package } from 'lucide-react'

const Orders = () => {
  return (
    <div className="min-h-screen bg-food-surface py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-food-dark mb-8">Order History</h1>
        
        {orderHistory.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {orderHistory.map((order) => (
              <OrderCard key={order.id} order={order} />
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

