import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import { getInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } from '../../lib/supabaseAPI'
import { 
  Plus, Edit, Trash2, Save, X, Package, 
  AlertTriangle, Filter, Search, ChevronRight, 
  Archive, Boxes 
} from 'lucide-react'

const StaffPantry = () => {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Form States
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [itemForm, setItemForm] = useState({
    item_name: '',
    category: 'Grains',
    stock_quantity: '',
    unit: 'kg',
    low_stock_threshold: '5',
    cost_price: ''
  })

  const categories = ['All', 'Grains', 'Dairy', 'Vegetables', 'Meat', 'Spices', 'Beverages', 'Cleaning', 'Others']
  const units = ['kg', 'Grams', 'Liters', 'ml', 'pcs', 'Packets', 'Boxes']

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    setLoading(true)
    const { data, error } = await getInventory()
    if (error) {
      console.error('Error fetching inventory:', error)
    } else {
      setInventory(data || [])
    }
    setLoading(false)
  }

  const handleSaveItem = async () => {
    if (!itemForm.item_name || !itemForm.stock_quantity || !itemForm.unit) {
      alert('Please fill in the Item Name, Stock, and Unit.')
      return
    }

    const payload = {
      ...itemForm,
      stock_quantity: parseInt(itemForm.stock_quantity),
      low_stock_threshold: parseInt(itemForm.low_stock_threshold),
      cost_price: itemForm.cost_price ? parseFloat(itemForm.cost_price) : null
    }

    try {
      if (editingId) {
        await updateInventoryItem(editingId, payload)
      } else {
        await addInventoryItem(payload)
      }
      
      setShowForm(false)
      setEditingId(null)
      setItemForm({ item_name: '', category: 'Grains', stock_quantity: '', unit: 'kg', low_stock_threshold: '5', cost_price: '' })
      fetchInventory()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return
    try {
      const { error } = await deleteInventoryItem(id)
      if (error) throw error
      fetchInventory()
    } catch (err) {
      alert(err.message)
    }
  }

  const filteredItems = inventory.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    const matchesSearch = item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Summary Logic
  const lowStockItems = inventory.filter(item => item.stock_quantity <= item.low_stock_threshold)

  if (loading) return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-grow flex items-center justify-center bg-food-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-food-orange"></div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-food-surface">
      <Sidebar />
      <div className="flex-grow p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-food-dark">Inventory Management</h1>
            <p className="text-slate-500 mt-1 capitalize">Manage raw materials and pantry stock</p>
          </div>
          <button 
            onClick={() => { 
              setShowForm(true); 
              setEditingId(null); 
              setItemForm({ item_name: '', category: 'Grains', stock_quantity: '', unit: 'kg', low_stock_threshold: '5', cost_price: '' });
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-food-green text-white rounded-lg hover:bg-green-600 transition-all font-bold shadow-sm"
          >
            <Plus className="w-5 h-5" /> Add Inventory Item
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Boxes className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Items</p>
                <p className="text-2xl font-bold text-food-dark">{inventory.length}</p>
              </div>
            </div>
          </div>
          <div className={`bg-white p-6 rounded-xl shadow-sm border-2 ${lowStockItems.length > 0 ? 'border-red-100' : 'border-slate-200'}`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${lowStockItems.length > 0 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400'}`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Low Stock Alerts</p>
                <p className={`text-2xl font-bold ${lowStockItems.length > 0 ? 'text-red-600' : 'text-food-dark'}`}>
                  {lowStockItems.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 col-span-1 md:col-span-2">
            <div className="flex items-center gap-4 h-full">
              <div className="p-3 bg-orange-50 text-food-orange rounded-lg">
                <Search className="w-6 h-6" />
              </div>
              <input 
                type="text" 
                placeholder="Search inventory items..."
                className="flex-grow bg-transparent border-none focus:ring-0 text-food-dark font-medium placeholder-slate-400"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* CATEGORIES SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filter by
              </h2>
              <div className="space-y-1">
                {categories.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg font-bold transition-all ${
                      selectedCategory === cat 
                      ? 'bg-food-orange text-white shadow-md' 
                      : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <ChevronRight className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* MAIN TABLE AREA */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              {showForm && (
                <div className="p-6 bg-slate-50 border-b border-slate-200 animate-in slide-in-from-top duration-300">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl text-food-dark">{editingId ? 'Edit Item' : 'Add New Inventory Item'}</h3>
                    <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-600">Item Name</label>
                      <input 
                        type="text" placeholder="e.g. Basmati Rice" 
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-food-orange outline-none" 
                        value={itemForm.item_name} onChange={e => setItemForm({...itemForm, item_name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-600">Category</label>
                      <select 
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-food-orange outline-none"
                        value={itemForm.category} onChange={e => setItemForm({...itemForm, category: e.target.value})}
                      >
                        {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-600">Unit</label>
                      <select 
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-food-orange outline-none"
                        value={itemForm.unit} onChange={e => setItemForm({...itemForm, unit: e.target.value})}
                      >
                        {units.map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-600">Stock Quantity</label>
                      <input 
                        type="number" placeholder="0" 
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-food-orange outline-none" 
                        value={itemForm.stock_quantity} onChange={e => setItemForm({...itemForm, stock_quantity: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-600">Low Stock Threshold</label>
                      <input 
                        type="number" placeholder="5" 
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-food-orange outline-none" 
                        value={itemForm.low_stock_threshold} onChange={e => setItemForm({...itemForm, low_stock_threshold: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-600">Cost Price (Optional)</label>
                      <input 
                        type="number" placeholder="₹ 0.00" 
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-food-orange outline-none" 
                        value={itemForm.cost_price} onChange={e => setItemForm({...itemForm, cost_price: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end gap-3">
                    <button onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-300 transition-all">Cancel</button>
                    <button onClick={handleSaveItem} className="px-8 py-2.5 bg-food-orange text-white rounded-lg font-bold flex items-center gap-2 hover:shadow-lg transition-all active:scale-95">
                      <Save className="w-5 h-5" /> {editingId ? 'Update Item' : 'Create Item'}
                    </button>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50/80 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Item</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Stock</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Status</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredItems.map(item => {
                      const isLow = item.stock_quantity <= item.low_stock_threshold
                      return (
                        <tr key={item.inventory_id} className="group hover:bg-slate-50/50 transition-all">
                          <td className="px-6 py-4">
                            <div className="font-bold text-food-dark">{item.item_name}</div>
                            {item.cost_price && <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">Cost: ₹{item.cost_price} / {item.unit}</div>}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded uppercase tracking-wide">{item.category}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-baseline gap-1">
                              <span className={`text-lg font-extrabold ${isLow ? 'text-red-600' : 'text-slate-700'}`}>{item.stock_quantity}</span>
                              <span className="text-xs font-bold text-slate-400">{item.unit}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {isLow ? (
                              <div className="flex items-center gap-1.5 text-red-600 font-bold text-xs bg-red-50 py-1 px-2.5 rounded-full border border-red-100 w-fit">
                                <AlertTriangle className="w-3.5 h-3.5" /> LOW STOCK
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs bg-emerald-50 py-1 px-2.5 rounded-full border border-emerald-100 w-fit">
                                <Package className="w-3.5 h-3.5" /> ADEQUATE
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                              <button 
                                onClick={() => {
                                  setEditingId(item.inventory_id);
                                  setItemForm({
                                    item_name: item.item_name,
                                    category: item.category,
                                    stock_quantity: item.stock_quantity.toString(),
                                    unit: item.unit,
                                    low_stock_threshold: item.low_stock_threshold.toString(),
                                    cost_price: item.cost_price?.toString() || ''
                                  });
                                  setShowForm(true);
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteItem(item.inventory_id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {filteredItems.length === 0 && (
                  <div className="text-center py-20 bg-slate-50/30">
                    <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                      <Package className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-slate-400 font-bold text-lg">No inventory items found</h3>
                    <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffPantry
