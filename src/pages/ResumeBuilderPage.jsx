import React, { useState, useMemo, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import TopBar from '../components/TopBar'
import AlertBanner from '../components/AlertBanner'
import { BRAND_ASSETS } from '../config/brandAssets'
import { isValidName, isValidIndianPhone, nameMessage, phoneMessage } from '../utils/validation'
import {
  Edit3, Eye, Download, Plus, Trash2, Save, Share2, Check, FileText, Briefcase,
  GraduationCap, Languages as LangIcon, Award, BookOpen, ShieldCheck, ChevronDown,
  ChevronUp, Star, FilePlus2,
} from 'lucide-react'

/* Resume Builder — full-stack editor for the resume slice in AppContext.
   - Mobile: tabs Edit / Preview / Download
   - Desktop: 2-column (editor left, sticky preview right)
   - PDF: window.print() with #resume-print-root only — no extra deps. */

const TEMPLATES = [
  { id: 'clean',    name: 'Clean Worker',          tagline: 'ATS-friendly, simple layout' },
  { id: 'passport', name: 'Skill Passport',        tagline: 'Includes verified badges + ID' },
  { id: 'overseas', name: 'Overseas Application',  tagline: 'Highlights documents + readiness' },
]

function isEmail(v) { return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) }

export default function ResumeBuilderPage() {
  const { resume, setResume, navigate, showToast } = useApp()
  const [tab, setTab] = useState('edit') // edit | preview | download (mobile)
  const [savedTick, setSavedTick] = useState(false)

  // Light "saved" indicator after each edit settles
  useEffect(() => {
    setSavedTick(true)
    const t = setTimeout(() => setSavedTick(false), 1400)
    return () => clearTimeout(t)
  }, [resume.lastUpdated])

  const completeness = useMemo(() => completenessScore(resume), [resume])

  const setField = (path, value) => {
    setResume(r => setIn(r, path, value))
  }
  const setItemAt = (section, index, patch) => {
    setResume(r => ({ ...r, [section]: r[section].map((it, i) => i === index ? { ...it, ...patch } : it) }))
  }
  const removeItemAt = (section, index) => {
    setResume(r => ({ ...r, [section]: r[section].filter((_, i) => i !== index) }))
  }
  const addItem = (section, item) => {
    setResume(r => ({ ...r, [section]: [...r[section], { ...item, id: `${section.slice(0, 3)}-${Date.now()}` }] }))
  }

  const onPrint = () => {
    showToast('Opening print dialog — choose "Save as PDF"')
    const previousTitle = document.title
    document.title = `Pravasi_Setu_Resume_${(resume.personal.name || 'worker').replace(/\s+/g, '_')}`
    setTimeout(() => {
      window.print()
      // Most browsers fire focus on return from the print dialog; reset title.
      const reset = () => { document.title = previousTitle; window.removeEventListener('focus', reset) }
      window.addEventListener('focus', reset)
    }, 200)
  }

  return (
    <div className="flex-1 flex flex-col bg-surface-secondary overflow-hidden">
      <StatusBar />
      <TopBar
        title="Resume Builder"
        sub={savedTick ? 'Draft saved' : `Last updated ${formatRelative(resume.lastUpdated)}`}
        actions={[
          { icon: <Share2 size={18} />,   onClick: () => showToast('Resume share link copied') },
          { icon: <Download size={18} />, onClick: onPrint },
        ]}
      />

      {/* Mobile tab bar */}
      <div className="lg:hidden bg-white border-b border-bdr-light px-4">
        <div className="max-w-screen-xl mx-auto w-full flex gap-2">
          {[
            { id: 'edit',     label: 'Edit',     Icon: Edit3 },
            { id: 'preview',  label: 'Preview',  Icon: Eye },
            { id: 'download', label: 'Download', Icon: Download },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => t.id === 'download' ? onPrint() : setTab(t.id)}
              className={`flex-1 py-2.5 text-[12px] font-bold flex items-center justify-center gap-1.5 border-b-2 ${
                tab === t.id && t.id !== 'download'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-txt-secondary'
              }`}
            >
              <t.Icon size={14} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        <div className="max-w-screen-xl mx-auto w-full lg:grid lg:grid-cols-5 lg:gap-4 lg:p-4">

          {/* ── EDITOR ── */}
          <div className={`lg:col-span-3 ${tab !== 'edit' ? 'hidden lg:block' : ''}`}>
            <div className="px-4 lg:px-0 py-4 space-y-4">
              <CompletenessCard score={completeness} />

              <TemplateSection
                template={resume.template}
                onChange={(id) => setField(['template'], id)}
              />

              <PersonalSection
                personal={resume.personal}
                onChange={(k, v) => setField(['personal', k], v)}
              />

              <SummarySection
                summary={resume.summary}
                onChange={v => setField(['summary'], v)}
              />

              <SkillsSection
                items={resume.skills}
                onAdd={() => addItem('skills', { name: '', level: 'Skilled', years: 1, verified: false })}
                onPatch={(i, patch) => setItemAt('skills', i, patch)}
                onRemove={(i) => removeItemAt('skills', i)}
              />

              <CertificatesSection
                items={resume.certifications}
                onAdd={() => addItem('certifications', { name: '', issuer: '', year: new Date().getFullYear(), verified: false, expiry: '' })}
                onPatch={(i, patch) => setItemAt('certifications', i, patch)}
                onRemove={(i) => removeItemAt('certifications', i)}
                openVerification={(id) => navigate('certificate', { certId: id })}
              />

              <ExperienceSection
                items={resume.experience}
                onAdd={() => addItem('experience', { title: '', company: '', country: '', duration: '', current: false, responsibilities: '', tools: '' })}
                onPatch={(i, patch) => setItemAt('experience', i, patch)}
                onRemove={(i) => removeItemAt('experience', i)}
              />

              <EducationSection
                items={resume.education}
                onAdd={() => addItem('education', { qualification: '', institution: '', year: '', field: '' })}
                onPatch={(i, patch) => setItemAt('education', i, patch)}
                onRemove={(i) => removeItemAt('education', i)}
              />

              <LanguagesSection
                items={resume.languages}
                onAdd={() => addItem('languages', { name: '', speaking: 'Conversational', reading: 'Conversational', writing: 'Basic' })}
                onPatch={(i, patch) => setItemAt('languages', i, patch)}
                onRemove={(i) => removeItemAt('languages', i)}
              />

              <DocumentsSection
                items={resume.documents}
                onPatch={(i, patch) => setItemAt('documents', i, patch)}
              />

              <ReferencesSection
                items={resume.references}
                onAdd={() => addItem('references', { name: '', relation: '', phone: '', company: '', consent: false })}
                onPatch={(i, patch) => setItemAt('references', i, patch)}
                onRemove={(i) => removeItemAt('references', i)}
              />

              <AlertBanner tone="info" title="Prototype-safe note">
                Prototype resume generated from self-declared and verified profile data.
                Verified badges indicate mock verification status. PDF is for demonstration
                and job application preview.
              </AlertBanner>

              <div className="flex gap-2 sticky bottom-0 bg-surface-secondary -mx-4 lg:mx-0 px-4 py-3 border-t border-bdr-light">
                <button onClick={() => showToast('Draft saved')} className="px-4 rounded-pill bg-white border border-bdr text-txt-primary font-bold text-[13px] flex items-center gap-1">
                  <Save size={14} /> Save draft
                </button>
                <button onClick={onPrint} className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold text-[14px] py-3 rounded-pill flex items-center justify-center gap-2 shadow-modal">
                  <Download size={16} /> Download PDF
                </button>
              </div>
            </div>
          </div>

          {/* ── PREVIEW ── */}
          <div className={`lg:col-span-2 ${tab !== 'preview' ? 'hidden lg:block' : ''}`}>
            <div className="px-4 lg:px-0 py-4">
              <div className="lg:sticky lg:top-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-txt-secondary uppercase tracking-wide">Live preview · A4</span>
                  <span className="text-[10px] text-txt-tertiary">Template: {TEMPLATES.find(t => t.id === resume.template)?.name}</span>
                </div>
                <ResumePreview resume={resume} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden full-size print view — only this renders when window.print() fires */}
      <div id="resume-print-root" className="hidden print:block">
        <ResumePreview resume={resume} forPrint />
      </div>

      <PrintStyles fileName={`Pravasi_Setu_Resume_${(resume.personal.name || 'worker').replace(/\s+/g, '_')}`} />
    </div>
  )
}

