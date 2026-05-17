import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { action, email, password } = await request.json()

  if (action === 'login') {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return NextResponse.json({ error: error.message }, { status: 401 })
    const { data: userData } = await supabase.from('users').select('*').eq('id', data.user.id).single()
    return NextResponse.json({ user: userData })
  }

  if (action === 'logout') {
    await supabase.auth.signOut()
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not logged in' }, { status: 401 })
  const { data: userData } = await supabase.from('users').select('*').eq('id', user.id).single()
  return NextResponse.json({ user: userData })
}
