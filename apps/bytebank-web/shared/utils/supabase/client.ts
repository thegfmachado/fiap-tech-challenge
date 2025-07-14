import { createBrowserClient } from '@supabase/ssr'

import type { IDatabase } from '@bytebank/shared/models/database.interface'

export function createClient() {
  return createBrowserClient<IDatabase>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    }
  )
}
