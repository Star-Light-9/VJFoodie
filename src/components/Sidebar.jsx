import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation()

  const menuItems = [
    { path: '/staff/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/staff/orders', label: 'Orders', icon: '📋' },
    { path: '/staff/pantry', label: 'Pantry', icon: '🥘' },
  ]

  return (
    <div className="bg-gradient-to-b from-food-dark to-gray-800 text-white w-64 min-h-screen p-4 shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-food-yellow">Staff Portal</h2>
        <p className="text-gray-400 text-sm">Canteen Management</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              location.pathname === item.path
                ? 'bg-food-orange text-white shadow-md'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar

