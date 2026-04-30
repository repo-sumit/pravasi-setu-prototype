import React from 'react'

// Product logomark — NSDC International is the official Pravasi Setu mark.
// Pages that need a fuller lockup (logo + title + tagline) should use
// `<LogoLockup variant="centered" />` instead.
export default function Logo({ size = 48, className = '' }) {
  return (
    <img
      src="/nsdc.png"
      alt="Pravasi Setu"
      className={className}
      style={{ width: size, height: 'auto' }}
    />
  )
}
