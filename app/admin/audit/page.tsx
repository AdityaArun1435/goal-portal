'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuditPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth').then(r => r.json()).then(async data => {
      if (data.error || data.user?.role !== 'admin') { router.push('/dashboard'); return }
      setUser(data.user)
      const res = await fetch('/api/admin/audit').then(r => r.json())
      setLogs(res.logs ?? [])
      setLoading(false)
    })
  }, [])

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <nav style={{ background: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#2563eb' }}>Back to Dashboard</button>
        <h1 style={{ margin: 0, fontSize: '18px' }}>Audit Log</h1>
        <span style={{ fontSize: '14px', color: '#666' }}>{user?.name}</span>
      </nav>

      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {['Time', 'Table', 'Action', 'Record ID', 'Changed By'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 && (
                <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No audit logs yet.</td></tr>
              )}
              {logs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '13px', color: '#666' }}>{new Date(log.changed_at).toLocaleString()}</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '13px' }}>{log.table_name}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '12px', background: log.change_type === 'INSERT' ? '#dcfce7' : log.change_type === 'DELETE' ? '#fee2e2' : '#fef9c3', color: log.change_type === 'INSERT' ? '#16a34a' : log.change_type === 'DELETE' ? '#dc2626' : '#854d0e' }}>
                      {log.change_type}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>{log.record_id?.slice(0, 8)}...</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '13px', color: '#666' }}>{log.changed_by?.slice(0, 8) ?? 'system'}...</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}