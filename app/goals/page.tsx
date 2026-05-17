'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DarkNav } from '@/components/ui/dark-nav'
import { NeonButton } from '@/components/ui/neon-button'
import { GlowCard } from '@/components/ui/spotlight-card'
import LiquidLoading from '@/components/ui/liquid-loader'

const statusStyles: Record<string, string> = {
  draft:     'bg-white/5 text-white/40 border border-white/[0.08]',
  submitted: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
  approved:  'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
  rework:    'bg-red-500/15 text-red-400 border border-red-500/20',
  locked:    'bg-blue-500/15 text-blue-400 border border-blue-500/20',
}

const darkInput  = "w-full px-3 py-2 text-sm rounded-lg bg-white/[0.05] border border-white/[0.1] text-white/85 placeholder:text-white/25 focus:outline-none focus:border-white/25 focus:ring-1 focus:ring-white/10 transition-colors"
const darkSelect = "w-full px-3 py-2 text-sm rounded-lg bg-[#1a1a1a] border border-white/[0.1] text-white/85 focus:outline-none focus:border-white/25 transition-colors cursor-pointer"

function Spinner() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

function formatPhase(phase: string) {
  return phase.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
}

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
    setSubmitting(true); setError('')
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

  async function handleLogout() {
    await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'logout' }) })
    router.push('/login')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
      <LiquidLoading />
      <p style={{ color: '#666', fontSize: '14px' }}>Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <DarkNav user={user} onLogout={handleLogout} pageTitle="Goals" showBack />

      <div className="pt-14 max-w-4xl mx-auto px-6 py-8">
        {error && (
          <div className="flex items-start gap-2.5 bg-red-500/[0.08] border border-red-500/20 text-red-400/90 text-sm px-4 py-3 rounded-lg mb-4">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 4h1.5v4.5h-1.5V5zm0 5.5h1.5v1.5h-1.5v-1.5z"/></svg>
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-start gap-2.5 bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400/90 text-sm px-4 py-3 rounded-lg mb-4">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z" clipRule="evenodd"/></svg>
            {success}
          </div>
        )}

        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-white/35 uppercase tracking-wider">Cycle</label>
            <select value={selectedCycle} onChange={e => setSelectedCycle(e.target.value)} className={darkSelect} style={{width: 'auto'}}>
              {cycles.map(c => (
                <option key={c.id} value={c.id} className="bg-[#1a1a1a]">
                  {c.year} · {formatPhase(c.phase)}
                </option>
              ))}
            </select>
          </div>
          {user?.role === 'employee' && (
            <div className="flex items-center gap-2 ml-auto">
              <NeonButton onClick={() => setShowForm(!showForm)} variant="ghost" className="text-white cursor-pointer">
                {showForm ? 'Cancel' : '+ New Goal'}
              </NeonButton>
              <NeonButton onClick={handleSubmitAll} variant="ghost" className="text-white cursor-pointer">
                {submitting ? <><Spinner /> Submitting…</> : 'Submit All'}
              </NeonButton>
            </div>
          )}
        </div>

        {showForm && (
          <div className="bg-[#111] border border-[#222] rounded-xl p-6 mb-6">
            <h3 className="text-sm font-semibold text-white/85 mb-5">New Goal</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/35 uppercase tracking-wider mb-1.5">Title</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Goal title" className={darkInput} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/35 uppercase tracking-wider mb-1.5">Thrust Area</label>
                <select value={form.thrust_area_id} onChange={e => setForm(f => ({ ...f, thrust_area_id: e.target.value }))} className={darkSelect}>
                  <option value="" className="bg-[#1a1a1a]">Select area</option>
                  {thrustAreas.map(a => <option key={a.id} value={a.id} className="bg-[#1a1a1a]">{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/35 uppercase tracking-wider mb-1.5">Unit of Measurement</label>
                <select value={form.uom_type} onChange={e => setForm(f => ({ ...f, uom_type: e.target.value }))} className={darkSelect}>
                  <option value="numeric_min" className="bg-[#1a1a1a]">Numeric (higher is better)</option>
                  <option value="numeric_max" className="bg-[#1a1a1a]">Numeric (lower is better)</option>
                  <option value="timeline" className="bg-[#1a1a1a]">Timeline</option>
                  <option value="zero" className="bg-[#1a1a1a]">Zero based</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/35 uppercase tracking-wider mb-1.5">Target</label>
                <input type="number" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} placeholder="0" className={darkInput} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/35 uppercase tracking-wider mb-1.5">Weightage (%)</label>
                <input type="number" min="10" max="100" value={form.weightage} onChange={e => setForm(f => ({ ...f, weightage: e.target.value }))} placeholder="10–100" className={darkInput} />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs font-semibold text-white/35 uppercase tracking-wider mb-1.5">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Describe this goal…" className={`${darkInput} resize-none`} />
            </div>
            <div className="mt-5 flex items-center gap-3">
              <NeonButton onClick={handleCreate} variant="solid" className="cursor-pointer">
                {submitting ? <><Spinner /> Creating…</> : 'Create Goal'}
              </NeonButton>
              <NeonButton onClick={() => setShowForm(false)} variant="ghost" className="cursor-pointer">Cancel</NeonButton>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {goals.length === 0 && (
            <div className="bg-[#111] border border-[#222] rounded-xl p-12 text-center">
              <div className="w-10 h-10 bg-white/[0.04] rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-white/25" viewBox="0 0 20 20" fill="currentColor">
                  <circle cx="10" cy="10" r="2.5"/><circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </div>
              <p className="text-sm text-white/35">No goals yet. Click <strong className="text-white/60">+ New Goal</strong> to get started.</p>
            </div>
          )}
          {goals.map(goal => (
            <GlowCard key={goal.id} glowColor="purple" className="px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white/85 truncate mb-1">{goal.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-white/35">
                    {goal.thrust_areas?.name && <span>{goal.thrust_areas.name}</span>}
                    <span>Target: <span className="text-white/60 font-medium">{goal.target}</span></span>
                    <span>Weight: <span className="text-white/60 font-medium">{goal.weightage}%</span></span>
                  </div>
                  {goal.description && <p className="text-xs text-white/30 mt-1.5 line-clamp-2">{goal.description}</p>}
                  {goal.users?.name && user?.role !== 'employee' && (
                    <p className="text-xs text-white/30 mt-1">{goal.users.name}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[goal.status] ?? 'bg-white/5 text-white/40'}`}>
                    {goal.status}
                  </span>
                  {user?.role === 'employee' && goal.status === 'draft' && (
                    <NeonButton onClick={() => handleDelete(goal.id)} variant="ghost" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10 cursor-pointer" title="Delete goal">
                      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 1h3a.5.5 0 01.5.5v1H6v-1a.5.5 0 01.5-.5zM11 2.5v-1A1.5 1.5 0 009.5 0h-3A1.5 1.5 0 005 1.5v1H2.506a.58.58 0 00-.01 0H1.5a.5.5 0 000 1h.538l.853 10.66A2 2 0 004.885 16h6.23a2 2 0 001.994-1.84l.853-10.66h.538a.5.5 0 000-1h-.995a.59.59 0 00-.01 0H11z"/></svg>
                    </NeonButton>
                  )}
                  {['manager', 'admin'].includes(user?.role) && goal.status === 'submitted' && (
                    <div className="flex gap-1.5">
                      <NeonButton onClick={() => handleApprove(goal.id, 'approve')} variant="ghost" size="sm" className="flex items-center gap-1 border-green-500/30 text-green-400 hover:bg-green-500/10 cursor-pointer">
                        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor"><path fillRule="evenodd" d="M10.354 3.146a.5.5 0 010 .708l-5.5 5.5a.5.5 0 01-.708 0l-2.5-2.5a.5.5 0 01.708-.708L4.5 8.293l5.146-5.147a.5.5 0 01.708 0z" clipRule="evenodd"/></svg>
                        Approve
                      </NeonButton>
                      <NeonButton onClick={() => handleApprove(goal.id, 'return')} variant="ghost" size="sm" className="flex items-center gap-1 border-red-500/30 text-red-400 hover:bg-red-500/10 cursor-pointer">
                        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor"><path d="M6 0a6 6 0 100 12A6 6 0 006 0zM4.646 4.646a.5.5 0 01.708 0L6 5.293l.646-.647a.5.5 0 01.708.708L6.707 6l.647.646a.5.5 0 01-.708.708L6 6.707l-.646.647a.5.5 0 01-.708-.708L5.293 6l-.647-.646a.5.5 0 010-.708z"/></svg>
                        Return
                      </NeonButton>
                    </div>
                  )}
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </div>
  )
}
