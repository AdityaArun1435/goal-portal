import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: manager } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (!['manager', 'admin'].includes(manager?.role ?? ''))
    return NextResponse.json({ error: 'Only managers can add check-in comments' }, { status: 403 })

  const { achievement_id, comment } = await request.json()
  const { data, error } = await supabase.from('checkins')
    .insert({ achievement_id, manager_id: user.id, comment }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ checkin: data })
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const achievement_id = searchParams.get('achievement_id')

  const { data, error } = await supabase.from('checkins').select('*, users(name, role)')
    .eq('achievement_id', achievement_id!).order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ checkins: data })
}
