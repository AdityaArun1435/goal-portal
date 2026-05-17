'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DarkNav } from '@/components/ui/dark-nav'
import { GlowButton } from '@/components/ui/glow-button'
import { GlowCard } from '@/components/ui/spotlight-card'
import LiquidLoading from '@/components/ui/liquid-loader'

const darkTextarea = "w-full px-2.5 py-1.5 text-xs rounded-md bg-white/[0.05] border border-white/[0.08] text-white/85 placeholder:text-white/25 focus:outline-none focus:border-white/20 transition-colors resize-none"

function Spinner() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

export default function CheckinsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [comments, setComments] = useState<any>({})
  const [saving, setSaving] = useState<string>('')

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
    setSaving(key); setError('')
    const res = await fetch('/api/checkins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ achievement_id, comment })
    })
    const data = await res.json()
    setSaving('')
    if (data.error) { setError(data.error) } else {
      setSuccess('Check-in added!')
      setComments((c: any) => ({ ...c, [key]: '' }))
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

  const approvedGoals = goals.filter(g => g.status === 'approved')

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <DarkNav user={user} onLogout={handleLogout} pageTitle="Check-ins" showBack />

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

        {approvedGoals.length === 0 && (
          <div className="bg-[#111] border border-[#222] rounded-xl p-12 text-center">
            <div className="w-10 h-10 bg-white/[0.04] rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-white/25" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            </div>
            <p className="text-sm text-white/35">No approved goals to check in on.</p>
          </div>
        )}

        <div className="space-y-5">
          {approvedGoals.map(goal => (
            <GlowCard key={goal.id} glowColor="green" className="overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.05]">
                <h3 className="text-sm font-semibold text-white/85">{goal.title}</h3>
                {goal.users?.name && <p className="text-xs text-white/35 mt-0.5">{goal.users.name}</p>}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-white/[0.05]">
                {['Q1', 'Q2', 'Q3', 'Q4'].map(q => {
                  const key = goal.id + q
                  const isSaving = saving === key
                  return (
                    <div key={q} className="p-4">
                      <p className="text-xs font-semibold text-white/35 uppercase tracking-wider mb-3">{q}</p>
                      <div className="space-y-2">
                        <textarea
                          placeholder="Add comment…"
                          value={comments[key] ?? ''}
                          onChange={e => setComments((c: any) => ({ ...c, [key]: e.target.value }))}
                          rows={3}
                          className={darkTextarea}
                        />
                        <GlowButton onClick={() => handleCheckin(goal.id + '_' + q, key)} variant="primary">
                          {isSaving ? <><Spinner /> Saving…</> : 'Add Check-in'}
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
