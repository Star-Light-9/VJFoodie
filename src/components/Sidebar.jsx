import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, Package, LogOut, Utensils } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const menuItems = [
    { path: '/staff/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/staff/orders', label: 'Orders', icon: ClipboardList },
    { path: '/staff/menu', label: 'Manage Menu', icon: Utensils },
    { path: '/staff/pantry', label: 'Pantry', icon: Package },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="bg-white border-r border-slate-200 text-food-dark w-64 min-h-screen p-4 shadow-sm z-10 relative flex flex-col">
      <div className="mb-8 px-2 mt-4">
        <h2 className="text-2xl font-bold text-food-dark">Staff Portal</h2>
        <p className="text-slate-500 text-sm mt-1">VJFoodie Management</p>
      </div>
      
      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-all font-medium ${
                isActive
                  ? 'bg-food-orange text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-food-dark'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
      
      <div className="mt-auto border-t border-slate-200 pt-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center space-x-3 px-4 py-3 rounded-md transition-all font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar

