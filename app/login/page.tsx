'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { WebGLShader } from '@/components/ui/web-gl-shader'

const DEPARTMENTS = [
  'Engineering', 'Product', 'Design', 'Marketing',
  'Sales', 'Operations', 'Finance', 'People & HR', 'Other',
]

type Tab = 'login' | 'register'

export default function LoginPage() {
  const router = useRouter()

  // ── Tab ──────────────────────────────────────────────────────
  const [tab, setTab] = useState<Tab>('login')

  // ── Login state ───────────────────────────────────────────────
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passFocused, setPassFocused] = useState(false)

  // ── Register state ────────────────────────────────────────────
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regDept, setRegDept] = useState('')
  const [regRole, setRegRole] = useState('employee')
  const [regLoading, setRegLoading] = useState(false)
  const [regSubmitted, setRegSubmitted] = useState(false)
  const [nameFocused, setNameFocused] = useState(false)
  const [regEmailFocused, setRegEmailFocused] = useState(false)
  const [deptFocused, setDeptFocused] = useState(false)
  const [roleFocused, setRoleFocused] = useState(false)

  function switchTab(t: Tab) {
    setTab(t)
    setError('')
  }

  async function handleLogin() {
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email, password })
    })
    const data = await res.json()
    setLoading(false)
    if (data.error) {
      setError(data.error)
    } else {
      router.push('/dashboard')
    }
  }

  function handleRegister() {
    setRegLoading(true)
    setTimeout(() => {
      setRegLoading(false)
      setRegSubmitted(true)
    }, 750)
  }

  // ── Shared style helpers ──────────────────────────────────────

  const inputStyle = (focused: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '10px 13px',
    fontSize: '14px',
    borderRadius: '10px',
    border: `1px solid ${focused ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)'}`,
    background: 'rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.88)',
    outline: 'none',
    boxShadow: focused ? '0 0 0 3px rgba(255,255,255,0.06)' : 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  })

  const selectStyle = (focused: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '10px 36px 10px 13px',
    fontSize: '14px',
    borderRadius: '10px',
    border: `1px solid ${focused ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)'}`,
    background: 'rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.88)',
    outline: 'none',
    boxShadow: focused ? '0 0 0 3px rgba(255,255,255,0.06)' : 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(255,255,255,0.3)' d='M6 8L1 3h10L6 8z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 13px center',
  })

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.09em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.38)',
    marginBottom: '7px',
  }

  const submitBtnStyle = (busy: boolean): React.CSSProperties => ({
    marginTop: '6px',
    width: '100%',
    padding: '11px 20px',
    borderRadius: '10px',
    border: 'none',
    background: busy ? 'rgba(255,255,255,0.08)' : '#fff',
    color: busy ? 'rgba(255,255,255,0.4)' : '#0a0a0a',
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '-0.01em',
    cursor: busy ? 'not-allowed' : 'pointer',
    transition: 'background 0.15s, color 0.15s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  })

  function Spinner() {
    return (
      <svg
        style={{ width: 15, height: 15, animation: 'rotate-angle 0.8s linear infinite', flexShrink: 0 }}
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.15)" strokeWidth="3" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke="rgba(0,0,0,0.6)" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', position: 'relative' }}>
      <WebGLShader />

      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Subtle radial glow behind the card */}
        <div
          style={{
            position: 'fixed',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '400px',
            background: 'radial-gradient(ellipse, rgba(64,47,181,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ width: '100%', maxWidth: '380px', position: 'relative', zIndex: 1 }}>

          {/* Brand header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <Link
              href="/"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '16px' }}
            >
              <div
                style={{
                  width: 34, height: 34, borderRadius: '10px',
                  background: 'linear-gradient(135deg, #402fb5, #cf30aa)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 20 20" fill="white">
                  <circle cx="10" cy="10" r="3" />
                  <circle cx="10" cy="10" r="7" fill="none" stroke="white" strokeWidth="2" />
                </svg>
              </div>
              <span style={{ fontSize: '17px', fontWeight: '700', color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.03em' }}>
                GoalFlow
              </span>
            </Link>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.38)', margin: 0 }}>
              {tab === 'login' ? 'Sign in to your account' : 'Request access to GoalFlow'}
            </p>
          </div>

          {/* Card */}
          <div
            style={{
              background: '#111111',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: '20px',
              boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
              overflow: 'hidden',
            }}
          >
            {/* ── Tab switcher ─────────────────────────────────── */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {(['login', 'register'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => switchTab(t)}
                  style={{
                    flex: 1,
                    padding: '16px 0 15px',
                    fontSize: '13px',
                    fontWeight: '500',
                    letterSpacing: '-0.01em',
                    color: tab === t ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.32)',
                    background: 'none',
                    border: 'none',
                    borderBottom: `2px solid ${tab === t ? 'rgba(255,255,255,0.75)' : 'transparent'}`,
                    marginBottom: '-1px',
                    cursor: 'pointer',
                    transition: 'color 0.2s, border-color 0.2s',
                  }}
                >
                  {t === 'login' ? 'Sign In' : 'Request Access'}
                </button>
              ))}
            </div>

            {/* ── Tab content ──────────────────────────────────── */}
            <div style={{ padding: '28px 32px 32px' }}>

              {tab === 'login' ? (
                /* ── LOGIN FORM ─────────────────────────────── */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {error && (
                    <div
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: '9px',
                        padding: '11px 14px', borderRadius: '10px',
                        background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                        fontSize: '13px', color: 'rgba(252,165,165,0.9)', lineHeight: 1.5,
                      }}
                    >
                      <svg style={{ width: 15, height: 15, marginTop: 1, flexShrink: 0 }} viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 4h1.5v4.5h-1.5V5zm0 5.5h1.5v1.5h-1.5v-1.5z" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  )}

                  <div>
                    <label style={labelStyle}>Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      placeholder="you@company.com"
                      style={inputStyle(emailFocused)}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onFocus={() => setPassFocused(true)}
                      onBlur={() => setPassFocused(false)}
                      placeholder="••••••••"
                      onKeyDown={e => e.key === 'Enter' && handleLogin()}
                      style={inputStyle(passFocused)}
                    />
                  </div>

                  <button onClick={handleLogin} disabled={loading} style={submitBtnStyle(loading)}>
                    {loading && <Spinner />}
                    {loading ? 'Signing in…' : 'Continue'}
                  </button>
                </div>
              ) : regSubmitted ? (
                /* ── REGISTER SUCCESS ────────────────────────── */
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  <div
                    style={{
                      width: 56, height: 56, borderRadius: '50%',
                      background: 'rgba(52,211,153,0.08)',
                      border: '1px solid rgba(52,211,153,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 18px',
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>

                  <h3
                    style={{
                      fontSize: '16px', fontWeight: '600',
                      color: 'rgba(255,255,255,0.9)',
                      letterSpacing: '-0.02em', marginBottom: '8px',
                    }}
                  >
                    Request submitted
                  </h3>
                  <p
                    style={{
                      fontSize: '13px', color: 'rgba(255,255,255,0.42)',
                      lineHeight: 1.65, marginBottom: '24px',
                    }}
                  >
                    Your request has been submitted. An admin will activate your account.
                  </p>

                  <button
                    onClick={() => { setRegSubmitted(false); switchTab('login') }}
                    style={{
                      width: '100%', padding: '10px 20px', borderRadius: '10px',
                      border: 'none', background: '#fff', color: '#0a0a0a',
                      fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                    }}
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                /* ── REGISTER FORM ───────────────────────────── */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Full Name</label>
                    <input
                      type="text"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      onFocus={() => setNameFocused(true)}
                      onBlur={() => setNameFocused(false)}
                      placeholder="Jane Smith"
                      style={inputStyle(nameFocused)}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Email</label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      onFocus={() => setRegEmailFocused(true)}
                      onBlur={() => setRegEmailFocused(false)}
                      placeholder="jane@company.com"
                      style={inputStyle(regEmailFocused)}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Department</label>
                    <select
                      value={regDept}
                      onChange={e => setRegDept(e.target.value)}
                      onFocus={() => setDeptFocused(true)}
                      onBlur={() => setDeptFocused(false)}
                      style={selectStyle(deptFocused)}
                    >
                      <option value="" disabled>Select department…</option>
                      {DEPARTMENTS.map(d => (
                        <option key={d} value={d} style={{ background: '#1a1a1a' }}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Role Preference</label>
                    <select
                      value={regRole}
                      onChange={e => setRegRole(e.target.value)}
                      onFocus={() => setRoleFocused(true)}
                      onBlur={() => setRoleFocused(false)}
                      style={selectStyle(roleFocused)}
                    >
                      <option value="employee" style={{ background: '#1a1a1a' }}>Employee</option>
                      <option value="manager" style={{ background: '#1a1a1a' }}>Manager</option>
                    </select>
                  </div>

                  <button onClick={handleRegister} disabled={regLoading} style={submitBtnStyle(regLoading)}>
                    {regLoading && <Spinner />}
                    {regLoading ? 'Submitting…' : 'Submit Request'}
                  </button>
                </div>
              )}
            </div>

            {/* Demo credentials */}
            <div style={{ padding: '0 32px 28px' }}>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={{ color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Demo Credentials</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    { role: 'Admin', email: 'admin@test.com', password: 'password123' },
                    { role: 'Employee', email: 'employee@test.com', password: 'password123' },
                  ].map(cred => (
                    <div
                      key={cred.role}
                      onClick={() => { setEmail(cred.email); setPassword(cred.password); setTab('login') }}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <span style={{ fontSize: '12px', color: '#888' }}>{cred.role}</span>
                      <span style={{ fontSize: '12px', color: '#555', fontFamily: 'monospace' }}>{cred.email}</span>
                    </div>
                  ))}
                </div>
                <p style={{ color: '#444', fontSize: '11px', marginTop: '0.5rem', textAlign: 'center' }}>Click a role to auto-fill credentials</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
