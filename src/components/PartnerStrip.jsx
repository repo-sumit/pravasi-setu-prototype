import React from 'react'

// "Powered by ConveGenius · In partnership with NSDC International" trust strip.
// Used on Splash, KYC, Skill Passport and Certificate Verification.
export default function PartnerStrip({ compact = false, className = '' }) {
  if (compact) {
    return (
      <div className={`flex items-center justify-center gap-3 ${className}`}>
        <img src="/convegenius.png" alt="ConveGenius" className="h-5 w-auto opacity-80" />
        <span className="text-txt-tertiary text-[10px]">·</span>
        <img src="/nsdc.png" alt="NSDC International" className="h-5 w-auto opacity-90" />
      </div>
    )
  }
  return (
    <div className={`bg-white rounded-card border border-bdr-light p-3 ${className}`}>
      <div className="text-[10px] font-bold uppercase tracking-wide text-txt-tertiary text-center mb-2">
        A trusted public–private prototype
      </div>
      <div className="flex items-center justify-center gap-5">
        <div className="flex flex-col items-center">
          <img src="/convegenius.png" alt="ConveGenius" className="h-9 w-auto" />
          <span className="text-[9px] text-txt-secondary mt-1">Powered by ConveGenius</span>
        </div>
        <span className="w-px h-9 bg-bdr-light" />
        <div className="flex flex-col items-center">
          <img src="/nsdc.png" alt="NSDC International" className="h-9 w-auto" />
          <span className="text-[9px] text-txt-secondary mt-1">In partnership with NSDC</span>
        </div>
      </div>
    </div>
  )
}
