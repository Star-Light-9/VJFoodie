import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { Utensils, Home, Menu as MenuIcon, ClipboardList, LayoutDashboard, ShoppingCart, LogOut, LogIn, UserPlus } from 'lucide-react'

const Navbar = () => {
  const { getCartCount } = useCart()
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // If staff is logged in, hide Navbar entirely since Staff has a sidebar
  if (user?.role === 'staff') {
    return null
  }

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-slate-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Utensils className="w-7 h-7 text-food-orange" />
            <span className="text-food-dark font-bold text-xl tracking-wide hidden sm:inline">VJFoodie</span>
          </Link>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            {!user ? (
               <>
                 <Link to="/login" className="flex items-center space-x-1 px-4 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors">
                   <LogIn className="w-4 h-4" />
                   <span>Login</span>
                 </Link>
                 <Link to="/signup" className="flex items-center space-x-1 px-4 py-2 rounded-md text-sm font-medium text-white bg-food-orange hover:bg-orange-600 transition-colors shadow-sm">
                   <UserPlus className="w-4 h-4" />
                   <span className="hidden sm:inline">Sign up</span>
                 </Link>
               </>
            ) : (
               <>
                <Link
                  to="/"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/') ? 'text-food-orange bg-orange-50' : 'text-slate-600 hover:text-food-orange hover:bg-slate-50'}`}
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden md:inline">Home</span>
                </Link>
                <Link
                  to="/menu"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/menu') ? 'text-food-orange bg-orange-50' : 'text-slate-600 hover:text-food-orange hover:bg-slate-50'}`}
                >
                  <MenuIcon className="w-4 h-4" />
                  <span className="hidden md:inline">Menu</span>
                </Link>
                <Link
                  to="/orders"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/orders') ? 'text-food-orange bg-orange-50' : 'text-slate-600 hover:text-food-orange hover:bg-slate-50'}`}
                >
                  <ClipboardList className="w-4 h-4" />
                  <span className="hidden md:inline">Orders</span>
                </Link>
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-food-orange bg-orange-50' : 'text-slate-600 hover:text-food-orange hover:bg-slate-50'}`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden md:inline">Dashboard</span>
                </Link>
                <Link
                  to="/cart"
                  className={`relative flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/cart') ? 'text-food-orange bg-orange-50' : 'text-slate-600 hover:text-food-orange hover:bg-slate-50'}`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden md:inline">Cart</span>
                  {getCartCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-food-orange text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-sm">
                      {getCartCount()}
                    </span>
                  )}
                </Link>
                <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 border border-transparent transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Logout</span>
                </button>
               </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

