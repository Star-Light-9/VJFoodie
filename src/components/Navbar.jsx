import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const Navbar = () => {
  const { getCartCount } = useCart()

  return (
    <nav className="bg-gradient-to-r from-food-orange to-orange-500 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">🍽️ CMS</span>
            <span className="text-white font-semibold hidden sm:inline">College Canteen</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-white hover:text-food-yellow transition-colors px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </Link>
            <Link
              to="/menu"
              className="text-white hover:text-food-yellow transition-colors px-3 py-2 rounded-md text-sm font-medium"
            >
              Menu
            </Link>
            <Link
              to="/orders"
              className="text-white hover:text-food-yellow transition-colors px-3 py-2 rounded-md text-sm font-medium"
            >
              Orders
            </Link>
            <Link
              to="/dashboard"
              className="text-white hover:text-food-yellow transition-colors px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/cart"
              className="relative text-white hover:text-food-yellow transition-colors px-3 py-2 rounded-md text-sm font-medium"
            >
              Cart
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-food-yellow text-food-dark rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {getCartCount()}
                </span>
              )}
            </Link>
            <Link
              to="/staff/dashboard"
              className="text-white hover:text-food-yellow transition-colors px-3 py-2 rounded-md text-sm font-medium border border-white rounded-lg"
            >
              Staff
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

