import { createClient } from '@supabase/supabase-js'

export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string
          type: 'credit' | 'debit'
          description: string
          value: number
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          type: 'credit' | 'debit'
          description: string
          value: number
          date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: 'credit' | 'debit'
          description?: string
          value?: number
          date?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

export const createServiceSupabase = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

export const handleSupabaseError = (error: any): Error => {
  if (error?.message) {
    return new Error(`Supabase Error: ${error.message}`)
  }
  return new Error('Unknown Supabase error occurred')
}

export default supabase
