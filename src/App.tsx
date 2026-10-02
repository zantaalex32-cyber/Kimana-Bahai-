import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DrawerMenu } from './components/DrawerMenu';
import { NotificationDrawer } from './components/NotificationDrawer';
import { NotificationToast } from './components/NotificationToast';
import { BookingModal } from './components/BookingModal';
import { BookingSuccessModal } from './components/BookingSuccessModal';
import { HomeView } from './views/HomeView';
import { FacilitatorsView } from './views/FacilitatorsView';
import { ScheduleView } from './views/ScheduleView';
import { LsaView } from './views/LsaView';
import { DashboardView } from './views/DashboardView';
import { MessagingView } from './views/MessagingView';
import { Smartphone, Monitor, Wifi, Battery, Signal } from 'lucide-react';
import { ClusterLogo } from './components/ClusterLogo';

const MainContent: React.FC = () => {
  const { currentTab, viewMode, setViewMode } = useApp();

  const renderActiveView = () => {
    switch (currentTab) {
      case 'home':
        return <HomeView />;
      case 'activities':
        return <FacilitatorsView />;
      case 'schedule':
        return <ScheduleView />;
      case 'lsa':
        return <LsaView />;
      case 'dashboard':
        return <DashboardView />;
      case 'chat':
        return <MessagingView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-rose-50/40 to-slate-200 text-slate-800 flex flex-col items-center justify-start py-0 sm:py-6 selection:bg-[#882455] selection:text-white">
      {/* Top Desktop bar with View Switcher and Quick Context */}
      <div className="w-full max-w-5xl px-4 py-2 hidden sm:flex items-center justify-between text-xs text-slate-600 mb-2">
        <div className="flex items-center gap-2">
          <ClusterLogo size={24} />
          <span className="font-extrabold text-slate-900 tracking-tight">KIMANA CLUSTER APP</span>
          <span className="text-slate-400">·</span>
          <span className="text-[11px] font-semibold text-[#882455]">Bahá'í Core Activities & LSA Planning Platform</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white p-1 rounded-xl shadow-xs border border-slate-200/80">
            <button
              onClick={() => setViewMode('handheld')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'handheld'
                  ? 'bg-[#882455] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Handheld Device</span>
            </button>
            <button
              onClick={() => setViewMode('responsive')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'responsive'
                  ? 'bg-[#882455] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Expanded View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 ${
          viewMode === 'handheld'
            ? 'max-w-[430px] sm:rounded-[44px] shadow-[0_25px_60px_-15px_rgba(115,28,68,0.2)] border-0 sm:border-[8px] sm:border-slate-800 bg-white overflow-hidden relative min-h-screen sm:min-h-[860px]'
            : 'max-w-4xl bg-white sm:rounded-3xl shadow-xl border border-rose-100/80 min-h-screen sm:min-h-[820px] overflow-hidden'
        }`}
      >
        {/* Handheld Device Status Bar (only visible in handheld mode) */}
        {viewMode === 'handheld' && (
          <div className="bg-white/95 px-6 pt-3 pb-1 flex items-center justify-between text-xs text-slate-800 font-semibold select-none z-30">
            <span className="text-[11px] font-bold tracking-tight">09:42</span>
            
            {/* Speaker & camera notch */}
            <div className="w-24 h-4 bg-slate-800 rounded-full flex items-center justify-center gap-2 px-3">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
              <span className="w-6 h-1 bg-slate-700 rounded-full"></span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-700">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Global Header */}
        <Header />

        {/* Scrollable View Area with padding for bottom nav */}
        <main className="pb-20">
          {renderActiveView()}
        </main>

        {/* Global Bottom Navigation */}
        <BottomNav />

        {/* Modals & Overlays */}
        <DrawerMenu />
        <NotificationDrawer />
        <NotificationToast />
        <BookingModal />
        <BookingSuccessModal />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
