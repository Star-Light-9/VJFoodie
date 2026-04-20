import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Utensils } from 'lucide-react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    const result = await login(email, password)

    if (result.success) {
      if (result.role === 'staff') {
        navigate('/staff/dashboard')
      } else {
        navigate('/')
      }
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="min-h-screen bg-food-surface flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-slate-200 p-8 space-y-8">
        <div className="text-center flex flex-col items-center">
          <div className="bg-orange-50 p-3 rounded-full mb-4">
            <Utensils className="w-8 h-8 text-food-orange" />
          </div>
          <h2 className="text-3xl font-extrabold text-food-dark">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to access your VJFoodie account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center border border-red-100">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-slate-300 placeholder-gray-500 text-food-dark focus:outline-none focus:ring-food-orange focus:border-food-orange focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                minLength={6}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-slate-300 placeholder-gray-500 text-food-dark focus:outline-none focus:ring-food-orange focus:border-food-orange focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-food-orange hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-food-orange transition-colors"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-food-orange hover:text-orange-500">
              Sign up today
            </Link>
          </p>
        </div>

        {/* For Presentation Purposes Only */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500 text-center space-y-2">
          <p className="font-semibold text-slate-600">Presentation Test Accounts</p>
          <div className="flex justify-center space-x-6">
            <div>
              <p className="font-semibold">Staff (Admin)</p>
              <p>staff@vjfoodie.com</p>
              <p>staff</p>
            </div>
            <div>
              <p className="font-semibold">Customer</p>
              <p>user@vjfoodie.com</p>
              <p>user123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
