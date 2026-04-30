import React from 'react'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import TopBar from '../components/TopBar'
import { Plane, FileText, Briefcase, GraduationCap, Scale, ChevronRight, RotateCcw } from 'lucide-react'

const STEPS = [
  { icon: FileText,  title: 'Visa closure',    sub: 'Cancel work permit · Get exit clearance' },
  { icon: Plane,     title: 'Book return ticket', sub: 'Compare airlines · ₹18,000 onwards' },
  { icon: Scale,     title: 'Legal closure',    sub: 'Final settlement, gratuity, no-dues' },
  { icon: Briefcase, title: 'Find jobs in India', sub: '12 matches in Lucknow · Skill mapped' },
  { icon: GraduationCap, title: 'Skill recognition', sub: 'Map UAE certifications to NSDC' },
]

export default function ReturnPage() {
  const { navigate, showToast } = useApp()

  return (
    <div className="flex-1 flex flex-col bg-surface-secondary overflow-hidden">
      <StatusBar />
      <TopBar title="Return & Reintegration" />

      <div className="flex-1 overflow-y-auto pb-6">
        <div className="bg-gradient-to-br from-accent to-warn text-white p-5">
          <RotateCcw size={28} className="mb-2" />
          <div className="text-[18px] font-extrabold leading-tight">Coming home?</div>
          <p className="text-[12px] opacity-90 mt-1">We'll help you close abroad chapters and re-enter the Indian job market with your earned skills.</p>
        </div>

        <div className="px-4 mt-4 space-y-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            return (
              <button
                key={i}
                onClick={() => showToast(s.title)}
                className="w-full bg-white rounded-card shadow-card p-4 flex items-center gap-3 active:scale-[0.99] text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-bold text-txt-primary">{s.title}</div>
                  <div className="text-[11px] text-txt-secondary">{s.sub}</div>
                </div>
                <ChevronRight size={16} className="text-txt-tertiary" />
              </button>
            )
          })}
        </div>

        <div className="px-4 mt-5">
          <div className="bg-white rounded-card shadow-card p-4">
            <div className="text-[13px] font-bold text-txt-primary mb-3">Skill reuse mapping</div>
            <div className="space-y-2">
              <Map src="UAE Industrial Electrician" dst="NSDC Electrician Level 5" />
              <Map src="OSHA Safety Cert" dst="DGFASLI Safety Officer" />
            </div>
            <button onClick={() => navigate('passport')} className="text-[11px] font-bold text-primary mt-3">
              View Skill Passport →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Map({ src, dst }) {
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="px-2 py-1 rounded-full bg-info-light text-info font-semibold">{src}</span>
      <span className="text-txt-tertiary">→</span>
      <span className="px-2 py-1 rounded-full bg-ok-light text-ok font-semibold">{dst}</span>
    </div>
  )
}
