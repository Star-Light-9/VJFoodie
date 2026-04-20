// ============================================================
// VJFoodie — Supabase API Service Layer
// Centralized database operations for all tables
// ============================================================

import { supabase } from './supabase'

// ---- AUTH HELPERS ----

/** Get the currently logged-in user's UUID */
export const getCurrentUserId = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id || null
}

/** Get the current session */
export const getCurrentSession = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// ---- PROFILES ----

/** Fetch the logged-in user's profile */
export const getProfile = async () => {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: 'Not authenticated' }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  return { data, error }
}

/** Update the logged-in user's profile */
export const updateProfile = async (updates) => {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: 'Not authenticated' }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single()

  return { data, error }
}

// ---- CATEGORIES ----

/** Fetch all categories */
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('category_id')

  return { data: data || [], error }
}

// ---- MENU ----

/** Fetch all menu items with their category names (JOIN) */
export const getMenuItems = async () => {
  const { data, error } = await supabase
    .from('menu')
    .select(`
      item_id,
      item_name,
      item_price,
      image_url,
      description,
      category_id,
      categories ( category_name )
    `)
    .order('item_id')

  // Flatten the category name for easier frontend use
  const items = (data || []).map(item => ({
    ...item,
    category: item.categories?.category_name || 'Uncategorized'
  }))

  return { data: items, error }
}

/** Add a new menu item (staff only) */
export const addMenuItem = async (item) => {
  const { data, error } = await supabase
    .from('menu')
    .insert([item])
    .select()
    .single()

  return { data, error }
}

/** Update a menu item (staff only) */
export const updateMenuItem = async (itemId, updates) => {
  const { data, error } = await supabase
    .from('menu')
    .update(updates)
    .eq('item_id', itemId)
    .select()
    .single()

  return { data, error }
}

/** Delete a menu item (staff only) */
export const deleteMenuItem = async (itemId) => {
  const { error } = await supabase
    .from('menu')
    .delete()
    .eq('item_id', itemId)

  return { error }
}

// ---- ORDERS ----

/**
 * Create a new order with order items and payment record.
 * @param {Array} cartItems - Array of { item_id, quantity, price } from the cart
 * @param {string} paymentMethod - 'wallet', 'upi', 'card', or 'cash'
 * @param {number} totalPrice - Total price including tax
 */
export const createOrder = async (cartItems, paymentMethod, totalPrice) => {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: 'Not authenticated' }

  // 1. Create the order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{
      user_id: userId,
      total_price: totalPrice,
      status: 'Order Placed'
    }])
    .select()
    .single()

  if (orderError) return { data: null, error: orderError }

  // 2. Create order items
  const orderItemsData = cartItems.map(item => ({
    order_id: order.order_id,
    item_id: item.item_id,
    quantity: item.quantity,
    price_at_time: item.price
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsData)

  if (itemsError) return { data: null, error: itemsError }

  // 3. Create payment record
  const { error: paymentError } = await supabase
    .from('payments')
    .insert([{
      order_id: order.order_id,
      payment_method: paymentMethod,
      payment_status: 'completed',
      amount: totalPrice
    }])

  if (paymentError) return { data: null, error: paymentError }

  return { data: order, error: null }
}

/**
 * Fetch the logged-in user's orders with order items and menu details.
 * This is a relational query (JOIN).
 */
export const getUserOrders = async () => {
  const userId = await getCurrentUserId()
  if (!userId) return { data: [], error: 'Not authenticated' }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      order_id,
      order_date,
      status,
      total_price,
      order_items (
        order_item_id,
        quantity,
        price_at_time,
        menu ( item_id, item_name, image_url )
      ),
      payments ( payment_method, payment_status )
    `)
    .eq('user_id', userId)
    .order('order_date', { ascending: false })

  return { data: data || [], error }
}

/** Fetch a single order by ID with full details */
export const getOrderById = async (orderId) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      order_id,
      user_id,
      order_date,
      status,
      total_price,
      order_items (
        order_item_id,
        quantity,
        price_at_time,
        menu ( item_id, item_name, image_url )
      ),
      payments ( payment_method, payment_status )
    `)
    .eq('order_id', orderId)
    .single()

  return { data, error }
}

/** Fetch ALL orders — for staff dashboard */
export const getAllOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      order_id,
      user_id,
      order_date,
      status,
      total_price,
      profiles ( name, email ),
      order_items (
        order_item_id,
        quantity,
        price_at_time,
        menu ( item_id, item_name )
      )
    `)
    .order('order_date', { ascending: false })

  return { data: data || [], error }
}

/** Update order status (staff only) */
export const updateOrderStatus = async (orderId, newStatus) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('order_id', orderId)
    .select()
    .single()

  return { data, error }
}

// ---- INVENTORY (Standalone) ----

/** Fetch all inventory items */
export const getInventory = async () => {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('item_name')

  return { data: data || [], error }
}

/** Add a new inventory item (staff only) */
export const addInventoryItem = async (item) => {
  const { data, error } = await supabase
    .from('inventory')
    .insert([item])
    .select()
    .single()

  return { data, error }
}

/** Update an inventory item (staff only) */
export const updateInventoryItem = async (inventoryId, updates) => {
  const { data, error } = await supabase
    .from('inventory')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('inventory_id', inventoryId)
    .select()
    .single()

  return { data, error }
}

/** Delete an inventory item (staff only) */
export const deleteInventoryItem = async (inventoryId) => {
  const { error } = await supabase
    .from('inventory')
    .delete()
    .eq('inventory_id', inventoryId)

  return { error }
}

// ---- FEEDBACK ----

/** Submit feedback for a completed order */
export const submitFeedback = async (orderId, rating, comment) => {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: 'Not authenticated' }

  const { data, error } = await supabase
    .from('feedback')
    .insert([{
      user_id: userId,
      order_id: orderId,
      rating,
      comment
    }])
    .select()
    .single()

  return { data, error }
}

/** Fetch the logged-in user's feedback */
export const getUserFeedback = async () => {
  const userId = await getCurrentUserId()
  if (!userId) return { data: [], error: 'Not authenticated' }

  const { data, error } = await supabase
    .from('feedback')
    .select(`
      feedback_id,
      rating,
      comment,
      created_at,
      orders ( order_id, order_date, total_price )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return { data: data || [], error }
}
