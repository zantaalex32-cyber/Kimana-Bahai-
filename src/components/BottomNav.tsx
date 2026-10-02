import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Users, Calendar, Landmark, MessageSquare, BarChart3 } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, messages } = useApp();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'activities', label: 'Facilitators', icon: Users },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'lsa', label: 'LSA Council', icon: Landmark },
    { id: 'dashboard', label: 'Cycles', icon: BarChart3 },
    { id: 'chat', label: 'Messages', icon: MessageSquare, badge: true },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-rose-100 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
      <div className="max-w-md mx-auto grid grid-cols-6 items-center h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 transition-all group ${
                isActive ? 'text-[#882455]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div
                className={`relative w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
                  isActive
                    ? 'bg-rose-50 text-[#882455] transform scale-105'
                    : 'group-hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {item.id === 'chat' && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#882455] rounded-full ring-2 ring-white"></span>
                )}
              </div>
              <span
                className={`text-[9px] font-semibold tracking-tight transition-all mt-0.5 truncate max-w-full px-0.5 ${
                  isActive ? 'text-[#882455]' : 'text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
