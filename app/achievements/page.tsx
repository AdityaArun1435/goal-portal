'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AchievementsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState<any>({})

  useEffect(() => {
    fetch('/api/auth').then(r => r.json()).then(async data => {
      if (data.error) { router.push('/login'); return }
      setUser(data.user)
      const goalsRes = await fetch('/api/goals').then(r => r.json())
      const approved = (goalsRes.goals ?? []).filter((g: any) => g.status === 'approved')
      setGoals(approved)
      setLoading(false)
    })
  }, [])

  async function handleLog(goal_id: string, quarter: string) {
    const key = goal_id + quarter
    const actual = form[key + '_actual']
    const status = form[key + '_status'] ?? 'on_track'
    const res = await fetch('/api/achievements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal_id, quarter, actual: Number(actual), status })
    })
    const data = await res.json()
    if (data.error) { setError(data.error) } else {
      setSuccess('Achievement logged!')
      setTimeout(() => setSuccess(''), 3000)
    }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <nav style={{ background: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#2563eb' }}>Back to Dashboard</button>
        <h1 style={{ margin: 0, fontSize: '18px' }}>Achievements</h1>
        <span style={{ fontSize: '14px', color: '#666' }}>{user?.name}</span>
      </nav>

      <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
        {success && <div style={{ background: '#dcfce7', color: '#16a34a', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>{success}</div>}

        {goals.length === 0 && <p style={{ color: '#666' }}>No approved goals yet. Goals must be approved before logging achievements.</p>}

        {goals.map(goal => (
          <div key={goal.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '1rem' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '16px' }}>{goal.title} <span style={{ fontSize: '13px', color: '#666', fontWeight: '400' }}>Target: {goal.target} - Weightage: {goal.weightage}%</span></h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              {['Q1', 'Q2', 'Q3', 'Q4'].map(q => {
                const key = goal.id + q
                return (
                  <div key={q} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem' }}>
                    <p style={{ margin: '0 0 0.5rem', fontWeight: '500', fontSize: '14px' }}>{q}</p>
                    <input type="number" placeholder="Actual" value={form[key + '_actual'] ?? ''} onChange={e => setForm((f: any) => ({ ...f, [key + '_actual']: e.target.value }))} style={{ width: '100%', padding: '0.4rem', border: '1px solid #e5e7eb', borderRadius: '6px', marginBottom: '0.5rem', boxSizing: 'border-box' }} />
                    <select value={form[key + '_status'] ?? 'on_track'} onChange={e => setForm((f: any) => ({ ...f, [key + '_status']: e.target.value }))} style={{ width: '100%', padding: '0.4rem', border: '1px solid #e5e7eb', borderRadius: '6px', marginBottom: '0.5rem' }}>
                      <option value="not_started">Not Started</option>
                      <option value="on_track">On Track</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button onClick={() => handleLog(goal.id, q)} style={{ width: '100%', padding: '0.4rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                      Log
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}