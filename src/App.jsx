import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Payment from './pages/Payment'
import Orders from './pages/Orders'
import TrackOrder from './pages/TrackOrder'
import StaffDashboard from './pages/staff/StaffDashboard'
import StaffOrders from './pages/staff/StaffOrders'
import StaffPantry from './pages/staff/StaffPantry'

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Client Side Routes */}
          <Route path="/" element={<><Navbar /><Home /></>} />
          <Route path="/dashboard" element={<><Navbar /><Dashboard /></>} />
          <Route path="/menu" element={<><Navbar /><Menu /></>} />
          <Route path="/cart" element={<><Navbar /><Cart /></>} />
          <Route path="/payment" element={<><Navbar /><Payment /></>} />
          <Route path="/orders" element={<><Navbar /><Orders /></>} />
          <Route path="/track/:orderId" element={<><Navbar /><TrackOrder /></>} />
          
          {/* Staff Side Routes */}
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/staff/orders" element={<StaffOrders />} />
          <Route path="/staff/pantry" element={<StaffPantry />} />
        </Routes>
      </Router>
    </CartProvider>
  )
}

export default App