/* ───────────────────────── Editor sections ────────────────────────── */

function CompletenessCard({ score }) {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-bdr-light p-4">
      <div className="flex items-center justify-between">
        <div className="text-[12px] font-bold text-txt-primary">Resume readiness</div>
        <span className={`text-[11px] font-bold ${score >= 80 ? 'text-ok' : score >= 50 ? 'text-warn-text' : 'text-danger'}`}>{score}%</span>
      </div>
      <div className="h-2 bg-bdr rounded-full mt-2 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${score >= 80 ? 'bg-ok' : score >= 50 ? 'bg-warn' : 'bg-danger'}`} style={{ width: `${score}%` }} />
      </div>
      <div className="text-[10px] text-txt-secondary mt-1">Higher readiness = stronger Swift Apply submissions.</div>
    </div>
  )
}

function TemplateSection({ template, onChange }) {
  return (
    <SectionCard title="Template" icon={FilePlus2}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {TEMPLATES.map(t => {
          const active = template === t.id
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={`text-left p-3 rounded-2xl border-2 transition-colors ${
                active ? 'border-primary bg-primary-50' : 'border-bdr bg-white hover:border-primary'
              }`}
            >
              <div className="text-[12px] font-bold text-txt-primary">{t.name}</div>
              <div className="text-[10px] text-txt-secondary mt-0.5">{t.tagline}</div>
              {active && <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-primary"><Check size={10} /> Selected</div>}
            </button>
          )
        })}
      </div>
    </SectionCard>
  )
}

