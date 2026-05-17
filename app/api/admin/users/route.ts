import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('users').select('*').order('name')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ users: data })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { name, email, password, role, manager_id, department } = await request.json()

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email, password, email_confirm: true
  })
  if (authError) return NextResponse.json({ error: authError.message }, { status: 500 })

  const { data, error } = await supabase.from('users').insert({
    id: authData.user.id, name, email, role,
    manager_id: manager_id || null,
    department: department || null
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ user: data })
}