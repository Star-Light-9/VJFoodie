import { useCart } from '../context/CartContext'

const FoodCard = ({ item }) => {
  const { addToCart } = useCart()

  return (
    <div className="bg-white rounded-md shadow-md hover:shadow-xl transition-shadow overflow-hidden">
      <div className="h-48 bg-gradient-to-br bg-food-surface border border-orange-100 flex items-center justify-center">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=' + item.name
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-food-dark mb-2">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-food-orange">₹{item.price}</span>
          <button
            onClick={() => addToCart(item)}
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

