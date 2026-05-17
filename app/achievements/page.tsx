'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DarkNav } from '@/components/ui/dark-nav'
import { GlowButton } from '@/components/ui/glow-button'
import { GlowCard } from '@/components/ui/spotlight-card'
import LiquidLoading from '@/components/ui/liquid-loader'

const statusOptions = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'on_track',    label: 'On Track' },
  { value: 'completed',  label: 'Completed' },
]

const darkInput = "w-full px-2.5 py-1.5 text-xs rounded-md bg-white/[0.05] border border-white/[0.08] text-white/85 placeholder:text-white/25 focus:outline-none focus:border-white/20 transition-colors"
const darkSelect = "w-full px-2.5 py-1.5 text-xs rounded-md bg-[#1a1a1a] border border-white/[0.08] text-white/85 focus:outline-none focus:border-white/20 transition-colors cursor-pointer"

function Spinner() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

export default function AchievementsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState<any>({})
  const [logging, setLogging] = useState<string>('')

  useEffect(() => {
    fetch('/api/auth').then(r => r.json()).then(async data => {
      if (data.error) { router.push('/login'); return }
      setUser(data.user)
      const goalsRes = await fetch('/api/goals').then(r => r.json())
      setGoals((goalsRes.goals ?? []).filter((g: any) => g.status === 'approved'))
      setLoading(false)
    })
  }, [])

  async function handleLog(goal_id: string, quarter: string) {
    const key = goal_id + quarter
    setLogging(key)
    const res = await fetch('/api/achievements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal_id, quarter, actual: Number(form[key + '_actual']), status: form[key + '_status'] ?? 'on_track' })
    })
    const data = await res.json()
    setLogging('')
    if (data.error) { setError(data.error) } else {
      setSuccess('Achievement logged!')
      setTimeout(() => setSuccess(''), 3000)
    }
  }

  async function handleLogout() {
    await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'logout' }) })
    router.push('/login')
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <LiquidLoading />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <DarkNav user={user} onLogout={handleLogout} pageTitle="Achievements" showBack />

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

        {goals.length === 0 && (
          <div className="bg-[#111] border border-[#222] rounded-xl p-12 text-center">
            <div className="w-10 h-10 bg-white/[0.04] rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-white/25" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2l2.09 4.26L17 7.27l-3.5 3.41.83 4.82L10 13.27l-4.33 2.23.83-4.82L3 7.27l4.91-.71L10 2z"/>
              </svg>
            </div>
            <p className="text-sm text-white/35">No approved goals yet. Goals must be approved before logging achievements.</p>
          </div>
        )}

        <div className="space-y-5">
          {goals.map(goal => (
            <GlowCard key={goal.id} glowColor="blue" className="overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.05]">
                <h3 className="text-sm font-semibold text-white/85">{goal.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-white/35">
                  <span>Target: <span className="text-white/60 font-medium">{goal.target}</span></span>
                  <span>·</span>
                  <span>Weightage: <span className="text-white/60 font-medium">{goal.weightage}%</span></span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-white/[0.05]">
                {['Q1', 'Q2', 'Q3', 'Q4'].map(q => {
                  const key = goal.id + q
                  const isLogging = logging === key
                  return (
                    <div key={q} className="p-4">
                      <p className="text-xs font-semibold text-white/35 uppercase tracking-wider mb-3">{q}</p>
                      <div className="space-y-2">
                        <input
                          type="number"
                          placeholder="Actual value"
                          value={form[key + '_actual'] ?? ''}
                          onChange={e => setForm((f: any) => ({ ...f, [key + '_actual']: e.target.value }))}
                          className={darkInput}
                        />
                        <select
                          value={form[key + '_status'] ?? 'on_track'}
                          onChange={e => setForm((f: any) => ({ ...f, [key + '_status']: e.target.value }))}
                          className={darkSelect}
                        >
                          {statusOptions.map(o => <option key={o.value} value={o.value} className="bg-[#1a1a1a]">{o.label}</option>)}
                        </select>
                        <GlowButton onClick={() => handleLog(goal.id, q)} variant="primary">
                          {isLogging ? <><Spinner /> Saving…</> : 'Log Achievement'}
                        </GlowButton>
                      </div>
                    </div>
                  )
                })}
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </div>
  )
}
