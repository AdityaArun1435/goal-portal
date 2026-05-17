import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const quarter = searchParams.get('quarter')
  const goal_id = searchParams.get('goal_id')

  let query = supabase.from('achievements').select('*, goals(title, uom_type, target, weightage, user_id)')
  if (goal_id) query = query.eq('goal_id', goal_id)
  if (quarter) query = query.eq('quarter', quarter)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ achievements: data })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { goal_id, quarter, actual, actual_date, status } = await request.json()
  const { data: goal } = await supabase.from('goals').select('user_id, status').eq('id', goal_id).single()

  if (!goal) return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
  if (goal.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (goal.status !== 'approved')
    return NextResponse.json({ error: 'Can only log achievement for approved goals' }, { status: 400 })

  const { data, error } = await supabase.from('achievements')
    .upsert({ goal_id, quarter, actual, actual_date, status }, { onConflict: 'goal_id,quarter' })
    .select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ achievement: data })
}
