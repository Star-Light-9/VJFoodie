import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth()

  // 1. If not logged in, always redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // 2. If logged in but role doesn't match the constraints, redirect to their respective home
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'staff') {
      return <Navigate to="/staff/dashboard" replace />
    } else {
      return <Navigate to="/" replace />
    }
  }

  // 3. User is authorized
  return children
}

export default ProtectedRoute
