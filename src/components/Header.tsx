import React from 'react';
import { useApp } from '../context/AppContext';
import { ClusterLogo } from './ClusterLogo';
import { Bell, Menu, Search, MapPin, Sparkles, SlidersHorizontal } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

export const Header: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    setIsDrawerOpen,
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    searchQuery,
    setSearchQuery,
    selectedNeighborhood,
    setSelectedNeighborhood,
    neighborhoods,
    viewMode,
    setViewMode,
  } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-rose-100/70 transition-all">
      {/* Top Bar Row */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 hover:bg-rose-50 hover:text-[#882455] transition-colors"
            title="Open Menu"
            aria-label="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2 text-left group"
          >
            <ClusterLogo size={34} />
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-tight text-slate-900 group-hover:text-[#882455] transition-colors">
                KIMANA CLUSTER
              </span>
              <span className="text-[10px] font-medium text-slate-500">
                Bahá'í Growth & LSA
              </span>
            </div>
          </button>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* PWA Install Button */}
          <PWAInstallButton variant="header" />

          {/* Handheld / Fluid toggle */}
          <button
            onClick={() => setViewMode(viewMode === 'handheld' ? 'responsive' : 'handheld')}
            className="hidden sm:flex text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-rose-50 hover:text-[#882455] px-2.5 py-1 rounded-lg border border-slate-200 transition-colors items-center gap-1"
            title="Toggle between handheld phone mock view and expanded desktop view"
          >
            <span>{viewMode === 'handheld' ? '📱 Mobile Frame' : '🖥️ Expanded View'}</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 hover:bg-rose-50 hover:text-[#882455] transition-colors"
            title="Milestone Notifications"
            aria-label="Milestone Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#882455] text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Avatar */}
          <button
            onClick={() => setCurrentTab('lsa')}
            className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-[#882455]/20 hover:ring-[#882455] transition-all shrink-0"
            title="LSA Member Profile"
          >
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
              alt="Coordinator"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </button>
        </div>
      </div>

      {/* Contextual Search & Filter Strip on Home & Activities Views */}
      {(currentTab === 'home' || currentTab === 'activities') && (
        <div className="px-4 pb-3 pt-1 space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search activities, facilitators, ruhi books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#882455]/20 focus:border-[#882455] transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-medium"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Neighborhood quick selector */}
            <div className="relative shrink-0">
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                className="text-xs bg-rose-50/80 text-[#882455] font-semibold pl-6 pr-6 py-2 rounded-xl border border-rose-200/60 focus:outline-none cursor-pointer appearance-none hover:bg-rose-100/60 transition-colors"
              >
                <option value="all">📍 All Kimana</option>
                {neighborhoods.map((n) => (
                  <option key={n.id} value={n.name}>
                    {n.name}
                  </option>
                ))}
              </select>
              <MapPin className="w-3.5 h-3.5 text-[#882455] absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
