'use client'
import { useState } from 'react'

interface Props {
  placeholder?: string
}

export default function AnimatedGlowingSearchBar({ placeholder = 'Search goals, track milestones…' }: Props) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ position: 'relative', display: 'inline-flex', width: '100%', maxWidth: '480px' }}>
      {/* Rotating gradient border */}
      <div
        style={{
          position: 'absolute',
          inset: '-1px',
          borderRadius: '14px',
          background: 'conic-gradient(from var(--angle) at 50% 50%, #402fb5 0%, #cf30aa 25%, #7c3aed 50%, #cf30aa 75%, #402fb5 100%)',
          animation: 'rotate-angle 4s linear infinite',
          opacity: focused ? 1 : 0.6,
          transition: 'opacity 0.3s ease',
        } as React.CSSProperties}
      />
      {/* Glow halo */}
      <div
        style={{
          position: 'absolute',
          inset: '-8px',
          borderRadius: '20px',
          background: 'conic-gradient(from var(--angle) at 50% 50%, #402fb5 0%, #cf30aa 25%, #7c3aed 50%, #cf30aa 75%, #402fb5 100%)',
          animation: 'rotate-angle 4s linear infinite',
          filter: 'blur(14px)',
          opacity: focused ? 0.45 : 0.2,
          transition: 'opacity 0.3s ease',
        } as React.CSSProperties}
      />
      {/* Inner input surface */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 16px',
          borderRadius: '13px',
          background: 'rgba(12, 12, 14, 0.95)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <svg
          style={{ width: 16, height: 16, color: focused ? '#a78bfa' : '#52525b', flexShrink: 0, transition: 'color 0.2s' }}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.5,
          }}
        />
        <kbd
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            padding: '2px 6px',
            fontSize: 11,
            color: 'rgba(255,255,255,0.25)',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 5,
            border: '1px solid rgba(255,255,255,0.08)',
            whiteSpace: 'nowrap',
          }}
        >
          ⌘ K
        </kbd>
      </div>
    </div>
  )
}
