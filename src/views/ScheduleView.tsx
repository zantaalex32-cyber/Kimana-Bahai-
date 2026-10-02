import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ScheduledSession } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  Plus,
  Bell,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

export const ScheduleView: React.FC = () => {
  const {
    scheduledSessions,
    updateSessionStatus,
    setBookingModalOpen,
    facilitators,
    setSelectedFacilitatorForBooking,
    triggerPushNotification,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'scheduled' | 'completed' | 'cancelled'>('scheduled');

  const filteredSessions = scheduledSessions.filter((s) => s.status === activeTab);

  const handleCreateNew = () => {
    setSelectedFacilitatorForBooking(facilitators.length > 0 ? facilitators[0] : null);
    setBookingModalOpen(true);
  };

  const handleMarkComplete = (id: string, title: string) => {
    updateSessionStatus(id, 'completed');
  };

  const handleCancel = (id: string, title: string) => {
    updateSessionStatus(id, 'cancelled');
    triggerPushNotification(
      'Session Cancelled ⚠️',
      `"${title}" was moved to Cancelled. Schedule slots reopened for Kimana cluster coordinators.`,
      'reminder'
    );
  };

  const handleReschedule = (session: ScheduledSession) => {
    const fac = facilitators.find((f) => f.id === session.facilitatorId);
    setSelectedFacilitatorForBooking(fac || null);
    setBookingModalOpen(true);
  };

  return (
    <div className="space-y-4 px-4 pb-10">
      {/* Top Header & Fast Action */}
      <div className="pt-2 flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            Activity Schedule & Milestones
          </h2>
          <p className="text-[11px] text-slate-500 font-medium">
            Automated notifications & conflict-free scheduling
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-3.5 py-2 bg-[#882455] text-white font-bold text-xs rounded-2xl shadow-sm hover:bg-[#721a44] active:scale-95 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Session</span>
        </button>
      </div>

      {/* 3 Tabs matching the exact template design: [Schedule] [Complete] [Cancel] */}
      <div className="flex items-center p-1 bg-rose-50/80 rounded-2xl border border-rose-100">
        <button
          onClick={() => setActiveTab('scheduled')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'scheduled'
              ? 'bg-[#882455] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Scheduled ({scheduledSessions.filter((s) => s.status === 'scheduled').length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'completed'
              ? 'bg-[#882455] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Complete ({scheduledSessions.filter((s) => s.status === 'completed').length})
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'cancelled'
              ? 'bg-[#882455] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Cancelled ({scheduledSessions.filter((s) => s.status === 'cancelled').length})
        </button>
      </div>

      {/* Automated Scheduling Feature Banner */}
      <div className="p-3 bg-gradient-to-r from-rose-50 to-white rounded-2xl border border-rose-100 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-[#882455]/10 text-[#882455] flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1 text-[11px] leading-tight">
          <span className="font-bold text-slate-800">Automated Push Reminders Active</span>
          <p className="text-slate-500 text-[10px] mt-0.5">
            Participants & facilitators receive automated reminders 24h and 2h before gathering times.
          </p>
        </div>
      </div>

      {/* Appointment Cards List matching template design */}
      <div className="space-y-3">
        {filteredSessions.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-slate-200">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">No {activeTab} sessions found</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Tap "New Session" to schedule a community gathering or milestone.
            </p>
          </div>
        ) : (
          filteredSessions.map((session) => {
            const fac = facilitators.find((f) => f.id === session.facilitatorId);

            return (
              <div
                key={session.id}
                className="bg-white rounded-3xl p-4 border border-rose-100 shadow-2xs hover:shadow-md transition-all space-y-3"
              >
                {/* Header row with avatar and title */}
                <div className="flex items-start gap-3.5">
                  <img
                    src={
                      fac?.avatarUrl ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                    }
                    alt={session.facilitatorName}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-rose-50 shadow-2xs shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-slate-900 truncate">
                        {session.facilitatorName}
                      </h4>
                      <span className="text-[10px] font-bold text-[#882455] bg-rose-50 px-2 py-0.5 rounded-full">
                        {session.neighborhood}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-800 line-clamp-1 mt-0.5">
                      {session.title}
                    </p>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{session.date} · {session.time}</span>
                    </div>
                  </div>
                </div>

                {/* Venue and Notes */}
                <div className="bg-slate-50 p-2.5 rounded-2xl text-[11px] space-y-1 border border-slate-100/70">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-[#882455] shrink-0" />
                    <span className="font-semibold truncate">{session.venue}</span>
                  </div>
                  {session.notes && (
                    <p className="text-slate-500 italic pl-5 line-clamp-2">
                      "{session.notes}"
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pl-5 pt-0.5">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span>Expected: {session.participantsExpected} participants</span>
                  </div>
                </div>

                {/* Action buttons matching template (Cancel vs Reschedule/Complete) */}
                <div className="pt-1 flex items-center justify-between gap-2.5">
                  {activeTab === 'scheduled' && (
                    <>
                      <button
                        onClick={() => handleCancel(session.id, session.title)}
                        className="flex-1 py-2 px-3 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-bold text-xs rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleMarkComplete(session.id, session.title)}
                        className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Mark Complete
                      </button>
                      <button
                        onClick={() => handleReschedule(session)}
                        className="flex-1 py-2 px-3 bg-[#882455] hover:bg-[#701c44] text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                      >
                        Reschedule
                      </button>
                    </>
                  )}

                  {activeTab === 'completed' && (
                    <div className="w-full flex items-center justify-between text-xs text-emerald-700 font-bold bg-emerald-50 p-2 rounded-xl">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" />
                        Completed & Logged in Growth Cycle Records
                      </span>
                      <button
                        onClick={() => updateSessionStatus(session.id, 'scheduled')}
                        className="text-[10px] text-slate-500 hover:text-slate-800 font-semibold underline"
                      >
                        Reopen
                      </button>
                    </div>
                  )}

                  {activeTab === 'cancelled' && (
                    <div className="w-full flex items-center justify-between text-xs text-rose-700 font-bold bg-rose-50 p-2 rounded-xl">
                      <span className="flex items-center gap-1.5">
                        <XCircle className="w-4 h-4" />
                        Cancelled
                      </span>
                      <button
                        onClick={() => updateSessionStatus(session.id, 'scheduled')}
                        className="text-[10px] text-slate-600 hover:text-slate-900 font-semibold underline"
                      >
                        Restore Session
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
