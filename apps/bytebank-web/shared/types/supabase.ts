export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string
          type: 'credit' | 'debit'
          value: number
          date: string
          description: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: 'credit' | 'debit'
          value: number
          date?: string
          description: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: 'credit' | 'debit'
          value?: number
          date?: string
          description?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      transaction_stats: {
        Row: {
          total_transactions: number | null
          credit_count: number | null
          debit_count: number | null
          total_credits: number | null
          total_debits: number | null
          current_balance: number | null
          last_transaction_date: string | null
          first_transaction_date: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_transaction_summary: {
        Args: {
          start_date?: string
          end_date?: string
        }
        Returns: {
          period_start: string
          period_end: string
          total_transactions: number
          credit_count: number
          debit_count: number
          total_credits: number
          total_debits: number
          net_balance: number
        }[]
      }
    }
    Enums: {}
    CompositeTypes: {}
  }
}

export type Transaction = Database['public']['Tables']['transactions']['Row']
export type TransactionInsert = Database['public']['Tables']['transactions']['Insert']
export type TransactionUpdate = Database['public']['Tables']['transactions']['Update']
export type TransactionStats = Database['public']['Views']['transaction_stats']['Row']
export type TransactionSummary = Database['public']['Functions']['get_transaction_summary']['Returns'][0]

export type TransactionType = Transaction['type']
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
