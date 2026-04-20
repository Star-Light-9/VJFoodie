import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import { supabase } from '../../lib/supabase'
import { Plus, Edit, Trash2, Save, X, UtensilsCrossed } from 'lucide-react'

const StaffMenu = () => {
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Form States
  const [showCatForm, setShowCatForm] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [editingCatId, setEditingCatId] = useState(null)

  const [showItemForm, setShowItemForm] = useState(false)
  const [editingItemId, setEditingItemId] = useState(null)
  const [itemForm, setItemForm] = useState({
    item_name: '',
    item_price: '',
    category_id: '',
    image_url: '',
    description: ''
  })

  useEffect(() => {
    fetchMenuData(true)
  }, [])

  const fetchMenuData = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true)
      // Updated to match schema: 'categories' table and 'category_name'
      const { data: catData } = await supabase.from('categories').select('*').order('category_name')
      // Updated to match schema: 'menu' table and join on 'categories'
      const { data: itemData } = await supabase.from('menu').select('*, categories(category_name)').order('item_name')
      
      setCategories(catData || [])
      setItems(itemData || [])
    } catch (err) {
      console.error('Error fetching menu:', err.message)
    } finally {
      if (isInitial) setLoading(false)
    }
  }

  // --- Category Functions ---
  const handleSaveCategory = async () => {
    if (!newCatName.trim()) return
    try {
      if (editingCatId) {
        await supabase.from('categories').update({ category_name: newCatName }).eq('category_id', editingCatId)
      } else {
        await supabase.from('categories').insert([{ category_name: newCatName }])
      }
      setNewCatName('')
      setEditingCatId(null)
      setShowCatForm(false)
      fetchMenuData(false)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure? This will fail if items are linked to this category.')) return
    try {
      const { error } = await supabase.from('categories').delete().eq('category_id', id)
      if (error) throw error
      fetchMenuData(false)
    } catch (err) {
      alert('Cannot delete category: Ensure no food items are linked to it first.')
    }
  }

  // --- Item Functions ---
  const handleSaveItem = async () => {
    if (!itemForm.item_name || !itemForm.item_price || !itemForm.category_id) {
      alert('Please fill name, price and category')
      return
    }

    try {
      const payload = { ...itemForm, item_price: parseFloat(itemForm.item_price) }
      if (editingItemId) {
        await supabase.from('menu').update(payload).eq('item_id', editingItemId)
      } else {
        await supabase.from('menu').insert([payload])
      }
      
      setShowItemForm(false)
      setEditingItemId(null)
      setItemForm({ item_name: '', item_price: '', category_id: '', image_url: '', description: '' })
      fetchMenuData(false)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Delete this food item?')) return
    await supabase.from('menu').delete().eq('item_id', id)
    fetchMenuData(false)
  }

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
        <h1 className="text-3xl font-bold text-food-dark mb-8">Manage Menu</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* CATEGORIES SECTION */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-food-dark">Categories</h2>
                <button 
                  onClick={() => { setShowCatForm(true); setEditingCatId(null); setNewCatName(''); }}
                  className="p-2 bg-food-orange text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {showCatForm && (
                <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <input 
                    type="text" 
                    placeholder="Category Name"
                    className="w-full px-3 py-2 border rounded-md mb-3 focus:outline-food-orange"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSaveCategory} className="flex-1 bg-food-green text-white py-2 rounded-md font-bold flex items-center justify-center gap-1">
                      <Save className="w-4 h-4" /> Save
                    </button>
                    <button onClick={() => setShowCatForm(false)} className="flex-1 bg-slate-200 text-slate-600 py-2 rounded-md font-bold flex items-center justify-center gap-1">
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {categories.map(cat => (
                  <div key={cat.category_id} className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50">
                    <span className="font-medium text-slate-700">{cat.category_name}</span>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => { setEditingCatId(cat.category_id); setNewCatName(cat.category_name); setShowCatForm(true); }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(cat.category_id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MENU ITEMS SECTION */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-food-dark">Food Items</h2>
                <button 
                  onClick={() => { 
                    setShowItemForm(true); 
                    setEditingItemId(null); 
                    setItemForm({ item_name: '', item_price: '', category_id: categories[0]?.category_id || '', image_url: '', description: '' });
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-food-green text-white rounded-md hover:bg-green-600 transition-colors font-bold"
                >
                  <Plus className="w-5 h-5" /> Add New Item
                </button>
              </div>

              {showItemForm && (
                <div className="mb-8 p-6 bg-slate-50 rounded-lg border border-slate-200">
                  <h3 className="font-bold text-lg mb-4">{editingItemId ? 'Edit Item' : 'New Menu Item'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <input 
                        type="text" placeholder="Item Name" 
                        className="w-full px-3 py-2 border rounded-md" 
                        value={itemForm.item_name} onChange={e => setItemForm({...itemForm, item_name: e.target.value})}
                      />
                      <input 
                        type="number" placeholder="Price (₹)" 
                        className="w-full px-3 py-2 border rounded-md" 
                        value={itemForm.item_price} onChange={e => setItemForm({...itemForm, item_price: e.target.value})}
                      />
                      <select 
                        className="w-full px-3 py-2 border rounded-md"
                        value={itemForm.category_id} onChange={e => setItemForm({...itemForm, category_id: e.target.value})}
                      >
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c.category_id} value={c.category_id}>{c.category_name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-4">
                      <input 
                        type="text" placeholder="Image URL" 
                        className="w-full px-3 py-2 border rounded-md" 
                        value={itemForm.image_url} onChange={e => setItemForm({...itemForm, image_url: e.target.value})}
                      />
                      <textarea 
                        placeholder="Description" 
                        className="w-full px-3 py-2 border rounded-md h-24" 
                        value={itemForm.description} onChange={e => setItemForm({...itemForm, description: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button onClick={() => setShowItemForm(false)} className="px-6 py-2 bg-slate-200 text-slate-600 rounded-md font-bold">Cancel</button>
                    <button onClick={handleSaveItem} className="px-6 py-2 bg-food-orange text-white rounded-md font-bold flex items-center gap-2">
                      <Save className="w-5 h-5" /> Save Item
                    </button>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Item</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Price</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map(item => (
                      <tr key={item.item_id} className="hover:bg-slate-50">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <img src={item.image_url} alt="" className="w-10 h-10 rounded-md object-cover bg-slate-100" onError={(e) => e.target.src='https://via.placeholder.com/40'} />
                            <div className="font-bold text-slate-700">{item.item_name}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600">{item.categories?.category_name}</td>
                        <td className="px-4 py-4 font-bold text-food-orange">₹{item.item_price}</td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => {
                                setEditingItemId(item.item_id);
                                setItemForm({
                                  item_name: item.item_name,
                                  item_price: item.item_price.toString(),
                                  category_id: item.category_id,
                                  image_url: item.image_url || '',
                                  description: item.description || ''
                                });
                                setShowItemForm(true);
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteItem(item.item_id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {items.length === 0 && (
                  <div className="text-center py-12">
                    <UtensilsCrossed className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No menu items found. Start adding some!</p>
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

export default StaffMenu
