import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getUserOrders } from '../lib/supabaseAPI'
import { useCart } from '../context/CartContext'
import { Package, Clock, Wallet, ShoppingCart, Loader2 } from 'lucide-react'

const Dashboard = () => {
  const { getCartCount, getTotalPrice } = useCart()
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

  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length
  const walletBalance = 500 // Placeholder — can be connected to a wallet table later

  const stats = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: <Package className="w-8 h-8 text-food-orange" />,
      color: 'bg-orange-100',
      link: '/orders'
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      icon: <Clock className="w-8 h-8 text-amber-500" />,
      color: 'bg-amber-100',
      link: '/orders'
    },
    {
      title: 'Wallet Balance',
      value: `₹${walletBalance}`,
      icon: <Wallet className="w-8 h-8 text-emerald-500" />,
      color: 'bg-emerald-100',
      link: '/payment'
    },
    {
      title: 'Cart Items',
      value: getCartCount(),
      icon: <ShoppingCart className="w-8 h-8 text-blue-500" />,
      color: 'bg-blue-100',
      link: '/cart'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-food-surface flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-food-orange animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-lg">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-food-surface py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-food-dark mb-8">Welcome Back</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <Link
              key={idx}
              to={stat.link}
              className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all"
            >
              <div className={`w-14 h-14 rounded-md ${stat.color} flex items-center justify-center mb-4`}>
                {stat.icon}
              </div>
              <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-food-dark">{stat.value}</p>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-food-dark mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              to="/menu"
              className="bg-food-orange text-white font-medium px-6 py-4 rounded-md font-semibold text-center hover:shadow-md transition-all shadow-sm"
            >
              Browse Menu
            </Link>
            <Link
              to="/cart"
              className="bg-white border border-slate-200 text-slate-700 font-medium px-6 py-4 rounded-md font-semibold text-center hover:shadow-md transition-all shadow-sm"
            >
              View Cart ({getCartCount()})
            </Link>
            <Link
              to="/orders"
              className="bg-white border border-slate-200 text-slate-700 font-medium px-6 py-4 rounded-md font-semibold text-center hover:shadow-md transition-all shadow-sm"
            >
              Order History
            </Link>
            <Link
              to="/feedback"
              className="bg-white border border-slate-200 text-slate-700 font-medium px-6 py-4 rounded-md font-semibold text-center hover:shadow-md transition-all shadow-sm"
            >
              Give Feedback
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-2xl font-bold text-food-dark mb-4">Recent Orders</h2>
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.slice(0, 3).map((order) => {
                const formattedDate = new Date(order.order_date).toLocaleDateString('en-IN', {
                  year: 'numeric', month: 'short', day: 'numeric'
                })
                return (
                  <div
                    key={order.order_id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-food-dark">Order #{order.order_id}</p>
                        <p className="text-sm text-gray-600">{formattedDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-food-orange text-lg">₹{order.total_price}</p>
                        <span className={`text-xs px-2 py-1 rounded-md ${
                          order.status === 'Completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
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
