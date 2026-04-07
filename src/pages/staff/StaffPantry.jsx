import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { pantryItems as initialPantryItems } from '../../data/dummyData'
import { AlertCircle } from 'lucide-react'

const StaffPantry = () => {
  const [pantryItems, setPantryItems] = useState(initialPantryItems)
  const [editingId, setEditingId] = useState(null)
  const [stockValue, setStockValue] = useState('')

  const getStockLevelColor = (level) => {
    switch (level) {
      case 'High':
        return 'bg-green-100 text-green-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'Low':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStockLevel = (stock) => {
    if (stock >= 50) return 'High'
    if (stock >= 25) return 'Medium'
    return 'Low'
  }

  const handleUpdateStock = (id) => {
    const newStock = parseInt(stockValue)
    if (!isNaN(newStock) && newStock >= 0) {
      setPantryItems(pantryItems.map(item => 
        item.id === id 
          ? { ...item, stock: newStock, level: getStockLevel(newStock) }
          : item
      ))
      setEditingId(null)
      setStockValue('')
    }
  }

  const startEditing = (id, currentStock) => {
    setEditingId(id)
    setStockValue(currentStock.toString())
  }

  return (
    <div className="flex min-h-screen bg-food-surface">
      <Sidebar />
      <div className="flex-grow p-8">
        <h1 className="text-4xl font-bold text-food-dark mb-8">Pantry Inventory</h1>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white border border-slate-200 text-slate-700 font-medium">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Ingredient</th>
                  <th className="px-6 py-4 text-left font-semibold">Stock Level</th>
                  <th className="px-6 py-4 text-left font-semibold">Current Stock</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pantryItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-food-dark">{item.name}</div>
                      <div className="text-sm text-gray-500">Unit: {item.unit}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-md text-sm font-semibold ${getStockLevelColor(item.level)}`}>
                        {item.level}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {editingId === item.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={stockValue}
                            onChange={(e) => setStockValue(e.target.value)}
                            className="w-24 px-3 py-2 border-2 border-food-green rounded-lg focus:outline-none focus:ring-2 focus:ring-food-green"
                            min="0"
                          />
                          <span className="text-gray-600">{item.unit}</span>
                        </div>
                      ) : (
                        <span className="font-semibold text-gray-700">
                          {item.stock} {item.unit}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === item.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateStock(item.id)}
                            className="bg-food-green hover:bg-food-green/80 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null)
                              setStockValue('')
                            }}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditing(item.id, item.stock)}
                          className="bg-food-orange hover:bg-food-orange/80 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                        >
                          Update Stock
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-600 mb-1">Low Stock</h3>
            <p className="text-3xl font-bold text-red-600">
              {pantryItems.filter(item => item.level === 'Low').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="text-3xl mb-2">🟡</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-1">Medium Stock</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {pantryItems.filter(item => item.level === 'Medium').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="text-3xl mb-2">🟢</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-1">High Stock</h3>
            <p className="text-3xl font-bold text-green-600">
              {pantryItems.filter(item => item.level === 'High').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffPantry

