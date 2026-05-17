"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'

interface DarkNavProps {
  user: any
  onLogout: () => void
  pageTitle?: string
  showBack?: boolean
}

export function DarkNav({ user, onLogout, pageTitle, showBack }: DarkNavProps) {
  const router = useRouter()

  const roleBg =
    user?.role === 'admin'   ? 'bg-violet-500/20 text-violet-300 border border-violet-500/20' :
    user?.role === 'manager' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/20' :
                               'bg-emerald-500/20 text-emerald-300 border border-emerald-500/20'

  const initials = user?.name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? '?'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-black/60 backdrop-blur-md border-b border-white/[0.06] px-6 flex items-center justify-between">
      {/* Left */}
      {showBack ? (
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Dashboard
        </button>
      ) : (
        <Link href="/dashboard" className="flex items-center gap-2 no-underline">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #402fb5, #cf30aa)' }}
          >
            <svg width="12" height="12" viewBox="0 0 20 20" fill="white">
              <circle cx="10" cy="10" r="3" />
              <circle cx="10" cy="10" r="7" fill="none" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          <span className="font-bold text-sm text-white/90 tracking-tight">GoalFlow</span>
        </Link>
      )}

      {/* Center title */}
      {pageTitle && (
        <span className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-white/75">
          {pageTitle}
        </span>
      )}

      {/* Right: user dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 cursor-pointer outline-none group">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold text-white/80 group-hover:bg-white/15 transition-colors flex-shrink-0">
              {initials}
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-white/55">{user?.name}</span>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${roleBg}`}>
                {user?.role}
              </span>
            </div>
            <svg className="w-3 h-3 text-white/30 hidden sm:block" viewBox="0 0 16 16" fill="currentColor">
              <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
            </svg>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8}>
          <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/dashboard')}>
            <svg className="w-3.5 h-3.5 text-white/40" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/goals')}>
            <svg className="w-3.5 h-3.5 text-white/40" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="10" r="2.5" /><circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            {user?.role === 'employee' ? 'My Goals' : 'Team Goals'}
          </DropdownMenuItem>
          {user?.role === 'employee' && (
            <DropdownMenuItem onClick={() => router.push('/achievements')}>
              <svg className="w-3.5 h-3.5 text-white/40" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2l2.09 4.26L17 7.27l-3.5 3.41.83 4.82L10 13.27l-4.33 2.23.83-4.82L3 7.27l4.91-.71L10 2z" />
              </svg>
              My Achievements
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onLogout}
            className="text-red-400/80 hover:text-red-300 hover:bg-red-500/[0.08] focus:bg-red-500/[0.08] focus:text-red-300"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h7a1 1 0 100-2H4V5h6a1 1 0 100-2H3zm11.707 4.293a1 1 0 010 1.414L13.414 10l1.293 1.293a1 1 0 01-1.414 1.414l-2-2a1 1 0 010-1.414l2-2a1 1 0 011.414 0zM17 10a1 1 0 01-1 1h-4a1 1 0 110-2h4a1 1 0 011 1z" clipRule="evenodd" />
            </svg>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}
