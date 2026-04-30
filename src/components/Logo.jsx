import React from 'react'

export default function Logo({ size = 48 }) {
  return (
    <div
      className="rounded-2xl flex items-center justify-center shadow-card"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #0F766E 0%, #16A34A 100%)',
      }}
    >
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none">
        <path d="M3 12c4-6 14-6 18 0" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M3 12c4 6 14 6 18 0" stroke="#FFE7C2" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="12" cy="12" r="2.2" fill="#F97316" />
      </svg>
    </div>
  )
}
