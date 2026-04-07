import { Link } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { staffOrders } from '../../data/dummyData'
import { Package, Clock, CheckCircle, Award } from 'lucide-react'

const StaffDashboard = () => {
  const totalOrders = staffOrders.length
  const pendingOrders = staffOrders.filter(o => o.status === 'Order Placed' || o.status === 'Preparing').length
  const readyOrders = staffOrders.filter(o => o.status === 'Ready').length
  const completedToday = 12 // Dummy data

  const stats = [
    { title: 'Total Orders', value: totalOrders, icon: <Package className="w-8 h-8 text-food-orange" />, color: 'bg-orange-100' },
    { title: 'Pending', value: pendingOrders, icon: <Clock className="w-8 h-8 text-amber-500" />, color: 'bg-amber-100' },
    { title: 'Ready', value: readyOrders, icon: <CheckCircle className="w-8 h-8 text-emerald-500" />, color: 'bg-emerald-100' },
    { title: 'Completed', value: completedToday, icon: <Award className="w-8 h-8 text-blue-500" />, color: 'bg-blue-100' },
  ]

  return (
    <div className="flex min-h-screen bg-food-surface">
      <Sidebar />
      <div className="flex-grow p-8">
        <h1 className="text-3xl font-bold text-food-dark mb-8">Staff Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
            >
              <div className={`w-14 h-14 rounded-md ${stat.color} flex items-center justify-center mb-4`}>
                {stat.icon}
              </div>
              <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-food-dark">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Orders Preview */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-2xl font-bold text-food-dark mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {staffOrders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-food-dark">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">{order.items.join(', ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-food-orange text-lg">₹{order.total}</p>
                    <span className={`text-xs px-2 py-1 rounded-md ${
                      order.status === 'Ready' 
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'Preparing'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link
              to="/staff/orders"
              className="text-food-orange hover:text-food-orange/80 font-semibold"
            >
              View All Orders →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffDashboard

