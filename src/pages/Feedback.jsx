import { useState, useEffect } from 'react'
import { getUserOrders, submitFeedback, getUserFeedback } from '../lib/supabaseAPI'
import { Star, MessageSquare, Loader2, CheckCircle } from 'lucide-react'

const Feedback = () => {
  const [completedOrders, setCompletedOrders] = useState([])
  const [pastFeedback, setPastFeedback] = useState([])
  const [loading, setLoading] = useState(true)

  // Form state
  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      // Fetch completed orders
      const { data: orders } = await getUserOrders()
      const completed = (orders || []).filter(o => o.status === 'Completed')
      setCompletedOrders(completed)

      // Fetch existing feedback
      const { data: feedback } = await getUserFeedback()
      setPastFeedback(feedback || [])

      setLoading(false)
    }
    fetchData()
  }, [])

  // Filter out orders that already have feedback
  const feedbackOrderIds = new Set(pastFeedback.map(f => f.orders?.order_id))
  const ordersWithoutFeedback = completedOrders.filter(o => !feedbackOrderIds.has(o.order_id))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!selectedOrderId) {
      setError('Please select an order')
      return
    }
    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    setSubmitting(true)
    const { data, error: submitError } = await submitFeedback(
      parseInt(selectedOrderId),
      rating,
      comment
    )

    if (submitError) {
      setError(typeof submitError === 'string' ? submitError : submitError.message || 'Failed to submit feedback')
      setSubmitting(false)
      return
    }

    setSuccess(true)
    setSubmitting(false)

    // Reset form and refresh data
    setTimeout(async () => {
      setSelectedOrderId('')
      setRating(0)
      setComment('')
      setSuccess(false)

      // Refresh feedback
      const { data: feedback } = await getUserFeedback()
      setPastFeedback(feedback || [])
    }, 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-food-surface flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-food-orange animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-food-surface py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-food-dark mb-8">Feedback</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Submit Feedback Form */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-food-dark mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-food-orange" />
              Submit Feedback
            </h2>

            {success ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-food-dark mb-2">Thank you!</h3>
                <p className="text-gray-600">Your feedback has been submitted successfully.</p>
              </div>
            ) : ordersWithoutFeedback.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-gray-600">
                  {completedOrders.length === 0
                    ? 'No completed orders to give feedback on yet.'
                    : 'You have already submitted feedback for all your completed orders!'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">
                    {error}
                  </div>
                )}

                {/* Order Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Select Order
                  </label>
                  <select
                    value={selectedOrderId}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-food-orange bg-white"
                  >
                    <option value="">Choose an order...</option>
                    {ordersWithoutFeedback.map(order => {
                      const date = new Date(order.order_date).toLocaleDateString('en-IN', {
                        month: 'short', day: 'numeric'
                      })
                      return (
                        <option key={order.order_id} value={order.order_id}>
                          Order #{order.order_id} — ₹{order.total_price} ({date})
                        </option>
                      )
                    })}
                  </select>
                </div>

                {/* Star Rating */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Rating
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= (hoveredRating || rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Comment (optional)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about your experience..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-food-orange resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-food-orange text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-shadow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Feedback'
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Past Feedback */}
          <div>
            <h2 className="text-2xl font-bold text-food-dark mb-6">Your Past Feedback</h2>
            {pastFeedback.length > 0 ? (
              <div className="space-y-4">
                {pastFeedback.map((fb) => {
                  const date = new Date(fb.created_at).toLocaleDateString('en-IN', {
                    year: 'numeric', month: 'short', day: 'numeric'
                  })
                  return (
                    <div
                      key={fb.feedback_id}
                      className="bg-white rounded-lg shadow-sm border border-slate-200 p-5"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-food-dark">
                            Order #{fb.orders?.order_id}
                          </p>
                          <p className="text-xs text-gray-500">{date}</p>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= fb.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {fb.comment && (
                        <p className="text-gray-600 text-sm">{fb.comment}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
                <Star className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-gray-600">You haven't submitted any feedback yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Feedback
