import React from 'react'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import TopBar from '../components/TopBar'
import { VerifiedBadge, FlaggedBadge } from '../components/VerifiedBadge'
import { JOBS, EMPLOYER_REVIEWS } from '../data/mockData'
import { Building2, MapPin, Star, Clock, Users, Plane, Bookmark, Share2, ShieldCheck, AlertTriangle, ChevronRight } from 'lucide-react'

export default function JobDetailPage() {
  const { params, navigate, showToast } = useApp()
  const job = JOBS.find(j => j.id === params.jobId) || JOBS[0]

  return (
    <div className="flex-1 flex flex-col bg-surface-secondary overflow-hidden">
      <StatusBar />
      <TopBar title="Job Details" actions={[
        { icon: <Bookmark size={18} />, onClick: () => showToast('Saved') },
        { icon: <Share2 size={18} />,   onClick: () => showToast('Link shared') },
      ]} />

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Header */}
        <div className="bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
              <Building2 size={26} className="text-primary" />
            </div>
            <div className="flex-1">
              <div className="text-[18px] font-extrabold text-txt-primary leading-tight">{job.title}</div>
              <div className="text-[13px] text-txt-secondary mt-0.5">{job.employer}</div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                {job.flagged ? <FlaggedBadge /> : <VerifiedBadge label="Verified Employer" />}
                <span className="text-[10px] text-txt-tertiary">{job.posted}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-bdr-light">
            <Stat icon={<MapPin size={14} />} label="Location" value={`${job.city}`} />
            <Stat icon={<Clock size={14} />}  label="Duration" value={job.duration} />
            <Stat icon={<Users size={14} />}  label="Seats"    value={job.seats.toString()} />
          </div>

          <div className="mt-4 p-3 bg-primary-light rounded-xl">
            <div className="text-[11px] text-primary font-semibold">Monthly Salary</div>
            <div className="text-[18px] font-extrabold text-primary mt-0.5">{job.salary}</div>
          </div>
        </div>

        {/* Trust Score */}
        <div className="bg-white mt-2 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[13px] font-bold text-txt-primary">Employer Trust Score</div>
            <button onClick={() => navigate('rateEmployer', { jobId: job.id })} className="text-[11px] font-bold text-primary">Rate →</button>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-[36px] font-extrabold text-primary leading-none">{job.trustScore}</div>
              <div className="flex items-center justify-center gap-0.5 mt-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={12} className={i <= Math.round(job.trustScore) ? 'text-warn fill-warn' : 'text-bdr'} />
                ))}
              </div>
              <div className="text-[10px] text-txt-secondary mt-1">{job.reviews} reviews</div>
            </div>
            <div className="flex-1 space-y-1.5">
              <Bar label="Salary fairness"   v={5} />
              <Bar label="Work conditions"   v={4} />
              <Bar label="Accommodation"     v={4} />
              <Bar label="Safety"            v={5} />
            </div>
          </div>
        </div>

        {/* Contract Transparency */}
        {job.contract && (
          <div className="bg-white mt-2 p-5">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={16} className="text-ok" />
              <div className="text-[13px] font-bold text-txt-primary">Contract Transparency</div>
            </div>
            <div className="space-y-2">
              <KV k="Working hours" v={job.contract.workingHours} />
              <KV k="Overtime"      v={job.contract.overtime} />
              <KV k="Accommodation" v={job.contract.accommodation} />
              <KV k="Food"          v={job.contract.food} />
              <KV k="Visa"          v={job.contract.visa} />
              <KV k="Return flight" v={job.contract.flightBack} />
            </div>
            <button className="text-[11px] font-bold text-primary mt-3">View full contract (translated to Hindi) →</button>
          </div>
        )}

        {/* Travel arrangement */}
        <div className="bg-white mt-2 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-info-light flex items-center justify-center">
              <Plane size={18} className="text-info" />
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-bold text-txt-primary">
                {job.travelArranged ? 'Travel pre-arranged' : 'Self-arranged travel'}
              </div>
              <div className="text-[11px] text-txt-secondary">
                {job.travelArranged ? 'Employer covers visa, ticket, transport' : 'You arrange visa & ticket. Loan support available.'}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white mt-2 p-5">
          <div className="text-[13px] font-bold text-txt-primary mb-3">Recent Worker Reviews</div>
          <div className="space-y-3">
            {EMPLOYER_REVIEWS.slice(0, 3).map((r, i) => (
              <div key={i} className="border-b border-bdr-light pb-3 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <div className="text-[12px] font-bold text-txt-primary">{r.name}</div>
                  {r.verified && <VerifiedBadge verified label="Verified worker" />}
                </div>
                <div className="flex items-center gap-0.5 my-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={10} className={i <= r.rating ? 'text-warn fill-warn' : 'text-bdr'} />
                  ))}
                  <span className="text-[10px] text-txt-tertiary ml-1">{r.date}</span>
                </div>
                <p className="text-[11px] text-txt-secondary leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cost calc CTA */}
        <button
          onClick={() => navigate('calculator')}
          className="mx-4 mt-3 w-[calc(100%-32px)] bg-accent-light border border-accent rounded-card p-3 flex items-center gap-3"
        >
          <span className="text-[20px]">💰</span>
          <div className="flex-1 text-left">
            <div className="text-[12px] font-bold text-accent">Estimate your migration cost</div>
            <div className="text-[10px] text-txt-secondary">Visa, agent, travel, living — all in one</div>
          </div>
          <ChevronRight size={16} className="text-accent" />
        </button>
      </div>

      <div className="px-4 py-3 border-t border-bdr-light bg-white flex gap-2 flex-shrink-0">
        <button
          onClick={() => showToast('Application submitted')}
          className="flex-1 bg-primary text-white font-bold text-[14px] py-3 rounded-pill shadow-card"
        >
          Apply Now
        </button>
        <button
          onClick={() => showToast('Reported to support')}
          className="w-12 h-12 rounded-full bg-danger-light flex items-center justify-center"
        >
          <AlertTriangle size={18} className="text-danger" />
        </button>
      </div>
    </div>
  )
}

function Stat({ icon, label, value }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 text-txt-secondary">{icon}</div>
      <div className="text-[12px] font-bold text-txt-primary mt-1">{value}</div>
      <div className="text-[10px] text-txt-tertiary">{label}</div>
    </div>
  )
}

function KV({ k, v }) {
  return (
    <div className="flex items-start justify-between text-[12px] gap-3">
      <span className="text-txt-secondary flex-shrink-0">{k}</span>
      <span className="font-semibold text-txt-primary text-right">{v}</span>
    </div>
  )
}

function Bar({ label, v }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] mb-0.5">
        <span className="text-txt-secondary">{label}</span>
        <span className="font-bold text-txt-primary">{v}.0</span>
      </div>
      <div className="h-1.5 bg-bdr rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full" style={{ width: `${v / 5 * 100}%` }} />
      </div>
    </div>
  )
}
