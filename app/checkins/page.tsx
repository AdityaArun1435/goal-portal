'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CheckinsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [comments, setComments] = useState<any>({})

  useEffect(() => {
    fetch('/api/auth').then(r => r.json()).then(async data => {
      if (data.error) { router.push('/login'); return }
      setUser(data.user)
      const goalsRes = await fetch('/api/goals').then(r => r.json())
      setGoals(goalsRes.goals ?? [])
      setLoading(false)
    })
  }, [])

  async function handleCheckin(achievement_id: string, key: string) {
    const comment = comments[key]
    if (!comment) { setError('Please enter a comment'); return }
    const res = await fetch('/api/checkins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ achievement_id, comment })
    })
    const data = await res.json()
    if (data.error) { setError(data.error) } else {
      setSuccess('Check-in added!')
      setComments((c: any) => ({ ...c, [key]: '' }))
      setTimeout(() => setSuccess(''), 3000)
    }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>

  const approvedGoals = goals.filter(g => g.status === 'approved')

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <nav style={{ background: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#2563eb' }}>Back to Dashboard</button>
        <h1 style={{ margin: 0, fontSize: '18px' }}>Check-ins</h1>
        <span style={{ fontSize: '14px', color: '#666' }}>{user?.name}</span>
      </nav>

      <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
        {success && <div style={{ background: '#dcfce7', color: '#16a34a', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>{success}</div>}

        {approvedGoals.length === 0 && <p style={{ color: '#666' }}>No approved goals to check in on.</p>}

        {approvedGoals.map(goal => (
          <div key={goal.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '1rem' }}>
            <h3 style={{ margin: '0 0 0.25rem' }}>{goal.title}</h3>
            <p style={{ margin: '0 0 1rem', fontSize: '13px', color: '#666' }}>{goal.users?.name}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              {['Q1', 'Q2', 'Q3', 'Q4'].map(q => {
                const key = goal.id + q
                return (
                  <div key={q} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem' }}>
                    <p style={{ margin: '0 0 0.5rem', fontWeight: '500', fontSize: '14px' }}>{q}</p>
                    <textarea placeholder="Add comment..." value={comments[key] ?? ''} onChange={e => setComments((c: any) => ({ ...c, [key]: e.target.value }))} rows={2} style={{ width: '100%', padding: '0.4rem', border: '1px solid #e5e7eb', borderRadius: '6px', marginBottom: '0.5rem', boxSizing: 'border-box', fontSize: '13px' }} />
                    <button onClick={() => handleCheckin(goal.id + '_' + q, key)} style={{ width: '100%', padding: '0.4rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                      Add Check-in
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