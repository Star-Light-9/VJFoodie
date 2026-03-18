import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const Payment = () => {
  const navigate = useNavigate()
  const { cart, getTotalPrice, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState('wallet')
  const [showSuccess, setShowSuccess] = useState(false)

  const total = (getTotalPrice() * 1.05).toFixed(2)

  const handleConfirmOrder = () => {
    // Simulate order processing
    setTimeout(() => {
      setShowSuccess(true)
      clearCart()
      setTimeout(() => {
        navigate('/orders')
      }, 2000)
    }, 1000)
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center max-w-md">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold text-food-dark mb-4">Order Placed Successfully!</h2>
          <p className="text-gray-600">Your order is being prepared. Redirecting to orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-food-dark mb-8">Payment 💳</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Options */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-food-dark mb-6">Select Payment Method</h2>
              
              <div className="space-y-4">
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="wallet"
                    checked={paymentMethod === 'wallet'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-4 w-5 h-5"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💰</span>
                      <div>
                        <p className="font-semibold text-food-dark">Wallet</p>
                        <p className="text-sm text-gray-600">Balance: ₹500</p>
                      </div>
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-4 w-5 h-5"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📱</span>
                      <div>
                        <p className="font-semibold text-food-dark">UPI</p>
                        <p className="text-sm text-gray-600">Pay via UPI apps</p>
                      </div>
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-4 w-5 h-5"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💳</span>
                      <div>
                        <p className="font-semibold text-food-dark">Card</p>
                        <p className="text-sm text-gray-600">Credit/Debit Card</p>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-food-dark mb-4">Card Details</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-food-orange"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-food-orange"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-food-orange"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-food-dark mb-6">Order Summary</h2>
              
              <div className="space-y-2 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.name} x{item.quantity}</span>
                    <span className="text-gray-600">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (5%)</span>
                  <span>₹{(getTotalPrice() * 0.05).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-xl font-bold text-food-dark">
                  <span>Total</span>
                  <span className="text-food-orange">₹{total}</span>
                </div>
              </div>

              <button
                onClick={handleConfirmOrder}
                className="w-full mt-6 bg-gradient-to-r from-food-orange to-orange-500 text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-shadow"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment

