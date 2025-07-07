import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_PATHS = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/api/auth',
  '/api/auth/signup',
  '/api/auth/signout',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
];

/**
 * Middleware responsible for managing and refreshing the Supabase Auth session.
 *
 * This middleware is responsible for:
 *
 * 1. Refreshing the Auth token by calling `supabase.auth.getUser`.
 *
 * 2. Passing the refreshed Auth token to Server Components, so they don't attempt
 *    to refresh the same token themselves. This is accomplished with `request.cookies.set`.
 *
 * 3. Passing the refreshed Auth token to the browser, so it replaces the old token.
 *    This is accomplished with `response.cookies.set`.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          for (const cookie of cookiesToSet) {
            request.cookies.set(cookie.name, cookie.value)
          }

          supabaseResponse = NextResponse.next({
            request,
          })

          for (const cookie of cookiesToSet) {
            supabaseResponse.cookies.set(cookie.name, cookie.value, cookie.options)
          }
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isPublic = PUBLIC_PATHS.includes(pathname);

  if (!user && !isPublic) {
    // For the sake of debugging 😎
    console.error({
      message: 'User not found, redirecting to login',
      pathname: request.nextUrl.pathname,
    })

    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
