import {
  CoreActivity,
  Facilitator,
  Neighborhood,
  GrowthCycle,
  LsaMeeting,
  RegionalInstituteGoal,
  ScheduledSession,
  ChatMessage,
  PushNotificationItem,
} from '../types';

export const INITIAL_NEIGHBORHOODS: Neighborhood[] = [
  {
    id: 'kimana_central',
    name: 'Kimana Central',
    coordinator: 'Neighborhood Coordinator',
    totalActivities: 0,
    participants: 0,
    juniorYouthGroups: 0,
    childrenClasses: 0,
    studyCircles: 0,
    devotionals: 0,
    growthStatus: 'milestone_1',
    focalPoint: 'Kimana Central Bahá\'í Centre',
  },
  {
    id: 'inkisanjani',
    name: 'Inkisanjani',
    coordinator: 'Neighborhood Coordinator',
    totalActivities: 0,
    participants: 0,
    juniorYouthGroups: 0,
    childrenClasses: 0,
    studyCircles: 0,
    devotionals: 0,
    growthStatus: 'milestone_1',
    focalPoint: 'Inkisanjani Community Point',
  },
  {
    id: 'isinet',
    name: 'Isinet',
    coordinator: 'Neighborhood Coordinator',
    totalActivities: 0,
    participants: 0,
    juniorYouthGroups: 0,
    childrenClasses: 0,
    studyCircles: 0,
    devotionals: 0,
    growthStatus: 'milestone_1',
    focalPoint: 'Isinet Springs Community Hall',
  },
  {
    id: 'namelok',
    name: 'Namelok',
    coordinator: 'Neighborhood Coordinator',
    totalActivities: 0,
    participants: 0,
    juniorYouthGroups: 0,
    childrenClasses: 0,
    studyCircles: 0,
    devotionals: 0,
    growthStatus: 'milestone_1',
    focalPoint: 'Namelok Center',
  },
  {
    id: 'ilmotiok',
    name: 'Ilmotiok',
    coordinator: 'Neighborhood Coordinator',
    totalActivities: 0,
    participants: 0,
    juniorYouthGroups: 0,
    childrenClasses: 0,
    studyCircles: 0,
    devotionals: 0,
    growthStatus: 'milestone_1',
    focalPoint: 'Ilmotiok Junction Point',
  },
  {
    id: 'lenkisem',
    name: 'Lenkisem',
    coordinator: 'Neighborhood Coordinator',
    totalActivities: 0,
    participants: 0,
    juniorYouthGroups: 0,
    childrenClasses: 0,
    studyCircles: 0,
    devotionals: 0,
    growthStatus: 'milestone_1',
    focalPoint: 'Lenkisem Outreach Point',
  },
];

// Clean empty facilitators list (no mock/test records)
export const INITIAL_FACILITATORS: Facilitator[] = [];

// Clean empty core activities list (no mock/test records)
export const INITIAL_CORE_ACTIVITIES: CoreActivity[] = [];

// Active Growth Cycle initialized with 0 actuals
export const INITIAL_GROWTH_CYCLE: GrowthCycle = {
  cycleNumber: 24,
  name: 'Kimana Growth Cycle 24',
  currentPhase: 'consolidation',
  startDate: '2026-09-01',
  endDate: '2026-11-30',
  daysRemaining: 18,
  targets: {
    coreActivities: 50,
    participants: 400,
    homeVisits: 40,
    newEnrollments: 20,
    ruhiGraduates: 25,
    jyGroups: 20,
  },
  actuals: {
    coreActivities: 0,
    participants: 0,
    homeVisits: 0,
    newEnrollments: 0,
    ruhiGraduates: 0,
    jyGroups: 0,
  },
  reflectionMeetingDate: '2026-10-24',
  reflectionVenue: 'Kimana Bahá\'í Centre Main Hall',
};

// Clean empty LSA meetings list (no mock/test records)
export const INITIAL_LSA_MEETINGS: LsaMeeting[] = [];

// Regional Institute Goals initialized with 0 actual progress
export const INITIAL_INSTITUTE_GOALS: RegionalInstituteGoal[] = [
  {
    id: 'goal-1',
    title: 'Ruhi Book 7 Tutors Trained & Accompanied',
    description: 'Equip believers to tutor Study Circles on Walking Together on a Path of Service.',
    targetCount: 25,
    currentCount: 0,
    unit: 'Tutors Certified',
    deadline: '2026-11-15',
    coordinatorLead: 'Cluster Coordinator',
    status: 'on_track',
    ruhiCourseRelated: 'Ruhi Book 7',
  },
  {
    id: 'goal-2',
    title: 'Active Junior Youth Animators Deployed',
    description: 'Mobilize older youth to mentor groups of 11-14 year olds in community service.',
    targetCount: 30,
    currentCount: 0,
    unit: 'Active Animators',
    deadline: '2026-10-31',
    coordinatorLead: 'Youth Coordinator',
    status: 'on_track',
    ruhiCourseRelated: 'Ruhi Book 5',
  },
  {
    id: 'goal-3',
    title: 'Children\'s Class Teachers (Grades 1–4)',
    description: 'Train local teachers in pedagogy, songs, prayers, and moral education for neighborhood children.',
    targetCount: 35,
    currentCount: 0,
    unit: 'Active Teachers',
    deadline: '2026-11-30',
    coordinatorLead: 'Children\'s Coordinator',
    status: 'on_track',
    ruhiCourseRelated: 'Ruhi Book 3',
  },
  {
    id: 'goal-4',
    title: 'Ruhi Book 1 Completions (Life of the Spirit)',
    description: 'Ensure seekers and new friends complete the foundation course on prayer, life after death, and scripture.',
    targetCount: 50,
    currentCount: 0,
    unit: 'Graduates',
    deadline: '2026-10-25',
    coordinatorLead: 'Institute Coordinator',
    status: 'on_track',
    ruhiCourseRelated: 'Ruhi Book 1',
  },
];

// Clean empty scheduled sessions (no mock/test records)
export const INITIAL_SCHEDULED_SESSIONS: ScheduledSession[] = [];

// Clean empty messages (no mock/test records)
export const INITIAL_MESSAGES: ChatMessage[] = [];

// Clean empty notifications (no mock/test records)
export const INITIAL_NOTIFICATIONS: PushNotificationItem[] = [];
