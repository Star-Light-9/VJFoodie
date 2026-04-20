import { useCart } from '../context/CartContext'

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23FFF7ED' width='400' height='300'/%3E%3Ctext x='200' y='140' text-anchor='middle' font-family='sans-serif' font-size='48' fill='%23FB923C'%3E🍽️%3C/text%3E%3Ctext x='200' y='180' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%23999'%3EImage unavailable%3C/text%3E%3C/svg%3E"

const FoodCard = ({ item }) => {
  const { addToCart } = useCart()

  // Build a cart-compatible object from Supabase menu data
  const handleAddToCart = () => {
    addToCart({
      id: item.item_id,
      item_id: item.item_id,
      name: item.item_name,
      price: Number(item.item_price),
      image: item.image_url,
      category: item.category
    })
  }

  return (
    <div className="bg-white rounded-md shadow-md hover:shadow-xl transition-shadow overflow-hidden">
      <div className="h-48 bg-gradient-to-br bg-food-surface border border-orange-100 flex items-center justify-center">
        <img
          src={item.image_url || FALLBACK_IMAGE}
          alt={item.item_name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = FALLBACK_IMAGE
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-food-dark mb-2">{item.item_name}</h3>
        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-food-orange">₹{item.item_price}</span>
          <button
            onClick={handleAddToCart}
            className="bg-food-green hover:bg-food-green/80 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default FoodCard
