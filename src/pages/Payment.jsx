import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { createOrder } from '../lib/supabaseAPI'
import { Wallet, Smartphone, CreditCard, CheckCircle, Loader2, X, AlertCircle } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'

const Payment = () => {
  const navigate = useNavigate()
  const { cart, getTotalPrice, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState('wallet')
  const [showSuccess, setShowSuccess] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  
  // UPI QR Payment States
  const [showQR, setShowQR] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)

  const total = (getTotalPrice() * 1.05).toFixed(2)

  // Timer logic for UPI QR payment
  useEffect(() => {
    let timerID
    if (showQR && timeLeft > 0) {
      timerID = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && showQR) {
      setShowQR(false)
      setError('Payment session expired. Please try again.')
      setTimeLeft(60)
    }
    return () => clearInterval(timerID)
  }, [showQR, timeLeft])

  const handleConfirmOrder = async () => {
    setError('')
    
    // If UPI is selected, show the QR code modal first
    if (paymentMethod === 'upi') {
      setShowQR(true)
      setTimeLeft(60)
      return
    }

    // For other methods (wallet/card simulation), place order directly
    await placeOrder()
  }

  const placeOrder = async () => {
    setIsProcessing(true)
    setError('')

    const cartItems = cart.map(item => ({
      item_id: item.item_id || item.id,
      quantity: item.quantity,
      price: Number(item.price)
    }))

    const { error: orderError } = await createOrder(
      cartItems,
      paymentMethod,
      Number(total)
    )

    if (orderError) {
      console.error('Order creation failed:', orderError)
      setError(typeof orderError === 'string' ? orderError : orderError.message || 'Failed to place order. Please try again.')
      setIsProcessing(false)
      setShowQR(false)
      return
    }

    // Success flow
    setShowQR(false)
    setShowSuccess(true)
    clearCart()
    setTimeout(() => {
      navigate('/orders')
    }, 2000)
  }

  const handleCancelPayment = () => {
    setShowQR(false)
    setTimeLeft(60)
    setIsProcessing(false)
  }

  // UPI Payment Link Simulation
  const upiLink = `upi://pay?pa=test@upi&pn=VJFoodie&am=${total}&cu=INR`

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-food-surface flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center max-w-md">
          <CheckCircle className="w-16 h-16 mx-auto text-emerald-500 mb-4" />
          <h2 className="text-3xl font-bold text-food-dark mb-4">Order Placed Successfully!</h2>
          <p className="text-gray-600">Your order is being prepared. Redirecting to orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-food-surface py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-food-dark">Payment</h1>
          <div className="text-food-orange font-bold text-xl bg-orange-50 px-4 py-2 rounded-lg border border-orange-100">
            Total: ₹{total}
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm mb-6 border border-red-100 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Options */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
              <h2 className="text-2xl font-bold text-food-dark mb-6">Select Payment Method</h2>
              
              <div className="grid gap-4">
                <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'wallet' ? 'border-food-orange bg-orange-50/30' : 'border-gray-100 hover:border-gray-200'}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="wallet"
                    checked={paymentMethod === 'wallet'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-4 w-5 h-5 text-food-orange"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${paymentMethod === 'wallet' ? 'bg-food-orange text-white' : 'bg-gray-100 text-gray-500'}`}>
                        <Wallet className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-food-dark">Wallet</p>
                        <p className="text-sm text-gray-500">Balance: ₹500.00</p>
                      </div>
                    </div>
                  </div>
                </label>

                <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-food-orange bg-orange-50/30' : 'border-gray-100 hover:border-gray-200'}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-4 w-5 h-5 text-food-orange"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${paymentMethod === 'upi' ? 'bg-food-orange text-white' : 'bg-gray-100 text-gray-500'}`}>
                        <Smartphone className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-food-dark">UPI QR Code</p>
                        <p className="text-sm text-gray-500">Scan and pay using any UPI app</p>
                      </div>
                    </div>
                  </div>
                </label>

                <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-food-orange bg-orange-50/30' : 'border-gray-100 hover:border-gray-200'}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-4 w-5 h-5 text-food-orange"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${paymentMethod === 'card' ? 'bg-food-orange text-white' : 'bg-gray-100 text-gray-500'}`}>
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-food-dark">Credit / Debit Card</p>
                        <p className="text-sm text-gray-500">Secure simulated transaction</p>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-800">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm">For security, manual card input is disabled. Clicking "Confirm" will simulate an encrypted transaction through our payment provider.</p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-food-dark mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-gray-100 text-gray-600 rounded flex items-center justify-center text-xs font-bold">{item.quantity}x</span>
                      <span className="text-gray-700 font-medium">{item.name}</span>
                    </div>
                    <span className="text-food-dark font-semibold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed pt-4 space-y-2">
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Subtotal</span>
                  <span>₹{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>GST (5%)</span>
                  <span>₹{(getTotalPrice() * 0.05).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-extrabold text-food-dark">
                  <span>Total</span>
                  <span className="text-food-orange">₹{total}</span>
                </div>
              </div>

              <button
                onClick={handleConfirmOrder}
                disabled={isProcessing}
                className="w-full mt-6 bg-food-orange text-white font-bold py-4 rounded-xl text-lg hover:shadow-lg transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm Order'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* UPI QR Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative animate-in zoom-in duration-300">
            <button 
              onClick={handleCancelPayment}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 text-food-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-food-dark mb-1">Scan to Pay</h3>
              <p className="text-gray-500 text-sm mb-6 px-4">Use any UPI app like GPay, PhonePe or Paytm to scan</p>
              
              <div className="bg-white p-4 border-2 border-orange-100 rounded-2xl inline-block mb-6 shadow-sm">
                <QRCodeCanvas 
                  value={upiLink} 
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              
              <div className="bg-orange-50 p-4 rounded-2xl mb-8 border border-orange-100">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <p className="text-sm font-bold text-food-dark">Expires in {timeLeft}s</p>
                </div>
                <p className="text-lg font-extrabold text-food-orange">Pay ₹{total}</p>
              </div>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={placeOrder}
                  disabled={isProcessing}
                  className="w-full bg-food-orange text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Proceed to pay'
                  )}
                </button>
                <button
                  onClick={handleCancelPayment}
                  className="w-full py-2 text-gray-400 font-semibold hover:text-gray-600 transition-colors text-sm"
                >
                  Cancel and go back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Payment
