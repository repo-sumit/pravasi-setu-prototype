import React from 'react'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import TopBar from '../components/TopBar'
import { Wallet, FileText, Calendar, Download, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react'

const PAYSLIPS = [
  { month: 'April 2026',    gross: 62000, net: 51200, deduction: 10800, status: 'Paid' },
  { month: 'March 2026',    gross: 62000, net: 51200, deduction: 10800, status: 'Paid' },
  { month: 'February 2026', gross: 62000, net: 51200, deduction: 10800, status: 'Paid' },
]

export default function EmploymentPage() {
  const { showToast } = useApp()

  return (
    <div className="flex-1 flex flex-col bg-surface-secondary overflow-hidden">
      <StatusBar />
      <TopBar title="My Employment" sub="Al Habtoor Construction · Dubai" />

      <div className="flex-1 overflow-y-auto pb-6">
        {/* Salary card */}
        <div className="bg-gradient-to-br from-info to-primary text-white p-5">
          <div className="text-[11px] opacity-80 uppercase font-semibold">This month's net pay</div>
          <div className="text-[32px] font-extrabold mt-0.5">₹51,200</div>
          <div className="text-[11px] opacity-90">Paid on 1 May 2026</div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <Stat label="Gross"      value="₹62,000" />
            <Stat label="Deductions" value="₹10,800" />
            <Stat label="EMI"        value="₹4,500" />
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-2 px-4 -mt-3">
          <Tile icon={FileText} label="Contract"   onClick={() => showToast('Contract opened')} />
          <Tile icon={Calendar} label="Attendance" onClick={() => showToast('Attendance log')} />
          <Tile icon={Wallet}   label="EMI / Tax"  onClick={() => showToast('Deduction details')} />
        </div>

        {/* Payslips */}
        <div className="px-4 mt-4">
          <div className="text-[12px] font-bold text-txt-secondary uppercase mb-2">Salary slips</div>
          <div className="bg-white rounded-card shadow-card overflow-hidden">
            {PAYSLIPS.map((p, i) => (
              <div key={i} className={`p-3 flex items-center gap-3 ${i ? 'border-t border-bdr-light' : ''}`}>
                <div className="w-9 h-9 rounded-lg bg-ok-light flex items-center justify-center">
                  <Wallet size={16} className="text-ok" />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-bold text-txt-primary">{p.month}</div>
                  <div className="text-[10px] text-txt-secondary">Net ₹{p.net.toLocaleString()} · {p.status}</div>
                </div>
                <button onClick={() => showToast('Payslip downloaded')} className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center">
                  <Download size={14} className="text-primary" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Earnings trend */}
        <div className="px-4 mt-4">
          <div className="bg-white rounded-card shadow-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[13px] font-bold text-txt-primary">Earnings trend</div>
              <span className="text-[11px] text-ok flex items-center gap-1 font-bold">
                <TrendingUp size={12} /> +4.2%
              </span>
            </div>
            <div className="h-24 flex items-end gap-2">
              {[40, 55, 50, 62, 58, 62, 62].map((h, i) => (
                <div key={i} className="flex-1 bg-primary-light rounded-t" style={{ height: `${h}%` }}>
                  <div className="w-full bg-primary rounded-t" style={{ height: '60%' }} />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[9px] text-txt-tertiary mt-1">
              {['Nov','Dec','Jan','Feb','Mar','Apr','May'].map(m => <span key={m}>{m}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="bg-white/15 rounded-xl p-2.5">
      <div className="text-[10px] opacity-80">{label}</div>
      <div className="text-[13px] font-extrabold mt-0.5">{value}</div>
    </div>
  )
}

function Tile({ icon: Icon, label, onClick }) {
  return (
    <button onClick={onClick} className="bg-white rounded-card shadow-card p-3 flex flex-col items-center gap-1.5 active:scale-[0.97]">
      <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center">
        <Icon size={16} className="text-primary" />
      </div>
      <span className="text-[10px] font-semibold text-txt-primary">{label}</span>
    </button>
  )
}
