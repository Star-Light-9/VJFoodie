import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const parseEnv = (content) => {
  const env = {}
  content.split('\n').forEach((line) => {
    const parts = line.split('=')
    if (parts.length >= 2) {
      env[parts[0].trim()] = parts.slice(1).join('=').trim()
    }
  })
  return env
}

async function verify() {
  try {
    const envContent = fs.readFileSync('.env', 'utf-8')
    const env = parseEnv(envContent)

    const url = env.VITE_SUPABASE_URL
    const key = env.VITE_SUPABASE_ANON_KEY

    if (!url || !key) {
      console.error('❌ Environment variables VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not found in .env')
      return
    }

    console.log('✅ Found environment variables.')
    console.log(`🔗 URL: ${url}`)

    const supabase = createClient(url, key)

    console.log('🧪 Testing connection to "users" table...')
    const { data, error } = await supabase
      .from('users')
    .select('*')
    .limit(1)

    if (error) {
      console.error('❌ Connection test failed!')
      console.error('Error message:', error.message)
      if (error.code === 'PGRST116') {
        console.log('💡 Note: The connection was successful, but the table "User" might be empty or restricted by RLS.')
      }
    } else {
      console.log('🎉 Connection successful!')
      console.log('📊 Data received:', data)
    }
  } catch (err) {
    console.error('❌ An unexpected error occurred:', err)
  }
}

verify()
