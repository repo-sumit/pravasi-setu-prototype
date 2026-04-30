import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import TopBar from '../components/TopBar'
import { PRE_DEPARTURE_CHECKLIST } from '../data/mockData'
import {
  Check, FileText, Stethoscope, Wallet, Plane, BookOpen, Scale, ChevronRight, Languages
} from 'lucide-react'

const CATEGORY_META = {
  Documents:   { icon: FileText,    color: 'bg-info-light text-info' },
  Health:      { icon: Stethoscope, color: 'bg-ok-light text-ok' },
  Financial:   { icon: Wallet,      color: 'bg-warn-light text-warn' },
  Travel:      { icon: Plane,       color: 'bg-accent-light text-accent' },
  Preparation: { icon: BookOpen,    color: 'bg-primary-light text-primary' },
  Legal:       { icon: Scale,       color: 'bg-danger-light text-danger' },
}

export default function PreDeparturePage() {
  const { showToast, navigate } = useApp()
  const [items, setItems] = useState(PRE_DEPARTURE_CHECKLIST)

  const toggle = (id) => setItems(arr => arr.map(i => i.id === id ? { ...i, done: !i.done } : i))
  const done = items.filter(i => i.done).length
  const pct = Math.round(done / items.length * 100)

  const grouped = items.reduce((acc, i) => {
    (acc[i.category] = acc[i.category] || []).push(i)
    return acc
  }, {})

  return (
    <div className="flex-1 flex flex-col bg-surface-secondary overflow-hidden">
      <StatusBar dark />
      <TopBar title="Pre-Departure" sub={`${done} of ${items.length} ready`} dark />

      <div className="bg-primary text-white px-5 pb-5">
        <div className="max-w-screen-lg mx-auto w-full">
          <div className="text-[12px] opacity-80">Departure readiness</div>
          <div className="text-[28px] font-extrabold leading-tight">{pct}%</div>
          <div className="h-2 bg-white/20 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 -mt-3 pb-6">
        <div className="max-w-screen-lg mx-auto w-full">
        {/* Service tiles — compact action cards (no aspect-square). */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-3 mb-4">
          <ServiceTile icon="🏦" label="Loans"        onClick={() => showToast('Loan providers')} />
          <ServiceTile icon="🛡️" label="Insurance (PBBY)" onClick={() => showToast('PBBY insurance')} />
          <ServiceTile icon="💱" label="Forex"        onClick={() => showToast('Forex providers')} />
          <ServiceTile icon="🛂" label="Visa help"    onClick={() => showToast('Visa assistance')} />
          <ServiceTile icon="✈️" label="Tickets"      onClick={() => showToast('Travel booking')} />
          <ServiceTile icon="💉" label="Vaccines"     onClick={() => showToast('Diagnostic centers')} />
          <ServiceTile icon="🗣️" label="Language"     onClick={() => showToast('Language basics')} />
          <ServiceTile icon="📜" label="Contract review" onClick={() => showToast('Translated contracts')} />
          <ServiceTile icon="🚔" label="PCC"          onClick={() => showToast('Police clearance')} />
        </div>

        {/* Checklist by category */}
        <div className="text-[12px] font-bold text-txt-secondary uppercase tracking-wide mb-2">
          Checklist
        </div>
        {Object.entries(grouped).map(([cat, list]) => {
          const meta = CATEGORY_META[cat] || CATEGORY_META.Documents
          const Icon = meta.icon
          return (
            <div key={cat} className="bg-white rounded-card shadow-card p-3 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-lg ${meta.color} flex items-center justify-center`}>
                  <Icon size={14} />
                </div>
                <div className="text-[12px] font-bold text-txt-primary">{cat}</div>
                <div className="text-[10px] text-txt-tertiary ml-auto">
                  {list.filter(i => i.done).length}/{list.length}
                </div>
              </div>
              <div className="space-y-1">
                {list.map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    className="w-full flex items-center gap-3 py-2 active:bg-surface-secondary rounded-lg transition-colors"
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      item.done ? 'bg-ok border-ok' : 'border-bdr'
                    }`}>
                      {item.done && <Check size={12} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className={`text-[12px] flex-1 text-left ${item.done ? 'line-through text-txt-tertiary' : 'text-txt-primary'}`}>
                      {item.title}
                    </span>
                    <ChevronRight size={14} className="text-txt-tertiary" />
                  </button>
                ))}
              </div>
            </div>
          )
        })}

        {/* Legal toolkit */}
        <div className="bg-white rounded-card shadow-card p-4 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Scale size={16} className="text-danger" />
            <div className="text-[13px] font-bold text-txt-primary">Legal Toolkit</div>
          </div>
          <p className="text-[11px] text-txt-secondary mb-3">
            Country-specific policies, FAQs, and contract translation help.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Tag>UAE Labour Law</Tag>
            <Tag>KSA Kafala</Tag>
            <Tag>Worker Rights FAQ</Tag>
            <Tag>Embassy contacts</Tag>
          </div>
        </div>

        {/* Language */}
        <div className="bg-primary-light rounded-card p-4 flex items-center gap-3">
          <Languages size={22} className="text-primary" />
          <div className="flex-1">
            <div className="text-[13px] font-bold text-primary">Learn basic Arabic</div>
            <div className="text-[11px] text-txt-secondary">10-minute daily lessons · Voice + text</div>
          </div>
          <button onClick={() => navigate('chat')} className="text-[11px] font-bold text-primary">Start →</button>
        </div>
        </div>
      </div>
    </div>
  )
}

function ServiceTile({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-card shadow-card border border-bdr-light px-3 py-3 min-h-[88px] sm:min-h-[96px] flex flex-col items-center justify-center gap-2 text-center active:scale-[0.98] hover:border-primary hover:bg-primary-light/40 transition-all"
    >
      <span className="text-[22px] leading-none">{icon}</span>
      <span className="text-[11px] sm:text-[12px] font-bold text-txt-primary leading-tight line-clamp-2">
        {label}
      </span>
    </button>
  )
}

function Tag({ children }) {
  return (
    <span className="px-2.5 py-1 rounded-full bg-surface-secondary text-[11px] font-semibold text-txt-secondary">
      {children}
    </span>
  )
}
