import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Helper: fetch profile from profiles table and merge with auth user
  const fetchAndSetUser = async (authUser) => {
    if (!authUser) {
      setUser(null)
      return
    }

    // Try to get the profile from the database
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, email, role')
      .eq('user_id', authUser.id)
      .single()

    setUser({
      id: authUser.id,
      email: authUser.email,
      name: profile?.name || authUser.user_metadata?.name || 'User',
      role: profile?.role || authUser.user_metadata?.role || 'customer'
    })
  }

  useEffect(() => {
    // Check active sessions and sets the user
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        await fetchAndSetUser(session.user)
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        await fetchAndSetUser(session.user)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Helper to convert username to a valid email format for Supabase
  const formatEmail = (username) => {
    return username.includes('@') ? username : `${username}@vjfoodie.com`
  }

  const login = async (username, password) => {
    try {
      const email = formatEmail(username)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Profile will be fetched by the onAuthStateChange listener
      const role = data.user.user_metadata.role || 'customer'
      return { success: true, role }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const signup = async (name, username, password) => {
    try {
      const email = formatEmail(username)
      const role = 'customer'

      // Create auth user — the database trigger automatically creates the profile
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role },
        },
      })

      if (error) throw error

      return { success: true, role }

    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}