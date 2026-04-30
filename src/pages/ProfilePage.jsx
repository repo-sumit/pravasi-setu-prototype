import React from 'react'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import { VerifiedBadge } from '../components/VerifiedBadge'
import {
  User, Phone, MapPin, BookOpen, ChevronRight, BookUser, Fingerprint,
  FileText, LogOut, Settings, Globe, Languages, ShieldCheck
} from 'lucide-react'

export default function ProfilePage() {
  const { profile, navigate } = useApp()

  return (
    <div className="flex-1 flex flex-col bg-surface-secondary overflow-hidden">
      <StatusBar />
      <TopBar title="My Profile" />
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Header card */}
        <div className="bg-white p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-ok flex items-center justify-center text-white text-[22px] font-bold flex-shrink-0">
            {profile.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <div className="text-[16px] font-bold text-txt-primary">{profile.name}</div>
            <div className="text-[11px] text-txt-secondary">{profile.phone}</div>
            <div className="flex items-center gap-1 mt-1">
              <VerifiedBadge verified label="KYC Verified" />
            </div>
          </div>
        </div>

        {/* Identity */}
        <div className="bg-white mt-2 p-4">
          <div className="text-[12px] font-bold text-txt-secondary uppercase mb-3">Identity</div>
          <Row icon={Fingerprint} label="Aadhaar" value="XXXX XXXX 4523" verified={profile.aadhaarVerified} />
          <Row icon={BookUser} label="APAAR ID" value="APR-2389-4521" verified={profile.apaarVerified} />
          <Row icon={FileText} label="DigiLocker" value="Linked · 8 documents" verified={profile.digilockerLinked} />
          <Row icon={ShieldCheck} label="Police Clearance Certificate" value="Not yet uploaded" verified={profile.pccVerified} />
        </div>

        {/* Personal */}
        <div className="bg-white mt-2 p-4">
          <div className="text-[12px] font-bold text-txt-secondary uppercase mb-3">Personal Details</div>
          <Row icon={User} label="Age & Gender" value={`${profile.age} · ${profile.gender}`} />
          <Row icon={MapPin} label="Location" value={profile.location} />
          <Row icon={BookOpen} label="Education" value={profile.education} />
          <Row icon={Phone} label="Phone" value={profile.phone} />
        </div>

        {/* Quick links */}
        <div className="bg-white mt-2 p-4">
          <div className="text-[12px] font-bold text-txt-secondary uppercase mb-3">Documents & Skills</div>
          <LinkRow icon={ShieldCheck} label="Skill Passport" sub="3 skills · 3 certificates" onClick={() => navigate('passport')} />
          <LinkRow icon={FileText} label="Resume Builder" sub="Generate PDF · Share QR" onClick={() => navigate('passport')} />
          <LinkRow icon={Languages} label="Languages" sub="Hindi, English, Basic Arabic" />
        </div>

        <div className="bg-white mt-2 p-4">
          <div className="text-[12px] font-bold text-txt-secondary uppercase mb-3">Settings</div>
          <LinkRow icon={Globe} label="Language" sub="English · Voice support enabled" />
          <LinkRow icon={Settings} label="Notifications & Alerts" />
          <LinkRow icon={LogOut} label="Sign Out" danger onClick={() => navigate('splash')} />
        </div>

        <p className="text-center text-[10px] text-txt-tertiary mt-4 mb-2">Pravasi Setu v0.1 · Govt. of India</p>
      </div>
      <BottomNav />
    </div>
  )
}

function Row({ icon: Icon, label, value, verified }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] text-txt-secondary">{label}</div>
        <div className="text-[13px] font-semibold text-txt-primary truncate">{value}</div>
      </div>
      {verified !== undefined && <VerifiedBadge verified={verified} />}
    </div>
  )
}

function LinkRow({ icon: Icon, label, sub, danger, onClick }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 py-2.5 active:bg-surface-secondary rounded-lg">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
        danger ? 'bg-danger-light text-danger' : 'bg-primary-light text-primary'
      }`}>
        <Icon size={16} />
      </div>
      <div className="flex-1 text-left">
        <div className={`text-[13px] font-semibold ${danger ? 'text-danger' : 'text-txt-primary'}`}>{label}</div>
        {sub && <div className="text-[11px] text-txt-secondary">{sub}</div>}
      </div>
      <ChevronRight size={16} className="text-txt-tertiary" />
    </button>
  )
}
