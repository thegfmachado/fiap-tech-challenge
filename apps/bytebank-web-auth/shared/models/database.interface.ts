export interface IDatabase {
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
