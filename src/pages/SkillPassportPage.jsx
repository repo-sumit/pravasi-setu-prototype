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
        {/* Hero card — full-width blue band, content capped */}
        <div className="bg-primary text-white px-5 pb-6 pt-2">
          <div className="max-w-screen-lg mx-auto w-full">
            <div className="bg-white text-txt-primary rounded-2xl p-5 shadow-modal">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[10px] text-txt-secondary font-bold uppercase tracking-wide">Pravasi Setu Skill Passport</div>
                  <div className="text-[20px] font-extrabold mt-0.5 truncate">{profile.name}</div>
                  <div className="text-[11px] text-txt-secondary">ID: PS-9847-3221 · Issued 2026</div>
                </div>
                <div className="w-16 h-16 bg-white border-2 border-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <QrCode size={44} className="text-primary" />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 pt-4 border-t border-bdr-light">
                <Stat label="Skills"      value={profile.skills.length.toString()} />
                <Stat label="Certificates" value={profile.certifications.length.toString()} />
                <Stat label="Experience"   value={`${(profile.skills[0]?.years || 0)}y`} />
              </div>
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <VerifiedBadge verified label="Aadhaar verified" />
                <VerifiedBadge verified label="NSDC linked" />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-screen-lg mx-auto w-full px-4 sm:px-6 mt-5 space-y-5">
          {/* Two-column layout on desktop: skills+certs left, experience+CTAs right */}
          <div className="grid gap-5 md:grid-cols-2">
            <Section
              title="Skills"
              action={<button onClick={() => showToast('Add skill flow')} className="text-[11px] font-bold text-primary flex items-center gap-1"><Plus size={12} /> Add</button>}
            >
              <div className="space-y-2">
                {profile.skills.map(s => (
                  <div key={s.name} className="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-card border border-bdr-light">
                    <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
                      <Star size={16} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-bold text-txt-primary truncate">{s.name}</div>
                      <div className="text-[11px] text-txt-secondary">{s.level} · {s.years} yrs experience</div>
                    </div>
                    <VerifiedBadge verified={s.verified} />
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Certifications">
              <div className="space-y-2">
                {profile.certifications.map(c => (
                  <button
                    key={c.id || c.name}
                    onClick={() => navigate('certificate', { certId: c.id })}
                    className="w-full flex items-center gap-3 p-3 bg-white rounded-2xl shadow-card border border-bdr-light text-left active:scale-[0.99] hover:border-primary transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                      <Award size={16} className="text-primary" />
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
          </div>

          <Section title="Work Experience">
            <div className="grid gap-2 sm:grid-cols-2">
              {profile.experience.map((e, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-card border border-bdr-light">
                  <div className="w-10 h-10 rounded-xl bg-info-light flex items-center justify-center">
                    <Briefcase size={16} className="text-info" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-txt-primary truncate">{e.role}</div>
                    <div className="text-[11px] text-txt-secondary truncate">{e.company} · {e.duration} · {e.country}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <button
            onClick={() => showToast('Resume PDF generated')}
            className="w-full sm:w-auto sm:min-w-[280px] sm:mx-auto block bg-primary hover:bg-primary-dark text-white font-bold text-[14px] py-3 px-6 rounded-pill shadow-card transition-colors"
          >
            Generate Resume PDF
          </button>

          <PartnerStrip />
          <p className="text-center text-[10px] text-txt-tertiary px-4 leading-relaxed">
            Skills verified via NSDC International. Powered by ConveGenius.
          </p>
        </div>
      </div>
    </div>
  )
}

function Section({ title, action, children }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-1">
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
      <div className="text-[20px] font-extrabold text-primary">{value}</div>
      <div className="text-[10px] text-txt-secondary uppercase tracking-wide">{label}</div>
    </div>
  )
}
