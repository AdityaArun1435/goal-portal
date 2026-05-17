import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { cycle_id } = await request.json()
  const { data: goals } = await supabase.from('goals').select('id, weightage, status')
    .eq('user_id', user.id).eq('cycle_id', cycle_id).in('status', ['draft', 'rework'])

  if (!goals || goals.length === 0)
    return NextResponse.json({ error: 'No goals to submit' }, { status: 400 })

  const total = goals.reduce((sum, g) => sum + g.weightage, 0)
  if (total !== 100)
    return NextResponse.json({ error: `Total weightage must equal 100%. Current total: ${total}%` }, { status: 400 })

  const { error } = await supabase.from('goals').update({ status: 'submitted' })
    .eq('user_id', user.id).eq('cycle_id', cycle_id).in('status', ['draft', 'rework'])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, submitted: goals.length })
}
