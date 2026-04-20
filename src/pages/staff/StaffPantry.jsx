import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import { getInventory, updateInventoryStock } from '../../lib/supabaseAPI'
import { AlertCircle, Loader2 } from 'lucide-react'

const StaffPantry = () => {
  const [pantryItems, setPantryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [stockValue, setStockValue] = useState('')

  useEffect(() => {
    const fetchInventory = async () => {
      const { data, error } = await getInventory()
      if (error) {
        console.error('Error fetching inventory:', error)
      } else {
        setPantryItems(data)
      }
      setLoading(false)
    }
    fetchInventory()
  }, [])

  const getStockLevel = (stock) => {
    if (stock >= 50) return 'High'
    if (stock >= 25) return 'Medium'
    return 'Low'
  }

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

  const handleUpdateStock = async (inventoryId) => {
    const newStock = parseInt(stockValue)
    if (!isNaN(newStock) && newStock >= 0) {
      const { error } = await updateInventoryStock(inventoryId, newStock)
      if (error) {
        console.error('Error updating stock:', error)
        return
      }
      setPantryItems(pantryItems.map(item => 
        item.inventory_id === inventoryId 
          ? { ...item, stock: newStock }
          : item
      ))
      setEditingId(null)
      setStockValue('')
    }
  }

  const startEditing = (inventoryId, currentStock) => {
    setEditingId(inventoryId)
    setStockValue(currentStock.toString())
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-food-surface">
        <Sidebar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-food-orange animate-spin mx-auto mb-4" />
            <p className="text-slate-500 text-lg">Loading inventory...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-food-surface">
      <Sidebar />
      <div className="flex-grow p-8">
        <h1 className="text-4xl font-bold text-food-dark mb-8">Pantry Inventory</h1>
        
        {pantryItems.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white border border-slate-200 text-slate-700 font-medium">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Item</th>
                    <th className="px-6 py-4 text-left font-semibold">Stock Level</th>
                    <th className="px-6 py-4 text-left font-semibold">Current Stock</th>
                    <th className="px-6 py-4 text-left font-semibold">Last Updated</th>
                    <th className="px-6 py-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pantryItems.map((item) => {
                    const level = getStockLevel(item.stock)
                    const lastUpdated = new Date(item.last_updated).toLocaleDateString('en-IN', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })

                    return (
                      <tr key={item.inventory_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-food-dark">
                            {item.menu?.item_name || 'Unknown Item'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-md text-sm font-semibold ${getStockLevelColor(level)}`}>
                            {level}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {editingId === item.inventory_id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={stockValue}
                                onChange={(e) => setStockValue(e.target.value)}
                                className="w-24 px-3 py-2 border-2 border-food-green rounded-lg focus:outline-none focus:ring-2 focus:ring-food-green"
                                min="0"
                              />
                            </div>
                          ) : (
                            <span className="font-semibold text-gray-700">
                              {item.stock}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          {lastUpdated}
                        </td>
                        <td className="px-6 py-4">
                          {editingId === item.inventory_id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateStock(item.inventory_id)}
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
                              onClick={() => startEditing(item.inventory_id, item.stock)}
                              className="bg-food-orange hover:bg-food-orange/80 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                            >
                              Update Stock
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <AlertCircle className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h2 className="text-2xl font-bold text-food-dark mb-2">No inventory items</h2>
            <p className="text-gray-600">Add inventory items in the Supabase dashboard to get started.</p>
          </div>
        )}

        {/* Summary Cards */}
        {pantryItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-600 mb-1">Low Stock</h3>
              <p className="text-3xl font-bold text-red-600">
                {pantryItems.filter(item => getStockLevel(item.stock) === 'Low').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 text-center">
              <div className="text-3xl mb-2">🟡</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-1">Medium Stock</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {pantryItems.filter(item => getStockLevel(item.stock) === 'Medium').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 text-center">
              <div className="text-3xl mb-2">🟢</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-1">High Stock</h3>
              <p className="text-3xl font-bold text-green-600">
                {pantryItems.filter(item => getStockLevel(item.stock) === 'High').length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StaffPantry
