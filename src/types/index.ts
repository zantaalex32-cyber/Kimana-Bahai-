export type CoreActivityType = 
  | 'children_class' 
  | 'junior_youth' 
  | 'study_circle' 
  | 'devotional' 
  | 'home_visit' 
  | 'youth_service';

export interface ParticipantRecord {
  id: string;
  name: string;
  age?: number;
  isFriendOfFaith: boolean;
  guardianName?: string;
  guardianPhone?: string;
  attendanceCount: number;
  joinedDate?: string;
}

export interface ActivitySessionLog {
  id: string;
  date: string;
  attendeesCount: number;
  topicCovered: string;
  notes?: string;
  loggedBy: string;
}

export interface CoreActivity {
  id: string;
  title: string;
  type: CoreActivityType;
  neighborhood: string;
  facilitatorId: string;
  facilitatorName: string;
  coFacilitator?: string;
  participantsCount: number;
  friendsOfFaithCount: number;
  meetingDayTime: string;
  location: string;
  status: 'active' | 'in_planning' | 'paused';
  cycle: number;
  
  // Specific curriculum & progress tracking
  currentBookOrLesson?: string; // e.g., "Ruhi Book 1", "Breezes of Confirmation"
  currentUnitOrChapter?: number;
  totalUnitsOrChapters?: number;
  virtueOrTheme?: string;
  memorizationQuote?: string;
  targetAgeRange?: string; // e.g., "5-7 years", "11-14 years", "Youth & Adults"
  gradeLevel?: string; // e.g., "Grade 1", "Grade 2"
  frequency?: string; // e.g., "Weekly", "Fortnightly"
  languages?: string[]; // e.g., ["Swahili", "Maa", "English"]

  // Junior Youth specific
  serviceProject?: {
    title: string;
    description: string;
    status: 'planning' | 'in_progress' | 'completed';
    hoursServed?: number;
  };

  // Study circle specific
  practicalComponent?: string; // e.g. "Conduct 2 home visits and organize a devotional"

  // Participants roster & attendance history
  roster: ParticipantRecord[];
  sessionLogs: ActivitySessionLog[];
}

export interface Facilitator {
  id: string;
  name: string;
  role: string; // e.g., "Junior Youth Animator", "Ruhi Study Circle Tutor", "Children's Class Teacher", "Cluster Coordinator"
  primaryNeighborhood: string;
  activitiesCount: number;
  participantsReached: number;
  phone: string;
  avatarUrl: string;
  rating: number; // accompaniment score e.g. 4.9
  instituteCompleted: string[]; // ['Book 1', 'Book 2', 'Book 3', 'Book 4', 'Book 5']
  bio: string;
  isAvailableForChat: boolean;
  upcomingMilestone: string;
}

export interface Neighborhood {
  id: string;
  name: string;
  coordinator: string;
  totalActivities: number;
  participants: number;
  juniorYouthGroups: number;
  childrenClasses: number;
  studyCircles: number;
  devotionals: number;
  growthStatus: 'milestone_1' | 'milestone_2' | 'milestone_3';
  focalPoint: string;
}

export interface GrowthCycle {
  cycleNumber: number;
  name: string;
  currentPhase: 'expansion' | 'consolidation' | 'reflection';
  startDate: string;
  endDate: string;
  daysRemaining: number;
  targets: {
    coreActivities: number;
    participants: number;
    homeVisits: number;
    newEnrollments: number;
    ruhiGraduates: number;
    jyGroups: number;
  };
  actuals: {
    coreActivities: number;
    participants: number;
    homeVisits: number;
    newEnrollments: number;
    ruhiGraduates: number;
    jyGroups: number;
  };
  reflectionMeetingDate: string;
  reflectionVenue: string;
}

export interface LsaMeeting {
  id: string;
  meetingNumber: string;
  date: string;
  time: string;
  venue: string;
  status: 'upcoming' | 'completed' | 'draft';
  chairperson: string;
  secretary: string;
  attendeesCount: number;
  quorumReached: boolean;
  agendaItems: {
    id: string;
    title: string;
    description: string;
    category: 'cluster_growth' | 'institute_goals' | 'community_welfare' | 'nineteen_day_feast' | 'holy_days' | 'treasury';
    status: 'pending' | 'consulted' | 'resolved';
    assignedTo?: string;
  }[];
  resolutions: string[];
}

export interface RegionalInstituteGoal {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  unit: string; // e.g. "Tutors trained", "JY Animators active", "Grade 1-3 Teachers"
  deadline: string;
  coordinatorLead: string;
  status: 'on_track' | 'needs_accompaniment' | 'achieved';
  ruhiCourseRelated?: string;
}

export interface ScheduledSession {
  id: string;
  title: string;
  activityType: CoreActivityType | 'lsa_meeting' | 'reflection_meeting' | 'accompaniment_visit';
  facilitatorName: string;
  facilitatorId: string;
  neighborhood: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:00 AM - 12:00 PM"
  status: 'scheduled' | 'completed' | 'cancelled';
  venue: string;
  notes?: string;
  participantsExpected: number;
  cycleNumber: number;
  automatedRemindersSent: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  recipientId?: string; // empty if channel message
  channelId?: string; // e.g. "general", "kimana_central", "animators", "lsa"
  text: string;
  timestamp: string;
  isAutomated?: boolean;
}

export interface PushNotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'milestone' | 'meeting' | 'reminder' | 'growth_alert';
  read: boolean;
  neighborhood?: string;
}
