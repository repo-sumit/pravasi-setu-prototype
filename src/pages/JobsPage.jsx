import React, { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import BottomNav from '../components/BottomNav'
import { VerifiedBadge, FlaggedBadge } from '../components/VerifiedBadge'
import { JOBS, COUNTRIES } from '../data/mockData'
import { Search, SlidersHorizontal, MapPin, Star, Building2, ShieldCheck, ChevronRight } from 'lucide-react'

export default function JobsPage() {
  const { navigate } = useApp()
  const [country, setCountry] = useState('all')
  const [skill, setSkill] = useState('all')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [q, setQ] = useState('')

  const skills = ['all', ...new Set(JOBS.map(j => j.skill))]

  const filtered = useMemo(() => {
    return JOBS.filter(j =>
      (country === 'all' || j.countryCode === country) &&
      (skill === 'all' || j.skill === skill) &&
      (!verifiedOnly || j.employerVerified) &&
      (!q || j.title.toLowerCase().includes(q.toLowerCase()) || j.employer.toLowerCase().includes(q.toLowerCase()))
    )
  }, [country, skill, verifiedOnly, q])

  return (
    <div className="flex-1 flex flex-col bg-surface-secondary overflow-hidden">
      <StatusBar />
      <div className="bg-white border-b border-bdr-light px-4 pt-4 pb-3">
        <h1 className="text-[20px] font-extrabold text-txt-primary">Find Jobs Abroad</h1>
        <p className="text-[11px] text-txt-secondary">Verified employers · Aggregated from Govt. & private sources</p>

        <div className="flex items-center gap-2 mt-3">
          <div className="flex-1 flex items-center bg-surface-secondary rounded-pill px-3">
            <Search size={16} className="text-txt-tertiary" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search title or employer"
              className="flex-1 py-2.5 px-2 text-[13px] outline-none bg-transparent"
            />
          </div>
          <button className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
            <SlidersHorizontal size={16} className="text-primary" />
          </button>
        </div>

        {/* Country chips */}
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide -mx-4 px-4">
          <Chip active={country === 'all'} onClick={() => setCountry('all')}>🌐 All</Chip>
          {COUNTRIES.slice(0, 6).map(c => (
            <Chip key={c.code} active={country === c.code} onClick={() => setCountry(c.code)}>
              {c.flag} {c.name}
            </Chip>
          ))}
        </div>

        {/* Skill chips */}
        <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
          {skills.map(s => (
            <Chip key={s} active={skill === s} small onClick={() => setSkill(s)}>
              {s === 'all' ? 'All skills' : s}
            </Chip>
          ))}
        </div>

        <button
          onClick={() => setVerifiedOnly(v => !v)}
          className={`mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full ${
            verifiedOnly ? 'bg-ok-light text-ok' : 'bg-surface-secondary text-txt-secondary'
          }`}
        >
          <ShieldCheck size={12} /> Verified employers only
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 pb-20">
        <div className="text-[11px] text-txt-secondary mb-2">{filtered.length} jobs match</div>
        <div className="space-y-3">
          {filtered.map(j => (
            <JobCard key={j.id} job={j} onClick={() => navigate('jobDetail', { jobId: j.id })} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-txt-tertiary text-[13px]">No jobs match your filters.</div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}

function Chip({ active, onClick, children, small }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 ${small ? 'px-3 py-1 text-[11px]' : 'px-3.5 py-1.5 text-[12px]'} rounded-pill font-semibold transition-colors whitespace-nowrap ${
        active ? 'bg-primary text-white' : 'bg-surface-secondary text-txt-secondary'
      }`}
    >
      {children}
    </button>
  )
}

export function JobCard({ job, onClick }) {
  return (
    <button onClick={onClick} className="w-full bg-white rounded-card shadow-card p-4 text-left active:scale-[0.99] transition-transform">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
          <Building2 size={20} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-[14px] font-bold text-txt-primary truncate">{job.title}</div>
          </div>
          <div className="text-[12px] text-txt-secondary truncate">{job.employer}</div>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {job.flagged ? <FlaggedBadge /> : job.employerVerified ? <VerifiedBadge /> : <VerifiedBadge verified={false} />}
            <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-warn">
              <Star size={11} fill="currentColor" /> {job.trustScore} <span className="text-txt-tertiary font-normal">({job.reviews})</span>
            </span>
          </div>
        </div>
        <ChevronRight size={16} className="text-txt-tertiary flex-shrink-0 mt-2" />
      </div>
      <div className="mt-3 pt-3 border-t border-bdr-light flex items-center justify-between">
        <div className="flex items-center gap-1 text-[11px] text-txt-secondary">
          <MapPin size={12} /> {job.city}, {job.country}
        </div>
        <div className="text-[12px] font-bold text-primary">{job.salary}</div>
      </div>
    </button>
  )
}
