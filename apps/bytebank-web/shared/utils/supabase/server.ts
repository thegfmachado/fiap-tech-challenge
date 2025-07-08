import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import type { IDatabase } from '@bytebank/shared/models/database.interface'

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<IDatabase>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            for (const cookie of cookiesToSet) {
              cookieStore.set(cookie.name, cookie.value, cookie.options)
            }
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored since we have a middleware refreshing
            // user sessions.
          }
        },
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      },
    }
  )
}
