import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMenuItems } from '../lib/supabaseAPI'
import FoodCard from '../components/FoodCard'
import { Zap, ChefHat, Smartphone, Loader2 } from 'lucide-react'

const Home = () => {
  const [featuredItems, setFeaturedItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data, error } = await getMenuItems()
      if (error) {
        console.error('Error fetching menu:', error)
      } else {
        setFeaturedItems(data.slice(0, 4))
      }
      setLoading(false)
    }
    fetchFeatured()
  }, [])

  return (
    <div className="min-h-screen bg-food-surface">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 py-24">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-food-dark tracking-tight">
            Order Smart. Eat Fresh.
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-slate-600 leading-relaxed">
            Welcome to the VJFoodie platform. Experience a streamlined, efficient way to manage and track your campus meals.
          </p>
          <Link
             to="/menu"
             className="inline-flex items-center justify-center bg-food-orange text-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-orange-600 transition-colors shadow-sm"
          >
             Browse Menu
          </Link>
        </div>
      </section>

      {/* Featured Items */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-food-dark">Featured Choices</h2>
          <Link to="/menu" className="text-food-orange font-medium hover:underline">View full menu &rarr;</Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-10 h-10 text-food-orange animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
              <FoodCard key={item.item_id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-food-surface-alt py-16 border-y border-slate-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-lg bg-white shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-orange-100 rounded-md flex items-center justify-center text-food-orange mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-food-dark mb-3">Fast Ordering</h3>
              <p className="text-slate-600 leading-relaxed">Streamlined campus ordering process saving you valuable time between classes.</p>
            </div>
            <div className="p-8 rounded-lg bg-white shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-emerald-100 rounded-md flex items-center justify-center text-food-green mb-6">
                <ChefHat className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-food-dark mb-3">Fresh Preparation</h3>
              <p className="text-slate-600 leading-relaxed">High-quality ingredients prepared fresh daily within our academic campus kitchen.</p>
            </div>
            <div className="p-8 rounded-lg bg-white shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-amber-100 rounded-md flex items-center justify-center text-food-yellow mb-6">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-food-dark mb-3">Digital Tracking</h3>
              <p className="text-slate-600 leading-relaxed">Monitor your order status in real-time through our modern digital interface.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
