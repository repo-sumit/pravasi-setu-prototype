import React from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Toast from './components/Toast'

import SplashPage        from './pages/SplashPage'
import LoginPage         from './pages/LoginPage'
import OTPPage           from './pages/OTPPage'
import KYCPage           from './pages/KYCPage'
import HomePage          from './pages/HomePage'
import ProfilePage       from './pages/ProfilePage'
import SkillPassportPage from './pages/SkillPassportPage'
import JobsPage          from './pages/JobsPage'
import JobDetailPage     from './pages/JobDetailPage'
import RateEmployerPage  from './pages/RateEmployerPage'
import CalculatorPage    from './pages/CalculatorPage'
import PreDeparturePage  from './pages/PreDeparturePage'
import PostArrivalPage   from './pages/PostArrivalPage'
import RemittancePage    from './pages/RemittancePage'
import EmploymentPage    from './pages/EmploymentPage'
import ReturnPage        from './pages/ReturnPage'
import GrievancePage     from './pages/GrievancePage'
import ChatPage          from './pages/ChatPage'
import UpdatesPage       from './pages/UpdatesPage'

const ROUTES = {
  splash:       SplashPage,
  login:        LoginPage,
  otp:          OTPPage,
  kyc:          KYCPage,
  home:         HomePage,
  profile:      ProfilePage,
  passport:     SkillPassportPage,
  jobs:         JobsPage,
  jobDetail:    JobDetailPage,
  rateEmployer: RateEmployerPage,
  calculator:   CalculatorPage,
  predeparture: PreDeparturePage,
  postarrival:  PostArrivalPage,
  remittance:   RemittancePage,
  employment:   EmploymentPage,
  return:       ReturnPage,
  grievance:    GrievancePage,
  chat:         ChatPage,
  updates:      UpdatesPage,
}

function AppRoutes() {
  const { screen } = useApp()
  const Page = ROUTES[screen] || SplashPage

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#e6ecf5] md:p-6">
      {/* Phone bezel */}
      <div
        className="
          bg-[#0E1A2B] overflow-hidden
          w-full h-full
          md:w-[420px] md:h-[860px] md:max-h-full
          md:rounded-[36px] md:shadow-[0_0_60px_rgba(0,0,0,0.18)]
          md:p-[10px]
        "
      >
        {/* Inner viewport — single source of layout, only one page rendered */}
        <div className="relative w-full h-full overflow-hidden bg-white md:rounded-[26px] flex flex-col">
          <Page key={screen} />
          <Toast />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  )
}
