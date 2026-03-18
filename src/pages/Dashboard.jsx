import { Link } from 'react-router-dom'
import { orderHistory } from '../data/dummyData'
import { useCart } from '../context/CartContext'

const Dashboard = () => {
  const { getCartCount, getTotalPrice } = useCart()
  const totalOrders = orderHistory.length
  const pendingOrders = orderHistory.filter(o => o.status !== 'Completed').length
  const walletBalance = 500 // Dummy wallet balance

  const stats = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: '📦',
      color: 'from-food-orange to-orange-500',
      link: '/orders'
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      icon: '⏳',
      color: 'from-yellow-400 to-yellow-500',
      link: '/orders'
    },
    {
      title: 'Wallet Balance',
      value: `₹${walletBalance}`,
      icon: '💰',
      color: 'from-food-green to-green-500',
      link: '/payment'
    },
    {
      title: 'Cart Items',
      value: getCartCount(),
      icon: '🛒',
      color: 'from-blue-400 to-blue-500',
      link: '/cart'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-food-dark mb-8">Welcome Back! 👋</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <Link
              key={idx}
              to={stat.link}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center text-3xl mb-4`}>
                {stat.icon}
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-food-dark">{stat.value}</p>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-food-dark mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/menu"
              className="bg-gradient-to-r from-food-orange to-orange-500 text-white px-6 py-4 rounded-lg font-semibold text-center hover:shadow-lg transition-shadow"
            >
              Browse Menu
            </Link>
            <Link
              to="/cart"
              className="bg-gradient-to-r from-food-green to-green-500 text-white px-6 py-4 rounded-lg font-semibold text-center hover:shadow-lg transition-shadow"
            >
              View Cart ({getCartCount()})
            </Link>
            <Link
              to="/orders"
              className="bg-gradient-to-r from-food-yellow to-yellow-500 text-white px-6 py-4 rounded-lg font-semibold text-center hover:shadow-lg transition-shadow"
            >
              Order History
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-food-dark mb-4">Recent Orders</h2>
          {orderHistory.length > 0 ? (
            <div className="space-y-4">
              {orderHistory.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-food-dark">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-food-orange text-lg">₹{order.total}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No recent orders</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

