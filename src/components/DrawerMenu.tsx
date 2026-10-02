import React from 'react';
import { useApp } from '../context/AppContext';
import { ClusterLogo } from './ClusterLogo';
import {
  X,
  Landmark,
  Target,
  BarChart3,
  Calendar,
  MessageSquare,
  Bell,
  RefreshCw,
  Smartphone,
  CheckCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

export const DrawerMenu: React.FC = () => {
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    setCurrentTab,
    viewMode,
    setViewMode,
    triggerPushNotification,
    resetAllData,
    growthCycle,
    lsaMeetings,
  } = useApp();

  if (!isDrawerOpen) return null;

  const navigateTo = (tab: any) => {
    setCurrentTab(tab);
    setIsDrawerOpen(false);
  };

  const handleTestNotification = () => {
    triggerPushNotification(
      'Milestone Alert 🎯',
      'Junior Youth group in Inkisanjani completed community tree planting project! 16 youth participated.',
      'milestone',
      'Inkisanjani'
    );
    setIsDrawerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Container */}
      <div className="absolute inset-y-0 left-0 max-w-[320px] w-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
        {/* Top Header with Plum Banner */}
        <div className="bg-gradient-to-br from-[#701a43] via-[#882455] to-[#a02c65] text-white p-5 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-15">
            <ClusterLogo size={140} theme="plum" />
          </div>

          <div className="flex items-center justify-between mb-4">
            <ClusterLogo size={42} theme="plum" />
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-lg font-extrabold tracking-tight">KIMANA CLUSTER</h2>
          <p className="text-xs text-rose-100 font-medium mt-0.5">
            Bahá'í Institute & LSA Planning Platform
          </p>

          <div className="mt-3 inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Cycle {growthCycle.cycleNumber} ({growthCycle.currentPhase})
          </div>
        </div>

        {/* Menu Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
            Main Features
          </div>

          <button
            onClick={() => navigateTo('home')}
            className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-rose-50 hover:text-[#882455] font-semibold text-xs transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#882455] flex items-center justify-center">
              <ClusterLogo size={20} />
            </div>
            <div>
              <div className="text-slate-900">Neighborhood Core Activities</div>
              <div className="text-[10px] text-slate-500 font-normal">JY, Children, Ruhi & Devotionals</div>
            </div>
          </button>

          <button
            onClick={() => navigateTo('lsa')}
            className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-rose-50 hover:text-[#882455] font-semibold text-xs transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-900">LSA Council & Governance</div>
              <div className="text-[10px] text-slate-500 font-normal">{lsaMeetings.length} Meetings, Resolutions & Goals</div>
            </div>
          </button>

          <button
            onClick={() => navigateTo('dashboard')}
            className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-rose-50 hover:text-[#882455] font-semibold text-xs transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-900">Growth Cycle Dashboards</div>
              <div className="text-[10px] text-slate-500 font-normal">Expansion & Consolidation Progress</div>
            </div>
          </button>

          <button
            onClick={() => navigateTo('schedule')}
            className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-rose-50 hover:text-[#882455] font-semibold text-xs transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-900">Automated Session Scheduling</div>
              <div className="text-[10px] text-slate-500 font-normal">Conflict-Free Coordination</div>
            </div>
          </button>

          <button
            onClick={() => navigateTo('chat')}
            className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-rose-50 hover:text-[#882455] font-semibold text-xs transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-900">Integrated Messaging</div>
              <div className="text-[10px] text-slate-500 font-normal">Channels & Coordinator Chat</div>
            </div>
          </button>

          <div className="pt-3 border-t border-slate-100 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
              Android Download & App Settings
            </div>

            <PWAInstallButton variant="drawer" />

            <button
              onClick={handleTestNotification}
              className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-rose-50 hover:text-[#882455] font-semibold text-xs transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#882455] flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="text-slate-900">Trigger Push Notification</div>
                <div className="text-[10px] text-slate-500 font-normal">Test instant team milestone alert</div>
              </div>
            </button>

            <button
              onClick={() => {
                setViewMode(viewMode === 'handheld' ? 'responsive' : 'handheld');
                setIsDrawerOpen(false);
              }}
              className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-rose-50 hover:text-[#882455] font-semibold text-xs transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-slate-900">Switch View Mode</div>
                <div className="text-[10px] text-slate-500 font-normal">
                  Current: {viewMode === 'handheld' ? 'Mobile Handheld Frame' : 'Expanded Responsive'}
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                resetAllData();
                triggerPushNotification(
                  'Cluster Records Reset 🔄',
                  'Kimana cluster tracking data cleared to fresh start.',
                  'reminder'
                );
                setIsDrawerOpen(false);
              }}
              className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 font-semibold text-xs transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <div className="text-slate-800">Clear All Stored Records</div>
                <div className="text-[10px] text-slate-400 font-normal">Wipe saved data and start fresh</div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Kimana Cluster · Kenya</span>
          <span className="font-semibold text-[#882455]">Milestone 3</span>
        </div>
      </div>
    </div>
  );
};
