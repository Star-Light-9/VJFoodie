import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Pre-defined Staff Accounts
const STAFF_ACCOUNTS = [
  { id: 's1', name: 'Admin Staff', email: 'staff@vjfoodie.com', password: 'staff', role: 'staff' },
]

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('vjFoodieUser')
    return savedUser ? JSON.parse(savedUser) : null
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('vjFoodieUser', JSON.stringify(user))
    } else {
      localStorage.removeItem('vjFoodieUser')
    }
  }, [user])

  const login = (email, password) => {
    // 1. Check if it's a staff account
    const staffMatch = STAFF_ACCOUNTS.find(s => s.email === email && s.password === password)
    if (staffMatch) {
      const { password, ...staffInfo } = staffMatch
      setUser(staffInfo)
      return { success: true, role: staffInfo.role }
    }

    // 2. Check if it's a registered customer
    let customers = JSON.parse(localStorage.getItem('vjFoodieCustomers'))
    
    // Inject a default demo customer if the system is completely empty
    if (!customers || customers.length === 0) {
      const demoCustomer = {
        id: 'c1',
        name: 'John Doe',
        email: 'user@vjfoodie.com',
        password: 'user123',
        role: 'customer'
      }
      customers = [demoCustomer]
      localStorage.setItem('vjFoodieCustomers', JSON.stringify(customers))
    }

    const customerMatch = customers.find(c => c.email === email && c.password === password)
    
    if (customerMatch) {
      const { password, ...customerInfo } = customerMatch
      setUser(customerInfo)
      return { success: true, role: customerInfo.role }
    }

    return { success: false, message: 'Invalid credentials' }
  }

  const signup = (name, email, password) => {
    // Check if email already exists (even in staff, though unlikely)
    const isStaffEmail = STAFF_ACCOUNTS.some(s => s.email === email)
    const customers = JSON.parse(localStorage.getItem('vjFoodieCustomers')) || []
    const isCustomerEmail = customers.some(c => c.email === email)

    if (isStaffEmail || isCustomerEmail) {
      return { success: false, message: 'Email is already registered' }
    }

    const newCustomer = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role: 'customer' // Strongly enforced customer role
    }

    customers.push(newCustomer)
    localStorage.setItem('vjFoodieCustomers', JSON.stringify(customers))
    
    // Auto login
    const { password: _, ...customerInfo } = newCustomer
    setUser(customerInfo)
    
    return { success: true }
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
