import { supabase } from './supabase'

/**
 * Example function to test Supabase connection by querying the 'User' table.
 * You can call this function from App.jsx or main.jsx to verify connectivity.
 */
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('User') // Replace 'User' with your actual table name if different
      .select('*')
      .limit(1)

    if (error) {
      console.error('Error fetching data from Supabase:', error.message)
      return { success: false, error }
    }

    console.log('Successfully connected to Supabase. Sample data:', data)
    return { success: true, data }
  } catch (err) {
    console.error('Unexpected error:', err)
    return { success: false, error: err }
  }
}
