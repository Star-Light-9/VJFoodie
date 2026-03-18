import { Link } from 'react-router-dom'

const OrderCard = ({ order }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-food-dark">Order #{order.id}</h3>
          <p className="text-gray-600 text-sm">{order.date}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          order.status === 'Completed' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {order.status}
        </span>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-700 font-medium mb-2">Items:</p>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          {order.items.map((item, idx) => (
            <li key={idx}>
              {item.name} x{item.quantity} - ₹{item.price * item.quantity}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold text-food-orange">₹{order.total}</span>
        <div className="space-x-2">
          <Link
            to={`/track/${order.id}`}
            className="bg-food-green hover:bg-food-green/80 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Track
          </Link>
          <button className="bg-food-orange hover:bg-food-orange/80 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
            Reorder
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderCard

