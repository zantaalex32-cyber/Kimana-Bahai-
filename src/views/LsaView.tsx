import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LsaMeeting, RegionalInstituteGoal } from '../types';
import {
  Landmark,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Clock3,
  Award,
  Plus,
  BookOpen,
  Users,
  Target,
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { NewLsaMeetingModal } from '../components/NewLsaMeetingModal';

export const LsaView: React.FC = () => {
  const {
    lsaMeetings,
    instituteGoals,
    updateAgendaStatus,
    addLsaResolution,
    updateInstituteGoalProgress,
    triggerPushNotification,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'meetings' | 'institute_goals' | 'resolutions'>('meetings');
  const [showNewMeetingModal, setShowNewMeetingModal] = useState(false);
  const [expandedMeetingId, setExpandedMeetingId] = useState<string | null>(lsaMeetings[0]?.id || null);
  const [newResolutionText, setNewResolutionText] = useState('');
  const [selectedMeetingForResolution, setSelectedMeetingForResolution] = useState(lsaMeetings[0]?.id || '');

  const upcomingMeetings = lsaMeetings.filter((m) => m.status === 'upcoming');
  const nextMeeting = upcomingMeetings[0];

  const handleAddResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResolutionText.trim() || !selectedMeetingForResolution) return;
    addLsaResolution(selectedMeetingForResolution, newResolutionText.trim());
    setNewResolutionText('');
  };

  return (
    <div className="space-y-4 px-4 pb-12">
      {/* LSA Header Banner */}
      <div className="pt-2">
        <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 text-white shadow-xl shadow-purple-900/15 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase">
                <Landmark className="w-3.5 h-3.5 text-amber-300" />
                Spiritual Governance
              </div>
              <span className="text-[11px] text-purple-200 font-semibold">
                9 Assembly Members
              </span>
            </div>

            <h2 className="text-lg font-black tracking-tight mt-2 text-white">
              Local Spiritual Assembly of Kimana
            </h2>
            <p className="text-xs text-purple-100/90 mt-1 leading-relaxed">
              Consultation chamber, meeting planning, and tracking benchmarks for the Regional Bahá'í Training Institute.
            </p>

            <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-xs text-purple-100">
              <span>
                Next Meeting: <strong>{nextMeeting ? `${nextMeeting.meetingNumber} (${nextMeeting.date})` : 'Not scheduled'}</strong>
              </span>
              <span className="text-emerald-300 font-bold bg-white/10 px-2 py-0.5 rounded-full text-[10px]">
                {nextMeeting ? `Quorum: ${nextMeeting.attendeesCount}/9` : 'LSA Ready (9 Members)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Section Tabs */}
      <div className="flex items-center p-1 bg-purple-50/80 rounded-2xl border border-purple-100">
        <button
          onClick={() => setActiveTab('meetings')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'meetings'
              ? 'bg-purple-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Meetings ({lsaMeetings.length})
        </button>
        <button
          onClick={() => setActiveTab('institute_goals')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'institute_goals'
              ? 'bg-purple-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Institute Goals ({instituteGoals.length})
        </button>
        <button
          onClick={() => setActiveTab('resolutions')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'resolutions'
              ? 'bg-purple-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Resolutions Log
        </button>
      </div>

      {/* 1. MEETINGS SECTION */}
      {activeTab === 'meetings' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900 tracking-tight uppercase">
              Assembly Meetings & Agendas
            </h3>
            <button
              onClick={() => setShowNewMeetingModal(true)}
              className="px-3 py-1.5 bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Convene Meeting</span>
            </button>
          </div>

          {lsaMeetings.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-purple-200">
              <Landmark className="w-10 h-10 text-purple-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-800">No Assembly Meetings Convened Yet</p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                Plan and convene your first LSA meeting to consult on neighborhood growth, set agendas, and track quorum.
              </p>
              <button
                onClick={() => setShowNewMeetingModal(true)}
                className="mt-3.5 px-4 py-2 bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Convene Meeting #1</span>
              </button>
            </div>
          ) : (
            lsaMeetings.map((meeting) => {
            const isExpanded = expandedMeetingId === meeting.id;

            return (
              <div
                key={meeting.id}
                className="bg-white rounded-3xl border border-purple-100 shadow-2xs overflow-hidden transition-all"
              >
                {/* Meeting card header */}
                <div
                  onClick={() => setExpandedMeetingId(isExpanded ? null : meeting.id)}
                  className="p-4 cursor-pointer hover:bg-purple-50/30 transition-colors flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-purple-900 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100">
                        {meeting.meetingNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          meeting.status === 'upcoming'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {meeting.status === 'upcoming' ? 'Scheduled' : 'Completed'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-600 pt-1">
                      <span className="flex items-center gap-1 font-semibold text-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-purple-700" />
                        {meeting.date}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {meeting.time}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-purple-700" />
                      <span>{meeting.venue}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Quorum {meeting.attendeesCount}/9
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details: Agenda Items & Resolutions */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-purple-100/70 space-y-3 bg-purple-50/20">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                          Consultative Agenda ({meeting.agendaItems.length} topics)
                        </span>
                        <span className="text-[10px] text-purple-800 font-semibold">
                          Chair: {meeting.chairperson} · Sec: {meeting.secretary}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {meeting.agendaItems.map((item, idx) => (
                          <div
                            key={item.id}
                            className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-1.5"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-[9px] uppercase font-extrabold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                                  {item.category.replace('_', ' ')}
                                </span>
                                <h5 className="text-xs font-bold text-slate-900 mt-1">
                                  {item.title}
                                </h5>
                              </div>

                              {/* Status Toggle Button */}
                              <div className="flex items-center gap-1 shrink-0">
                                {(['pending', 'consulted', 'resolved'] as const).map((st) => (
                                  <button
                                    key={st}
                                    onClick={() => updateAgendaStatus(meeting.id, item.id, st)}
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize transition-colors ${
                                      item.status === st
                                        ? st === 'resolved'
                                          ? 'bg-emerald-600 text-white'
                                          : st === 'consulted'
                                          ? 'bg-purple-700 text-white'
                                          : 'bg-amber-500 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                  >
                                    {st}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <p className="text-[11px] text-slate-600 leading-relaxed">
                              {item.description}
                            </p>

                            {item.assignedTo && (
                              <div className="text-[10px] text-slate-500 font-medium">
                                Lead Coordinator: <strong className="text-purple-900">{item.assignedTo}</strong>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resolutions inside meeting */}
                    {meeting.resolutions.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                          Agreed Assembly Resolutions ({meeting.resolutions.length})
                        </span>
                        <div className="space-y-1.5">
                          {meeting.resolutions.map((res, i) => (
                            <div
                              key={i}
                              className="p-2.5 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-xs text-emerald-950 font-medium flex items-start gap-2"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{res}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          }))}
        </div>
      )}

      {/* 2. REGIONAL INSTITUTE GOALS SECTION */}
      {activeTab === 'institute_goals' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 tracking-tight uppercase">
                Regional Training Institute Goals
              </h3>
              <p className="text-[10px] text-slate-500">
                Benchmarks set with the Regional Bahá'í Council for Kimana
              </p>
            </div>
            <span className="text-[11px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full">
              Consolidation Targets
            </span>
          </div>

          <div className="space-y-3">
            {instituteGoals.map((goal) => {
              const progressPct = Math.min(100, Math.round((goal.currentCount / goal.targetCount) * 100));

              return (
                <div
                  key={goal.id}
                  className="bg-white p-4 rounded-3xl border border-purple-100 shadow-2xs space-y-3 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md">
                          {goal.ruhiCourseRelated || 'Institute Pathway'}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            progressPct >= 100
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {progressPct >= 100 ? 'Achieved 🏆' : `${progressPct}% on track`}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900 mt-1">
                        {goal.title}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-lg font-black text-purple-900">
                        {goal.currentCount}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">
                        /{goal.targetCount}
                      </span>
                      <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                        {goal.unit}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {goal.description}
                  </p>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-700 to-[#882455] rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                      <span>Target Date: {goal.deadline}</span>
                      <span>Lead: <strong>{goal.coordinatorLead}</strong></span>
                    </div>
                  </div>

                  {/* Quick increment action button */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">
                      Accompany new candidate into service:
                    </span>
                    <button
                      onClick={() => updateInstituteGoalProgress(goal.id, 1)}
                      className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+1 Trained</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. RESOLUTIONS ARCHIVE */}
      {activeTab === 'resolutions' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900 tracking-tight uppercase">
              Official Assembly Resolutions Log
            </h3>
            <span className="text-[11px] text-slate-500">Recorded for Kimana</span>
          </div>

          {/* Add new resolution box */}
          <form
            onSubmit={handleAddResolution}
            className="p-3.5 bg-purple-50/60 border border-purple-100 rounded-3xl space-y-2.5 text-xs"
          >
            <span className="font-bold text-purple-900 text-xs block">
              Record Consulted Resolution:
            </span>
            <textarea
              rows={2}
              placeholder="e.g., Resolved that the Assembly allocates 20,000 KES to support Ruhi Book 3 teacher trainings..."
              value={newResolutionText}
              onChange={(e) => setNewResolutionText(e.target.value)}
              className="w-full p-2.5 bg-white border border-purple-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-700/20"
              required
            />
            <div className="flex items-center justify-between">
              <select
                value={selectedMeetingForResolution}
                onChange={(e) => setSelectedMeetingForResolution(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-purple-200 rounded-xl text-xs font-medium"
              >
                {lsaMeetings.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.meetingNumber} ({m.date})
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="px-4 py-1.5 bg-purple-800 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-purple-900"
              >
                Save Resolution
              </button>
            </div>
          </form>

          {/* Resolutions list */}
          <div className="space-y-2.5">
            {lsaMeetings.flatMap((m) => m.resolutions).length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-purple-200">
                <FileText className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No Resolutions Recorded Yet</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                  {lsaMeetings.length === 0
                    ? 'Convene an LSA meeting first to record agreed resolutions and decisions.'
                    : 'Use the form above to record an official assembly resolution for this cycle.'}
                </p>
              </div>
            ) : (
              lsaMeetings.flatMap((m) =>
                m.resolutions.map((res, idx) => (
                  <div
                    key={`${m.id}-${idx}`}
                    className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded">
                        {m.meetingNumber}
                      </span>
                      <span>Date: {m.date}</span>
                    </div>
                    <p className="text-xs text-slate-800 font-medium leading-relaxed pt-1">
                      "{res}"
                    </p>
                  </div>
                ))
              )
            )}
          </div>
        </div>
      )}

      {/* New Meeting Modal */}
      {showNewMeetingModal && (
        <NewLsaMeetingModal onClose={() => setShowNewMeetingModal(false)} />
      )}
    </div>
  );
};
