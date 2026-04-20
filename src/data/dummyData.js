export const menuItems = [
  {
    id: 1,
    name: 'Veg Biryani',
    category: 'Meals',
    price: 120,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400',
    description: 'Aromatic basmati rice with mixed vegetables'
  },
  {
    id: 2,
    name: 'Chicken Biryani',
    category: 'Meals',
    price: 150,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400',
    description: 'Spicy chicken biryani with basmati rice'
  },
  {
    id: 3,
    name: 'Samosa',
    category: 'Snacks',
    price: 15,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
    description: 'Crispy samosa with potato filling'
  },
  {
    id: 4,
    name: 'Vada Pav',
    category: 'Snacks',
    price: 25,
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400',
    description: 'Mumbai style vada pav'
  },
  {
    id: 5,
    name: 'Pav Bhaji',
    category: 'Snacks',
    price: 80,
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400',
    description: 'Spicy vegetable curry with buttered bread'
  },
  {
    id: 6,
    name: 'Cold Coffee',
    category: 'Beverages',
    price: 50,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
    description: 'Iced coffee with cream'
  },
  {
    id: 7,
    name: 'Fresh Lime Soda',
    category: 'Beverages',
    price: 30,
    image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2fdc?w=400',
    description: 'Refreshing lime soda'
  },
  {
    id: 8,
    name: 'Masala Chai',
    category: 'Beverages',
    price: 15,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400',
    description: 'Spiced Indian tea'
  },
  {
    id: 9,
    name: 'Gulab Jamun',
    category: 'Desserts',
    price: 40,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
    description: 'Sweet milk dumplings in syrup'
  },
  {
    id: 10,
    name: 'Ice Cream',
    category: 'Desserts',
    price: 60,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
    description: 'Vanilla ice cream'
  },
  {
    id: 11,
    name: 'Paneer Tikka',
    category: 'Snacks',
    price: 100,
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400',
    description: 'Grilled paneer with spices'
  },
  {
    id: 12,
    name: 'Dal Rice',
    category: 'Meals',
    price: 70,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
    description: 'Lentil curry with steamed rice'
  }
]

export const orderHistory = [
  {
    id: 'ORD001',
    date: '2024-01-15',
    items: [
      { name: 'Veg Biryani', quantity: 2, price: 120 },
      { name: 'Cold Coffee', quantity: 1, price: 50 }
    ],
    total: 290,
    status: 'Completed'
  },
  {
    id: 'ORD002',
    date: '2024-01-14',
    items: [
      { name: 'Samosa', quantity: 4, price: 15 },
      { name: 'Masala Chai', quantity: 2, price: 15 }
    ],
    total: 90,
    status: 'Completed'
  },
  {
    id: 'ORD003',
    date: '2024-01-13',
    items: [
      { name: 'Paneer Tikka', quantity: 1, price: 100 },
      { name: 'Gulab Jamun', quantity: 2, price: 40 }
    ],
    total: 180,
    status: 'Completed'
  }
]

export const staffOrders = [
  {
    id: 'ORD004',
    items: ['Veg Biryani x2', 'Cold Coffee x1'],
    time: '12:30 PM',
    status: 'Order Placed',
    total: 290
  },
  {
    id: 'ORD005',
    items: ['Samosa x4', 'Masala Chai x2'],
    time: '12:25 PM',
    status: 'Preparing',
    total: 90
  },
  {
    id: 'ORD006',
    items: ['Paneer Tikka x1', 'Gulab Jamun x2'],
    time: '12:20 PM',
    status: 'Ready',
    total: 180
  }
]

export const pantryItems = [
  { id: 1, name: 'Rice', stock: 45, unit: 'kg', level: 'Medium' },
  { id: 2, name: 'Wheat Flour', stock: 20, unit: 'kg', level: 'Low' },
  { id: 3, name: 'Sugar', stock: 80, unit: 'kg', level: 'High' },
  { id: 4, name: 'Cooking Oil', stock: 35, unit: 'L', level: 'Medium' },
  { id: 5, name: 'Potatoes', stock: 15, unit: 'kg', level: 'Low' },
  { id: 6, name: 'Onions', stock: 25, unit: 'kg', level: 'Medium' },
  { id: 7, name: 'Tomatoes', stock: 30, unit: 'kg', level: 'Medium' },
  { id: 8, name: 'Milk', stock: 50, unit: 'L', level: 'High' },
]

