import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Payment from './pages/Payment'
import Orders from './pages/Orders'
import TrackOrder from './pages/TrackOrder'
import Feedback from './pages/Feedback'
import StaffDashboard from './pages/staff/StaffDashboard'
import StaffOrders from './pages/staff/StaffOrders'
import StaffMenu from './pages/staff/StaffMenu'
import StaffPantry from './pages/staff/StaffPantry'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Customer Routes */}
            <Route path="/" element={<ProtectedRoute allowedRoles={['customer']}><Home /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['customer']}><Dashboard /></ProtectedRoute>} />
            <Route path="/menu" element={<ProtectedRoute allowedRoles={['customer']}><Menu /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute allowedRoles={['customer']}><Cart /></ProtectedRoute>} />
            <Route path="/payment" element={<ProtectedRoute allowedRoles={['customer']}><Payment /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute allowedRoles={['customer']}><Orders /></ProtectedRoute>} />
            <Route path="/track/:orderId" element={<ProtectedRoute allowedRoles={['customer']}><TrackOrder /></ProtectedRoute>} />
            <Route path="/feedback" element={<ProtectedRoute allowedRoles={['customer']}><Feedback /></ProtectedRoute>} />
            
            {/* Staff Routes */}
            <Route path="/staff/dashboard" element={<ProtectedRoute allowedRoles={['staff']}><StaffDashboard /></ProtectedRoute>} />
            <Route path="/staff/orders" element={<ProtectedRoute allowedRoles={['staff']}><StaffOrders /></ProtectedRoute>} />
            <Route path="/staff/menu" element={<ProtectedRoute allowedRoles={['staff']}><StaffMenu /></ProtectedRoute>} />
            <Route path="/staff/pantry" element={<ProtectedRoute allowedRoles={['staff']}><StaffPantry /></ProtectedRoute>} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
