import React from 'react'

// NSDC International is the official product mark.
//   variant="centered"  → stacked logo + title + tagline (auth pages, splash)
//   variant="horizontal"→ inline logo + text block (page headers)
//   variant="compact"   → small inline lockup (top bars)
//   variant="iconOnly"  → just the logomark (avatars / favicons)
export default function LogoLockup({
  variant = 'centered',
  size,
  subtitle,
  showTagline = false,
  className = '',
}) {
  if (variant === 'iconOnly') {
    return (
      <img
        src="/nsdc.png"
        alt="Pravasi Setu"
        className={className}
        style={{ width: size || 36, height: 'auto' }}
      />
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <img src="/nsdc.png" alt="Pravasi Setu" style={{ width: size || 28, height: 'auto' }} />
        <span className="text-[14px] font-extrabold text-txt-primary">Pravasi Setu</span>
      </div>
    )
  }

  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <img src="/nsdc.png" alt="Pravasi Setu" style={{ width: size || 48, height: 'auto' }} />
        <div>
          <div className="text-[16px] font-extrabold text-txt-primary leading-tight">Pravasi Setu</div>
          {subtitle && <div className="text-[11px] text-txt-secondary mt-0.5">{subtitle}</div>}
        </div>
      </div>
    )
  }

  // centered (default)
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <img src="/nsdc.png" alt="Pravasi Setu" style={{ width: size || 72, height: 'auto' }} />
      <div className="text-[20px] font-extrabold text-txt-primary mt-3">Pravasi Setu</div>
      {showTagline && (
        <div className="text-[12px] text-txt-secondary mt-1">Your trusted bridge for migration</div>
      )}
      {subtitle && (
        <div className="text-[12px] text-txt-secondary mt-1">{subtitle}</div>
      )}
    </div>
  )
}
