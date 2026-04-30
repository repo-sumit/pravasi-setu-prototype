import React, { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import BottomNav from '../components/BottomNav'
import { JOBS, SUGGESTED_PROMPTS } from '../data/mockData'
import {
  Mic, Send, Bot, ChevronRight, Briefcase, AlertTriangle, Calculator, Send as SendIcon,
  ShieldCheck, Phone, X
} from 'lucide-react'

const INITIAL = [
  { from: 'bot', kind: 'text', text: '🙏 Namaste! I\'m Setu — your migration assistant. Ask me anything in Hindi, English, Malayalam, or speak with the mic.' },
  { from: 'bot', kind: 'suggestions' },
]

export default function ChatPage() {
  const { navigate } = useApp()
  const [msgs, setMsgs] = useState(INITIAL)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing])

  const respond = (userText) => {
    setMsgs(m => [...m, { from: 'user', kind: 'text', text: userText }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      const lc = userText.toLowerCase()
      let reply
      if (lc.includes('job') || lc.includes('dubai') || lc.includes('electric')) {
        reply = [
          { from: 'bot', kind: 'text', text: 'I found 2 verified jobs matching "Electrician in Dubai". Here are the top picks:' },
          { from: 'bot', kind: 'jobCards', items: JOBS.filter(j => j.skill === 'Electrician').slice(0, 2) },
        ]
      } else if (lc.includes('cost') || lc.includes('how much')) {
        reply = [
          { from: 'bot', kind: 'text', text: 'A typical migration to Dubai (Electrician) costs ₹1,00,000 – ₹1,50,000. Let me open the calculator so you can plan precisely.' },
          { from: 'bot', kind: 'action', label: 'Open Cost Calculator', icon: Calculator, target: 'calculator' },
        ]
      } else if (lc.includes('send') || lc.includes('money') || lc.includes('remit')) {
        reply = [
          { from: 'bot', kind: 'text', text: 'You can send money home in under 30 minutes. Wise gives the best rate today (₹22.92/AED, fee ₹90).' },
          { from: 'bot', kind: 'action', label: 'Open Remittance', icon: SendIcon, target: 'remittance' },
        ]
      } else if (lc.includes('paying') || lc.includes('grievance') || lc.includes('help') || lc.includes('complain')) {
        reply = [
          { from: 'bot', kind: 'text', text: '⚠️ I\'m sorry to hear that. Let\'s raise a grievance — it routes to the embassy and our legal team. You can also press the emergency button.' },
          { from: 'bot', kind: 'action', label: 'Raise Grievance', icon: AlertTriangle, target: 'grievance', danger: true },
        ]
      } else if (lc.includes('document') || lc.includes('saudi') || lc.includes('checklist')) {
        reply = [
          { from: 'bot', kind: 'text', text: 'For Saudi Arabia, you\'ll need: Passport (6mo+), Work Visa, GAMCA medical, PCC, Yellow Fever certificate, attested educational docs. Want me to open the checklist?' },
          { from: 'bot', kind: 'action', label: 'Open Pre-Departure', icon: ShieldCheck, target: 'predeparture' },
        ]
      } else if (lc.includes('housing') || lc.includes('sim') || lc.includes('arabic')) {
        reply = [
          { from: 'bot', kind: 'text', text: 'Got you. Let me show you post-arrival essentials: housing, SIM, transport and Arabic basics.' },
          { from: 'bot', kind: 'action', label: 'Post-Arrival', icon: ChevronRight, target: 'postarrival' },
        ]
      } else {
        reply = [
          { from: 'bot', kind: 'text', text: 'I can help with jobs, costs, documents, money transfer, housing abroad, or grievances. Pick one below 👇' },
          { from: 'bot', kind: 'suggestions' },
        ]
      }
      setMsgs(m => [...m, ...reply])
    }, 900)
  }

  const handleSend = () => {
    if (!input.trim()) return
    const text = input
    setInput('')
    respond(text)
  }

  return (
    <div className="flex-1 flex flex-col bg-surface-chat overflow-hidden">
      <StatusBar dark />
      {/* Header */}
      <div className="bg-primary text-white px-4 pt-2 pb-3 flex items-center gap-3 flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
          <Bot size={20} />
        </div>
        <div className="flex-1">
          <div className="text-[15px] font-bold flex items-center gap-1.5">
            Setu Assistant
            <span className="w-2 h-2 rounded-full bg-ok animate-pulse" />
          </div>
          <div className="text-[10px] text-white/75">Multilingual · Voice + Text · Always free</div>
        </div>
        <button onClick={() => navigate('grievance')} className="w-9 h-9 rounded-full bg-danger/30 flex items-center justify-center" aria-label="Emergency">
          <Phone size={16} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {msgs.map((m, i) => <Message key={i} m={m} onSuggest={respond} navigate={navigate} />)}
        {typing && (
          <div className="flex items-center gap-1 px-3 py-2 bg-white rounded-2xl rounded-bl-sm w-fit shadow-card">
            {[0, 1, 2].map(i => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-txt-tertiary animate-typing" style={{ animationDelay: `${i * 150}ms` }} />
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-3 py-2 border-t border-bdr-light bg-white flex items-center gap-2 flex-shrink-0">
        <button onClick={() => respond('Voice input demo')} className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
          <Mic size={18} className="text-primary" />
        </button>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask anything..."
          className="flex-1 px-4 py-2.5 bg-surface-secondary rounded-pill text-[13px] outline-none"
        />
        <button onClick={handleSend} className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-card">
          <Send size={16} className="text-white" />
        </button>
      </div>

      <BottomNav />
    </div>
  )
}

function Message({ m, onSuggest, navigate }) {
  if (m.from === 'user') {
    return (
      <div className="flex justify-end animate-bubble-in">
        <div className="max-w-[80%] bg-primary text-white px-3.5 py-2.5 rounded-2xl rounded-br-sm">
          <p className="text-[13px] leading-relaxed">{m.text}</p>
        </div>
      </div>
    )
  }

  if (m.kind === 'text') {
    return (
      <div className="flex animate-bubble-in">
        <div className="max-w-[85%] bg-white px-3.5 py-2.5 rounded-2xl rounded-bl-sm shadow-card">
          <p className="text-[13px] text-txt-primary leading-relaxed">{m.text}</p>
        </div>
      </div>
    )
  }

  if (m.kind === 'suggestions') {
    return (
      <div className="flex flex-wrap gap-2 mt-1 animate-bubble-in">
        {SUGGESTED_PROMPTS.slice(0, 6).map(p => (
          <button
            key={p}
            onClick={() => onSuggest(p)}
            className="text-[11px] font-semibold bg-white text-primary border border-primary/30 px-3 py-1.5 rounded-pill active:bg-primary-light"
          >
            {p}
          </button>
        ))}
      </div>
    )
  }

  if (m.kind === 'jobCards') {
    return (
      <div className="space-y-2 animate-bubble-in">
        {m.items.map(j => (
          <button
            key={j.id}
            onClick={() => navigate('jobDetail', { jobId: j.id })}
            className="w-full bg-white rounded-2xl p-3 shadow-card text-left active:scale-[0.99]"
          >
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center">
                <Briefcase size={16} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-bold text-txt-primary truncate">{j.title}</div>
                <div className="text-[10px] text-txt-secondary truncate">{j.employer} · {j.city}</div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-bdr-light">
              <span className="text-[11px] text-primary font-bold">{j.salary}</span>
              <span className="text-[10px] text-warn font-bold">⭐ {j.trustScore}</span>
            </div>
          </button>
        ))}
      </div>
    )
  }

  if (m.kind === 'action') {
    const Icon = m.icon
    return (
      <button
        onClick={() => navigate(m.target)}
        className={`w-fit flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-card animate-bubble-in ${
          m.danger ? 'bg-danger text-white' : 'bg-white text-primary border border-primary/30'
        }`}
      >
        <Icon size={16} />
        <span className="text-[12px] font-bold">{m.label}</span>
        <ChevronRight size={14} />
      </button>
    )
  }

  return null
}
