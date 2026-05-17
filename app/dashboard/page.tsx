'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth').then(r => r.json()).then(data => {
      if (data.error) {
        router.push('/login')
      } else {
        setUser(data.user)
        setLoading(false)
      }
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p>Loading...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <nav style={{ background: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Goal Portal</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>{user?.name} - {user?.role}</span>
          <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', border: '1px solid #e5e7eb', borderRadius: '8px', background: 'white', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </nav>
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '0.5rem' }}>Welcome, {user?.name}!</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>You are logged in as {user?.role}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {user?.role === 'employee' && (
            <>
              <DashCard title="My Goals" desc="Create and manage your goals" onClick={() => router.push('/goals')} />
              <DashCard title="My Achievements" desc="Log quarterly achievements" onClick={() => router.push('/achievements')} />
            </>
          )}
          {user?.role === 'manager' && (
            <>
              <DashCard title="Team Goals" desc="Review and approve team goals" onClick={() => router.push('/goals')} />
              <DashCard title="Check-ins" desc="Add quarterly check-in comments" onClick={() => router.push('/checkins')} />
              <DashCard title="Reports" desc="Download achievement reports" onClick={() => router.push('/reports')} />
            </>
          )}
          {user?.role === 'admin' && (
            <>
              <DashCard title="All Goals" desc="View all goals across org" onClick={() => router.push('/goals')} />
              <DashCard title="Users" desc="Manage users and roles" onClick={() => router.push('/admin/users')} />
              <DashCard title="Reports" desc="Download achievement reports" onClick={() => router.push('/reports')} />
              <DashCard title="Audit Log" desc="View all changes" onClick={() => router.push('/admin/audit')} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function DashCard({ title, desc, onClick }: { title: string, desc: string, onClick: () => void }) {
  return (
    <div onClick={onClick} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', cursor: 'pointer', border: '1px solid #e5e7eb' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>{desc}</p>
    </div>
  )
}