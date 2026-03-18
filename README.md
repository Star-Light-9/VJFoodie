# College Canteen Management System (CMS)

A modern, responsive frontend application for managing college canteen operations, built with React, Vite, Tailwind CSS, and React Router.

## Features

### Client Side (Students & Faculty)
- 🏠 **Home Page** - Hero section with featured items
- 📊 **Dashboard** - Quick stats and recent orders
- 🍽️ **Menu** - Browse food items with search and category filters
- 🛒 **Cart** - Manage cart items with quantity controls
- 💳 **Payment** - Multiple payment options (Wallet, UPI, Card)
- 📋 **Orders** - View order history
- 📍 **Track Order** - Real-time order tracking with status updates

### Staff Side (Canteen Staff)
- 📊 **Dashboard** - Overview of orders and statistics
- 📋 **Order Queue** - Manage and update order statuses
- 🥘 **Pantry** - Inventory management with stock levels

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Context API** - State management for cart

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── FoodCard.jsx
│   └── OrderCard.jsx
├── context/            # React Context providers
│   └── CartContext.jsx
├── data/               # Dummy data
│   └── dummyData.js
├── pages/              # Page components
│   ├── Home.jsx
│   ├── Dashboard.jsx
│   ├── Menu.jsx
│   ├── Cart.jsx
│   ├── Payment.jsx
│   ├── Orders.jsx
│   ├── TrackOrder.jsx
│   └── staff/
│       ├── StaffDashboard.jsx
│       ├── StaffOrders.jsx
│       └── StaffPantry.jsx
├── App.jsx             # Main app component with routing
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Color Scheme

The application uses a warm food-themed color palette:
- **Orange** (`#FF6B35`) - Primary actions and highlights
- **Green** (`#4ECDC4`) - Success states and secondary actions
- **Yellow** (`#FFE66D`) - Accents and highlights
- **Dark** (`#2C3E50`) - Text and backgrounds

## Features in Detail

### Cart Management
- Add/remove items
- Update quantities
- Persistent storage using localStorage
- Real-time total calculation

### Order Tracking
- Visual status timeline
- Four status stages: Order Placed → Preparing → Ready → Completed
- Progress indicators

### Staff Features
- Order status management
- Inventory tracking
- Stock level indicators (Low/Medium/High)
- Real-time updates

## Routes

### Client Routes
- `/` - Home page
- `/dashboard` - User dashboard
- `/menu` - Food menu
- `/cart` - Shopping cart
- `/payment` - Payment page
- `/orders` - Order history
- `/track/:orderId` - Track specific order

### Staff Routes
- `/staff/dashboard` - Staff dashboard
- `/staff/orders` - Order queue management
- `/staff/pantry` - Inventory management

## Notes

- All data is currently stored in local state and localStorage
- Images use placeholder URLs (Unsplash) - replace with actual images in production
- Payment processing is simulated
- Order tracking uses dummy data

## License

This project is created for educational purposes.

