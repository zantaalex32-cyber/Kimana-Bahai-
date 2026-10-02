import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Facilitator, CoreActivityType } from '../types';
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
} from 'lucide-react';
import { NewActivityModal } from '../components/NewActivityModal';

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
  } = useApp();

  const [roleFilter, setRoleFilter] = useState<'all' | 'animator' | 'teacher' | 'tutor' | 'coordinator'>('all');
  const [showNewActivityModal, setShowNewActivityModal] = useState(false);
  const [activeTabSection, setActiveTabSection] = useState<'facilitators' | 'activities'>('facilitators');

  // Filter facilitators
  const filteredFacilitators = facilitators.filter((fac) => {
    const matchesNeighborhood =
      selectedNeighborhood === 'all' || fac.primaryNeighborhood === selectedNeighborhood;

    let matchesRole = true;
    if (roleFilter === 'animator') matchesRole = fac.role.toLowerCase().includes('animator');
    if (roleFilter === 'teacher') matchesRole = fac.role.toLowerCase().includes('teacher');
    if (roleFilter === 'tutor') matchesRole = fac.role.toLowerCase().includes('tutor');
    if (roleFilter === 'coordinator') matchesRole = fac.role.toLowerCase().includes('coordinator');

    return matchesNeighborhood && matchesRole;
  });

  // Filter core activities
  const filteredActivities = coreActivities.filter((act) => {
    const matchesNeighborhood =
      selectedNeighborhood === 'all' || act.neighborhood === selectedNeighborhood;
    const matchesType =
      selectedActivityType === 'all' || act.type === selectedActivityType;
    return matchesNeighborhood && matchesType;
  });

  const handleBook = (fac: Facilitator) => {
    setSelectedFacilitatorForBooking(fac);
    setBookingModalOpen(true);
  };

  const handleChat = (fac: Facilitator) => {
    setCurrentTab('chat');
  };

  return (
    <div className="space-y-4 px-4 pb-8">
      {/* Top Segmented Tabs: Facilitators Directory vs Active Core Activities */}
      <div className="pt-2">
        <div className="flex items-center p-1 bg-rose-50/80 rounded-2xl border border-rose-100">
          <button
            onClick={() => setActiveTabSection('facilitators')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTabSection === 'facilitators'
                ? 'bg-[#882455] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Facilitators & Tutors ({facilitators.length})
          </button>
          <button
            onClick={() => setActiveTabSection('activities')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTabSection === 'activities'
                ? 'bg-[#882455] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Groups ({coreActivities.length})
          </button>
        </div>
      </div>

      {/* Role Filter Chips */}
      {activeTabSection === 'facilitators' && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
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
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-rose-50/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Active Activities Type Filter */}
      {activeTabSection === 'activities' && (
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5 scrollbar-none text-xs">
            {[
              { id: 'all', label: 'All Activities' },
              { id: 'junior_youth', label: 'Junior Youth' },
              { id: 'children_class', label: "Children's Class" },
              { id: 'study_circle', label: 'Study Circles' },
              { id: 'devotional', label: 'Devotionals' },
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
            className="shrink-0 px-3 py-1.5 bg-[#882455] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#701c44] flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Group</span>
          </button>
        </div>
      )}

      {/* Facilitators List Section */}
      {activeTabSection === 'facilitators' && (
        <div className="space-y-3">
          {filteredFacilitators.map((fac) => {
            const isFav = favoriteFacilitatorIds.includes(fac.id);
            return (
              <div
                key={fac.id}
                className="bg-white p-4 rounded-3xl border border-rose-100 shadow-2xs hover:shadow-md transition-all space-y-3"
              >
                {/* Header row */}
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

                {/* Bio text */}
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100/70">
                  {fac.bio}
                </p>

                {/* Institute Training Badges */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Ruhi Institute Path of Service:
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

                {/* Bottom Action Buttons matching template */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleChat(fac)}
                    className="flex-1 py-2 px-3 bg-rose-50 hover:bg-rose-100/70 text-[#882455] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Coordinate Chat
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
          })}
        </div>
      )}

      {/* Active Core Activities List Section */}
      {activeTabSection === 'activities' && (
        <div className="space-y-3">
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              className="bg-white p-4 rounded-3xl border border-rose-100 shadow-2xs hover:border-[#882455]/40 transition-all space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#882455] bg-rose-50 px-2 py-0.5 rounded-full inline-block mb-1">
                    {act.type.replace('_', ' ')}
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    {act.title}
                  </h4>
                </div>
                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-xl">
                  {act.neighborhood}
                </span>
              </div>

              {act.currentBookOrLesson && (
                <div className="text-xs text-slate-700 font-medium flex items-center gap-1.5 bg-rose-50/50 p-2 rounded-xl">
                  <BookOpen className="w-3.5 h-3.5 text-[#882455] shrink-0" />
                  <span>Curriculum: <strong>{act.currentBookOrLesson}</strong></span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                <div>
                  <span className="text-slate-400 text-[10px] block">Facilitator / Tutor</span>
                  <span className="font-semibold text-slate-800">{act.facilitatorName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Weekly Gathering</span>
                  <span className="font-semibold text-slate-800">{act.meetingDayTime}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                <span className="text-slate-500 font-medium">
                  👥 <strong>{act.participantsCount}</strong> Souls ({act.friendsOfFaithCount} Friends of the Faith)
                </span>
                <button
                  onClick={() => {
                    const fac = facilitators.find((f) => f.id === act.facilitatorId) || facilitators[0];
                    handleBook(fac);
                  }}
                  className="px-3 py-1 bg-[#882455] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#721a44]"
                >
                  Schedule Session
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Activity Modal */}
      {showNewActivityModal && (
        <NewActivityModal onClose={() => setShowNewActivityModal(false)} />
      )}
    </div>
  );
};
