import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Target,
  Users,
  Compass,
  MapPin,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Flame,
  BookOpen,
  Heart,
  RotateCw,
} from 'lucide-react';
import { ClusterLogo } from '../components/ClusterLogo';

export const DashboardView: React.FC = () => {
  const {
    growthCycle,
    updateGrowthCyclePhase,
    neighborhoods,
    coreActivities,
    facilitators,
  } = useApp();

  const [activeMetricTab, setActiveMetricTab] = useState<'cycles' | 'neighborhoods' | 'institute_pipeline'>('cycles');

  // Real-time calculations from logged core activities
  const liveCoreActivitiesCount = coreActivities.length;
  const liveParticipantsCount = coreActivities.reduce((acc, a) => acc + a.participantsCount, 0);
  const liveJyCount = coreActivities.filter((a) => a.type === 'junior_youth').length;
  const liveJyParticipants = coreActivities
    .filter((a) => a.type === 'junior_youth')
    .reduce((acc, a) => acc + a.participantsCount, 0);
  const liveHomeVisitsCount = coreActivities.filter((a) => a.type === 'home_visit').length;

  const actPct = Math.min(100, Math.round((liveCoreActivitiesCount / (growthCycle.targets.coreActivities || 1)) * 100));
  const partPct = Math.min(100, Math.round((liveParticipantsCount / (growthCycle.targets.participants || 1)) * 100));
  const visitsPct = Math.min(100, Math.round((liveHomeVisitsCount / (growthCycle.targets.homeVisits || 1)) * 100));
  const jyPct = Math.min(100, Math.round((liveJyCount / (growthCycle.targets.jyGroups || 1)) * 100));

  // Ruhi sequence calculated dynamically from registered study circles and facilitators
  const ruhiCourses = [
    { book: 'Ruhi Book 1', name: 'Reflections on the Life of the Spirit', shortKey: 'Book 1' },
    { book: 'Ruhi Book 2', name: 'Arising to Serve (Visiting Homes)', shortKey: 'Book 2' },
    { book: 'Ruhi Book 3', name: "Teaching Children's Classes (Grade 1)", shortKey: 'Book 3' },
    { book: 'Ruhi Book 4', name: 'The Twin Manifestations', shortKey: 'Book 4' },
    { book: 'Ruhi Book 5', name: 'Releasing the Powers of Junior Youth', shortKey: 'Book 5' },
    { book: 'Ruhi Book 6', name: 'Teaching the Cause', shortKey: 'Book 6' },
    { book: 'Ruhi Book 7', name: 'Walking Together on a Path of Service (Tutors)', shortKey: 'Book 7' },
  ].map((c) => {
    const studyCirclesForBook = coreActivities.filter(
      (a) =>
        a.type === 'study_circle' &&
        (a.currentBookOrLesson?.toLowerCase().includes(c.shortKey.toLowerCase()) ||
          a.title.toLowerCase().includes(c.shortKey.toLowerCase()))
    );
    const soulsInCircles = studyCirclesForBook.reduce((acc, a) => acc + a.participantsCount, 0);
    const facsCompleted = facilitators.filter((f) =>
      f.instituteCompleted.some((b) => b.toLowerCase().includes(c.shortKey.toLowerCase()))
    ).length;
    const totalCount = soulsInCircles + facsCompleted;
    const pct = Math.min(
      100,
      Math.round((totalCount / Math.max(1, growthCycle.targets.ruhiGraduates || 25)) * 100)
    );
    return { ...c, count: totalCount, pct };
  });

  // Past 4 Cycles Data for Comparison
  const cyclesHistory = [
    { cycle: 21, activities: 0, participants: 0, graduates: 0 },
    { cycle: 22, activities: 0, participants: 0, graduates: 0 },
    { cycle: 23, activities: 0, participants: 0, graduates: 0 },
    { cycle: 24, activities: liveCoreActivitiesCount, participants: liveParticipantsCount, graduates: growthCycle.actuals.ruhiGraduates },
  ];

  return (
    <div className="space-y-4 px-4 pb-12">
      {/* Top Banner with Cycle Status */}
      <div className="pt-2">
        <div className="p-4 rounded-3xl bg-gradient-to-br from-[#701a43] via-[#882455] to-[#450a24] text-white shadow-xl shadow-[#882455]/15 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Kimana Growth Cycle {growthCycle.cycleNumber}
            </div>
            <span className="text-xs text-rose-200 font-bold">
              {growthCycle.daysRemaining} Days Left
            </span>
          </div>

          <h2 className="text-lg font-black tracking-tight mt-2.5">
            Expansion & Consolidation Telemetry
          </h2>
          <p className="text-xs text-rose-100/90 mt-1 leading-relaxed">
            Real-time tracking of neighborhood core activities, accompaniment flow, and regional institute benchmarks.
          </p>

          {/* Phase Control Row */}
          <div className="mt-3.5 pt-3 border-t border-white/20 flex flex-wrap items-center justify-between gap-2">
            <div className="text-[11px] text-rose-200 font-medium">
              Current Phase: <strong className="text-white uppercase font-black">{growthCycle.currentPhase}</strong>
            </div>

            <div className="flex items-center gap-1.5">
              {(['expansion', 'consolidation', 'reflection'] as const).map((phase) => (
                <button
                  key={phase}
                  onClick={() => updateGrowthCyclePhase(phase)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wide transition-all ${
                    growthCycle.currentPhase === phase
                      ? 'bg-white text-[#882455] shadow-xs'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {phase}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Metric Selector Tabs */}
      <div className="flex items-center p-1 bg-rose-50/80 rounded-2xl border border-rose-100">
        <button
          onClick={() => setActiveMetricTab('cycles')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeMetricTab === 'cycles'
              ? 'bg-[#882455] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Cycle Targets vs Actuals
        </button>
        <button
          onClick={() => setActiveMetricTab('neighborhoods')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeMetricTab === 'neighborhoods'
              ? 'bg-[#882455] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Neighborhood Heatmap
        </button>
        <button
          onClick={() => setActiveMetricTab('institute_pipeline')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeMetricTab === 'institute_pipeline'
              ? 'bg-[#882455] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Ruhi Sequence
        </button>
      </div>

      {/* 1. TARGETS VS ACTUALS DASHBOARD */}
      {activeMetricTab === 'cycles' && (
        <div className="space-y-3.5">
          {/* 4 Primary Progress Meters */}
          <div className="grid grid-cols-2 gap-3">
            {/* Core Activities Card */}
            <div className="bg-white p-3.5 rounded-3xl border border-rose-100 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-800">Core Activities</span>
                <span className="text-xs font-black text-[#882455]">{actPct}%</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-slate-900">
                  {growthCycle.actuals.coreActivities}
                </span>
                <span className="text-xs text-slate-400 font-bold">
                  / {growthCycle.targets.coreActivities} Goal
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#882455] h-full rounded-full transition-all duration-500"
                  style={{ width: `${actPct}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                <span>+7 new since expansion phase</span>
              </div>
            </div>

            {/* Souls Reached Card */}
            <div className="bg-white p-3.5 rounded-3xl border border-rose-100 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-800">Souls Reached</span>
                <span className="text-xs font-black text-emerald-600">{partPct}%</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-slate-900">
                  {growthCycle.actuals.participants}
                </span>
                <span className="text-xs text-slate-400 font-bold">
                  / {growthCycle.targets.participants} Goal
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${partPct}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                <span>65% are community friends</span>
              </div>
            </div>

            {/* Junior Youth Groups Card */}
            <div className="bg-white p-3.5 rounded-3xl border border-rose-100 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-800">Junior Youth</span>
                <span className="text-xs font-black text-amber-600">{jyPct}%</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-slate-900">
                  {growthCycle.actuals.jyGroups}
                </span>
                <span className="text-xs text-slate-400 font-bold">
                  / {growthCycle.targets.jyGroups} Target
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${jyPct}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {liveJyParticipants} youth participating across {liveJyCount} groups
              </div>
            </div>

            {/* Systematic Home Visits Card */}
            <div className="bg-white p-3.5 rounded-3xl border border-rose-100 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-800">Home Visits</span>
                <span className="text-xs font-black text-purple-700">{visitsPct}%</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-slate-900">
                  {growthCycle.actuals.homeVisits}
                </span>
                <span className="text-xs text-slate-400 font-bold">
                  / {growthCycle.targets.homeVisits} Goal
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-purple-700 h-full rounded-full transition-all duration-500"
                  style={{ width: `${visitsPct}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                Deepening & outreach visits
              </div>
            </div>
          </div>

          {/* Historical Cycles Growth Bar Visualization */}
          <div className="bg-white p-4 rounded-3xl border border-rose-100 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-tight">
                  Growth Trajectory (Cycles 21 to 24)
                </h4>
                <p className="text-[10px] text-slate-400">Total core activities and souls reached</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {liveCoreActivitiesCount > 0 ? `${liveCoreActivitiesCount} Activities Active` : 'Cycle Initiated'}
              </span>
            </div>

            {/* Vertical Bar Chart visualization */}
            <div className="pt-4 pb-2 flex items-end justify-between gap-3 h-36 px-2">
              {cyclesHistory.map((item) => {
                const heightPct = Math.round((item.activities / Math.max(1, liveCoreActivitiesCount, 25)) * 100);
                const isCurrent = item.cycle === 24;

                return (
                  <div key={item.cycle} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] font-extrabold text-slate-700">
                      {item.activities}
                    </span>
                    <div className="w-full max-w-[40px] bg-slate-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-24">
                      <div
                        className={`w-full rounded-t-xl transition-all duration-700 ${
                          isCurrent
                            ? 'bg-gradient-to-t from-[#882455] to-[#c23f7e]'
                            : 'bg-slate-300'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-bold ${isCurrent ? 'text-[#882455]' : 'text-slate-400'}`}>
                      C-{item.cycle}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Next Reflection Meeting: <strong>{growthCycle.reflectionMeetingDate}</strong></span>
              <span className="text-[#882455] font-semibold">{growthCycle.reflectionVenue}</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. NEIGHBORHOOD HEATMAP & DENSITY */}
      {activeMetricTab === 'neighborhoods' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-tight">
              Kimana Neighborhoods Growth Index
            </h4>
            <span className="text-[10px] font-bold text-[#882455] bg-rose-50 px-2 py-0.5 rounded-full">
              6 Active Neighborhoods
            </span>
          </div>

          <div className="space-y-2.5">
            {neighborhoods.map((n) => {
              return (
                <div
                  key={n.id}
                  className="bg-white p-4 rounded-3xl border border-rose-100 shadow-2xs space-y-2.5 hover:border-[#882455]/40 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="text-sm font-extrabold text-slate-900">
                          {n.name}
                        </h5>
                        <span
                          className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            n.growthStatus === 'milestone_3'
                              ? 'bg-purple-100 text-purple-900'
                              : n.growthStatus === 'milestone_2'
                              ? 'bg-rose-100 text-[#882455]'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {n.growthStatus.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Area Coordinator: <strong className="text-slate-800">{n.coordinator}</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-[#882455]">
                        {n.totalActivities}
                      </span>
                      <span className="text-[10px] block text-slate-400 font-bold uppercase">
                        Activities
                      </span>
                    </div>
                  </div>

                  {/* Neighborhood metrics mini-grid */}
                  <div className="grid grid-cols-4 gap-1.5 py-1 text-center bg-rose-50/40 rounded-2xl p-2 text-xs">
                    <div>
                      <span className="text-slate-400 text-[9px] block uppercase font-bold">Souls</span>
                      <span className="font-extrabold text-slate-800">{n.participants}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[9px] block uppercase font-bold">JY Groups</span>
                      <span className="font-extrabold text-[#882455]">{n.juniorYouthGroups}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[9px] block uppercase font-bold">Classes</span>
                      <span className="font-extrabold text-slate-800">{n.childrenClasses}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[9px] block uppercase font-bold">Ruhi</span>
                      <span className="font-extrabold text-slate-800">{n.studyCircles}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <MapPin className="w-3 h-3 text-[#882455] shrink-0" />
                    <span className="truncate">Focal Center: {n.focalPoint}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. RUHI SEQUENCE FUNNEL PIPELINE */}
      {activeMetricTab === 'institute_pipeline' && (
        <div className="bg-white p-4 rounded-3xl border border-rose-100 shadow-2xs space-y-3.5">
          <div>
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-tight">
              Ruhi Institute Path of Service Funnel
            </h4>
            <p className="text-[10px] text-slate-400">
              Capacity building sequence for Kimana animators, teachers & tutors
            </p>
          </div>

          <div className="space-y-2.5">
            {ruhiCourses.map((course) => (
              <div key={course.book} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-purple-950">{course.book}:</span>{' '}
                    <span className="text-slate-600 text-[11px]">{course.name}</span>
                  </div>
                  <span className="font-black text-[#882455] text-xs">
                    {course.count} Souls
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-800 to-[#882455] rounded-full"
                    style={{ width: `${course.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed bg-rose-50/50 p-2.5 rounded-2xl">
            {liveCoreActivitiesCount > 0 || facilitators.length > 0 ? (
              <span>
                💡 <strong>Facilitator Insight:</strong> {liveCoreActivitiesCount} active activities and {facilitators.length} facilitators are currently advancing capacity building across Kimana neighborhoods in {growthCycle.currentPhase} phase.
              </span>
            ) : (
              <span>
                💡 <strong>Facilitator Insight:</strong> Register Study Circles and Animators to track Ruhi sequence capacity building progression across Kimana neighborhoods.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
