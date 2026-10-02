import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Users,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Plus,
  Flame,
  Heart,
  Home as HomeIcon,
  Sparkles,
  MessageSquare,
  Award,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const ActivityDetailModal: React.FC = () => {
  const {
    selectedActivityDetail,
    setSelectedActivityDetail,
    logActivitySession,
    addParticipantToActivity,
    updateActivityCurriculumProgress,
    updateServiceProjectStatus,
    setSelectedFacilitatorForBooking,
    setBookingModalOpen,
    facilitators,
    setCurrentTab,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'roster' | 'sessions'>('overview');

  // Form states
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [newPartName, setNewPartName] = useState('');
  const [newPartAge, setNewPartAge] = useState<number | ''>('');
  const [newPartIsFriend, setNewPartIsFriend] = useState(true);
  const [newPartGuardian, setNewPartGuardian] = useState('');

  const [showLogSession, setShowLogSession] = useState(false);
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [sessionAttendees, setSessionAttendees] = useState(selectedActivityDetail?.participantsCount || 10);
  const [sessionTopic, setSessionTopic] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');

  if (!selectedActivityDetail) return null;

  const activity = selectedActivityDetail;
  const facilitator = facilitators.find((f) => f.id === activity.facilitatorId);

  // Curriculum progress percentage if available
  const currentProgress =
    activity.currentUnitOrChapter && activity.totalUnitsOrChapters
      ? Math.round((activity.currentUnitOrChapter / activity.totalUnitsOrChapters) * 100)
      : null;

  const handleAddParticipantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartName.trim()) return;

    addParticipantToActivity(activity.id, {
      name: newPartName.trim(),
      age: newPartAge ? Number(newPartAge) : undefined,
      isFriendOfFaith: newPartIsFriend,
      guardianName: newPartGuardian.trim() || undefined,
    });

    setNewPartName('');
    setNewPartAge('');
    setNewPartGuardian('');
    setShowAddParticipant(false);
  };

  const handleLogSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionTopic.trim()) return;

    logActivitySession(activity.id, {
      date: sessionDate,
      attendeesCount: Number(sessionAttendees),
      topicCovered: sessionTopic.trim(),
      notes: sessionNotes.trim() || undefined,
      loggedBy: activity.facilitatorName,
    });

    setSessionTopic('');
    setSessionNotes('');
    setShowLogSession(false);
  };

  const handleScheduleNext = () => {
    setSelectedFacilitatorForBooking(facilitator || null);
    setSelectedActivityDetail(null);
    setBookingModalOpen(true);
  };

  const handleMessage = () => {
    setSelectedActivityDetail(null);
    setCurrentTab('chat');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-rose-50 via-white to-rose-50/50 border-b border-rose-100 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#882455] bg-rose-100/70 px-2 py-0.5 rounded-md">
                {activity.type.replace('_', ' ')}
              </span>
              <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                📍 {activity.neighborhood}
              </span>
            </div>
            <h3 className="text-base font-black text-slate-900 leading-snug">
              {activity.title}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Facilitator: <strong className="text-slate-800">{activity.facilitatorName}</strong>
              {activity.coFacilitator && (
                <span> · Co-facilitator: <strong>{activity.coFacilitator}</strong></span>
              )}
            </p>
          </div>

          <button
            onClick={() => setSelectedActivityDetail(null)}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Detail Tabs */}
        <div className="flex items-center p-1 bg-slate-100/80 mx-5 mt-3 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'overview'
                ? 'bg-white text-[#882455] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Curriculum & Plan
          </button>
          <button
            onClick={() => setActiveTab('roster')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'roster'
                ? 'bg-white text-[#882455] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Roster ({activity.roster?.length || activity.participantsCount})
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'sessions'
                ? 'bg-white text-[#882455] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Session Logs ({activity.sessionLogs?.length || 0})
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* TAB 1: OVERVIEW & CURRICULUM */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Timing & Venue Card */}
              <div className="p-3.5 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-700">
                  <Clock className="w-4 h-4 text-[#882455] shrink-0" />
                  <span className="font-semibold">{activity.meetingDayTime}</span>
                  {activity.frequency && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      ({activity.frequency})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-[#882455] shrink-0" />
                  <span>{activity.location}</span>
                </div>
                {activity.languages && (
                  <div className="text-[10px] text-slate-500 pt-0.5">
                    Languages: <strong className="text-slate-700">{activity.languages.join(', ')}</strong>
                  </div>
                )}
              </div>

              {/* Progress & Chapter Track (if available) */}
              {activity.currentBookOrLesson && (
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                        Curriculum Progress
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
                        {activity.currentBookOrLesson}
                      </h4>
                    </div>
                    {currentProgress !== null && (
                      <span className="text-xs font-black text-[#882455] bg-rose-50 px-2 py-0.5 rounded-full">
                        {currentProgress}% Completed
                      </span>
                    )}
                  </div>

                  {currentProgress !== null && (
                    <div className="space-y-1">
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#882455] to-rose-500 rounded-full transition-all duration-500"
                          style={{ width: `${currentProgress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                        <span>Chapter/Lesson {activity.currentUnitOrChapter}</span>
                        <span>Total: {activity.totalUnitsOrChapters}</span>
                      </div>
                    </div>
                  )}

                  {/* Advance Chapter Quick Button */}
                  {activity.currentUnitOrChapter && activity.totalUnitsOrChapters && (
                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-slate-500 font-medium">Update Chapter:</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            updateActivityCurriculumProgress(
                              activity.id,
                              Math.max(1, (activity.currentUnitOrChapter || 1) - 1)
                            )
                          }
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded font-bold"
                        >
                          -1
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateActivityCurriculumProgress(
                              activity.id,
                              Math.min(
                                activity.totalUnitsOrChapters || 14,
                                (activity.currentUnitOrChapter || 1) + 1
                              )
                            )
                          }
                          className="px-2.5 py-1 bg-[#882455] text-white hover:bg-[#721a44] rounded font-bold"
                        >
                          +1 Completed
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Children's Class: Virtue & Quotation */}
              {activity.virtueOrTheme && (
                <div className="p-3.5 bg-rose-50/40 rounded-2xl border border-rose-100 space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase text-[#882455] tracking-wider block">
                    Virtue & Memorization Focus:
                  </span>
                  <p className="text-xs font-bold text-slate-800">
                    {activity.virtueOrTheme}
                  </p>
                  {activity.memorizationQuote && (
                    <blockquote className="text-[11px] text-slate-600 italic bg-white p-2.5 rounded-xl border border-rose-100/70">
                      {activity.memorizationQuote}
                    </blockquote>
                  )}
                </div>
              )}

              {/* Junior Youth: Service Project Card */}
              {activity.serviceProject && (
                <div className="p-3.5 bg-amber-50/50 rounded-2xl border border-amber-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase text-amber-800 tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Community Service Project
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        activity.serviceProject.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {activity.serviceProject.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h5 className="text-xs font-bold text-slate-900">
                    {activity.serviceProject.title}
                  </h5>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {activity.serviceProject.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-amber-200/50">
                    <span>
                      Hours of service: <strong>{activity.serviceProject.hoursServed || 0} hrs</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateServiceProjectStatus(
                          activity.id,
                          activity.serviceProject?.status === 'completed'
                            ? 'in_progress'
                            : 'completed'
                        )
                      }
                      className="text-[10px] font-bold text-amber-900 hover:underline"
                    >
                      Toggle Status
                    </button>
                  </div>
                </div>
              )}

              {/* Study Circle Practical Component */}
              {activity.practicalComponent && (
                <div className="p-3.5 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-purple-900 tracking-wider block">
                    Practical Service Assignment:
                  </span>
                  <p className="text-[11px] text-purple-950 font-medium leading-relaxed">
                    {activity.practicalComponent}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PARTICIPANTS ROSTER */}
          {activeTab === 'roster' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-tight">
                    Registered Participants ({activity.roster?.length || 0})
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    {activity.friendsOfFaithCount} Friends of the Faith enrolled
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddParticipant(!showAddParticipant)}
                  className="px-2.5 py-1.5 bg-[#882455] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#721a44] flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Soul</span>
                </button>
              </div>

              {/* Add participant form */}
              {showAddParticipant && (
                <form
                  onSubmit={handleAddParticipantSubmit}
                  className="p-3 bg-rose-50/60 rounded-2xl border border-rose-200 space-y-2 text-xs"
                >
                  <span className="font-bold text-[#882455] text-xs block">
                    Register New Participant:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={newPartName}
                      onChange={(e) => setNewPartName(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Age"
                      value={newPartAge}
                      onChange={(e) => setNewPartAge(e.target.value ? Number(e.target.value) : '')}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Guardian / Parent Name"
                      value={newPartGuardian}
                      onChange={(e) => setNewPartGuardian(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl"
                    />
                    <label className="flex items-center gap-2 px-2 text-[11px] font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={newPartIsFriend}
                        onChange={(e) => setNewPartIsFriend(e.target.checked)}
                        className="rounded text-[#882455]"
                      />
                      <span>Friend of the Faith</span>
                    </label>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddParticipant(false)}
                      className="px-3 py-1 bg-slate-200 rounded-xl text-slate-700 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-[#882455] text-white rounded-xl font-bold"
                    >
                      Enroll in Roster
                    </button>
                  </div>
                </form>
              )}

              {/* Roster list */}
              <div className="space-y-2">
                {activity.roster?.map((person, idx) => (
                  <div
                    key={person.id}
                    className="p-2.5 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-rose-50 text-[#882455] font-bold text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="truncate">
                        <div className="font-bold text-slate-900 truncate">
                          {person.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {person.age ? `${person.age} yrs` : 'Youth/Adult'}
                          {person.guardianName && ` · Guardian: ${person.guardianName}`}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          person.isFriendOfFaith
                            ? 'bg-rose-50 text-[#882455] border border-rose-100'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {person.isFriendOfFaith ? 'Community Friend' : 'Bahá\'í'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded">
                        {person.attendanceCount} sessions
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SESSION GATHERINGS LOG */}
          {activeTab === 'sessions' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-tight">
                    Recorded Gatherings
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Attendance and lesson records
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowLogSession(!showLogSession)}
                  className="px-2.5 py-1.5 bg-[#882455] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#721a44] flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Gathering</span>
                </button>
              </div>

              {/* Log new session form */}
              {showLogSession && (
                <form
                  onSubmit={handleLogSessionSubmit}
                  className="p-3 bg-rose-50/60 rounded-2xl border border-rose-200 space-y-2 text-xs"
                >
                  <span className="font-bold text-[#882455] text-xs block">
                    Record Gathering Details:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={sessionDate}
                      onChange={(e) => setSessionDate(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Attendees Count"
                      value={sessionAttendees}
                      onChange={(e) => setSessionAttendees(Number(e.target.value))}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl"
                      required
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Topic / Lesson Covered (e.g. Chapter 7: The Power of the Word)"
                    value={sessionTopic}
                    onChange={(e) => setSessionTopic(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl"
                    required
                  />
                  <textarea
                    rows={2}
                    placeholder="Notes, prayer reflections, community service updates..."
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl"
                  />
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowLogSession(false)}
                      className="px-3 py-1 bg-slate-200 rounded-xl text-slate-700 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-[#882455] text-white rounded-xl font-bold"
                    >
                      Save Session Log
                    </button>
                  </div>
                </form>
              )}

              {/* Logs history list */}
              <div className="space-y-2">
                {activity.sessionLogs?.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-white rounded-2xl border border-slate-200/80 space-y-1 shadow-2xs"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-extrabold text-slate-900">
                        {log.date}
                      </span>
                      <span className="font-bold text-[#882455] bg-rose-50 px-2 py-0.5 rounded-full">
                        👥 {log.attendeesCount} Souls
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800">
                      {log.topicCovered}
                    </p>
                    {log.notes && (
                      <p className="text-[11px] text-slate-500 italic">
                        "{log.notes}"
                      </p>
                    )}
                    <span className="text-[9px] text-slate-400 block pt-0.5">
                      Logged by {log.loggedBy}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
          <button
            type="button"
            onClick={handleMessage}
            className="flex-1 py-2.5 px-3 bg-white hover:bg-rose-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-[#882455]" />
            <span>Chat Facilitator</span>
          </button>
          <button
            type="button"
            onClick={handleScheduleNext}
            className="flex-1 py-2.5 px-3 bg-[#882455] hover:bg-[#721a44] text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
