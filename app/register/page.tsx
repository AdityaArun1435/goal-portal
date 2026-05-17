'use client'
import { useState } from 'react'
import Link from 'next/link'
import { WebGLShader } from '@/components/ui/web-gl-shader'

const DEPARTMENTS = [
  'Engineering', 'Product', 'Design', 'Marketing',
  'Sales', 'Operations', 'Finance', 'People & HR', 'Other',
]

const ROLES = [
  { value: 'employee', label: 'Employee', desc: 'Set goals and log achievements' },
  { value: 'manager', label: 'Manager', desc: 'Approve goals and add check-ins' },
  { value: 'admin', label: 'Admin', desc: 'Full organisational access' },
]

function Blob({ style }: { style: React.CSSProperties }) {
  return (
    <div style={{ position: 'absolute', borderRadius: '50%', pointerEvents: 'none', ...style }} />
  )
}

function InputField({
  label, type = 'text', value, onChange, placeholder, required,
}: {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
}) {
  const [focused, setFocused] = useState(false)

  return (
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
        {label}
        {required && <span style={{ color: 'rgba(207,48,170,0.7)', marginLeft: 3 }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '10px 13px',
          fontSize: '14px',
          borderRadius: '10px',
          border: `1px solid ${focused ? 'rgba(124,58,237,0.55)' : 'rgba(255,255,255,0.1)'}`,
          background: focused ? 'rgba(124,58,237,0.04)' : 'rgba(255,255,255,0.04)',
          color: 'rgba(255,255,255,0.85)',
          outline: 'none',
          boxShadow: focused ? '0 0 0 3px rgba(124,58,237,0.12)' : 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
          boxSizing: 'border-box',
        }}
      />
    </div>
  )
}

