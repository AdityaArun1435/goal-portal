"use client"
import React from 'react'

export function GlowButton({ onClick, children, variant = 'primary', href }: { onClick?: () => void, children: React.ReactNode, variant?: 'primary' | 'outline', href?: string }) {
  const cls = `relative z-10 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
    variant === 'primary' ? 'bg-white text-black hover:bg-gray-100' : 'bg-transparent text-white border border-white/20 hover:border-white/40'
  }`
  const inner = (
    <div className="relative flex items-center justify-center group">
      <div className="absolute z-[-1] overflow-hidden h-full w-full rounded-xl blur-[3px] before:absolute before:content-[''] before:z-[-2] before:w-[999px] before:h-[999px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-60 before:bg-[conic-gradient(#000,#402fb5_5%,#000_38%,#000_50%,#cf30aa_60%,#000_87%)] before:transition-all before:duration-[2000ms] group-hover:before:rotate-[-120deg]" />
      <div className="absolute z-[-1] overflow-hidden h-full w-full rounded-xl blur-[2px] before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[83deg] before:bg-[conic-gradient(rgba(0,0,0,0)_0%,#a099d8,rgba(0,0,0,0)_8%,rgba(0,0,0,0)_50%,#dfa2da,rgba(0,0,0,0)_58%)] before:transition-all before:duration-[2000ms] group-hover:before:rotate-[-97deg]" />
      <button onClick={onClick} className={cls}>{children}</button>
    </div>
  )
  if (href) return <a href={href}>{inner}</a>
  return inner
}
