import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCircle2, Calendar, Award, AlertTriangle, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notifications, markNotificationAsRead } = useApp();
  const [activeToast, setActiveToast] = useState<{
    id: string;
    title: string;
    message: string;
    type: string;
  } | null>(null);

  // When a new unread notification arrives (first item in array)
  useEffect(() => {
    if (notifications.length > 0 && !notifications[0].read && notifications[0].timestamp === 'Just now') {
      setActiveToast(notifications[0]);
      const timer = setTimeout(() => {
        setActiveToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  if (!activeToast) return null;

  const getIcon = () => {
    switch (activeToast.type) {
      case 'milestone':
        return <Award className="w-5 h-5 text-amber-500" />;
      case 'meeting':
        return <Calendar className="w-5 h-5 text-[#882455]" />;
      case 'growth_alert':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      default:
        return <Bell className="w-5 h-5 text-[#882455]" />;
    }
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm transition-all duration-300 transform animate-in fade-in slide-in-from-top-4">
      <div className="bg-white/95 backdrop-blur-md border border-rose-100 shadow-xl rounded-2xl p-3.5 flex items-start gap-3 ring-1 ring-black/5">
        <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 tracking-tight">{activeToast.title}</span>
            <span className="text-[10px] text-slate-400 font-medium">Push Alert</span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
            {activeToast.message}
          </p>
        </div>
        <button
          onClick={() => {
            markNotificationAsRead(activeToast.id);
            setActiveToast(null);
          }}
          className="text-slate-400 hover:text-slate-600 p-1 -mr-1"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
