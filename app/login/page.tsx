'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { WebGLShader } from '@/components/ui/web-gl-shader'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passFocused, setPassFocused] = useState(false)

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
      {/* Subtle background glow */}
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

      <div style={{ width: '100%', maxWidth: '360px', position: 'relative', zIndex: 1 }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '20px' }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #402fb5, #cf30aa)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: '#111111',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
          }}
        >
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '9px',
                padding: '11px 14px',
                borderRadius: '10px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                fontSize: '13px',
                color: 'rgba(252,165,165,0.9)',
                marginBottom: '20px',
                lineHeight: 1.5,
              }}
            >
              <svg style={{ width: 15, height: 15, marginTop: 1, flexShrink: 0 }} viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 4h1.5v4.5h-1.5V5zm0 5.5h1.5v1.5h-1.5v-1.5z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '0.09em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.38)',
                  marginBottom: '7px',
                }}
              >
                Email
              </label>
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
              <label
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '0.09em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.38)',
                  marginBottom: '7px',
                }}
              >
                Password
              </label>
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
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              marginTop: '22px',
              width: '100%',
              padding: '11px 20px',
              borderRadius: '10px',
              border: 'none',
              background: loading ? 'rgba(255,255,255,0.08)' : '#fff',
              color: loading ? 'rgba(255,255,255,0.4)' : '#0a0a0a',
              fontSize: '14px',
              fontWeight: '600',
              letterSpacing: '-0.01em',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.15s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {loading && (
              <svg style={{ width: 15, height: 15, animation: 'rotate-angle 0.8s linear infinite', flexShrink: 0 }} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="rgba(255,255,255,0.6)" strokeWidth="3" strokeLinecap="round" />
              </svg>
            )}
            {loading ? 'Signing in…' : 'Continue'}
          </button>

          <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.28)', margin: '20px 0 0' }}>
            Don&apos;t have access?{' '}
            <Link
              href="/register"
              style={{ color: 'rgba(167,139,250,0.8)', textDecoration: 'none', fontWeight: '500' }}
            >
              Request access
            </Link>
          </p>
        </div>
      </div>
      </div>
    </div>
  )
}
