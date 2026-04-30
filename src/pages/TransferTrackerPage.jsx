import React from 'react'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import TopBar from '../components/TopBar'
import { Send, Check, Clock, ArrowDownToLine, Building2, ChevronRight, Phone } from 'lucide-react'

export default function TransferTrackerPage() {
  const { transfers, params, navigate, showToast } = useApp()
  const focusId = params?.transferId
  const focused = focusId ? transfers.find(t => t.id === focusId) : null

  if (focused) {
    return (
      <div className="flex-1 flex flex-col bg-surface-secondary overflow-hidden">
        <StatusBar dark />
        <TopBar title={`Transfer ${focused.id}`} sub={focused.provider} dark />

        <div className="bg-primary text-white px-5 pb-6">
          <div className="text-[11px] opacity-80 uppercase">{focused.status}</div>
          <div className="text-[32px] font-extrabold mt-0.5">₹{focused.amount.toLocaleString()}</div>
          <div className="text-[12px] opacity-90">to {focused.to}</div>
        </div>

        <div className="flex-1 overflow-y-auto pb-6">
          <div className="bg-white p-5">
            <div className="text-[12px] font-bold text-txt-secondary uppercase mb-3">Transfer details</div>
            <Row k="From"        v={focused.from} />
            <Row k="Provider"    v={focused.provider} />
            <Row k="Rate"        v={`₹${focused.rate}/AED`} />
            <Row k="Fee"         v={`₹${focused.fee}`} />
            <Row k="Initiated"   v={focused.initiatedOn} />
            <Row k="ETA"         v={focused.eta} />
          </div>

          <div className="bg-white mt-2 p-5">
            <div className="text-[12px] font-bold text-txt-secondary uppercase mb-3">Status timeline</div>
            <ol className="relative ml-2 border-l-2 border-bdr space-y-3">
              {focused.timeline.map((t, i) => (
                <li key={i} className="ml-4">
                  <span className={`absolute -left-[9px] w-4 h-4 rounded-full flex items-center justify-center ${
                    t.done ? 'bg-ok' : t.current ? 'bg-warn' : 'bg-bdr'
                  }`}>
                    {t.done ? <Check size={10} className="text-white" /> : t.current ? <Clock size={10} className="text-white" /> : null}
                  </span>
                  <div className="text-[12px] font-bold text-txt-primary">{t.step}</div>
                  <div className="text-[10px] text-txt-secondary">{t.date}</div>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-white mt-2 p-5">
            <button onClick={() => showToast('Provider support called')} className="w-full flex items-center gap-3 p-3 rounded-card border border-bdr active:bg-primary-light">
              <Phone size={16} className="text-primary" />
              <div className="flex-1 text-left text-[13px] font-bold text-txt-primary">Call {focused.provider} support</div>
              <ChevronRight size={14} className="text-txt-tertiary" />
            </button>
            <button onClick={() => navigate('grievance')} className="mt-2 w-full flex items-center gap-3 p-3 rounded-card border border-bdr active:bg-danger-light">
              <ArrowDownToLine size={16} className="text-danger" />
              <div className="flex-1 text-left text-[13px] font-bold text-danger">Raise dispute</div>
              <ChevronRight size={14} className="text-txt-tertiary" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // List
  return (
    <div className="flex-1 flex flex-col bg-surface-secondary overflow-hidden">
      <StatusBar />
      <TopBar title="Transfer Tracker" sub={`${transfers.length} transfers`} />

      <div className="flex-1 overflow-y-auto px-4 py-3 pb-6 space-y-3">
        {transfers.map(t => (
          <button
            key={t.id}
            onClick={() => navigate('transferTracker', { transferId: t.id })}
            className="w-full bg-white rounded-card shadow-card p-4 text-left active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-bold text-txt-tertiary uppercase">{t.id}</div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                t.status === 'Delivered' ? 'bg-ok-light text-ok' : 'bg-warn-light text-warn'
              }`}>{t.status}</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center">
                <Send size={16} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-bold text-txt-primary truncate">{t.to}</div>
                <div className="text-[11px] text-txt-secondary">{t.provider} · {t.initiatedOn}</div>
              </div>
              <div className="text-[14px] font-extrabold text-ok">₹{t.amount.toLocaleString()}</div>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-1">
              {t.timeline.map((s, i) => (
                <div key={i} className={`h-1 rounded-full ${s.done ? 'bg-primary' : s.current ? 'bg-warn' : 'bg-bdr'}`} />
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function Row({ k, v }) {
  return (
    <div className="flex items-start justify-between text-[12px] gap-2 py-1.5 border-b border-bdr-light last:border-0">
      <span className="text-txt-secondary">{k}</span>
      <span className="font-semibold text-txt-primary text-right">{v}</span>
    </div>
  )
}
