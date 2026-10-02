import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-18 left-4 right-4 max-w-sm mx-auto z-50 flex items-center justify-between gap-2.5 rounded-2xl bg-amber-600/95 text-white px-4 py-2.5 text-xs font-semibold shadow-xl backdrop-blur-sm border border-amber-400 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center gap-2 min-w-0">
        <WifiOff className="w-4 h-4 shrink-0 text-amber-200 animate-pulse" />
        <span className="truncate">Offline Mode · Saved data is cached on your device</span>
      </div>
      <span className="text-[10px] font-bold bg-amber-700/60 px-2 py-0.5 rounded-full shrink-0">
        Ready
      </span>
    </div>
  );
};
