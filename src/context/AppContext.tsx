import React, { createContext, useContext, useState, useEffect } from 'react';
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
import {
  INITIAL_NEIGHBORHOODS,
  INITIAL_FACILITATORS,
  INITIAL_CORE_ACTIVITIES,
  INITIAL_GROWTH_CYCLE,
  INITIAL_LSA_MEETINGS,
  INITIAL_INSTITUTE_GOALS,
  INITIAL_SCHEDULED_SESSIONS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

interface AppContextType {
  // Navigation & UI Layout
  currentTab: 'home' | 'activities' | 'schedule' | 'lsa' | 'dashboard' | 'chat';
  setCurrentTab: (tab: 'home' | 'activities' | 'schedule' | 'lsa' | 'dashboard' | 'chat') => void;
  viewMode: 'handheld' | 'responsive';
  setViewMode: (mode: 'handheld' | 'responsive') => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedNeighborhood: string;
  setSelectedNeighborhood: (n: string) => void;
  selectedActivityType: string;
  setSelectedActivityType: (t: string) => void;

  // Data Collections
  neighborhoods: Neighborhood[];
  facilitators: Facilitator[];
  coreActivities: CoreActivity[];
  growthCycle: GrowthCycle;
  lsaMeetings: LsaMeeting[];
  instituteGoals: RegionalInstituteGoal[];
  scheduledSessions: ScheduledSession[];
  messages: ChatMessage[];
  notifications: PushNotificationItem[];
  favoriteFacilitatorIds: string[];

  // Modals & Selection
  bookingModalOpen: boolean;
  setBookingModalOpen: (open: boolean) => void;
  selectedFacilitatorForBooking: Facilitator | null;
  setSelectedFacilitatorForBooking: (f: Facilitator | null) => void;
  successModalOpen: boolean;
  setSuccessModalOpen: (open: boolean) => void;
  lastBookedSession: ScheduledSession | null;
  selectedSessionDetail: ScheduledSession | null;
  setSelectedSessionDetail: (s: ScheduledSession | null) => void;
  selectedActivityDetail: CoreActivity | null;
  setSelectedActivityDetail: (a: CoreActivity | null) => void;

  // Operations
  toggleFavoriteFacilitator: (id: string) => void;
  addNewFacilitator: (facilitator: Omit<Facilitator, 'id'>) => void;
  scheduleSession: (sessionData: Omit<ScheduledSession, 'id' | 'automatedRemindersSent'>) => ScheduledSession;
  updateSessionStatus: (id: string, status: 'scheduled' | 'completed' | 'cancelled') => void;
  addNewCoreActivity: (activity: Omit<CoreActivity, 'id' | 'cycle' | 'roster' | 'sessionLogs'>) => void;
  logActivitySession: (activityId: string, sessionLog: { date: string; attendeesCount: number; topicCovered: string; notes?: string; loggedBy: string }) => void;
  addParticipantToActivity: (activityId: string, participant: { name: string; age?: number; isFriendOfFaith: boolean; guardianName?: string; guardianPhone?: string }) => void;
  updateActivityCurriculumProgress: (activityId: string, currentUnit: number) => void;
  updateServiceProjectStatus: (activityId: string, status: 'planning' | 'in_progress' | 'completed', hours?: number) => void;
  addLsaMeeting: (meeting: Omit<LsaMeeting, 'id' | 'meetingNumber' | 'quorumReached'>) => void;
  updateAgendaStatus: (meetingId: string, itemId: string, status: 'pending' | 'consulted' | 'resolved') => void;
  addLsaResolution: (meetingId: string, resolution: string) => void;
  updateInstituteGoalProgress: (goalId: string, increment: number) => void;
  sendMessage: (text: string, channelId?: string, recipientId?: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  triggerPushNotification: (title: string, message: string, type?: PushNotificationItem['type'], neighborhood?: string) => void;
  updateGrowthCyclePhase: (phase: 'expansion' | 'consolidation' | 'reflection') => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentTab, setCurrentTab] = useState<'home' | 'activities' | 'schedule' | 'lsa' | 'dashboard' | 'chat'>('home');
  const [viewMode, setViewMode] = useState<'handheld' | 'responsive'>('handheld');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all');
  const [selectedActivityType, setSelectedActivityType] = useState<string>('all');

  // Clean storage versioning to ensure all mock/test data is cleared
  useEffect(() => {
    const CURRENT_VERSION = 'v3_clean_prod';
    if (localStorage.getItem('kimana_app_version') !== CURRENT_VERSION) {
      localStorage.removeItem('kimana_favorites');
      localStorage.removeItem('kimana_neighborhoods');
      localStorage.removeItem('kimana_facilitators');
      localStorage.removeItem('kimana_core_activities');
      localStorage.removeItem('kimana_growth_cycle');
      localStorage.removeItem('kimana_lsa_meetings');
      localStorage.removeItem('kimana_institute_goals');
      localStorage.removeItem('kimana_scheduled_sessions');
      localStorage.removeItem('kimana_messages');
      localStorage.removeItem('kimana_notifications');
      localStorage.setItem('kimana_app_version', CURRENT_VERSION);
    }
  }, []);

  // Favorites
  const [favoriteFacilitatorIds, setFavoriteFacilitatorIds] = useState<string[]>(() => {
    if (localStorage.getItem('kimana_app_version') !== 'v3_clean_prod') return [];
    const saved = localStorage.getItem('kimana_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Data persistence
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>(() => {
    if (localStorage.getItem('kimana_app_version') !== 'v3_clean_prod') return INITIAL_NEIGHBORHOODS;
    const saved = localStorage.getItem('kimana_neighborhoods');
    return saved ? JSON.parse(saved) : INITIAL_NEIGHBORHOODS;
  });

  const [facilitators, setFacilitators] = useState<Facilitator[]>(() => {
    if (localStorage.getItem('kimana_app_version') !== 'v3_clean_prod') return INITIAL_FACILITATORS;
    const saved = localStorage.getItem('kimana_facilitators');
    return saved ? JSON.parse(saved) : INITIAL_FACILITATORS;
  });

  const [coreActivities, setCoreActivities] = useState<CoreActivity[]>(() => {
    if (localStorage.getItem('kimana_app_version') !== 'v3_clean_prod') return INITIAL_CORE_ACTIVITIES;
    const saved = localStorage.getItem('kimana_core_activities');
    return saved ? JSON.parse(saved) : INITIAL_CORE_ACTIVITIES;
  });

  const [growthCycle, setGrowthCycle] = useState<GrowthCycle>(() => {
    if (localStorage.getItem('kimana_app_version') !== 'v3_clean_prod') return INITIAL_GROWTH_CYCLE;
    const saved = localStorage.getItem('kimana_growth_cycle');
    return saved ? JSON.parse(saved) : INITIAL_GROWTH_CYCLE;
  });

  const [lsaMeetings, setLsaMeetings] = useState<LsaMeeting[]>(() => {
    if (localStorage.getItem('kimana_app_version') !== 'v3_clean_prod') return INITIAL_LSA_MEETINGS;
    const saved = localStorage.getItem('kimana_lsa_meetings');
    return saved ? JSON.parse(saved) : INITIAL_LSA_MEETINGS;
  });

  const [instituteGoals, setInstituteGoals] = useState<RegionalInstituteGoal[]>(() => {
    if (localStorage.getItem('kimana_app_version') !== 'v3_clean_prod') return INITIAL_INSTITUTE_GOALS;
    const saved = localStorage.getItem('kimana_institute_goals');
    return saved ? JSON.parse(saved) : INITIAL_INSTITUTE_GOALS;
  });

  const [scheduledSessions, setScheduledSessions] = useState<ScheduledSession[]>(() => {
    if (localStorage.getItem('kimana_app_version') !== 'v3_clean_prod') return INITIAL_SCHEDULED_SESSIONS;
    const saved = localStorage.getItem('kimana_scheduled_sessions');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULED_SESSIONS;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (localStorage.getItem('kimana_app_version') !== 'v3_clean_prod') return INITIAL_MESSAGES;
    const saved = localStorage.getItem('kimana_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [notifications, setNotifications] = useState<PushNotificationItem[]>(() => {
    if (localStorage.getItem('kimana_app_version') !== 'v3_clean_prod') return INITIAL_NOTIFICATIONS;
    const saved = localStorage.getItem('kimana_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Modals & Selection
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedFacilitatorForBooking, setSelectedFacilitatorForBooking] = useState<Facilitator | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [lastBookedSession, setLastBookedSession] = useState<ScheduledSession | null>(null);
  const [selectedSessionDetail, setSelectedSessionDetail] = useState<ScheduledSession | null>(null);
  const [selectedActivityDetail, setSelectedActivityDetail] = useState<CoreActivity | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('kimana_favorites', JSON.stringify(favoriteFacilitatorIds));
  }, [favoriteFacilitatorIds]);

  useEffect(() => {
    localStorage.setItem('kimana_facilitators', JSON.stringify(facilitators));
  }, [facilitators]);

  useEffect(() => {
    localStorage.setItem('kimana_neighborhoods', JSON.stringify(neighborhoods));
  }, [neighborhoods]);

  useEffect(() => {
    localStorage.setItem('kimana_core_activities', JSON.stringify(coreActivities));
  }, [coreActivities]);

  useEffect(() => {
    localStorage.setItem('kimana_growth_cycle', JSON.stringify(growthCycle));
  }, [growthCycle]);

  useEffect(() => {
    localStorage.setItem('kimana_lsa_meetings', JSON.stringify(lsaMeetings));
  }, [lsaMeetings]);

  useEffect(() => {
    localStorage.setItem('kimana_institute_goals', JSON.stringify(instituteGoals));
  }, [instituteGoals]);

  useEffect(() => {
    localStorage.setItem('kimana_scheduled_sessions', JSON.stringify(scheduledSessions));
  }, [scheduledSessions]);

  useEffect(() => {
    localStorage.setItem('kimana_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('kimana_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Actions
  const toggleFavoriteFacilitator = (id: string) => {
    setFavoriteFacilitatorIds(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const triggerPushNotification = (
    title: string, 
    message: string, 
    type: PushNotificationItem['type'] = 'milestone',
    neighborhood?: string
  ) => {
    const newNotif: PushNotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      type,
      read: false,
      neighborhood,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const scheduleSession = (sessionData: Omit<ScheduledSession, 'id' | 'automatedRemindersSent'>): ScheduledSession => {
    const newSession: ScheduledSession = {
      ...sessionData,
      id: `sess-${Date.now()}`,
      automatedRemindersSent: true,
    };

    setScheduledSessions(prev => [newSession, ...prev]);
    setLastBookedSession(newSession);
    setSuccessModalOpen(true);

    // Automated Push Notification & System Broadcast
    triggerPushNotification(
      'Session Automated & Confirmed 📅',
      `"${newSession.title}" booked with ${newSession.facilitatorName} for ${newSession.date} in ${newSession.neighborhood}. Reminders queued.`,
      'reminder',
      newSession.neighborhood
    );

    // Also add automated system message in messaging
    const autoMsg: ChatMessage = {
      id: `msg-auto-${Date.now()}`,
      senderId: 'system',
      senderName: 'Kimana Schedule Dispatch',
      senderRole: 'Automated Bot',
      channelId: 'general',
      text: `📌 New milestone scheduled: "${newSession.title}" by ${newSession.facilitatorName} in ${newSession.neighborhood} on ${newSession.date} at ${newSession.time}. Automated WhatsApp & SMS notifications dispatched to participants.`,
      timestamp: 'Just now',
      isAutomated: true,
    };
    setMessages(prev => [...prev, autoMsg]);

    // Update cycle actuals if appropriate
    setGrowthCycle(prev => ({
      ...prev,
      actuals: {
        ...prev.actuals,
        participants: prev.actuals.participants + (sessionData.participantsExpected || 0),
      }
    }));

    return newSession;
  };

  const updateSessionStatus = (id: string, status: 'scheduled' | 'completed' | 'cancelled') => {
    setScheduledSessions(prev =>
      prev.map(s => (s.id === id ? { ...s, status } : s))
    );
    if (status === 'completed') {
      triggerPushNotification(
        'Milestone Completed! ✅',
        'Activity session was marked completed. Statistics updated in Cycle 24 consolidation records.',
        'milestone'
      );
    }
  };

  const addNewFacilitator = (facilitator: Omit<Facilitator, 'id'>) => {
    const newFac: Facilitator = {
      ...facilitator,
      id: `fac-${Date.now()}`,
    };
    setFacilitators(prev => [...prev, newFac]);
    triggerPushNotification(
      'New Facilitator Registered 🤝',
      `${newFac.name} registered as ${newFac.role} in ${newFac.primaryNeighborhood}.`,
      'reminder',
      newFac.primaryNeighborhood
    );
  };

  const addNewCoreActivity = (activity: Omit<CoreActivity, 'id' | 'cycle' | 'roster' | 'sessionLogs'>) => {
    const newActivity: CoreActivity = {
      ...activity,
      id: `act-${Date.now()}`,
      cycle: growthCycle.cycleNumber,
      roster: [],
      sessionLogs: [],
    };

    setCoreActivities(prev => [newActivity, ...prev]);

    // Update neighborhood statistics
    setNeighborhoods(prev =>
      prev.map(n => {
        if (n.name.toLowerCase() === activity.neighborhood.toLowerCase()) {
          return {
            ...n,
            totalActivities: n.totalActivities + 1,
            participants: n.participants + activity.participantsCount,
            childrenClasses: activity.type === 'children_class' ? n.childrenClasses + 1 : n.childrenClasses,
            juniorYouthGroups: activity.type === 'junior_youth' ? n.juniorYouthGroups + 1 : n.juniorYouthGroups,
            studyCircles: activity.type === 'study_circle' ? n.studyCircles + 1 : n.studyCircles,
            devotionals: activity.type === 'devotional' ? n.devotionals + 1 : n.devotionals,
          };
        }
        return n;
      })
    );

    // Update Growth Cycle Actuals
    setGrowthCycle(prev => ({
      ...prev,
      actuals: {
        ...prev.actuals,
        coreActivities: prev.actuals.coreActivities + 1,
        participants: prev.actuals.participants + activity.participantsCount,
        jyGroups: activity.type === 'junior_youth' ? prev.actuals.jyGroups + 1 : prev.actuals.jyGroups,
      }
    }));

    triggerPushNotification(
      'New Core Activity Registered 🌱',
      `"${activity.title}" (${activity.type.replace('_', ' ')}) started in ${activity.neighborhood}!`,
      'milestone',
      activity.neighborhood
    );
  };

  const logActivitySession = (
    activityId: string,
    sessionLog: { date: string; attendeesCount: number; topicCovered: string; notes?: string; loggedBy: string }
  ) => {
    const newLog = {
      ...sessionLog,
      id: `log-${Date.now()}`,
    };

    setCoreActivities(prev =>
      prev.map(act => {
        if (act.id === activityId) {
          const updated = {
            ...act,
            sessionLogs: [newLog, ...(act.sessionLogs || [])],
          };
          if (selectedActivityDetail?.id === activityId) {
            setSelectedActivityDetail(updated);
          }
          return updated;
        }
        return act;
      })
    );

    triggerPushNotification(
      'Activity Gathering Logged 📝',
      `${sessionLog.attendeesCount} attended session on "${sessionLog.topicCovered.slice(0, 45)}...".`,
      'milestone'
    );
  };

  const addParticipantToActivity = (
    activityId: string,
    participant: { name: string; age?: number; isFriendOfFaith: boolean; guardianName?: string; guardianPhone?: string }
  ) => {
    const newParticipant = {
      ...participant,
      id: `p-${Date.now()}`,
      attendanceCount: 1,
      joinedDate: new Date().toISOString().split('T')[0],
    };

    setCoreActivities(prev =>
      prev.map(act => {
        if (act.id === activityId) {
          const updatedRoster = [...(act.roster || []), newParticipant];
          const updated = {
            ...act,
            participantsCount: act.participantsCount + 1,
            friendsOfFaithCount: participant.isFriendOfFaith ? act.friendsOfFaithCount + 1 : act.friendsOfFaithCount,
            roster: updatedRoster,
          };
          if (selectedActivityDetail?.id === activityId) {
            setSelectedActivityDetail(updated);
          }
          return updated;
        }
        return act;
      })
    );

    // Update cycle participants
    setGrowthCycle(prev => ({
      ...prev,
      actuals: {
        ...prev.actuals,
        participants: prev.actuals.participants + 1,
      }
    }));

    triggerPushNotification(
      'New Soul Enrolled 👥',
      `${participant.name} joined Kimana cluster community building activities!`,
      'milestone'
    );
  };

  const updateActivityCurriculumProgress = (activityId: string, currentUnit: number) => {
    setCoreActivities(prev =>
      prev.map(act => {
        if (act.id === activityId) {
          const updated = {
            ...act,
            currentUnitOrChapter: currentUnit,
          };
          if (selectedActivityDetail?.id === activityId) {
            setSelectedActivityDetail(updated);
          }
          return updated;
        }
        return act;
      })
    );

    triggerPushNotification(
      'Curriculum Milestone Updated 📖',
      `Progress updated to Chapter/Unit ${currentUnit}.`,
      'growth_alert'
    );
  };

  const updateServiceProjectStatus = (
    activityId: string,
    status: 'planning' | 'in_progress' | 'completed',
    hours?: number
  ) => {
    setCoreActivities(prev =>
      prev.map(act => {
        if (act.id === activityId && act.serviceProject) {
          const updated = {
            ...act,
            serviceProject: {
              ...act.serviceProject,
              status,
              hoursServed: hours !== undefined ? hours : act.serviceProject.hoursServed,
            },
          };
          if (selectedActivityDetail?.id === activityId) {
            setSelectedActivityDetail(updated);
          }
          return updated;
        }
        return act;
      })
    );

    triggerPushNotification(
      'JY Service Project Updated 🌟',
      `Service project marked as ${status.replace('_', ' ')}.`,
      'milestone'
    );
  };

  const addLsaMeeting = (meeting: Omit<LsaMeeting, 'id' | 'meetingNumber' | 'quorumReached'>) => {
    const meetingCount = lsaMeetings.length + 1;
    const newMeeting: LsaMeeting = {
      ...meeting,
      id: `lsa-meet-${Date.now()}`,
      meetingNumber: `LSA-KM-2026-${meetingCount < 10 ? '0' + meetingCount : meetingCount}`,
      quorumReached: meeting.attendeesCount >= 5,
    };

    setLsaMeetings(prev => [newMeeting, ...prev]);
    triggerPushNotification(
      'LSA Consultation Meeting Convened 🏛️',
      `Meeting ${newMeeting.meetingNumber} scheduled for ${newMeeting.date} with ${meeting.agendaItems.length} agenda items.`,
      'meeting'
    );
  };

  const updateAgendaStatus = (meetingId: string, itemId: string, status: 'pending' | 'consulted' | 'resolved') => {
    setLsaMeetings(prev =>
      prev.map(m => {
        if (m.id === meetingId) {
          return {
            ...m,
            agendaItems: m.agendaItems.map(item =>
              item.id === itemId ? { ...item, status } : item
            ),
          };
        }
        return m;
      })
    );
  };

  const addLsaResolution = (meetingId: string, resolution: string) => {
    setLsaMeetings(prev =>
      prev.map(m => {
        if (m.id === meetingId) {
          return {
            ...m,
            resolutions: [...m.resolutions, resolution],
          };
        }
        return m;
      })
    );
    triggerPushNotification(
      'LSA Resolution Recorded 📜',
      `Assembly resolution agreed: "${resolution.slice(0, 70)}..."`,
      'meeting'
    );
  };

  const updateInstituteGoalProgress = (goalId: string, increment: number) => {
    setInstituteGoals(prev =>
      prev.map(g => {
        if (g.id === goalId) {
          const newCount = Math.max(0, g.currentCount + increment);
          const isAchieved = newCount >= g.targetCount;
          return {
            ...g,
            currentCount: newCount,
            status: isAchieved ? 'achieved' : 'on_track',
          };
        }
        return g;
      })
    );
    triggerPushNotification(
      'Institute Goal Progress Updated 📈',
      'Regional institute accompaniment records updated for Kimana cluster.',
      'growth_alert'
    );
  };

  const sendMessage = (text: string, channelId: string = 'general', recipientId?: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'current_user',
      senderName: 'You (Cluster Coordinator)',
      senderRole: 'Area Coordinator',
      channelId,
      recipientId,
      text,
      timestamp: 'Just now',
    };
    setMessages(prev => [...prev, newMsg]);

    // Simulated reply after 1.5 seconds if direct message
    if (recipientId) {
      setTimeout(() => {
        const fac = facilitators.find(f => f.id === recipientId);
        const replyMsg: ChatMessage = {
          id: `msg-reply-${Date.now()}`,
          senderId: recipientId,
          senderName: fac ? fac.name : 'Coordinator',
          senderRole: fac ? fac.role : 'Facilitator',
          recipientId: 'current_user',
          text: `Thank you for reaching out! We are preparing the materials for our next session in ${fac?.primaryNeighborhood || 'Kimana'}. Let's coordinate the youth accompaniment.`,
          timestamp: 'Just now',
        };
        setMessages(prev => [...prev, replyMsg]);
        triggerPushNotification(
          `Message from ${fac?.name || 'Coordinator'} 💬`,
          `"${replyMsg.text.slice(0, 60)}..."`,
          'reminder'
        );
      }, 1500);
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateGrowthCyclePhase = (phase: 'expansion' | 'consolidation' | 'reflection') => {
    setGrowthCycle(prev => ({
      ...prev,
      currentPhase: phase,
    }));
    triggerPushNotification(
      `Cycle 24 Phase Shift: ${phase.toUpperCase()} 🔄`,
      `Kimana Cluster has transitioned to the ${phase} phase. Outreach and accompaniment workflows adjusted.`,
      'growth_alert'
    );
  };

  const resetAllData = () => {
    localStorage.clear();
    setNeighborhoods(INITIAL_NEIGHBORHOODS);
    setFacilitators(INITIAL_FACILITATORS);
    setCoreActivities(INITIAL_CORE_ACTIVITIES);
    setGrowthCycle(INITIAL_GROWTH_CYCLE);
    setLsaMeetings(INITIAL_LSA_MEETINGS);
    setInstituteGoals(INITIAL_INSTITUTE_GOALS);
    setScheduledSessions(INITIAL_SCHEDULED_SESSIONS);
    setMessages(INITIAL_MESSAGES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setFavoriteFacilitatorIds([]);
    localStorage.setItem('kimana_app_version', 'v3_clean_prod');
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        viewMode,
        setViewMode,
        isDrawerOpen,
        setIsDrawerOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        searchQuery,
        setSearchQuery,
        selectedNeighborhood,
        setSelectedNeighborhood,
        selectedActivityType,
        setSelectedActivityType,
        neighborhoods,
        facilitators,
        coreActivities,
        growthCycle,
        lsaMeetings,
        instituteGoals,
        scheduledSessions,
        messages,
        notifications,
        favoriteFacilitatorIds,
        bookingModalOpen,
        setBookingModalOpen,
        selectedFacilitatorForBooking,
        setSelectedFacilitatorForBooking,
        successModalOpen,
        setSuccessModalOpen,
        lastBookedSession,
        selectedSessionDetail,
        setSelectedSessionDetail,
        selectedActivityDetail,
        setSelectedActivityDetail,
        toggleFavoriteFacilitator,
        addNewFacilitator,
        scheduleSession,
        updateSessionStatus,
        addNewCoreActivity,
        logActivitySession,
        addParticipantToActivity,
        updateActivityCurriculumProgress,
        updateServiceProjectStatus,
        addLsaMeeting,
        updateAgendaStatus,
        addLsaResolution,
        updateInstituteGoalProgress,
        sendMessage,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        triggerPushNotification,
        updateGrowthCyclePhase,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