function PersonalSection({ personal, onChange }) {
  const errors = {
    name:  !isValidName(personal.name) ? nameMessage : null,
    phone: !isValidIndianPhone(personal.phone) ? phoneMessage : null,
    email: !isEmail(personal.email) ? 'Enter a valid email or leave blank.' : null,
    location: personal.location.trim().length < 3 ? 'Location is required.' : null,
  }
  return (
    <SectionCard title="Personal information" icon={ShieldCheck}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Full name" error={errors.name}>
          <input value={personal.name} onChange={e => onChange('name', e.target.value)} className={inputCls(errors.name)} placeholder="As on Aadhaar" />
        </Field>
        <Field label="Phone" error={errors.phone}>
          <input inputMode="numeric" value={personal.phone} onChange={e => onChange('phone', e.target.value)} className={inputCls(errors.phone)} placeholder="+91 98765 43210" />
        </Field>
        <Field label="Email (optional)" error={errors.email}>
          <input type="email" value={personal.email} onChange={e => onChange('email', e.target.value)} className={inputCls(errors.email)} placeholder="you@example.com" />
        </Field>
        <Field label="Location" error={errors.location}>
          <input value={personal.location} onChange={e => onChange('location', e.target.value)} className={inputCls(errors.location)} placeholder="Lucknow, UP" />
        </Field>
        <Field label="Preferred destination">
          <select value={personal.preferredCountry} onChange={e => onChange('preferredCountry', e.target.value)} className={inputCls()}>
            {['UAE','Saudi Arabia','Qatar','Kuwait','Oman','Bahrain'].map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Preferred role">
          <input value={personal.preferredRole} onChange={e => onChange('preferredRole', e.target.value)} className={inputCls()} placeholder="Electrician" />
        </Field>
        <Field label="Passport available">
          <select value={personal.passportAvailable ? 'yes' : 'no'} onChange={e => onChange('passportAvailable', e.target.value === 'yes')} className={inputCls()}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </Field>
        <Field label="Skill Passport ID">
          <input value={personal.skillPassportId} onChange={e => onChange('skillPassportId', e.target.value)} className={inputCls()} placeholder="PS-…" />
        </Field>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className={`px-2 py-0.5 rounded-pill text-[10px] font-bold ${personal.kycVerified ? 'bg-ok-light text-ok' : 'bg-warn-light text-warn-text'}`}>
          {personal.kycVerified ? '✓ Aadhaar KYC verified' : '⚠ Complete Aadhaar KYC'}
        </span>
      </div>
    </SectionCard>
  )
}

function SummarySection({ summary, onChange }) {
  const length = (summary || '').length
  const tooShort = length > 0 && length < 40
  return (
    <SectionCard title="Professional summary" icon={Star}>
      <textarea
        value={summary}
        onChange={e => onChange(e.target.value)}
        rows={4}
        maxLength={500}
        placeholder="Skilled electrician with 5 years of construction and maintenance experience, NSDC-linked credentials, and readiness for overseas deployment."
        className={inputCls(tooShort && 'Summary should be at least 40 characters.', 'resize-none')}
      />
      <div className="flex items-center justify-between mt-1">
        <p className={`text-[10px] ${tooShort ? 'text-danger font-semibold' : 'text-txt-tertiary'}`}>
          {tooShort ? 'Summary should be at least 40 characters.' : 'Aim for 40–500 characters.'}
        </p>
        <span className="text-[10px] text-txt-tertiary">{length}/500</span>
      </div>
    </SectionCard>
  )
}

function SkillsSection({ items, onAdd, onPatch, onRemove }) {
  return (
    <SectionCard title="Skills" icon={Briefcase} action={
      <button onClick={onAdd} className="text-[11px] font-bold text-primary inline-flex items-center gap-1">
        <Plus size={12} /> Add skill
      </button>
    }>
      {items.length === 0 && <Empty>Add at least one skill — Swift Apply uses these to match jobs.</Empty>}
      <div className="space-y-2">
        {items.map((s, i) => (
          <div key={s.id || i} className="rounded-2xl border border-bdr p-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Field label="Skill"><input value={s.name} onChange={e => onPatch(i, { name: e.target.value })} className={inputCls(s.name.trim().length === 0 && 'Required')} /></Field>
              <Field label="Level">
                <select value={s.level} onChange={e => onPatch(i, { level: e.target.value })} className={inputCls()}>
                  {['Beginner','Semi-skilled','Skilled','Expert'].map(l => <option key={l}>{l}</option>)}
                </select>
              </Field>
              <Field label="Years">
                <input type="number" min={0} max={50} value={s.years} onChange={e => onPatch(i, { years: Math.max(0, +e.target.value || 0) })} className={inputCls()} />
              </Field>
            </div>
            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 text-[11px] text-txt-secondary cursor-pointer">
                <input type="checkbox" checked={!!s.verified} onChange={e => onPatch(i, { verified: e.target.checked })} className="w-4 h-4 accent-primary" />
                Verified by issuer
              </label>
              <button onClick={() => onRemove(i)} className="text-[11px] text-danger inline-flex items-center gap-1"><Trash2 size={12} /> Remove</button>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

function CertificatesSection({ items, onAdd, onPatch, onRemove, openVerification }) {
  return (
    <SectionCard title="Certifications" icon={Award} action={
      <button onClick={onAdd} className="text-[11px] font-bold text-primary inline-flex items-center gap-1">
        <Plus size={12} /> Add certificate
      </button>
    }>
      {items.length === 0 && <Empty>Verified certificates appear with a green badge in your resume.</Empty>}
      <div className="space-y-2">
        {items.map((c, i) => {
          const yearOk = !c.year || (Number(c.year) > 1950 && Number(c.year) <= new Date().getFullYear() + 1)
          return (
            <div key={c.id || i} className="rounded-2xl border border-bdr p-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Field label="Certificate name"><input value={c.name} onChange={e => onPatch(i, { name: e.target.value })} className={inputCls(c.name.trim().length === 0 && 'Required')} /></Field>
                <Field label="Issuer"><input value={c.issuer} onChange={e => onPatch(i, { issuer: e.target.value })} className={inputCls(c.issuer.trim().length === 0 && 'Required')} /></Field>
                <Field label="Issue year" error={!yearOk ? 'Year must be valid' : null}>
                  <input type="number" value={c.year} onChange={e => onPatch(i, { year: e.target.value })} className={inputCls(!yearOk && '!')} />
                </Field>
                <Field label="Expiry (optional)">
                  <input type="text" value={c.expiry || ''} placeholder="2027 or Lifetime" onChange={e => onPatch(i, { expiry: e.target.value })} className={inputCls()} />
                </Field>
                <Field label="Certificate ID (optional)">
                  <input value={c.certNumber || ''} onChange={e => onPatch(i, { certNumber: e.target.value })} className={inputCls()} />
                </Field>
              </div>
              <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                <label className="flex items-center gap-2 text-[11px] text-txt-secondary cursor-pointer">
                  <input type="checkbox" checked={!!c.verified} onChange={e => onPatch(i, { verified: e.target.checked })} className="w-4 h-4 accent-primary" />
                  Verified by issuer
                </label>
                <div className="flex items-center gap-3">
                  {openVerification && c.id && (
                    <button onClick={() => openVerification(c.id)} className="text-[11px] font-bold text-primary inline-flex items-center gap-1">View verification</button>
                  )}
                  <button onClick={() => onRemove(i)} className="text-[11px] text-danger inline-flex items-center gap-1"><Trash2 size={12} /> Remove</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}

function ExperienceSection({ items, onAdd, onPatch, onRemove }) {
  return (
    <SectionCard title="Work experience" icon={Briefcase} action={
      <button onClick={onAdd} className="text-[11px] font-bold text-primary inline-flex items-center gap-1"><Plus size={12} /> Add experience</button>
    }>
      {items.length === 0 && <Empty>Add at least one role — recruiters look here first.</Empty>}
      <div className="space-y-2">
        {items.map((e, i) => (
          <div key={e.id || i} className="rounded-2xl border border-bdr p-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Field label="Job title"><input value={e.title} onChange={ev => onPatch(i, { title: ev.target.value })} className={inputCls(e.title.trim().length === 0 && 'Required')} /></Field>
              <Field label="Employer / company"><input value={e.company} onChange={ev => onPatch(i, { company: ev.target.value })} className={inputCls(e.company.trim().length === 0 && 'Required')} /></Field>
              <Field label="Country / location"><input value={e.country} onChange={ev => onPatch(i, { country: ev.target.value })} className={inputCls()} /></Field>
              <Field label="Duration"><input value={e.duration} onChange={ev => onPatch(i, { duration: ev.target.value })} className={inputCls()} placeholder="2019 – 2023" /></Field>
            </div>
            <Field label="Responsibilities" className="mt-2">
              <textarea rows={2} value={e.responsibilities} onChange={ev => onPatch(i, { responsibilities: ev.target.value })} className={inputCls(null, 'resize-none')} placeholder="Day-to-day tasks, scope, achievements." />
            </Field>
            <Field label="Tools / equipment used (optional)" className="mt-2">
              <input value={e.tools || ''} onChange={ev => onPatch(i, { tools: ev.target.value })} className={inputCls()} placeholder="Multimeter, conduit benders, OSHA gear" />
            </Field>
            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 text-[11px] text-txt-secondary cursor-pointer">
                <input type="checkbox" checked={!!e.current} onChange={ev => onPatch(i, { current: ev.target.checked })} className="w-4 h-4 accent-primary" />
                Currently working here
              </label>
              <button onClick={() => onRemove(i)} className="text-[11px] text-danger inline-flex items-center gap-1"><Trash2 size={12} /> Remove</button>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

function EducationSection({ items, onAdd, onPatch, onRemove }) {
  return (
    <SectionCard title="Education" icon={GraduationCap} action={
      <button onClick={onAdd} className="text-[11px] font-bold text-primary inline-flex items-center gap-1"><Plus size={12} /> Add education</button>
    }>
      {items.length === 0 && <Empty>At least your highest qualification helps employers shortlist you faster.</Empty>}
      <div className="space-y-2">
        {items.map((e, i) => (
          <div key={e.id || i} className="rounded-2xl border border-bdr p-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Field label="Qualification"><input value={e.qualification} onChange={ev => onPatch(i, { qualification: ev.target.value })} className={inputCls(e.qualification.trim().length === 0 && 'Required')} /></Field>
              <Field label="Institution (optional)"><input value={e.institution} onChange={ev => onPatch(i, { institution: ev.target.value })} className={inputCls()} /></Field>
              <Field label="Year of completion"><input type="number" value={e.year} onChange={ev => onPatch(i, { year: ev.target.value })} className={inputCls()} /></Field>
              <Field label="Field / trade (optional)"><input value={e.field} onChange={ev => onPatch(i, { field: ev.target.value })} className={inputCls()} /></Field>
            </div>
            <div className="flex justify-end mt-2">
              <button onClick={() => onRemove(i)} className="text-[11px] text-danger inline-flex items-center gap-1"><Trash2 size={12} /> Remove</button>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

function LanguagesSection({ items, onAdd, onPatch, onRemove }) {
  const levels = ['Basic', 'Conversational', 'Fluent', 'Native']
  return (
    <SectionCard title="Languages" icon={LangIcon} action={
      <button onClick={onAdd} className="text-[11px] font-bold text-primary inline-flex items-center gap-1"><Plus size={12} /> Add language</button>
    }>
      {items.length === 0 && <Empty>List the languages you can speak / read / write.</Empty>}
      <div className="space-y-2">
        {items.map((l, i) => (
          <div key={l.id || i} className="rounded-2xl border border-bdr p-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Field label="Language"><input value={l.name} onChange={ev => onPatch(i, { name: ev.target.value })} className={inputCls(l.name.trim().length === 0 && 'Required')} /></Field>
              <Field label="Speaking">
                <select value={l.speaking} onChange={ev => onPatch(i, { speaking: ev.target.value })} className={inputCls()}>{levels.map(x => <option key={x}>{x}</option>)}</select>
              </Field>
              <Field label="Reading">
                <select value={l.reading} onChange={ev => onPatch(i, { reading: ev.target.value })} className={inputCls()}>{levels.map(x => <option key={x}>{x}</option>)}</select>
              </Field>
              <Field label="Writing">
                <select value={l.writing} onChange={ev => onPatch(i, { writing: ev.target.value })} className={inputCls()}>{levels.map(x => <option key={x}>{x}</option>)}</select>
              </Field>
            </div>
            <div className="flex justify-end mt-2">
              <button onClick={() => onRemove(i)} className="text-[11px] text-danger inline-flex items-center gap-1"><Trash2 size={12} /> Remove</button>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

function DocumentsSection({ items, onPatch }) {
  const statuses = [
    { id: 'available',     label: 'Available' },
    { id: 'pending',       label: 'Pending' },
    { id: 'expired',       label: 'Expired' },
    { id: 'not_uploaded',  label: 'Not uploaded' },
  ]
  return (
    <SectionCard title="Documents" icon={FileText}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((d, i) => (
          <div key={d.id} className="rounded-card border border-bdr p-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-bold text-txt-primary truncate">{d.label}</div>
              <select value={d.status} onChange={e => onPatch(i, { status: e.target.value })} className={inputCls() + ' mt-1'}>
                {statuses.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <DocStatusBadge status={d.status} />
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

function ReferencesSection({ items, onAdd, onPatch, onRemove }) {
  return (
    <SectionCard title="References (optional)" icon={BookOpen} action={
      <button onClick={onAdd} className="text-[11px] font-bold text-primary inline-flex items-center gap-1"><Plus size={12} /> Add reference</button>
    }>
      {items.length === 0 && <Empty>Optional — add a former employer or supervisor who can vouch for your work.</Empty>}
      <div className="space-y-2">
        {items.map((r, i) => (
          <div key={r.id || i} className="rounded-2xl border border-bdr p-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Field label="Name"><input value={r.name} onChange={e => onPatch(i, { name: e.target.value })} className={inputCls()} /></Field>
              <Field label="Relation"><input value={r.relation} onChange={e => onPatch(i, { relation: e.target.value })} className={inputCls()} placeholder="Former supervisor" /></Field>
              <Field label="Phone"><input value={r.phone} onChange={e => onPatch(i, { phone: e.target.value })} className={inputCls()} /></Field>
              <Field label="Company"><input value={r.company} onChange={e => onPatch(i, { company: e.target.value })} className={inputCls()} /></Field>
            </div>
            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 text-[11px] text-txt-secondary cursor-pointer">
                <input type="checkbox" checked={!!r.consent} onChange={e => onPatch(i, { consent: e.target.checked })} className="w-4 h-4 accent-primary" />
                Reference has consented to be contacted
              </label>
              <button onClick={() => onRemove(i)} className="text-[11px] text-danger inline-flex items-center gap-1"><Trash2 size={12} /> Remove</button>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

/* ───────────────────────── Live preview ───────────────────────────── */
function ResumePreview({ resume, forPrint = false }) {
  const T = resume.template
  const headerColour = T === 'clean' ? 'bg-txt-primary' : 'bg-primary'
  return (
    <div
      className={`bg-white shadow-modal mx-auto ${forPrint ? 'w-full max-w-[820px]' : 'w-full max-w-[640px]'}`}
      style={{ aspectRatio: forPrint ? 'auto' : '210 / 297', minHeight: forPrint ? 'auto' : 600 }}
      id={forPrint ? 'resume-print' : 'resume-screen'}
    >
      {/* Top band */}
      <div className={`${headerColour} text-white px-5 sm:px-6 py-4 flex items-center gap-3`}>
        <img src={BRAND_ASSETS.nsdcLogo} alt="" className="h-10 w-auto bg-white rounded-lg p-0.5" onError={e => e.currentTarget.style.display = 'none'} />
        <div className="flex-1 min-w-0">
          <div className="text-[18px] font-extrabold leading-tight truncate">{resume.personal.name || 'Your name'}</div>
          <div className="text-[11px] opacity-90 truncate">
            {resume.personal.preferredRole}
            {resume.personal.location ? ` · ${resume.personal.location}` : ''}
          </div>
        </div>
        {T !== 'clean' && (
          <div className="text-right">
            <div className="text-[10px] opacity-80">Skill Passport</div>
            <div className="text-[11px] font-mono font-bold">{resume.personal.skillPassportId}</div>
          </div>
        )}
      </div>

      {/* Verified badges row (passport / overseas only) */}
      {T !== 'clean' && (
        <div className="px-5 sm:px-6 pt-3 flex flex-wrap items-center gap-1.5">
          {resume.personal.kycVerified  && <Badge tone="ok">✓ Aadhaar KYC</Badge>}
          {resume.personal.passportAvailable && <Badge tone="ok">✓ Passport</Badge>}
          {T === 'overseas' && <Badge tone="brand">Ready for {resume.personal.preferredCountry}</Badge>}
          <Badge tone="brand">Pravasi Setu verified profile</Badge>
        </div>
      )}

      <div className="px-5 sm:px-6 py-4 text-[11px] text-txt-secondary leading-relaxed grid gap-4">
        {/* Contact strip */}
        <div className="grid grid-cols-3 gap-2 text-[10px]">
          {resume.personal.phone   && <Pair k="Phone"   v={resume.personal.phone} />}
          {resume.personal.email   && <Pair k="Email"   v={resume.personal.email} />}
          {resume.personal.location&& <Pair k="Location" v={resume.personal.location} />}
        </div>

        {resume.summary && (
          <PreviewSection title="Summary">
            <p className="text-txt-primary text-[12px] leading-relaxed">{resume.summary}</p>
          </PreviewSection>
        )}

        {resume.skills.length > 0 && (
          <PreviewSection title="Skills">
            <div className="flex flex-wrap gap-1.5">
              {resume.skills.map(s => (
                <span key={s.id || s.name} className={`px-2 py-0.5 rounded-pill text-[10px] font-bold ${s.verified ? 'bg-ok-light text-ok' : 'bg-primary-50 text-primary'}`}>
                  {s.verified ? '✓ ' : ''}{s.name} · {s.level} · {s.years}y
                </span>
              ))}
            </div>
          </PreviewSection>
        )}

        {resume.experience.length > 0 && (
          <PreviewSection title="Work experience">
            <div className="space-y-2">
              {resume.experience.map(e => (
                <div key={e.id} className="text-[11px]">
                  <div className="text-txt-primary font-bold text-[12px]">{e.title || 'Role'}</div>
                  <div className="text-txt-secondary">{[e.company, e.country, e.duration].filter(Boolean).join(' · ')}{e.current ? ' · Current' : ''}</div>
                  {e.responsibilities && <p className="text-txt-secondary mt-0.5">{e.responsibilities}</p>}
                  {e.tools && <p className="text-txt-tertiary text-[10px] mt-0.5">Tools: {e.tools}</p>}
                </div>
              ))}
            </div>
          </PreviewSection>
        )}

        {resume.certifications.length > 0 && (
          <PreviewSection title="Certifications">
            <ul className="space-y-1 text-[11px]">
              {resume.certifications.map(c => (
                <li key={c.id || c.name} className="flex items-start gap-2">
                  <span className={`mt-1 inline-block w-1.5 h-1.5 rounded-full ${c.verified ? 'bg-ok' : 'bg-warn'}`} />
                  <span>
                    <span className="text-txt-primary font-bold">{c.name}</span>
                    <span className="text-txt-secondary"> — {c.issuer || '—'}{c.year ? `, ${c.year}` : ''}</span>
                    {c.verified && <span className="ml-1 text-ok font-bold">✓ Verified</span>}
                  </span>
                </li>
              ))}
            </ul>
          </PreviewSection>
        )}

        {resume.education.length > 0 && (
          <PreviewSection title="Education">
            <ul className="space-y-1 text-[11px]">
              {resume.education.map(e => (
                <li key={e.id}>
                  <span className="text-txt-primary font-bold">{e.qualification}</span>
                  {e.field        && <span className="text-txt-secondary"> · {e.field}</span>}
                  {e.institution  && <span className="text-txt-secondary"> · {e.institution}</span>}
                  {e.year         && <span className="text-txt-secondary"> · {e.year}</span>}
                </li>
              ))}
            </ul>
          </PreviewSection>
        )}

        {resume.languages.length > 0 && (
          <PreviewSection title="Languages">
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              {resume.languages.map(l => (
                <div key={l.id} className="text-txt-primary">
                  {l.name} <span className="text-txt-secondary">— S:{l.speaking[0]} · R:{l.reading[0]} · W:{l.writing[0]}</span>
                </div>
              ))}
            </div>
          </PreviewSection>
        )}

        {T === 'overseas' && resume.documents.length > 0 && (
          <PreviewSection title="Document readiness">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 text-[10px]">
              {resume.documents.map(d => (
                <div key={d.id} className="flex items-center gap-1.5">
                  <DocStatusDot status={d.status} />
                  <span className="text-txt-primary">{d.label}</span>
                </div>
              ))}
            </div>
          </PreviewSection>
        )}
      </div>

      <div className="border-t border-bdr-light px-5 sm:px-6 py-2 flex items-center justify-between text-[9px] text-txt-tertiary">
        <span>Generated by Pravasi Setu · {formatDate(resume.lastUpdated)}</span>
        <span>Prototype document — not an official certificate</span>
      </div>
    </div>
  )
}

function Pair({ k, v }) {
  return (
    <div>
      <div className="text-txt-tertiary uppercase tracking-wide">{k}</div>
      <div className="text-txt-primary font-semibold truncate">{v}</div>
    </div>
  )
}

function Badge({ tone = 'brand', children }) {
  const cls = tone === 'ok' ? 'bg-ok-light text-ok' : 'bg-primary-50 text-primary'
  return <span className={`inline-flex px-2 py-0.5 rounded-pill text-[10px] font-bold ${cls}`}>{children}</span>
}

function PreviewSection({ title, children }) {
  return (
    <section>
      <div className="text-[10px] font-bold text-primary uppercase tracking-wide border-b border-bdr-light pb-1 mb-1.5">
        {title}
      </div>
      {children}
    </section>
  )
}

function DocStatusDot({ status }) {
  const tone = status === 'available' ? 'bg-ok'
            : status === 'pending'   ? 'bg-warn'
            : status === 'expired'   ? 'bg-danger'
            :                          'bg-bdr'
  return <span className={`inline-block w-1.5 h-1.5 rounded-full ${tone}`} />
}
function DocStatusBadge({ status }) {
  const map = {
    available:    { tone: 'bg-ok-light text-ok',           label: '✓ Available' },
    pending:      { tone: 'bg-warn-light text-warn-text',  label: '⏳ Pending' },
    expired:      { tone: 'bg-danger-light text-danger',   label: '✕ Expired' },
    not_uploaded: { tone: 'bg-surface-secondary text-txt-tertiary', label: '— Not uploaded' },
  }
  const m = map[status] || map.not_uploaded
  return <span className={`px-2 py-0.5 rounded-pill text-[10px] font-bold ${m.tone} flex-shrink-0`}>{m.label}</span>
}

/* ───────────────────────── shared bits ────────────────────────────── */

function SectionCard({ title, icon: Icon, action, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-bdr-light p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {Icon && <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center"><Icon size={14} className="text-primary" /></div>}
          <div className="text-[13px] font-extrabold text-txt-primary">{title}</div>
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}
function Empty({ children }) {
  return <p className="text-[11px] text-txt-tertiary italic">{children}</p>
}
function Field({ label, error, className = '', children }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[10px] font-semibold text-txt-secondary uppercase tracking-wide">{label}</span>
      {children}
      {error && error !== '!' && <span className="block text-[10px] text-danger mt-1">{error}</span>}
    </label>
  )
}
function inputCls(err, extra = '') {
  return `w-full mt-1 border-2 rounded-xl px-3 py-2.5 text-[13px] outline-none bg-white ${
    err ? 'border-danger' : 'border-bdr focus:border-primary'
  } ${extra}`
}
function setIn(obj, path, value) {
  if (path.length === 0) return value
  const [head, ...rest] = path
  return { ...obj, [head]: rest.length === 0 ? value : setIn(obj[head] || {}, rest, value) }
}
function completenessScore(r) {
  let total = 0, done = 0
  const add = (cond) => { total++; if (cond) done++ }
  add(isValidName(r.personal.name))
  add(isValidIndianPhone(r.personal.phone))
  add((r.personal.location || '').trim().length >= 3)
  add((r.summary || '').length >= 40)
  add(r.skills.length > 0)
  add(r.skills.some(s => s.verified))
  add(r.certifications.length > 0)
  add(r.experience.length > 0)
  add(r.education.length > 0)
  add(r.languages.length > 0)
  add(r.documents.filter(d => d.status === 'available').length >= 3)
  return Math.round((done / total) * 100)
}
function formatRelative(ts) {
  if (!ts) return 'just now'
  const d = Date.now() - ts
  if (d < 60_000)    return 'just now'
  if (d < 3600_000)  return `${Math.floor(d / 60_000)} min ago`
  if (d < 86400_000) return `${Math.floor(d / 3600_000)} hr ago`
  return new Date(ts).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
}
function formatDate(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

/* Print stylesheet — only the resume-print-root prints; everything else is
   suppressed. The browser's "Save as PDF" produces the actual PDF. */
function PrintStyles({ fileName }) {
  return (
    <style>{`
      @media print {
        @page { size: A4; margin: 12mm; }
        body * { visibility: hidden !important; }
        #resume-print-root, #resume-print-root * { visibility: visible !important; }
        #resume-print-root {
          position: absolute !important;
          inset: 0 !important;
          background: #fff !important;
          color: #000 !important;
          width: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
          box-shadow: none !important;
          display: block !important;
        }
        .shadow-modal, .shadow-card { box-shadow: none !important; }
      }
      @media print {
        title { content: "${fileName}"; }
      }
    `}</style>
  )
}
