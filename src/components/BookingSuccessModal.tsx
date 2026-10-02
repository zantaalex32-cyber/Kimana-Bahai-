import React from 'react';
import { useApp } from '../context/AppContext';
import { Check, Calendar, MapPin, Users, Bell, Sparkles } from 'lucide-react';
import { ClusterLogo } from './ClusterLogo';

export const BookingSuccessModal: React.FC = () => {
  const {
    successModalOpen,
    setSuccessModalOpen,
    lastBookedSession,
    setCurrentTab,
  } = useApp();

  if (!successModalOpen || !lastBookedSession) return null;

  const handleDone = () => {
    setSuccessModalOpen(false);
    setCurrentTab('schedule');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-[#882455] via-[#751b47] to-[#591234] text-white w-full max-w-sm rounded-3xl shadow-2xl p-6 flex flex-col items-center text-center relative overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Subtle decorative background circles */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/5 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-rose-400/10 rounded-full blur-xl pointer-events-none" />

        {/* Large Central Success Badge matching template */}
        <div className="w-24 h-24 rounded-full bg-white/10 border-4 border-white/30 flex items-center justify-center my-4 relative shadow-inner">
          <div className="w-16 h-16 rounded-full bg-white text-[#882455] flex items-center justify-center shadow-lg">
            <Check className="w-9 h-9 stroke-[3]" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center text-slate-900 shadow">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Header Text */}
        <h2 className="text-2xl font-black tracking-tight text-white mt-1">
          THANK YOU!
        </h2>
        <p className="text-xs text-rose-100 font-medium mt-1">
          Your Milestone Session is Scheduled & Broadcasted
        </p>

        {/* Session Details Card */}
        <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 my-5 text-left space-y-2.5">
          <div className="flex items-center justify-between border-b border-white/15 pb-2">
            <span className="text-[10px] uppercase font-bold text-rose-200">Activity Title</span>
            <span className="text-xs font-bold text-white truncate max-w-[180px]">
              {lastBookedSession.title}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-rose-100">
            <Calendar className="w-3.5 h-3.5 text-rose-300 shrink-0" />
            <span className="font-semibold text-white">{lastBookedSession.date}</span>
            <span>·</span>
            <span>{lastBookedSession.time}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-rose-100">
            <MapPin className="w-3.5 h-3.5 text-rose-300 shrink-0" />
            <span className="truncate">{lastBookedSession.venue} ({lastBookedSession.neighborhood})</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-rose-100">
            <Users className="w-3.5 h-3.5 text-rose-300 shrink-0" />
            <span>Facilitator: <strong className="text-white">{lastBookedSession.facilitatorName}</strong></span>
          </div>

          <div className="pt-2 border-t border-white/15 flex items-center gap-1.5 text-[10px] text-emerald-300 font-medium">
            <Bell className="w-3 h-3 shrink-0" />
            <span>Automated push alerts queued for 24h & 2h before</span>
          </div>
        </div>

        {/* Done Button */}
        <button
          onClick={handleDone}
          className="w-full py-3 px-4 bg-white text-[#882455] hover:bg-rose-50 font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-black/20 active:scale-[0.98] transition-all"
        >
          View in Schedule
        </button>
      </div>
    </div>
  );
};
