import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    'https://exmhuwausgvyhkmuwxft.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4bWh1d2F1c2d2eWhrbXV3eGZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NTU0NjEsImV4cCI6MjA5NDUzMTQ2MX0.NikIhBue_eoFowS9LbZTJ-zvQtjASoO7giam8JP8v7o',
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options))
          } catch {}
        },
      },
    }
  )
}
