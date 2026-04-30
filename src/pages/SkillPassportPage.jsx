import React from 'react'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import TopBar from '../components/TopBar'
import { VerifiedBadge } from '../components/VerifiedBadge'
import PartnerStrip from '../components/PartnerStrip'
import { QrCode, Share2, Download, Plus, Award, Briefcase, Star, ChevronRight } from 'lucide-react'

export default function SkillPassportPage() {
  const { profile, showToast, navigate } = useApp()

  return (
    <div className="flex-1 flex flex-col bg-surface-secondary overflow-hidden">
      <StatusBar dark />
      <TopBar title="Skill Passport" sub="Verifiable digital resume" dark
        actions={[
          { icon: <Share2 size={18} />, onClick: () => showToast('Share link copied') },
          { icon: <Download size={18} />, onClick: () => showToast('Resume PDF downloaded') },
        ]}
      />
      <div className="flex-1 overflow-y-auto pb-6">
        {/* Hero card */}
        <div className="bg-primary text-white px-5 pb-6 pt-2">
          <div className="bg-white text-txt-primary rounded-card p-4 shadow-modal">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] text-txt-secondary font-semibold uppercase">Pravasi Setu Skill Passport</div>
                <div className="text-[18px] font-extrabold mt-0.5">{profile.name}</div>
                <div className="text-[11px] text-txt-secondary">ID: PS-9847-3221 · Issued 2026</div>
              </div>
              <div className="w-16 h-16 bg-white border-2 border-primary rounded-lg flex items-center justify-center">
                <QrCode size={48} className="text-primary" />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 pt-3 border-t border-bdr-light">
              <Stat label="Skills" value="3" />
              <Stat label="Certificates" value="3" />
              <Stat label="Experience" value="5y" />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <VerifiedBadge verified label="Aadhaar verified" />
              <VerifiedBadge verified label="NSDC linked" />
            </div>
          </div>
        </div>

        {/* Skills */}
        <Section title="Skills" action={<button onClick={() => showToast('Add skill flow')} className="text-[11px] font-bold text-primary flex items-center gap-1"><Plus size={12} /> Add</button>}>
          <div className="space-y-2">
            {profile.skills.map(s => (
              <div key={s.name} className="flex items-center gap-3 p-3 bg-white rounded-card shadow-card">
                <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center">
                  <Star size={16} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-bold text-txt-primary">{s.name}</div>
                  <div className="text-[11px] text-txt-secondary">{s.level} · {s.years} yrs experience</div>
                </div>
                <VerifiedBadge verified={s.verified} />
              </div>
            ))}
          </div>
        </Section>

        {/* Certifications */}
        <Section title="Certifications">
          <div className="space-y-2">
            {profile.certifications.map(c => (
              <button
                key={c.id || c.name}
                onClick={() => navigate('certificate', { certId: c.id })}
                className="w-full flex items-center gap-3 p-3 bg-white rounded-card shadow-card text-left active:scale-[0.99]"
              >
                <div className="w-9 h-9 rounded-lg bg-accent-light flex items-center justify-center">
                  <Award size={16} className="text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold text-txt-primary truncate">{c.name}</div>
                  <div className="text-[11px] text-txt-secondary truncate">{c.issuer} · {c.year}</div>
                </div>
                <VerifiedBadge verified={c.verified} />
                <ChevronRight size={14} className="text-txt-tertiary" />
              </button>
            ))}
          </div>
        </Section>

        {/* Experience */}
        <Section title="Work Experience">
          <div className="space-y-2">
            {profile.experience.map((e, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-card shadow-card">
                <div className="w-9 h-9 rounded-lg bg-info-light flex items-center justify-center">
                  <Briefcase size={16} className="text-info" />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-bold text-txt-primary">{e.role}</div>
                  <div className="text-[11px] text-txt-secondary">{e.company} · {e.duration} · {e.country}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <div className="px-4 mt-4">
          <button
            onClick={() => showToast('Resume PDF generated')}
            className="w-full bg-primary text-white font-bold text-[14px] py-3 rounded-pill"
          >
            Generate Resume PDF
          </button>
        </div>

        <PartnerStrip className="mx-4 mt-5" />
        <p className="text-center text-[10px] text-txt-tertiary mt-3 mb-2 px-6">
          Skills verified via NSDC International. Powered by ConveGenius.
        </p>
      </div>
    </div>
  )
}

function Section({ title, action, children }) {
  return (
    <div className="px-4 mt-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[12px] font-bold text-txt-secondary uppercase tracking-wide">{title}</div>
        {action}
      </div>
      {children}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="text-center">
      <div className="text-[18px] font-extrabold text-txt-primary">{value}</div>
      <div className="text-[10px] text-txt-secondary uppercase">{label}</div>
    </div>
  )
}
