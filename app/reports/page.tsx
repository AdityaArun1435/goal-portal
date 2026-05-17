'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ReportsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    fetch('/api/auth').then(r => r.json()).then(data => {
      if (data.error) { router.push('/login'); return }
      setUser(data.user)
      setLoading(false)
    })
  }, [])

  async function handleDownload() {
    setDownloading(true)
    const res = await fetch('/api/reports')
    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'achievement-report.csv'
    a.click()
    window.URL.revokeObjectURL(url)
    setDownloading(false)
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <nav style={{ background: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#2563eb' }}>Back to Dashboard</button>
        <h1 style={{ margin: 0, fontSize: '18px' }}>Reports</h1>
        <span style={{ fontSize: '14px', color: '#666' }}>{user?.name}</span>
      </nav>

      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
          <h2 style={{ marginTop: 0 }}>Achievement Report</h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>Download a CSV of all planned vs actual achievements across the organisation.</p>
          <button onClick={handleDownload} disabled={downloading} style={{ padding: '0.75rem 2rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' }}>
            {downloading ? 'Downloading...' : 'Download CSV Report'}
          </button>
        </div>
      </div>
    </div>
  )
}