function SelectField({
  label, value, onChange, options, placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
}) {
  const [focused, setFocused] = useState(false)

  return (
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
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: '10px 13px',
          fontSize: '14px',
          borderRadius: '10px',
          border: `1px solid ${focused ? 'rgba(124,58,237,0.55)' : 'rgba(255,255,255,0.1)'}`,
          background: focused ? 'rgba(124,58,237,0.04)' : 'rgba(18,18,22,0.95)',
          color: value ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.25)',
          outline: 'none',
          boxShadow: focused ? '0 0 0 3px rgba(124,58,237,0.12)' : 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          cursor: 'pointer',
          boxSizing: 'border-box',
          appearance: 'none',
          WebkitAppearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(255,255,255,0.25)' d='M6 8L1 3h10L6 8z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 13px center',
          paddingRight: '36px',
        }}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map(o => (
          <option key={o} value={o} style={{ background: '#16161a', color: 'rgba(255,255,255,0.85)' }}>
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}

function SuccessState() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '12px 0 4px',
        animation: 'fade-up 0.5s ease both',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 68,
          height: 68,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(52,211,153,0.08)',
          border: '1px solid rgba(52,211,153,0.2)',
          boxShadow: '0 0 28px rgba(52,211,153,0.1)',
          marginBottom: '24px',
          flexShrink: 0,
        }}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h2
        style={{
          fontSize: '20px',
          fontWeight: '700',
          letterSpacing: '-0.025em',
          color: 'rgba(255,255,255,0.92)',
          marginBottom: '10px',
        }}
      >
        Request received!
      </h2>
      <p
        style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.42)',
          lineHeight: 1.7,
          maxWidth: '310px',
          marginBottom: '32px',
        }}
      >
        Request submitted — an admin will review and activate your account. You'll receive an email once you're ready to sign in.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
        <Link
          href="/login"
          style={{
            display: 'block',
            padding: '10px 20px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #402fb5, #7c3aed, #cf30aa)',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '600',
            textDecoration: 'none',
            textAlign: 'center',
            boxShadow: '0 0 20px rgba(124,58,237,0.3)',
          }}
        >
          Back to Sign In
        </Link>
        <Link
          href="/"
          style={{
            display: 'block',
            padding: '10px 20px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.09)',
            color: 'rgba(255,255,255,0.45)',
            fontSize: '14px',
            textDecoration: 'none',
            textAlign: 'center',
            transition: 'border-color 0.15s, color 0.15s',
          }}
        >
          Go to home
        </Link>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [department, setDepartment] = useState('')
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit() {
    if (!name.trim() || !email.trim()) {
      setError('Full name and email are required.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setLoading(true)
    // Simulate network round-trip — no real API call needed
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 750)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', position: 'relative' }}>
      <WebGLShader />
      <div
        style={{
          minHeight: '100vh',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1,
          overflowX: 'hidden',
        }}
      >
      {/* ── Animated background ──────────────────────────────── */}
      <Blob
        style={{
          width: 600,
          height: 600,
          top: '-10%',
          left: '-12%',
          background: 'radial-gradient(circle, rgba(64,47,181,0.13) 0%, transparent 65%)',
          animation: 'blob-drift-a 14s ease-in-out infinite',
        }}
      />
      <Blob
        style={{
          width: 500,
          height: 500,
          top: '20%',
          right: '-10%',
          background: 'radial-gradient(circle, rgba(207,48,170,0.1) 0%, transparent 65%)',
          animation: 'blob-drift-b 11s ease-in-out infinite',
        }}
      />
      <Blob
        style={{
          width: 400,
          height: 400,
          bottom: '0%',
          left: '30%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 65%)',
          animation: 'blob-drift-c 16s ease-in-out infinite',
        }}
      />
      {/* Subtle grid */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Navbar ───────────────────────────────────────────── */}
      <header
        style={{
          position: 'relative',
          zIndex: 10,
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 32px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #402fb5, #cf30aa)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="white">
              <circle cx="10" cy="10" r="3" />
              <circle cx="10" cy="10" r="7" fill="none" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          <span
            style={{
              fontSize: '15px',
              fontWeight: '700',
              color: 'rgba(255,255,255,0.85)',
              letterSpacing: '-0.03em',
            }}
          >
            GoalFlow
          </span>
        </Link>
        <div style={{ marginLeft: 'auto' }}>
          <Link
            href="/login"
            style={{
              fontSize: '13px',
              fontWeight: '500',
              color: 'rgba(255,255,255,0.45)',
              textDecoration: 'none',
            }}
          >
            Sign in →
          </Link>
        </div>
      </header>

      {/* ── Main ─────────────────────────────────────────────── */}
      <main
        style={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px 60px',
        }}
      >
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Brand header — only show before success */}
          {!submitted && (
            <div
              style={{
                textAlign: 'center',
                marginBottom: '28px',
                animation: 'fade-up 0.6s ease both',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '5px 13px',
                  borderRadius: '999px',
                  border: '1px solid rgba(124,58,237,0.25)',
                  background: 'rgba(124,58,237,0.07)',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'rgba(167,139,250,0.8)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '18px',
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: '#a78bfa',
                    flexShrink: 0,
                    animation: 'badge-pulse 2.5s ease infinite',
                  }}
                />
                Access Request
              </div>
              <h1
                style={{
                  fontSize: '26px',
                  fontWeight: '700',
                  letterSpacing: '-0.035em',
                  color: 'rgba(255,255,255,0.92)',
                  marginBottom: '8px',
                  lineHeight: 1.2,
                }}
              >
                Request access to{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #a78bfa, #cf30aa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  GoalFlow
                </span>
              </h1>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.6 }}>
                Fill in your details and an admin will activate your account.
              </p>
            </div>
          )}

          {/* Card */}
          <div
            style={{
              background: 'rgba(14,14,18,0.92)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: '20px',
              padding: '32px',
              boxShadow:
                '0 0 0 1px rgba(124,58,237,0.08), 0 24px 64px rgba(0,0,0,0.7), 0 0 40px rgba(64,47,181,0.05)',
              backdropFilter: 'blur(16px)',
              animation: 'fade-up 0.65s ease both',
              animationDelay: '0.1s',
            }}
          >
            {submitted ? (
              <SuccessState />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Error */}
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
                      lineHeight: 1.5,
                    }}
                  >
                    <svg
                      style={{ width: 15, height: 15, marginTop: 1, flexShrink: 0 }}
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 4h1.5v4.5h-1.5V5zm0 5.5h1.5v1.5h-1.5v-1.5z" />
                    </svg>
                    {error}
                  </div>
                )}

                {/* Full Name */}
                <InputField
                  label="Full Name"
                  value={name}
                  onChange={setName}
                  placeholder="Jane Smith"
                  required
                />

                {/* Email */}
                <InputField
                  label="Work Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="jane@company.com"
                  required
                />

                {/* Department */}
                <SelectField
                  label="Department"
                  value={department}
                  onChange={setDepartment}
                  options={DEPARTMENTS}
                  placeholder="Select department…"
                />

                {/* Role Preference */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: '600',
                      letterSpacing: '0.09em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.38)',
                      marginBottom: '9px',
                    }}
                  >
                    Role Preference
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                    {ROLES.map(r => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setRole(r.value)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '11px 14px',
                          borderRadius: '10px',
                          border: `1px solid ${role === r.value ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.08)'}`,
                          background: role === r.value ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.03)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'border-color 0.15s, background 0.15s',
                          width: '100%',
                        }}
                      >
                        {/* Radio indicator */}
                        <div
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            border: `2px solid ${role === r.value ? '#a78bfa' : 'rgba(255,255,255,0.2)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            transition: 'border-color 0.15s',
                          }}
                        >
                          {role === r.value && (
                            <div
                              style={{
                                width: 7,
                                height: 7,
                                borderRadius: '50%',
                                background: '#a78bfa',
                              }}
                            />
                          )}
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: '13px',
                              fontWeight: '600',
                              color: role === r.value ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.55)',
                              marginBottom: '1px',
                              transition: 'color 0.15s',
                            }}
                          >
                            {r.label}
                          </div>
                          <div
                            style={{
                              fontSize: '11px',
                              color: role === r.value ? 'rgba(167,139,250,0.65)' : 'rgba(255,255,255,0.22)',
                              transition: 'color 0.15s',
                            }}
                          >
                            {r.desc}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    marginTop: '4px',
                    width: '100%',
                    padding: '12px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    background: loading
                      ? 'rgba(124,58,237,0.4)'
                      : 'linear-gradient(135deg, #402fb5, #7c3aed, #cf30aa)',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600',
                    letterSpacing: '-0.01em',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: loading ? 'none' : '0 0 24px rgba(124,58,237,0.35)',
                    transition: 'opacity 0.15s, box-shadow 0.15s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {loading && (
                    <svg
                      style={{ width: 15, height: 15, animation: 'rotate-angle 0.8s linear infinite', flexShrink: 0 }}
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  )}
                  {loading ? 'Submitting…' : 'Submit Request'}
                </button>

                {/* Login link */}
                <p
                  style={{
                    textAlign: 'center',
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.28)',
                    margin: 0,
                  }}
                >
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    style={{
                      color: 'rgba(167,139,250,0.8)',
                      textDecoration: 'none',
                      fontWeight: '500',
                    }}
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      </div>
    </div>
  )
}
