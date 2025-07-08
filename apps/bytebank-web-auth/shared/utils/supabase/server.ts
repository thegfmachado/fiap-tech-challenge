import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import type { IDatabase } from '@bytebank-web-auth/shared/models/database.interface'

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
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
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
