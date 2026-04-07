import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { ShoppingCart } from 'lucide-react'

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart()

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-food-surface py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center max-w-2xl mx-auto">
            <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-food-dark mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some delicious items to your cart!</p>
            <Link
              to="/menu"
              className="inline-block bg-food-orange hover:bg-food-orange/80 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-food-surface py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-food-dark mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-md shadow-md p-6 flex flex-col md:flex-row items-center gap-4"
              >
                <div className="w-24 h-24 bg-gradient-to-br bg-food-surface border border-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100?text=' + item.name
                    }}
                  />
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-food-dark mb-1">{item.name}</h3>
                  <p className="text-food-orange font-semibold">₹{item.price} each</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-semibold text-lg">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="text-right min-w-[100px]">
                    <p className="text-xl font-bold text-food-dark">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 text-xl font-bold px-2"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-food-dark mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (5%)</span>
                  <span>₹{(getTotalPrice() * 0.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold text-food-dark">
                  <span>Total</span>
                  <span className="text-food-orange">
                    ₹{(getTotalPrice() * 1.05).toFixed(2)}
                  </span>
                </div>
              </div>

              <Link
                to="/payment"
                className="block w-full bg-food-orange text-white font-medium text-center py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-shadow mb-3"
              >
                Proceed to Payment
              </Link>
              
              <button
                onClick={clearCart}
                className="w-full bg-gray-200 hover:bg-gray-300 text-food-dark py-3 rounded-lg font-semibold transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

