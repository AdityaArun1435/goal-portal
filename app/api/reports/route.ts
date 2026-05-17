import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (!['manager', 'admin'].includes(userData?.role ?? ''))
    return NextResponse.json({ error: 'Access denied' }, { status: 403 })

  const { data, error } = await supabase.from('goal_progress').select('*')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const headers = ['goal_id', 'user_id', 'title', 'uom_type', 'target', 'weightage', 'quarter', 'actual', 'status', 'progress_score']
  const csv = [
    headers.join(','),
    ...(data ?? []).map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','))
  ].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="achievement-report.csv"'
    }
  })
}
