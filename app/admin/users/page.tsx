'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminUsersPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
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
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (data.error) { setError(data.error) } else {
      setSuccess('User created!')
      setShowForm(false)
      setUsers(prev => [...prev, data.user])
      setTimeout(() => setSuccess(''), 3000)
    }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <nav style={{ background: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#2563eb' }}>Back to Dashboard</button>
        <h1 style={{ margin: 0, fontSize: '18px' }}>Manage Users</h1>
        <span style={{ fontSize: '14px', color: '#666' }}>{user?.name}</span>
      </nav>

      <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
        {success && <div style={{ background: '#dcfce7', color: '#16a34a', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>{success}</div>}

        <button onClick={() => setShowForm(!showForm)} style={{ marginBottom: '1rem', padding: '0.6rem 1.2rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          {showForm ? 'Cancel' : '+ Add User'}
        </button>

        {showForm && (
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #e5e7eb' }}>
            <h3 style={{ marginTop: 0 }}>Create User</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[['Name', 'name', 'text'], ['Email', 'email', 'email'], ['Password', 'password', 'password'], ['Department', 'department', 'text']].map(([label, key, type]) => (
                <div key={key}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '14px' }}>{label}</label>
                  <input type={type} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={{ width: '100%', padding: '0.6rem', border: '1px solid #e5e7eb', borderRadius: '8px', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '14px' }}>Role</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={{ width: '100%', padding: '0.6rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '14px' }}>Manager</label>
                <select value={form.manager_id} onChange={e => setForm(f => ({ ...f, manager_id: e.target.value }))} style={{ width: '100%', padding: '0.6rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                  <option value="">No manager</option>
                  {users.filter(u => u.role === 'manager').map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
            </div>
            <button onClick={handleCreate} style={{ marginTop: '1rem', padding: '0.6rem 1.5rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Create User
            </button>
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {['Name', 'Email', 'Role', 'Department', 'Manager'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '14px' }}>{u.name}</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '14px', color: '#666' }}>{u.email}</td>
                  <td style={{ padding: '0.75rem 1rem' }}><span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '12px', background: u.role === 'admin' ? '#ede9fe' : u.role === 'manager' ? '#dbeafe' : '#f0fdf4', color: u.role === 'admin' ? '#6d28d9' : u.role === 'manager' ? '#1d4ed8' : '#15803d' }}>{u.role}</span></td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '14px', color: '#666' }}>{u.department ?? '-'}</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '14px', color: '#666' }}>{users.find(m => m.id === u.manager_id)?.name ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}