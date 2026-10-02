import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Bell, CheckCheck, Award, Calendar, AlertCircle, Trash2 } from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    triggerPushNotification,
  } = useApp();

  if (!isNotificationsOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <Award className="w-4 h-4 text-amber-500" />;
      case 'meeting':
        return <Calendar className="w-4 h-4 text-[#882455]" />;
      case 'growth_alert':
        return <AlertCircle className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-rose-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={() => setIsNotificationsOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-sm w-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Top Header */}
        <div className="p-4 border-b border-rose-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#882455] text-white flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Push Notifications</h3>
              <p className="text-[10px] text-slate-500">Upcoming team milestones & alerts</p>
            </div>
          </div>
          <button
            onClick={() => setIsNotificationsOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Actions bar */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px] font-medium">
            {notifications.filter((n) => !n.read).length} Unread
          </span>
          <button
            onClick={markAllNotificationsAsRead}
            className="text-[11px] font-semibold text-[#882455] hover:underline flex items-center gap-1"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No notifications yet.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  notif.read
                    ? 'bg-white border-slate-100 opacity-75'
                    : 'bg-rose-50/50 border-rose-200/80 shadow-2xs ring-1 ring-rose-200/30'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white shadow-2xs border border-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      {notif.message}
                    </p>
                    {notif.neighborhood && (
                      <span className="inline-block mt-1 text-[9px] font-semibold text-[#882455] bg-rose-100/60 px-1.5 py-0.5 rounded">
                        📍 {notif.neighborhood}
                      </span>
                    )}
                  </div>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-[#882455] shrink-0 mt-1.5" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer trigger button */}
        <div className="p-3 bg-slate-50 border-t border-slate-100">
          <button
            onClick={() => {
              triggerPushNotification(
                'New Outreach Milestone in Isinet! ✨',
                'Isinet children\'s class reached 18 children this morning! 12 new families welcomed.',
                'milestone',
                'Isinet'
              );
            }}
            className="w-full py-2 bg-rose-100/70 hover:bg-rose-100 text-[#882455] font-semibold text-xs rounded-xl transition-colors"
          >
            + Simulate New Milestone Push Alert
          </button>
        </div>
      </div>
    </div>
  );
};
