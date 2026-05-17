'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DarkNav } from '@/components/ui/dark-nav'
import { GlowButton } from '@/components/ui/glow-button'
import LiquidLoading from '@/components/ui/liquid-loader'

const roleBadge: Record<string, string> = {
  admin:    'bg-violet-500/15 text-violet-300 border border-violet-500/20',
  manager:  'bg-blue-500/15 text-blue-300 border border-blue-500/20',
  employee: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20',
}

const darkInput  = "w-full px-3 py-2 text-sm rounded-lg bg-white/[0.05] border border-white/[0.1] text-white/85 placeholder:text-white/25 focus:outline-none focus:border-white/25 transition-colors"
const darkSelect = "w-full px-3 py-2 text-sm rounded-lg bg-[#1a1a1a] border border-white/[0.1] text-white/85 focus:outline-none focus:border-white/25 transition-colors cursor-pointer"

function Spinner() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee', manager_id: '', department: '' })

  useEffect(() => {
    fetch('/api/auth').then(r => r.json()).then(async data => {
      if (data.error || data.user?.role !== 'admin') { router.push('/dashboard'); return }
      setUser(data.user)
      const res = await fetch('/api/admin/users').then(r => r.json())
      setUsers(res.users ?? [])
      setLoading(false)
    })
  }, [])

  async function handleCreate() {
    setSubmitting(true); setError('')
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    setSubmitting(false)
    if (data.error) { setError(data.error) } else {
      setSuccess('User created!')
      setShowForm(false)
      setUsers(prev => [...prev, data.user])
      setForm({ name: '', email: '', password: '', role: 'employee', manager_id: '', department: '' })
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

  const fields: [string, string, string][] = [
    ['Name', 'name', 'text'], ['Email', 'email', 'email'],
    ['Password', 'password', 'password'], ['Department', 'department', 'text'],
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <DarkNav user={user} onLogout={handleLogout} pageTitle="Manage Users" showBack />

      <div className="pt-14 max-w-5xl mx-auto px-6 py-8">
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

        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-white/85">Users</h2>
            <p className="text-xs text-white/35 mt-0.5">{users.length} member{users.length !== 1 ? 's' : ''}</p>
          </div>
          <GlowButton onClick={() => setShowForm(!showForm)} variant={showForm ? 'outline' : 'primary'}>
            {showForm ? 'Cancel' : '+ Add User'}
          </GlowButton>
        </div>

        {showForm && (
          <div className="bg-[#111] border border-[#222] rounded-xl p-6 mb-6">
            <h3 className="text-sm font-semibold text-white/85 mb-5">New User</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map(([label, key, type]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-white/35 uppercase tracking-wider mb-1.5">{label}</label>
                  <input type={type} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={label} className={darkInput} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-white/35 uppercase tracking-wider mb-1.5">Role</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className={darkSelect}>
                  <option value="employee" className="bg-[#1a1a1a]">Employee</option>
                  <option value="manager" className="bg-[#1a1a1a]">Manager</option>
                  <option value="admin" className="bg-[#1a1a1a]">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/35 uppercase tracking-wider mb-1.5">Manager</label>
                <select value={form.manager_id} onChange={e => setForm(f => ({ ...f, manager_id: e.target.value }))} className={darkSelect}>
                  <option value="" className="bg-[#1a1a1a]">No manager</option>
                  {users.filter(u => u.role === 'manager').map(u => (
                    <option key={u.id} value={u.id} className="bg-[#1a1a1a]">{u.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <GlowButton onClick={handleCreate} variant="primary">
                {submitting ? <><Spinner /> Creating…</> : 'Create User'}
              </GlowButton>
              <GlowButton onClick={() => setShowForm(false)} variant="outline">Cancel</GlowButton>
            </div>
          </div>
        )}

        <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Name', 'Email', 'Role', 'Department', 'Manager'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white/30 uppercase tracking-wider bg-white/[0.02]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-white/30">No users found.</td></tr>
              )}
              {users.map((u, i) => (
                <tr key={u.id} className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${i === users.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-white/[0.08] flex items-center justify-center text-xs font-semibold text-white/50 flex-shrink-0">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-white/80">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white/40">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${roleBadge[u.role] ?? 'bg-white/5 text-white/40'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-white/40">{u.department ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-white/40">
                    {users.find(m => m.id === u.manager_id)?.name ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
