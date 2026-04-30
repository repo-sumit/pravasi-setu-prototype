import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import Logo from '../components/Logo'
import { Phone, Fingerprint, ArrowRight, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const { navigate } = useApp()
  const [phone, setPhone] = useState('')

  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto">
      <div className="bg-gradient-to-b from-primary-light to-white px-6 pt-10 pb-8">
        <div className="flex items-center gap-3">
          <Logo size={48} />
          <div>
            <div className="text-[18px] font-extrabold text-txt-primary">Pravasi Setu</div>
            <div className="text-[11px] text-txt-secondary">Govt. of India initiative</div>
          </div>
        </div>
        <h1 className="text-[24px] font-bold text-txt-primary mt-6 leading-tight">
          Welcome back<br />
          <span className="text-primary">Let's get you home or abroad — safely.</span>
        </h1>
      </div>

      <div className="flex-1 px-6 py-6">
        <label className="text-[12px] font-semibold text-txt-secondary uppercase tracking-wide">Mobile number</label>
        <div className="flex items-center mt-2 border-2 border-bdr rounded-xl px-3 focus-within:border-primary transition-colors">
          <span className="text-[14px] font-semibold text-txt-secondary mr-2">+91</span>
          <input
            inputMode="numeric"
            value={phone}
            onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="98765 43210"
            className="flex-1 py-3.5 text-[15px] outline-none bg-transparent"
          />
          <Phone size={16} className="text-txt-tertiary" />
        </div>

        <button
          onClick={() => navigate('otp')}
          disabled={phone.length < 10}
          className="w-full mt-5 bg-primary text-white font-bold text-[15px] py-3.5 rounded-pill shadow-modal active:opacity-80 disabled:opacity-40 flex items-center justify-center gap-2"
        >
          Send OTP <ArrowRight size={18} />
        </button>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-bdr" />
          <span className="text-[11px] font-semibold text-txt-tertiary">OR</span>
          <div className="flex-1 h-px bg-bdr" />
        </div>

        <button
          onClick={() => navigate('kyc')}
          className="w-full border-2 border-primary text-primary font-semibold text-[14px] py-3.5 rounded-pill flex items-center justify-center gap-2 active:bg-primary-light"
        >
          <Fingerprint size={18} />
          Login with Aadhaar / DigiLocker
        </button>

        <div className="mt-6 p-3 bg-ok-light rounded-xl flex items-start gap-2">
          <ShieldCheck size={16} className="text-ok flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-ok leading-relaxed">
            Your identity is secured with Aadhaar-based KYC. We never share your data with employers without consent.
          </p>
        </div>

        <p className="text-center text-[11px] text-txt-tertiary mt-6">
          By continuing you agree to our{' '}
          <span className="text-primary">Terms</span> &{' '}
          <span className="text-primary">Privacy Policy</span>
        </p>
      </div>
    </div>
  )
}
