'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function GoalsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [goals, setGoals] = useState<any[]>([])
  const [cycles, setCycles] = useState<any[]>([])
  const [thrustAreas, setThrustAreas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedCycle, setSelectedCycle] = useState('')
  const [form, setForm] = useState({
    title: '', description: '', thrust_area_id: '',
    uom_type: 'numeric_min', target: '', weightage: ''
  })

  useEffect(() => {
    fetch('/api/auth').then(r => r.json()).then(async data => {
      if (data.error) { router.push('/login'); return }
      setUser(data.user)
      const [goalsRes, cyclesRes, areasRes] = await Promise.all([
        fetch('/api/goals').then(r => r.json()),
        fetch('/api/cycles').then(r => r.json()),
        fetch('/api/thrust-areas').then(r => r.json())
      ])
      setGoals(goalsRes.goals ?? [])
      setCycles(cyclesRes.cycles ?? [])
      if (cyclesRes.cycles?.length > 0) setSelectedCycle(cyclesRes.cycles[0].id)
      setThrustAreas(areasRes.areas ?? [])
      setLoading(false)
    })
  }, [])

  async function handleCreate() {
    if (!selectedCycle) { setError('No cycle selected'); return }
    setSubmitting(true)
    setError('')
    const res = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, target: Number(form.target), weightage: Number(form.weightage), cycle_id: selectedCycle })
    })
    const data = await res.json()
    setSubmitting(false)
    if (data.error) { setError(data.error) } else {
      setGoals(prev => [data.goal, ...prev])
      setShowForm(false)
      setForm({ title: '', description: '', thrust_area_id: '', uom_type: 'numeric_min', target: '', weightage: '' })
      setSuccess('Goal created!')
      setTimeout(() => setSuccess(''), 3000)
    }
  }

  async function handleSubmitAll() {
    if (!selectedCycle) { setError('No cycle selected'); return }
    setSubmitting(true)
    const res = await fetch('/api/goals/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cycle_id: selectedCycle })
    })
    const data = await res.json()
    setSubmitting(false)
    if (data.error) { setError(data.error) } else {
      setSuccess(`Submitted ${data.submitted} goals for approval!`)
      setTimeout(() => setSuccess(''), 3000)
      const res2 = await fetch('/api/goals').then(r => r.json())
      setGoals(res2.goals ?? [])
    }
  }

  async function handleApprove(goal_id: string, action: string) {
    const comment = action === 'return' ? prompt('Reason for returning:') : ''
    const res = await fetch('/api/goals/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal_id, action, comment })
    })
    const data = await res.json()
    if (data.error) { setError(data.error) } else {
      setSuccess('Goal updated!')
      setTimeout(() => setSuccess(''), 3000)
      const res2 = await fetch('/api/goals').then(r => r.json())
      setGoals(res2.goals ?? [])
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this goal?')) return
    const res = await fetch('/api/goals', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    const data = await res.json()
    if (data.error) { setError(data.error) } else {
      setGoals(prev => prev.filter(g => g.id !== id))
    }
  }

  const statusColor: any = {
    draft: '#6b7280', submitted: '#d97706', approved: '#16a34a',
    rework: '#dc2626', locked: '#1d4ed8'
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <nav style={{ background: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#2563eb' }}>Back to Dashboard</button>
        <h1 style={{ margin: 0, fontSize: '18px' }}>Goals</h1>
        <span style={{ fontSize: '14px', color: '#666' }}>{user?.name} - {user?.role}</span>
      </nav>

      <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
        {success && <div style={{ background: '#dcfce7', color: '#16a34a', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>{success}</div>}

        <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: '14px', marginRight: '0.5rem' }}>Cycle:</label>
            <select value={selectedCycle} onChange={e => setSelectedCycle(e.target.value)} style={{ padding: '0.6rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              {cycles.map(c => <option key={c.id} value={c.id}>{c.year} - {c.phase}</option>)}
            </select>
          </div>
          {user?.role === 'employee' && (
            <>
              <button onClick={() => setShowForm(!showForm)} style={{ padding: '0.6rem 1.2rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                {showForm ? 'Cancel' : '+ New Goal'}
              </button>
              <button onClick={handleSubmitAll} style={{ padding: '0.6rem 1.2rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                Submit All for Approval
              </button>
            </>
          )}
        </div>

        {showForm && (
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #e5e7eb' }}>
            <h3 style={{ marginTop: 0 }}>Create New Goal</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '14px' }}>Title</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={{ width: '100%', padding: '0.6rem', border: '1px solid #e5e7eb', borderRadius: '8px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '14px' }}>Thrust Area</label>
                <select value={form.thrust_area_id} onChange={e => setForm(f => ({ ...f, thrust_area_id: e.target.value }))} style={{ width: '100%', padding: '0.6rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                  <option value="">Select area</option>
                  {thrustAreas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '14px' }}>Unit of Measurement</label>
                <select value={form.uom_type} onChange={e => setForm(f => ({ ...f, uom_type: e.target.value }))} style={{ width: '100%', padding: '0.6rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                  <option value="numeric_min">Numeric (higher is better)</option>
                  <option value="numeric_max">Numeric (lower is better)</option>
                  <option value="timeline">Timeline</option>
                  <option value="zero">Zero based</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '14px' }}>Target</label>
                <input type="number" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} style={{ width: '100%', padding: '0.6rem', border: '1px solid #e5e7eb', borderRadius: '8px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '14px' }}>Weightage (%)</label>
                <input type="number" min="10" max="100" value={form.weightage} onChange={e => setForm(f => ({ ...f, weightage: e.target.value }))} style={{ width: '100%', padding: '0.6rem', border: '1px solid #e5e7eb', borderRadius: '8px', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '14px' }}>Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} style={{ width: '100%', padding: '0.6rem', border: '1px solid #e5e7eb', borderRadius: '8px', boxSizing: 'border-box' }} />
            </div>
            <button onClick={handleCreate} disabled={submitting} style={{ marginTop: '1rem', padding: '0.6rem 1.5rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              {submitting ? 'Creating...' : 'Create Goal'}
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {goals.length === 0 && <p style={{ color: '#666' }}>No goals yet. Click New Goal to create one.</p>}
          {goals.map(goal => (
            <div key={goal.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem', fontSize: '16px' }}>{goal.title}</h3>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '13px', color: '#666' }}>{goal.thrust_areas?.name} - Weightage: {goal.weightage}% - Target: {goal.target}</p>
                  {goal.description && <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>{goal.description}</p>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '12px', fontWeight: '500', background: statusColor[goal.status] + '20', color: statusColor[goal.status] }}>
                    {goal.status}
                  </span>
                  {user?.role === 'employee' && goal.status === 'draft' && (
                    <button onClick={() => handleDelete(goal.id)} style={{ padding: '0.25rem 0.75rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>
                      Delete
                    </button>
                  )}
                  {['manager', 'admin'].includes(user?.role) && goal.status === 'submitted' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleApprove(goal.id, 'approve')} style={{ padding: '0.25rem 0.75rem', background: '#dcfce7', color: '#16a34a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>Approve</button>
                      <button onClick={() => handleApprove(goal.id, 'return')} style={{ padding: '0.25rem 0.75rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>Return</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}