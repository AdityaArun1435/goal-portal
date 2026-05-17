'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DarkNav } from '@/components/ui/dark-nav'
import { GlowButton } from '@/components/ui/glow-button'
import LiquidLoading from '@/components/ui/liquid-loader'

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

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
      <DarkNav user={user} onLogout={handleLogout} pageTitle="Reports" showBack />

      <div className="pt-14 max-w-2xl mx-auto px-6 py-12">
        <div className="bg-[#111] border border-[#222] rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white/50" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
              </svg>
            </div>
            <div>
              <h2 className="text-base font-semibold text-white/88 mb-1">Achievement Report</h2>
              <p className="text-sm text-white/40 leading-relaxed">
                Download a CSV of all planned vs. actual achievements across the organisation. Includes goal targets, quarterly actuals, and status per employee.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/[0.06]">
            <div className="flex items-center gap-3 mb-6">
              {[
                { label: 'Format', value: 'CSV' },
                { label: 'Scope', value: 'Organisation-wide' },
                { label: 'Data', value: 'Planned vs. actual' },
              ].map(item => (
                <div key={item.label} className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2.5">
                  <p className="text-xs text-white/30 mb-0.5">{item.label}</p>
                  <p className="text-xs font-semibold text-white/70">{item.value}</p>
                </div>
              ))}
            </div>

            <GlowButton onClick={handleDownload} variant="primary">
              {downloading ? <><Spinner /> Preparing download…</> : (
                <>
                  <svg className="w-4 h-4 mr-1.5 inline" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                  Download CSV Report
                </>
              )}
            </GlowButton>
          </div>
        </div>
      </div>
    </div>
  )
}
