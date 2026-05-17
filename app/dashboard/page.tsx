'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { WebGLShader } from '@/components/ui/web-gl-shader'
import { DarkNav } from '@/components/ui/dark-nav'
import { GlowCard } from '@/components/ui/spotlight-card'
import LiquidLoading from '@/components/ui/liquid-loader'

const navItems: Record<string, { title: string; desc: string; href: string; icon: React.ReactNode }[]> = {
  employee: [
    {
      title: 'My Goals',
      desc: 'Create and manage your goals for the current cycle',
      href: '/goals',
      icon: (
        <svg className="w-6 h-6 text-white/70" viewBox="0 0 20 20" fill="currentColor">
          <circle cx="10" cy="10" r="2.5" />
          <circle cx="10" cy="10" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="10" cy="10" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      title: 'My Achievements',
      desc: 'Log quarterly actuals against approved goals',
      href: '/achievements',
      icon: (
        <svg className="w-6 h-6 text-white/70" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2l2.09 4.26L17 7.27l-3.5 3.41.83 4.82L10 13.27l-4.33 2.23.83-4.82L3 7.27l4.91-.71L10 2z" />
        </svg>
      ),
    },
  ],
  manager: [
    {
      title: 'Team Goals',
      desc: 'Review and approve team goals',
      href: '/goals',
      icon: (
        <svg className="w-6 h-6 text-white/70" viewBox="0 0 20 20" fill="currentColor">
          <circle cx="10" cy="10" r="2.5" />
          <circle cx="10" cy="10" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="10" cy="10" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      title: 'Check-ins',
      desc: 'Add quarterly check-in comments on goals',
      href: '/checkins',
      icon: (
        <svg className="w-6 h-6 text-white/70" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: 'Reports',
      desc: 'Download achievement reports',
      href: '/reports',
      icon: (
        <svg className="w-6 h-6 text-white/70" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      ),
    },
  ],
  admin: [
    {
      title: 'All Goals',
      desc: 'View all goals across the organisation',
      href: '/goals',
      icon: (
        <svg className="w-6 h-6 text-white/70" viewBox="0 0 20 20" fill="currentColor">
          <circle cx="10" cy="10" r="2.5" />
          <circle cx="10" cy="10" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="10" cy="10" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      title: 'Manage Users',
      desc: 'Create and manage user accounts',
      href: '/admin/users',
      icon: (
        <svg className="w-6 h-6 text-white/70" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
    },
    {
      title: 'Reports',
      desc: 'Download achievement reports as CSV',
      href: '/reports',
      icon: (
        <svg className="w-6 h-6 text-white/70" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: 'Audit Log',
      desc: 'View a full log of all data changes',
      href: '/admin/audit',
      icon: (
        <svg className="w-6 h-6 text-white/70" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
    },
  ],
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-[#111] border border-[#222] rounded-xl p-5 flex items-start gap-4">
      <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-white/90 tracking-tight leading-none mb-1">{value}</p>
        <p className="text-xs text-white/40">{label}</p>
      </div>
    </div>
  )
}

function NavCard({
  title, desc, href, icon, glowColor,
}: {
  title: string; desc: string; href: string; icon: React.ReactNode
  glowColor: 'blue' | 'purple' | 'green' | 'red' | 'orange'
}) {
  const router = useRouter()
  return (
    <div onClick={() => router.push(href)} className="cursor-pointer group">
      <GlowCard glowColor={glowColor} className="w-full transition-transform duration-200 hover:-translate-y-0.5">
        <div className="p-6">
          <div className="w-11 h-11 rounded-xl bg-white/[0.06] flex items-center justify-center mb-5">
            {icon}
          </div>
          <h3 className="text-sm font-semibold text-white/85 mb-1.5">{title}</h3>
          <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
          <div className="flex justify-end mt-4">
            <svg
              className="w-4 h-4 text-white/20 group-hover:text-white/45 group-hover:translate-x-0.5 transition-all duration-200"
              viewBox="0 0 16 16" fill="currentColor"
            >
              <path fillRule="evenodd" d="M1 8a.5.5 0 01.5-.5h11.793l-3.147-3.146a.5.5 0 01.708-.708l4 4a.5.5 0 010 .708l-4 4a.5.5 0 01-.708-.708L13.293 8.5H1.5A.5.5 0 011 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </GlowCard>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [goals, setGoals] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth').then(r => r.json()).then(async data => {
      if (data.error) { router.push('/login'); return }
      const u = data.user
      setUser(u)
      const [goalsRes] = await Promise.all([
        fetch('/api/goals').then(r => r.json()),
      ])
      setGoals(goalsRes.goals ?? [])
      if (u.role === 'admin') {
        const usersRes = await fetch('/api/admin/users').then(r => r.json())
        setUsers(usersRes.users ?? [])
      }
      setLoading(false)
    })
  }, [])

  async function handleLogout() {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' })
    })
    router.push('/login')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
      <LiquidLoading />
      <p style={{ color: '#666', fontSize: '14px' }}>Loading...</p>
    </div>
  )

  const approved  = goals.filter(g => g.status === 'approved').length
  const submitted = goals.filter(g => g.status === 'submitted').length
  const draft     = goals.filter(g => g.status === 'draft').length
  const rework    = goals.filter(g => g.status === 'rework').length

  const statsByRole: Record<string, { label: string; value: number; icon: React.ReactNode }[]> = {
    employee: [
      { label: 'Goals Created', value: goals.length, icon: <svg className="w-4 h-4 text-white/50" viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="10" r="2.5"/><circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg> },
      { label: 'Approved', value: approved, icon: <svg className="w-4 h-4 text-emerald-400/70" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg> },
      { label: 'Pending Review', value: submitted, icon: <svg className="w-4 h-4 text-amber-400/70" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/></svg> },
      { label: 'Draft', value: draft, icon: <svg className="w-4 h-4 text-white/30" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg> },
    ],
    manager: [
      { label: 'Team Goals', value: goals.length, icon: <svg className="w-4 h-4 text-white/50" viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="10" r="2.5"/><circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg> },
      { label: 'Pending Approval', value: submitted, icon: <svg className="w-4 h-4 text-amber-400/70" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/></svg> },
      { label: 'Approved', value: approved, icon: <svg className="w-4 h-4 text-emerald-400/70" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg> },
      { label: 'Returned', value: rework, icon: <svg className="w-4 h-4 text-red-400/70" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg> },
    ],
    admin: [
      { label: 'Total Users', value: users.length, icon: <svg className="w-4 h-4 text-white/50" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg> },
      { label: 'Total Goals', value: goals.length, icon: <svg className="w-4 h-4 text-white/50" viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="10" r="2.5"/><circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg> },
      { label: 'Pending Approval', value: submitted, icon: <svg className="w-4 h-4 text-amber-400/70" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/></svg> },
      { label: 'Approved Goals', value: approved, icon: <svg className="w-4 h-4 text-emerald-400/70" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg> },
    ],
  }

  const stats      = statsByRole[user?.role] ?? statsByRole.employee
  const cards      = navItems[user?.role] ?? []
  const firstName  = user?.name?.split(' ')[0] ?? 'there'
  const today      = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  const glowColor  = user?.role === 'admin' ? 'orange' : user?.role === 'manager' ? 'blue' : 'purple'

  const rolePill =
    user?.role === 'admin'   ? 'bg-violet-500/15 text-violet-300 border border-violet-500/20' :
    user?.role === 'manager' ? 'bg-blue-500/15 text-blue-300 border border-blue-500/20' :
                               'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative">
      <WebGLShader />
      <DarkNav user={user} onLogout={handleLogout} />

      <div className="relative z-10 pt-14 max-w-5xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold text-white/92 tracking-tight">
              Welcome back, {firstName}
            </h2>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${rolePill}`}>
              {user?.role}
            </span>
          </div>
          <p className="text-sm text-white/35">{today}</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {stats.map(s => (
            <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} />
          ))}
        </div>

        {/* Nav cards */}
        <div>
          <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">Quick access</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map(card => (
              <NavCard key={card.href} {...card} glowColor={glowColor as any} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
