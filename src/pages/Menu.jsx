import { useState, useEffect } from 'react'
import { getMenuItems } from '../lib/supabaseAPI'
import FoodCard from '../components/FoodCard'
import { Loader2 } from 'lucide-react'

const Menu = () => {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await getMenuItems()
      if (error) {
        console.error('Error fetching menu:', error)
      } else {
        setMenuItems(data)
      }
      setLoading(false)
    }
    fetchMenu()
  }, [])

  const categories = ['All', ...new Set(menuItems.map(item => item.category))]

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-food-surface flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-food-orange animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-lg">Loading menu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-food-surface py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-food-dark mb-8 text-center">Our Menu</h1>
        
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search for food items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 mx-auto block px-6 py-4 rounded-lg border-2 border-food-orange focus:outline-none focus:ring-2 focus:ring-food-orange text-lg"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                selectedCategory === category
                  ? 'bg-food-orange text-white shadow-lg scale-105'
                  : 'bg-white text-food-dark hover:bg-food-yellow hover:text-food-dark shadow-md'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <FoodCard key={item.item_id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-2xl text-gray-600">No items found matching your search</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Menu
