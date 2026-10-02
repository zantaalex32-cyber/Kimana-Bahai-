import React from 'react';

interface ClusterLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textSize?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark' | 'plum';
}

export const ClusterLogo: React.FC<ClusterLogoProps> = ({
  className = '',
  size = 48,
  showText = false,
  textSize = 'md',
  theme = 'light'
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div 
        style={{ width: size, height: size }} 
        className="relative shrink-0 flex items-center justify-center filter drop-shadow-sm select-none"
      >
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transform hover:rotate-6 transition-transform duration-500"
        >
          <defs>
            {/* Blue to Cyan Gradient */}
            <linearGradient id="blueSwoop" x1="20" y1="140" x2="90" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="50%" stopColor="#0EA5E9" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>

            {/* Deep Navy Inner Swoop */}
            <linearGradient id="navySwoop" x1="50" y1="110" x2="150" y2="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="40%" stopColor="#1E3A8A" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>

            {/* Green Spurt Gradient */}
            <linearGradient id="greenSwoop" x1="40" y1="160" x2="160" y2="170" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#84CC16" />
            </linearGradient>

            {/* Warm Gold / Yellow Arc */}
            <linearGradient id="goldSwoop" x1="60" y1="100" x2="170" y2="140" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#FDE047" />
            </linearGradient>

            {/* Orange to Crimson Red Swoop */}
            <linearGradient id="redSwoop" x1="120" y1="170" x2="190" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#EA580C" />
              <stop offset="50%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#BE123C" />
            </linearGradient>
          </defs>

          {/* Deep Navy & Blue bottom-left base swoop */}
          <path
            d="M28 65C30 95 44 140 85 168C115 186 150 178 152 176C138 174 100 162 76 138C52 114 48 85 45 68C40 60 30 52 28 65Z"
            fill="url(#navySwoop)"
          />

          {/* Cyan/Sky Blue splash wing */}
          <path
            d="M32 75C24 95 24 125 45 152C58 135 62 108 80 82C95 62 118 42 142 35C125 32 98 38 78 50C58 62 42 70 32 75Z"
            fill="url(#blueSwoop)"
            opacity="0.95"
          />

          {/* Green vibrancy curve */}
          <path
            d="M62 152C85 169 118 172 150 160C140 154 116 150 94 138C76 128 64 120 58 135C57 142 59 148 62 152Z"
            fill="url(#greenSwoop)"
          />

          {/* Yellow / Golden upward core spiral */}
          <path
            d="M65 95C62 120 78 145 106 152C132 158 160 142 172 116C158 130 134 136 112 130C90 124 78 108 76 92C75 88 70 85 65 95Z"
            fill="url(#goldSwoop)"
          />

          {/* Inner Golden Horn / Flame */}
          <path
            d="M72 102C82 124 108 136 136 130C152 124 165 108 170 94C164 110 146 122 128 122C108 122 90 110 82 96C78 88 74 94 72 102Z"
            fill="#FACC15"
          />

          {/* Orange/Red Right-side dynamic splash wing */}
          <path
            d="M130 145C155 138 175 118 184 88C190 68 188 45 180 32C178 48 174 72 158 92C146 108 132 120 120 128C116 134 122 147 130 145Z"
            fill="url(#redSwoop)"
          />

          {/* Splash particles - Cyan & Blue */}
          <circle cx="22" cy="70" r="3.5" fill="#0EA5E9" />
          <circle cx="16" cy="88" r="2.5" fill="#38BDF8" />
          <circle cx="28" cy="115" r="3" fill="#0284C7" />
          <circle cx="36" cy="50" r="2" fill="#0284C7" />
          <circle cx="48" cy="38" r="3" fill="#38BDF8" />
          
          {/* Splash particles - Green */}
          <circle cx="88" cy="178" r="2.8" fill="#10B981" />
          <circle cx="120" cy="182" r="3.2" fill="#84CC16" />
          <circle cx="102" cy="188" r="2" fill="#22C55E" />
          <circle cx="145" cy="174" r="2" fill="#84CC16" />

          {/* Splash particles - Red & Orange */}
          <circle cx="188" cy="72" r="3.5" fill="#E11D48" />
          <circle cx="192" cy="52" r="2.5" fill="#F43F5E" />
          <circle cx="182" cy="38" r="3" fill="#EA580C" />
          <circle cx="168" cy="22" r="2.5" fill="#E11D48" />
          <circle cx="160" cy="32" r="3.5" fill="#F97316" />
          <circle cx="152" cy="18" r="2" fill="#BE123C" />
          
          {/* Fine dynamic brush specks */}
          <path d="M174 58C176 54 182 52 180 60C178 65 173 63 174 58Z" fill="#E11D48" />
          <path d="M26 102C24 98 28 94 30 100C31 104 27 105 26 102Z" fill="#0284C7" />
          <path d="M92 42C96 36 104 42 98 48C94 51 90 46 92 42Z" fill="#16A34A" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left leading-tight">
          <span className={`font-bold tracking-tight ${
            theme === 'plum' 
              ? 'text-white' 
              : theme === 'dark' 
                ? 'text-slate-100' 
                : 'text-slate-900'
          } ${
            textSize === 'lg' ? 'text-lg' : textSize === 'md' ? 'text-base' : 'text-sm'
          }`}>
            KIMANA CLUSTER
          </span>
          <span className={`text-[10px] tracking-wide uppercase font-semibold ${
            theme === 'plum' 
              ? 'text-rose-200' 
              : theme === 'dark' 
                ? 'text-slate-400' 
                : 'text-[#882455]'
          }`}>
            Bahá'í Community & LSA
          </span>
        </div>
      )}
    </div>
  );
};
