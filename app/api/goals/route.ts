import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single()
  let query = supabase.from('goals').select('*, thrust_areas(name), user:users!user_id(name, email)')

  if (userData?.role === 'employee') {
    query = query.eq('user_id', user.id)
  } else if (userData?.role === 'manager') {
    const { data: team } = await supabase.from('users').select('id').eq('manager_id', user.id)
    const teamIds = [user.id, ...(team?.map(u => u.id) ?? [])]
    query = query.in('user_id', teamIds)
  }

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ goals: data })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { thrust_area_id, title, description, uom_type, target, target_date, weightage, cycle_id } = body

  if (weightage < 10)
    return NextResponse.json({ error: 'Minimum weightage per goal is 10%' }, { status: 400 })

  const { data: existingGoals } = await supabase.from('goals').select('weightage').eq('user_id', user.id).eq('cycle_id', cycle_id)
  const totalWeightage = (existingGoals ?? []).reduce((sum, g) => sum + g.weightage, 0) + weightage
  if (totalWeightage > 100)
    return NextResponse.json({ error: `Total weightage cannot exceed 100%. You have ${100 - (totalWeightage - weightage)}% remaining.` }, { status: 400 })

  const { data, error } = await supabase.from('goals')
    .insert({ user_id: user.id, cycle_id, thrust_area_id, title, description, uom_type, target, target_date, weightage, status: 'draft' })
    .select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ goal: data }, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, ...updates } = await request.json()
  const { data: goal } = await supabase.from('goals').select('status, user_id').eq('id', id).single()

  if (!goal) return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
  if (goal.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (!['draft', 'rework'].includes(goal.status))
    return NextResponse.json({ error: 'Cannot edit a submitted or approved goal' }, { status: 400 })

  const { data, error } = await supabase.from('goals').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ goal: data })
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await request.json()
  const { data: goal } = await supabase.from('goals').select('status, user_id').eq('id', id).single()

  if (!goal) return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
  if (goal.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (goal.status !== 'draft')
    return NextResponse.json({ error: 'Only draft goals can be deleted' }, { status: 400 })

  await supabase.from('goals').delete().eq('id', id)
  return NextResponse.json({ success: true })
}
