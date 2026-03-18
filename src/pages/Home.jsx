import { Link } from 'react-router-dom'
import { menuItems } from '../data/dummyData'
import FoodCard from '../components/FoodCard'

const Home = () => {
  const featuredItems = menuItems.slice(0, 4)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-food-orange to-orange-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Order Smart. Eat Fresh.</h1>
          <p className="text-xl md:text-2xl mb-8 text-orange-100">
            Your favorite canteen food, just a click away
          </p>
          <Link
            to="/menu"
            className="inline-block bg-white text-food-orange px-8 py-4 rounded-lg font-bold text-lg hover:bg-food-yellow transition-colors shadow-lg"
          >
            Browse Menu
          </Link>
        </div>
      </section>

      {/* Featured Items */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-food-dark mb-8 text-center">Featured Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-food-green/10 to-food-green/5">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-food-dark mb-2">Fast Ordering</h3>
              <p className="text-gray-600">Order your favorite food in seconds</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-food-yellow/20 to-food-yellow/10">
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="text-xl font-bold text-food-dark mb-2">Fresh Food</h3>
              <p className="text-gray-600">Daily prepared with fresh ingredients</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-food-orange/10 to-food-orange/5">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-food-dark mb-2">Easy Tracking</h3>
              <p className="text-gray-600">Track your order in real-time</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

