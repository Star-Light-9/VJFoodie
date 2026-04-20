import { Link } from 'react-router-dom'

const OrderCard = ({ order }) => {
  // Format the date from Supabase timestamp
  const formattedDate = new Date(order.order_date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  // Extract order items — Supabase returns nested data
  const items = (order.order_items || []).map(oi => ({
    name: oi.menu?.item_name || 'Unknown Item',
    quantity: oi.quantity,
    price: Number(oi.price_at_time)
  }))

  return (
    <div className="bg-white rounded-md shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-food-dark">Order #{order.order_id}</h3>
          <p className="text-gray-600 text-sm">{formattedDate}</p>
        </div>
        <span className={`px-3 py-1 rounded-md text-sm font-semibold ${
          order.status === 'Completed' 
            ? 'bg-green-100 text-green-800' 
            : order.status === 'Cancelled'
            ? 'bg-red-100 text-red-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {order.status}
        </span>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-700 font-medium mb-2">Items:</p>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          {items.map((item, idx) => (
            <li key={idx}>
              {item.name} x{item.quantity} - ₹{item.price * item.quantity}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold text-food-orange">₹{order.total_price}</span>
        <div className="space-x-2">
          <Link
            to={`/track/${order.order_id}`}
            className="bg-food-green hover:bg-food-green/80 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Track
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderCard
