'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DarkNav } from '@/components/ui/dark-nav'
import LiquidLoading from '@/components/ui/liquid-loader'

const actionBadge: Record<string, string> = {
  INSERT: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
  UPDATE: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
  DELETE: 'bg-red-500/15 text-red-400 border border-red-500/20',
}

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
      <DarkNav user={user} onLogout={handleLogout} pageTitle="Audit Log" showBack />

      <div className="pt-14 max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-white/85">Activity Log</h2>
            <p className="text-xs text-white/35 mt-0.5">{logs.length} event{logs.length !== 1 ? 's' : ''} recorded</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-white/50">Live</span>
          </div>
        </div>

        <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Time', 'Table', 'Action', 'Record ID', 'Changed By'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white/30 uppercase tracking-wider bg-white/[0.02]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-9 h-9 bg-white/[0.04] rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white/25" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <p className="text-sm text-white/30">No audit events yet.</p>
                    </div>
                  </td>
                </tr>
              )}
              {logs.map((log, i) => (
                <tr key={log.id} className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${i === logs.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="px-4 py-3 text-xs text-white/35 whitespace-nowrap">
                    {new Date(log.changed_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-white/55 bg-white/[0.06] px-2 py-0.5 rounded">
                      {log.table_name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${actionBadge[log.change_type] ?? 'bg-white/5 text-white/40'}`}>
                      {log.change_type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-xs text-white/40 font-mono bg-white/[0.04] px-1.5 py-0.5 rounded">
                      {log.record_id?.slice(0, 8)}…
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-xs text-white/40 font-mono">
                      {log.changed_by ? log.changed_by.slice(0, 8) + '…' : 'system'}
                    </code>
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
