"use client"
import { Target, CheckCircle, Calendar, Shield, TrendingUp, History } from 'lucide-react'
import { ShaderAnimation } from '@/components/ui/shader-animation'
import { GlowButton } from '@/components/ui/animated-glowing-button'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div style={{ background: '#0a0a0a', color: '#fff', overflowX: 'hidden', fontFamily: 'inherit' }}>

      {/* ── Navbar ──────────────────────────────────────────────── */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 32px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(10,10,10,0.75)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #402fb5, #cf30aa)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="white">
              <circle cx="10" cy="10" r="3" />
              <circle cx="10" cy="10" r="7" fill="none" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          <span style={{ fontSize: '15px', fontWeight: '700', color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.03em' }}>
            GoalFlow
          </span>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Link href="/login" className="nav-signin-btn">
            Sign In
          </Link>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          overflow: 'hidden',
          padding: '0 24px',
        }}
      >
        {/* Shader background */}
        <ShaderAnimation />

        {/* Bottom-only gradient overlay for text readability */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '55%',
            background: 'linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.5) 50%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1
            style={{
              fontSize: 'clamp(40px, 7vw, 72px)',
              fontWeight: '800',
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              color: 'rgba(255,255,255,0.96)',
              maxWidth: '820px',
              margin: '0 0 20px',
              animation: 'fade-up 0.7s ease both',
              animationDelay: '0.1s',
            }}
          >
            Set Goals. Get Aligned.
            <br />
            Track Progress.
          </h1>

          <p
            style={{
              fontSize: 'clamp(15px, 2vw, 18px)',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.7,
              maxWidth: '520px',
              margin: '0 0 36px',
              animation: 'fade-up 0.7s ease both',
              animationDelay: '0.25s',
            }}
          >
            A structured platform for goal setting, manager approvals, and quarterly performance tracking — built for modern organizations.
          </p>

          <div
            className="flex items-center gap-4 flex-wrap justify-center"
            style={{
              animation: 'fade-up 0.7s ease both',
              animationDelay: '0.4s',
            }}
          >
            <GlowButton href="/login" variant="primary">Sign In</GlowButton>
            <GlowButton href="#features" variant="outline">See How It Works</GlowButton>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section id="features" style={{background: '#0a0a0a'}} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-4">Everything your team needs</h2>
          <p className="text-gray-400 text-center mb-16">From setting goals to reviewing org-wide performance — all in one place.</p>

          <div className="grid grid-cols-3 gap-4">

            {/* Row 1: wide + normal */}
            <div className="col-span-2 rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-1" style={{background: '#111', borderColor: '#222'}}
                 onMouseEnter={e => (e.currentTarget.style.borderColor = '#333')} onMouseLeave={e => (e.currentTarget.style.borderColor = '#222')}>
              <Target size={32} className="text-white mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Goal Creation</h3>
              <p className="text-gray-400 text-sm mb-6">Set structured goals with thrust areas, targets, and weightage constraints</p>
              <div className="space-y-2">
                {['Revenue & Growth', 'Customer Satisfaction', 'Operational Efficiency'].map((area, i) => (
                  <div key={area} className="flex items-center gap-3">
                    <div className="text-xs text-gray-500 w-40">{area}</div>
                    <div className="flex-1 bg-[#222] rounded-full h-1.5">
                      <div className="bg-white rounded-full h-1.5 transition-all" style={{width: `${[75, 60, 45][i]}%`}}></div>
                    </div>
                    <div className="text-xs text-gray-500">{[75, 60, 45][i]}%</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-1 rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-1" style={{background: '#111', borderColor: '#222'}}
                 onMouseEnter={e => (e.currentTarget.style.borderColor = '#333')} onMouseLeave={e => (e.currentTarget.style.borderColor = '#222')}>
              <CheckCircle size={32} className="text-white mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Manager Approval</h3>
              <p className="text-gray-400 text-sm mb-6">Submit goals for review. Managers approve or return with comments</p>
              <div className="space-y-2">
                {[{label: 'Approved', color: '#4ade80'}, {label: 'Pending', color: '#facc15'}, {label: 'Returned', color: '#f87171'}].map(s => (
                  <div key={s.label} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{background: s.color}}></div>
                    <span className="text-xs text-gray-400">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2: normal + wide */}
            <div className="col-span-1 rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-1" style={{background: '#111', borderColor: '#222'}}
                 onMouseEnter={e => (e.currentTarget.style.borderColor = '#333')} onMouseLeave={e => (e.currentTarget.style.borderColor = '#222')}>
              <Calendar size={32} className="text-white mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Quarterly Check-ins</h3>
              <p className="text-gray-400 text-sm mb-6">Log actual vs planned every quarter. Stay on track all year</p>
              <div className="grid grid-cols-4 gap-1 mt-2">
                {['Q1', 'Q2', 'Q3', 'Q4'].map((q, i) => (
                  <div key={q} className="text-center">
                    <div className="text-xs text-gray-500 mb-1">{q}</div>
                    <div className="rounded h-8 flex items-end justify-center" style={{background: i < 2 ? '#ffffff20' : '#ffffff08'}}>
                      <div className="w-full rounded" style={{background: i < 2 ? 'white' : '#333', height: `${[80, 60, 0, 0][i]}%`}}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-2 rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-1" style={{background: '#111', borderColor: '#222'}}
                 onMouseEnter={e => (e.currentTarget.style.borderColor = '#333')} onMouseLeave={e => (e.currentTarget.style.borderColor = '#222')}>
              <Shield size={32} className="text-white mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Role-based Access</h3>
              <p className="text-gray-400 text-sm mb-6">Employee, Manager, and Admin roles each with tailored permissions</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {role: 'Employee', perms: ['Create Goals', 'Log Achievements', 'View Progress']},
                  {role: 'Manager',  perms: ['Approve Goals', 'Add Check-ins', 'View Team']},
                  {role: 'Admin',    perms: ['Manage Users', 'View Reports', 'Audit Logs']},
                ].map(r => (
                  <div key={r.role} className="rounded-xl p-3" style={{background: '#1a1a1a'}}>
                    <div className="text-white text-xs font-medium mb-2">{r.role}</div>
                    {r.perms.map(p => <div key={p} className="text-gray-500 text-xs mb-1">· {p}</div>)}
                  </div>
                ))}
              </div>
            </div>

            {/* Row 3: narrow + wide */}
            <div className="col-span-1 rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-1" style={{background: '#111', borderColor: '#222'}}
                 onMouseEnter={e => (e.currentTarget.style.borderColor = '#333')} onMouseLeave={e => (e.currentTarget.style.borderColor = '#222')}>
              <TrendingUp size={32} className="text-white mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Progress Scoring</h3>
              <p className="text-gray-400 text-sm">Auto-computed scores based on your unit of measurement type</p>
            </div>

            <div className="col-span-2 rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-1" style={{background: '#111', borderColor: '#222'}}
                 onMouseEnter={e => (e.currentTarget.style.borderColor = '#333')} onMouseLeave={e => (e.currentTarget.style.borderColor = '#222')}>
              <History size={32} className="text-white mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Audit Trail</h3>
              <p className="text-gray-400 text-sm mb-4">Every change is logged. Full transparency across the organization</p>
              <div className="space-y-2">
                {['Goal approved by manager', 'Achievement logged for Q1', 'Goal submitted for review'].map((log, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                    {log}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer
        style={{
          background: '#0a0a0a',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '28px 24px',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.25)', margin: 0 }}>
          GoalFlow © 2026
        </p>
      </footer>
    </div>
  )
}
