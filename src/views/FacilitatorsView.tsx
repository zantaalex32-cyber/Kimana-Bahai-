import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Facilitator, CoreActivity, CoreActivityType } from '../types';
import {
  Search,
  Filter,
  Heart,
  MessageSquare,
  Calendar,
  Award,
  Sparkles,
  BookOpen,
  Plus,
  Users,
  ChevronRight,
  Flame,
  Clock,
  MapPin,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import { NewActivityModal } from '../components/NewActivityModal';
import { NewFacilitatorModal } from '../components/NewFacilitatorModal';

export const FacilitatorsView: React.FC = () => {
  const {
    facilitators,
    coreActivities,
    selectedNeighborhood,
    setSelectedNeighborhood,
    neighborhoods,
    favoriteFacilitatorIds,
    toggleFavoriteFacilitator,
    setSelectedFacilitatorForBooking,
    setBookingModalOpen,
    setCurrentTab,
    selectedActivityType,
    setSelectedActivityType,
    setSelectedActivityDetail,
    searchQuery,
  } = useApp();

  const [roleFilter, setRoleFilter] = useState<'all' | 'animator' | 'teacher' | 'tutor' | 'coordinator'>('all');
  const [showNewActivityModal, setShowNewActivityModal] = useState(false);
  const [showNewFacilitatorModal, setShowNewFacilitatorModal] = useState(false);
  const [activeTabSection, setActiveTabSection] = useState<'activities' | 'facilitators' | 'matrix'>('activities');

  // Filter facilitators
  const filteredFacilitators = facilitators.filter((fac) => {
    const matchesNeighborhood =
      selectedNeighborhood === 'all' || fac.primaryNeighborhood === selectedNeighborhood;

    let matchesRole = true;
    if (roleFilter === 'animator') matchesRole = fac.role.toLowerCase().includes('animator');
    if (roleFilter === 'teacher') matchesRole = fac.role.toLowerCase().includes('teacher');
    if (roleFilter === 'tutor') matchesRole = fac.role.toLowerCase().includes('tutor');
    if (roleFilter === 'coordinator') matchesRole = fac.role.toLowerCase().includes('coordinator');

    const matchesSearch =
      searchQuery === '' ||
      fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fac.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fac.primaryNeighborhood.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesNeighborhood && matchesRole && matchesSearch;
  });

  // Filter core activities
  const filteredActivities = coreActivities.filter((act) => {
    const matchesNeighborhood =
      selectedNeighborhood === 'all' || act.neighborhood === selectedNeighborhood;
    const matchesType =
      selectedActivityType === 'all' || act.type === selectedActivityType;

    const matchesSearch =
      searchQuery === '' ||
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.facilitatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (act.currentBookOrLesson && act.currentBookOrLesson.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesNeighborhood && matchesType && matchesSearch;
  });

  const handleBook = (fac: Facilitator) => {
    setSelectedFacilitatorForBooking(fac);
    setBookingModalOpen(true);
  };

  const handleChat = (fac: Facilitator) => {
    setCurrentTab('chat');
  };

  // Activity type icon helper
  const getActivityIcon = (type: CoreActivityType) => {
    switch (type) {
      case 'junior_youth':
        return <Flame className="w-4 h-4 text-[#882455]" />;
      case 'children_class':
        return <Users className="w-4 h-4 text-emerald-600" />;
      case 'study_circle':
        return <BookOpen className="w-4 h-4 text-purple-700" />;
      case 'devotional':
        return <Heart className="w-4 h-4 text-rose-500" />;
      case 'youth_service':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      default:
        return <Award className="w-4 h-4 text-slate-600" />;
    }
  };

  // Aggregate stats
  const totalParticipants = coreActivities.reduce((acc, a) => acc + a.participantsCount, 0);
  const totalFriends = coreActivities.reduce((acc, a) => acc + a.friendsOfFaithCount, 0);
  const friendPercentage = totalParticipants > 0 ? Math.round((totalFriends / totalParticipants) * 100) : 0;
  const totalCC = coreActivities.filter((a) => a.type === 'children_class').length;
  const totalJY = coreActivities.filter((a) => a.type === 'junior_youth').length;
  const totalSC = coreActivities.filter((a) => a.type === 'study_circle').length;
  const totalDev = coreActivities.filter((a) => a.type === 'devotional').length;

  return (
    <div className="space-y-4 px-4 pb-12">
      {/* 3 Main View Sections: Core Activities Tracker | Facilitator Directory | Statistical Matrix */}
      <div className="pt-2">
        <div className="flex items-center p-1 bg-rose-50/80 rounded-2xl border border-rose-100">
          <button
            onClick={() => setActiveTabSection('activities')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTabSection === 'activities'
                ? 'bg-[#882455] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Activities ({coreActivities.length})
          </button>
          <button
            onClick={() => setActiveTabSection('facilitators')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTabSection === 'facilitators'
                ? 'bg-[#882455] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Facilitators ({facilitators.length})
          </button>
          <button
            onClick={() => setActiveTabSection('matrix')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTabSection === 'matrix'
                ? 'bg-[#882455] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Statistical Form
          </button>
        </div>
      </div>

      {/* 1. ALL CORE ACTIVITIES TRACKER */}
      {activeTabSection === 'activities' && (
        <div className="space-y-3">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 text-center bg-white p-3 rounded-2xl border border-rose-100 shadow-2xs">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Groups</span>
              <span className="text-base font-black text-slate-900">{coreActivities.length}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Souls Enrolled</span>
              <span className="text-base font-black text-[#882455]">{totalParticipants}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Community Friends</span>
              <span className="text-base font-black text-emerald-600">{friendPercentage}%</span>
            </div>
          </div>

          {/* Activity Type Filters + Register Button */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
            <div className="flex items-center gap-1.5 scrollbar-none text-xs">
              {[
                { id: 'all', label: 'All Activities' },
                { id: 'children_class', label: "Children's Classes" },
                { id: 'junior_youth', label: 'Junior Youth' },
                { id: 'study_circle', label: 'Study Circles' },
                { id: 'devotional', label: 'Devotionals' },
                { id: 'home_visit', label: 'Home Visits' },
                { id: 'youth_service', label: 'Youth Service' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedActivityType(tab.id)}
                  className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                    selectedActivityType === tab.id
                      ? 'bg-[#882455] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-rose-50/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowNewActivityModal(true)}
              className="shrink-0 px-3 py-1.5 bg-[#882455] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#721a44] flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
          </div>

          {/* Activities List */}
          <div className="space-y-3">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200 p-6">
                <BookOpen className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-700">No activities match your filters</p>
                <p className="text-[11px] text-slate-400 mt-1">Tap "Register" to create a new core activity group.</p>
              </div>
            ) : (
              filteredActivities.map((act) => {
                const progressPct =
                  act.currentUnitOrChapter && act.totalUnitsOrChapters
                    ? Math.round((act.currentUnitOrChapter / act.totalUnitsOrChapters) * 100)
                    : null;

                return (
                  <div
                    key={act.id}
                    onClick={() => setSelectedActivityDetail(act)}
                    className="bg-white p-4 rounded-3xl border border-rose-100 shadow-2xs hover:shadow-md hover:border-[#882455]/40 transition-all space-y-3 cursor-pointer group"
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div className="w-9 h-9 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#882455] group-hover:text-white transition-colors">
                          {getActivityIcon(act.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-extrabold uppercase text-[#882455] bg-rose-50 px-2 py-0.5 rounded">
                              {act.type.replace('_', ' ')}
                            </span>
                            {act.gradeLevel && (
                              <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                                {act.gradeLevel}
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-[#882455] transition-colors mt-0.5">
                            {act.title}
                          </h4>
                        </div>
                      </div>

                      <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-xl shrink-0">
                        📍 {act.neighborhood}
                      </span>
                    </div>

                    {/* Curriculum / Virtue / Service snippet */}
                    {act.currentBookOrLesson && (
                      <div className="bg-slate-50 p-2.5 rounded-2xl space-y-1.5 border border-slate-100">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600 font-medium truncate max-w-[220px]">
                            Curriculum: <strong>{act.currentBookOrLesson}</strong>
                          </span>
                          {progressPct !== null && (
                            <span className="text-[10px] font-black text-[#882455]">
                              Ch. {act.currentUnitOrChapter}/{act.totalUnitsOrChapters} ({progressPct}%)
                            </span>
                          )}
                        </div>

                        {progressPct !== null && (
                          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-[#882455] h-full rounded-full transition-all duration-500"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {act.virtueOrTheme && (
                      <p className="text-[11px] text-slate-600 italic pl-1">
                        Virtue / Theme: "{act.virtueOrTheme}"
                      </p>
                    )}

                    {act.serviceProject && (
                      <div className="text-[10px] text-amber-800 font-semibold bg-amber-50/70 p-2 rounded-xl flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">Service: {act.serviceProject.title}</span>
                      </div>
                    )}

                    {/* Facilitator & Gatherings info */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Facilitator</span>
                        <span className="font-semibold text-slate-800 truncate block">
                          {act.facilitatorName}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Gathering Time</span>
                        <span className="font-semibold text-slate-800 truncate block">
                          {act.meetingDayTime}
                        </span>
                      </div>
                    </div>

                    {/* Bottom strip */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-[11px] text-slate-500 font-semibold">
                        👥 <strong>{act.participantsCount}</strong> Souls ({act.friendsOfFaithCount} Community Friends)
                      </span>
                      <span className="text-xs font-bold text-[#882455] flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                        Inspect & Log
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 2. FACILITATORS DIRECTORY */}
      {activeTabSection === 'facilitators' && (
        <div className="space-y-3">
          {/* Role Filter Chips & Add Button */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
            <div className="flex items-center gap-1.5 scrollbar-none text-xs">
              {[
                { id: 'all', label: 'All Roles' },
                { id: 'animator', label: 'JY Animators' },
                { id: 'tutor', label: 'Ruhi Tutors' },
                { id: 'teacher', label: "Children's Teachers" },
                { id: 'coordinator', label: 'Coordinators' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setRoleFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                    roleFilter === tab.id
                      ? 'bg-[#882455] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-rose-50/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowNewFacilitatorModal(true)}
              className="shrink-0 px-3 py-1.5 bg-[#882455] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#721a44] flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Facilitator</span>
            </button>
          </div>

          <div className="space-y-3">
            {filteredFacilitators.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-rose-200 p-6 space-y-2">
                <Users className="w-8 h-8 text-[#882455]/50 mx-auto" />
                <h4 className="text-xs font-bold text-slate-800">
                  No facilitators found
                </h4>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Add local animators, children's teachers, Ruhi tutors, or devotional hosts to coordinate accompaniment.
                </p>
                <button
                  onClick={() => setShowNewFacilitatorModal(true)}
                  className="mt-1 px-4 py-2 bg-[#882455] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#721a44] inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register First Facilitator</span>
                </button>
              </div>
            ) : (
              filteredFacilitators.map((fac) => {
              const isFav = favoriteFacilitatorIds.includes(fac.id);
              return (
                <div
                  key={fac.id}
                  className="bg-white p-4 rounded-3xl border border-rose-100 shadow-2xs hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="relative shrink-0">
                      <img
                        src={fac.avatarUrl}
                        alt={fac.name}
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-rose-50 shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                      {fac.isAvailableForChat && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-extrabold text-slate-900 truncate">
                          {fac.name}
                        </h4>
                        <button
                          onClick={() => toggleFavoriteFacilitator(fac.id)}
                          className={`p-1 ${
                            isFav ? 'text-[#882455]' : 'text-slate-300 hover:text-slate-500'
                          }`}
                        >
                          <Heart className={`w-4.5 h-4.5 ${isFav ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      <p className="text-xs font-semibold text-[#882455] truncate mt-0.5">
                        {fac.role}
                      </p>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                        <span>📍 {fac.primaryNeighborhood}</span>
                        <span>·</span>
                        <span className="font-bold text-amber-600">★ {fac.rating} Accompaniment</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100/70">
                    {fac.bio}
                  </p>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Ruhi Institute Completed:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {fac.instituteCompleted.map((book) => (
                        <span
                          key={book}
                          className="text-[10px] font-semibold bg-rose-50 text-[#882455] border border-rose-100 px-2 py-0.5 rounded-md"
                        >
                          {book}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleChat(fac)}
                      className="flex-1 py-2 px-3 bg-rose-50 hover:bg-rose-100 text-[#882455] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Coordinate
                    </button>
                    <button
                      onClick={() => handleBook(fac)}
                      className="flex-1 py-2 px-3 bg-[#882455] hover:bg-[#721a44] text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Schedule Milestone
                    </button>
                  </div>
                </div>
              );
            }))}
          </div>
        </div>
      )}

      {/* 3. CLUSTER STATISTICAL RECORD FORM (SRF) MATRIX */}
      {activeTabSection === 'matrix' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-tight">
                Statistical Record Form (Kimana SRF)
              </h4>
              <p className="text-[10px] text-slate-400">
                Official cluster quarterly reporting matrix
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#882455]" />
              <span>Print / Export</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-rose-100 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-rose-50/80 text-[#882455] font-extrabold text-[10px] uppercase tracking-wider border-b border-rose-100">
                  <tr>
                    <th className="py-2.5 px-3">Neighborhood</th>
                    <th className="py-2.5 px-2 text-center">CC</th>
                    <th className="py-2.5 px-2 text-center">JY</th>
                    <th className="py-2.5 px-2 text-center">SC</th>
                    <th className="py-2.5 px-2 text-center">Dev</th>
                    <th className="py-2.5 px-3 text-right">Total Souls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {neighborhoods.map((n) => (
                    <tr key={n.id} className="hover:bg-rose-50/20">
                      <td className="py-2 px-3 font-bold text-slate-900">
                        {n.name}
                        <span className="block text-[9px] text-slate-400 font-normal">
                          {n.coordinator}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-center font-semibold">{n.childrenClasses}</td>
                      <td className="py-2 px-2 text-center font-semibold text-[#882455]">{n.juniorYouthGroups}</td>
                      <td className="py-2 px-2 text-center font-semibold">{n.studyCircles}</td>
                      <td className="py-2 px-2 text-center font-semibold">{n.devotionals}</td>
                      <td className="py-2 px-3 text-right font-black text-slate-900">{n.participants}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-black text-slate-900 border-t border-slate-200">
                    <td className="py-2.5 px-3">Cluster Total</td>
                    <td className="py-2.5 px-2 text-center">{totalCC}</td>
                    <td className="py-2.5 px-2 text-center text-[#882455]">{totalJY}</td>
                    <td className="py-2.5 px-2 text-center">{totalSC}</td>
                    <td className="py-2.5 px-2 text-center">{totalDev}</td>
                    <td className="py-2.5 px-3 text-right text-base text-[#882455]">{totalParticipants}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-rose-50/40 text-[10px] text-slate-500 border-t border-rose-100 flex items-center justify-between">
              <span>Kimana Cluster · Milestone 3 Consolidation</span>
              <span className="font-bold text-[#882455]">Cycle 24 Records Verified</span>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showNewActivityModal && (
        <NewActivityModal onClose={() => setShowNewActivityModal(false)} />
      )}
      {showNewFacilitatorModal && (
        <NewFacilitatorModal onClose={() => setShowNewFacilitatorModal(false)} />
      )}
    </div>
  );
};
