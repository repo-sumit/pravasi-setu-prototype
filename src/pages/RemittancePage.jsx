import React, { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import TopBar from '../components/TopBar'
import { REMITTANCE_PROVIDERS } from '../data/mockData'
import { ArrowDownUp, Send, Clock, Users, ChevronRight, BadgeCheck, History } from 'lucide-react'

const BENEFICIARIES = [
  { name: 'Sunita (Wife)',  bank: 'SBI · ****8821',  init: 'S', color: 'bg-primary' },
  { name: 'Father',         bank: 'PNB · ****4502',  init: 'F', color: 'bg-accent' },
  { name: 'Brother',        bank: 'HDFC · ****9132', init: 'B', color: 'bg-ok' },
]

const HISTORY = [
  { name: 'Sunita',  amt: 12000, date: '15 Apr', status: 'Delivered' },
  { name: 'Father',  amt: 5000,  date: '10 Apr', status: 'Delivered' },
  { name: 'Sunita',  amt: 10000, date: '02 Apr', status: 'Delivered' },
]

export default function RemittancePage() {
  const { showToast } = useApp()
  const [aed, setAed] = useState(500)
  const [provider, setProvider] = useState('rmly')

  const sorted = useMemo(() =>
    [...REMITTANCE_PROVIDERS].sort((a, b) => (b.rate - a.rate) - (a.fee - b.fee) / 100), [])
  const best = sorted[0]
  const selectedP = REMITTANCE_PROVIDERS.find(p => p.id === provider)

  const inr = aed * (selectedP?.rate || 22.85) - (selectedP?.fee || 0)

  return (
    <div className="flex-1 flex flex-col bg-surface-secondary overflow-hidden">
      <StatusBar dark />
      <TopBar title="Send Money Home" sub="Compare rates · Track transfers" dark />

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Converter card */}
        <div className="bg-primary px-5 pb-5">
          <div className="bg-white rounded-card shadow-modal p-4">
            <div className="text-[10px] text-txt-secondary font-semibold uppercase mb-2">You send (UAE Dirham)</div>
            <div className="flex items-center gap-2 border-b-2 border-bdr pb-3">
              <span className="text-[18px]">🇦🇪</span>
              <input
                type="number"
                value={aed}
                onChange={e => setAed(+e.target.value || 0)}
                className="flex-1 text-[24px] font-extrabold text-txt-primary outline-none"
              />
              <span className="text-[14px] font-bold text-txt-secondary">AED</span>
            </div>

            <div className="flex justify-center -my-3 z-10 relative">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-modal">
                <ArrowDownUp size={16} className="text-white" />
              </div>
            </div>

            <div className="text-[10px] text-txt-secondary font-semibold uppercase mb-2 mt-1">They receive (₹)</div>
            <div className="flex items-center gap-2 pt-3 border-t-0">
              <span className="text-[18px]">🇮🇳</span>
              <div className="flex-1 text-[24px] font-extrabold text-primary">
                ₹{Math.round(inr).toLocaleString()}
              </div>
              <span className="text-[14px] font-bold text-txt-secondary">INR</span>
            </div>
            <div className="text-[10px] text-txt-tertiary mt-1">
              Rate: ₹{selectedP?.rate} · Fee: ₹{selectedP?.fee} · {selectedP?.time}
            </div>
          </div>
        </div>

        {/* Provider compare */}
        <div className="px-4 mt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[12px] font-bold text-txt-secondary uppercase">Compare providers</div>
            <span className="text-[10px] text-ok font-bold">Best rate first</span>
          </div>
          <div className="space-y-2">
            {sorted.map(p => (
              <button
                key={p.id}
                onClick={() => setProvider(p.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-card border-2 ${
                  provider === p.id ? 'border-primary bg-primary-light' : 'border-bdr bg-white'
                }`}
              >
                <span className="text-[22px]">{p.logo}</span>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-1">
                    <div className="text-[13px] font-bold text-txt-primary">{p.name}</div>
                    {p.id === best.id && (
                      <span className="px-1.5 py-0.5 rounded-full bg-ok-light text-ok text-[9px] font-bold flex items-center gap-0.5">
                        <BadgeCheck size={10} /> BEST
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-txt-secondary flex items-center gap-2 mt-0.5">
                    <span>₹{p.rate}/AED</span>
                    <span>• Fee ₹{p.fee}</span>
                    <span className="flex items-center gap-0.5"><Clock size={10} /> {p.time}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[13px] font-extrabold text-txt-primary">
                    ₹{Math.round(aed * p.rate - p.fee).toLocaleString()}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Beneficiaries */}
        <div className="px-4 mt-5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[12px] font-bold text-txt-secondary uppercase">Send to</div>
            <button onClick={() => showToast('Add beneficiary')} className="text-[11px] font-bold text-primary">+ Add</button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {BENEFICIARIES.map(b => (
              <button key={b.name} className="flex-shrink-0 flex flex-col items-center gap-1 w-16">
                <div className={`w-12 h-12 rounded-full ${b.color} text-white text-[18px] font-bold flex items-center justify-center`}>
                  {b.init}
                </div>
                <span className="text-[10px] font-semibold text-txt-primary text-center leading-tight">
                  {b.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="px-4 mt-5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[12px] font-bold text-txt-secondary uppercase flex items-center gap-1">
              <History size={12} /> Recent transfers
            </div>
            <button className="text-[11px] font-bold text-primary">All →</button>
          </div>
          <div className="bg-white rounded-card shadow-card p-3 space-y-2">
            {HISTORY.map((h, i) => (
              <div key={i} className="flex items-center justify-between py-1.5">
                <div>
                  <div className="text-[12px] font-bold text-txt-primary">{h.name}</div>
                  <div className="text-[10px] text-txt-secondary">{h.date} · {h.status}</div>
                </div>
                <div className="text-[13px] font-extrabold text-ok">₹{h.amt.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-bdr-light bg-white flex-shrink-0">
        <button
          onClick={() => showToast('Transfer initiated · Tracking ID #TR-9821')}
          className="w-full bg-primary text-white font-bold text-[14px] py-3 rounded-pill flex items-center justify-center gap-2 shadow-card"
        >
          <Send size={16} /> Send ₹{Math.round(inr).toLocaleString()} now
        </button>
      </div>
    </div>
  )
}
