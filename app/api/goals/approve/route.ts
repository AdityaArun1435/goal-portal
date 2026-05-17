import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: manager } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (!['manager', 'admin'].includes(manager?.role ?? ''))
    return NextResponse.json({ error: 'Only managers can approve goals' }, { status: 403 })

  const { goal_id, action, comment, target, weightage } = await request.json()

  if (target !== undefined || weightage !== undefined) {
    await supabase.from('goals').update({
      ...(target !== undefined && { target }),
      ...(weightage !== undefined && { weightage })
    }).eq('id', goal_id)
  }

  const newStatus = action === 'approve' ? 'approved' : 'rework'
  const { error } = await supabase.from('goals').update({ status: newStatus }).eq('id', goal_id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.from('approvals').insert({
    goal_id, manager_id: user.id,
    action: action === 'approve' ? 'approved' : 'returned',
    comment
  })

  return NextResponse.json({ success: true, status: newStatus })
}
