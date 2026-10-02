import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CoreActivityType } from '../types';
import {
  Sparkles,
  Users,
  BookOpen,
  Heart,
  Home as HomeIcon,
  Flame,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  Award,
  ChevronRight,
  Plus,
  UserPlus,
} from 'lucide-react';
import { ClusterLogo } from '../components/ClusterLogo';
import { PWAInstallButton } from '../components/PWAInstallButton';
import { NewFacilitatorModal } from '../components/NewFacilitatorModal';
import { NewActivityModal } from '../components/NewActivityModal';

export const HomeView: React.FC = () => {
  const {
    neighborhoods,
    facilitators,
    coreActivities,
    growthCycle,
    scheduledSessions,
    setCurrentTab,
    setSelectedFacilitatorForBooking,
    setBookingModalOpen,
    favoriteFacilitatorIds,
    toggleFavoriteFacilitator,
    selectedNeighborhood,
    setSelectedNeighborhood,
    setSelectedActivityType,
    searchQuery,
  } = useApp();

  const [showAddFacilitatorModal, setShowAddFacilitatorModal] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);

  // Dynamic activity counts
  const jyCount = coreActivities.filter((a) => a.type === 'junior_youth').length;
  const ccCount = coreActivities.filter((a) => a.type === 'children_class').length;
  const scCount = coreActivities.filter((a) => a.type === 'study_circle').length;
  const devCount = coreActivities.filter((a) => a.type === 'devotional').length;
  const hvCount = coreActivities.filter((a) => a.type === 'home_visit').length;
  const ysCount = coreActivities.filter((a) => a.type === 'youth_service').length;

  // Core Activity Categories (matching the 6 category cards in the UI template)
  const categories = [
    {
      type: 'junior_youth',
      title: 'Junior Youth',
      subtitle: 'Ages 11-14 Spiritual Empowerment',
      icon: Flame,
      color: 'bg-rose-50 text-[#882455] border-rose-100',
      count: `${jyCount} Groups`,
    },
    {
      type: 'children_class',
      title: "Children's Class",
      subtitle: 'Moral education & virtues',
      icon: Users,
      color: 'bg-rose-50 text-[#882455] border-rose-100',
      count: `${ccCount} Classes`,
    },
    {
      type: 'study_circle',
      title: 'Study Circles',
      subtitle: 'Ruhi Institute Books 1-14',
      icon: BookOpen,
      color: 'bg-rose-50 text-[#882455] border-rose-100',
      count: `${scCount} Circles`,
    },
    {
      type: 'devotional',
      title: 'Devotionals',
      subtitle: 'Neighborhood prayer meetings',
      icon: Heart,
      color: 'bg-rose-50 text-[#882455] border-rose-100',
      count: `${devCount} Gatherings`,
    },
    {
      type: 'home_visit',
      title: 'Home Visits',
      subtitle: 'Systematic deepening & outreach',
      icon: HomeIcon,
      color: 'bg-rose-50 text-[#882455] border-rose-100',
      count: `${hvCount} Visits`,
    },
    {
      type: 'youth_service',
      title: 'Youth Service',
      subtitle: 'Social action & community projects',
      icon: Sparkles,
      color: 'bg-rose-50 text-[#882455] border-rose-100',
      count: `${ysCount} Projects`,
    },
  ];

  // Filter facilitators by neighborhood and search
  const filteredFacilitators = facilitators.filter((fac) => {
    const matchesNeighborhood =
      selectedNeighborhood === 'all' || fac.primaryNeighborhood === selectedNeighborhood;
    const matchesSearch =
      searchQuery === '' ||
      fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fac.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fac.primaryNeighborhood.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesNeighborhood && matchesSearch;
  });

  const upcomingSessions = scheduledSessions
    .filter((s) => s.status === 'scheduled')
    .slice(0, 3);

  const handleBook = (fac: any) => {
    setSelectedFacilitatorForBooking(fac);
    setBookingModalOpen(true);
  };

  const handleCategoryClick = (catType: string) => {
    setSelectedActivityType(catType);
    setCurrentTab('activities');
  };

  return (
    <div className="space-y-4 pb-6">
      {/* PWA Download Banner for Android on Web */}
      <PWAInstallButton variant="banner" />

      {/* Hero Welcome Banner (Plum/Wine gradient matching template) */}
      <div className="mx-4 p-4 rounded-3xl bg-gradient-to-br from-[#731c44] via-[#882455] to-[#a32d66] text-white shadow-xl shadow-[#882455]/15 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-15 pointer-events-none">
          <ClusterLogo size={160} theme="plum" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Kimana Growth Cycle {growthCycle.cycleNumber}
            </div>
            <span className="text-[11px] text-rose-200 font-semibold">
              {growthCycle.daysRemaining} days left in {growthCycle.currentPhase}
            </span>
          </div>

          <h2 className="text-xl font-black tracking-tight mt-2.5 leading-snug">
            Building Vibrant Communities in Kimana
          </h2>
          <p className="text-xs text-rose-100/90 mt-1 leading-relaxed max-w-[90%]">
            Coordinating core activities, Ruhi institute accompaniment, and neighborhood outreach across 6 zones.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-3.5 pt-3 border-t border-white/20 grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/10 rounded-2xl p-2 backdrop-blur-sm">
              <div className="text-base font-extrabold text-white">
                {coreActivities.length}/{growthCycle.targets.coreActivities}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-rose-200 font-semibold">
                Core Activities
              </div>
            </div>
            <div className="bg-white/10 rounded-2xl p-2 backdrop-blur-sm">
              <div className="text-base font-extrabold text-white">
                {coreActivities.reduce((acc, a) => acc + a.participantsCount, 0)}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-rose-200 font-semibold">
                Souls Reached
              </div>
            </div>
            <div className="bg-white/10 rounded-2xl p-2 backdrop-blur-sm">
              <div className="text-base font-extrabold text-white">
                {growthCycle.actuals.ruhiGraduates}/{growthCycle.targets.ruhiGraduates}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-rose-200 font-semibold">
                Ruhi Tutors
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid (matching the 6 pill cards in the template) */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
            Core Activities
          </h3>
          <button
            onClick={() => setCurrentTab('activities')}
            className="text-xs font-bold text-[#882455] hover:text-[#6a193f] flex items-center gap-0.5"
          >
            See All ({categories.length})
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.type}
                onClick={() => handleCategoryClick(cat.type)}
                className="bg-white p-3 rounded-2xl border border-rose-100 shadow-2xs hover:shadow-md hover:border-[#882455]/40 transition-all flex flex-col items-center text-center group active:scale-95"
              >
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#882455] flex items-center justify-center mb-2 group-hover:bg-[#882455] group-hover:text-white transition-colors shadow-inner">
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-bold text-slate-800 line-clamp-1 group-hover:text-[#882455]">
                  {cat.title}
                </span>
                <span className="text-[9px] text-slate-400 font-medium mt-0.5">
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Facilitators & Coordinators */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Facilitators & Coordinators
            </h3>
            <p className="text-[10px] text-slate-500">
              Accompaniment leads in Kimana neighborhoods
            </p>
          </div>
          <button
            onClick={() => setShowAddFacilitatorModal(true)}
            className="px-2.5 py-1 bg-[#882455] text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs hover:bg-[#721a44]"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {filteredFacilitators.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 text-center border border-dashed border-rose-200 space-y-2">
            <Users className="w-8 h-8 text-[#882455]/50 mx-auto" />
            <h4 className="text-xs font-bold text-slate-800">
              No facilitators registered yet
            </h4>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
              Register your local animators, children's teachers, or Ruhi tutors to start coordinating accompaniment.
            </p>
            <button
              onClick={() => setShowAddFacilitatorModal(true)}
              className="mt-1 px-4 py-2 bg-[#882455] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#721a44] inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register First Facilitator</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredFacilitators.slice(0, 4).map((fac) => {
              const isFav = favoriteFacilitatorIds.includes(fac.id);
              return (
                <div
                  key={fac.id}
                  className="bg-white p-3.5 rounded-2xl border border-rose-100 shadow-2xs hover:shadow-sm transition-all flex items-center gap-3.5"
                >
                  <div className="relative shrink-0">
                    <img
                      src={fac.avatarUrl}
                      alt={fac.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-rose-50 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    {fac.isAvailableForChat && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-slate-900 truncate">
                        {fac.name}
                      </h4>
                      <button
                        onClick={() => toggleFavoriteFacilitator(fac.id)}
                        className={`p-1 transition-colors ${
                          isFav ? 'text-[#882455]' : 'text-slate-300 hover:text-slate-500'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                      {fac.role}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                      <span className="font-semibold text-slate-600">📍 {fac.primaryNeighborhood}</span>
                      <span>·</span>
                      <span className="text-[#882455] font-bold">★ {fac.rating}</span>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                        {fac.upcomingMilestone}
                      </span>
                      <button
                        onClick={() => handleBook(fac)}
                        className="px-3 py-1.5 bg-[#882455] hover:bg-[#701c44] text-white text-[10px] font-bold rounded-xl shadow-xs active:scale-95 transition-all whitespace-nowrap"
                      >
                        Schedule Milestone
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upcoming Scheduled Activity Sessions */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
            Upcoming Milestones
          </h3>
          <button
            onClick={() => setCurrentTab('schedule')}
            className="text-xs font-bold text-[#882455] hover:text-[#6a193f] flex items-center gap-0.5"
          >
            All ({scheduledSessions.length})
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {upcomingSessions.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 text-center border border-dashed border-slate-200 space-y-2">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-xs font-bold text-slate-700">No scheduled sessions</h4>
            <p className="text-[11px] text-slate-400">
              Schedule your first gathering, study circle, or LSA consultation meeting.
            </p>
            <button
              onClick={() => {
                if (facilitators.length > 0) {
                  setSelectedFacilitatorForBooking(facilitators[0]);
                  setBookingModalOpen(true);
                } else {
                  setShowAddFacilitatorModal(true);
                }
              }}
              className="mt-1 px-3 py-1.5 bg-[#882455] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#721a44]"
            >
              + Schedule Milestone
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white p-3.5 rounded-2xl border border-rose-100 shadow-2xs hover:border-[#882455]/30 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#882455] flex items-center justify-center font-bold text-xs shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                        {session.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium">
                        With {session.facilitatorName}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#882455] bg-rose-50 px-2 py-0.5 rounded-full shrink-0">
                    {session.neighborhood}
                  </span>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{session.date} · {session.time}</span>
                  </div>
                  <button
                    onClick={() => setCurrentTab('schedule')}
                    className="font-bold text-[#882455] hover:underline"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LSA & Regional Institute Growth Quick Link */}
      <div className="mx-4 p-4 rounded-2xl bg-rose-50/70 border border-rose-200/70 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-[#882455] shadow-xs flex items-center justify-center font-bold">
            🏛️
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">
              Local Spiritual Assembly (LSA)
            </div>
            <div className="text-[10px] text-slate-600 font-medium">
              Consultation agenda, meeting planning & institute targets
            </div>
          </div>
        </div>
        <button
          onClick={() => setCurrentTab('lsa')}
          className="px-3 py-1.5 bg-[#882455] text-white text-[11px] font-bold rounded-xl shadow-xs hover:bg-[#721a44] transition-colors shrink-0"
        >
          Open LSA
        </button>
      </div>

      {/* Modals */}
      {showAddFacilitatorModal && (
        <NewFacilitatorModal onClose={() => setShowAddFacilitatorModal(false)} />
      )}
      {showAddActivityModal && (
        <NewActivityModal onClose={() => setShowAddActivityModal(false)} />
      )}
    </div>
  );
};
