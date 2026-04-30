import React from 'react'

// Pravasi Setu mark — SwiftChat-blue square with bridge/wave glyph.
// (The favicon and partner strip use the ConveGenius / NSDC PNG assets —
// this component is the in-app brand mark used in headers and lockups.)
export default function Logo({ size = 48 }) {
  return (
    <div
      className="rounded-2xl flex items-center justify-center shadow-card"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #386AF6 0%, #1339A3 100%)',
      }}
    >
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none">
        <path d="M3 12c4-6 14-6 18 0" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M3 12c4 6 14 6 18 0" stroke="#C3D2FC" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="12" cy="12" r="2.2" fill="#F97316" />
      </svg>
    </div>
  )
}
