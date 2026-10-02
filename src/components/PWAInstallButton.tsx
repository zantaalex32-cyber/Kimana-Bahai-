import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  Download,
  Smartphone,
  X,
  CheckCircle,
  ExternalLink,
  Sparkles,
  QrCode,
  Share2,
  FileDown,
  ArrowRight,
} from 'lucide-react';
import { ClusterLogo } from './ClusterLogo';

interface PWAInstallButtonProps {
  variant?: 'header' | 'banner' | 'drawer' | 'card';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isAndroid, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'install' | 'qr' | 'package'>('install');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // If already installed in standalone mode, don't show the prompt
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  const handleDownloadAppBundle = () => {
    // Generate a downloadable launcher package / manifest for the Android app
    const appPackage = {
      name: 'Kimana Cluster Tracker',
      short_name: 'Kimana',
      description: 'Bahá\'í cluster tracking and community building platform for Kimana with core activities, LSA governance, and growth cycle analytics.',
      platform: 'Android Web Application (PWA)',
      start_url: window.location.origin + '/',
      theme_color: '#882455',
      background_color: '#882455',
      display: 'standalone',
      orientation: 'portrait',
      exported_at: new Date().toISOString(),
      installation_note: 'Open the URL in Chrome on Android and tap Add to Home Screen / Install App.',
    };

    const blob = new Blob([JSON.stringify(appPackage, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kimana-cluster-android-app.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  // Current app URL
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://kimana-cluster.web.app';

  return (
    <>
      {/* Header Variant */}
      {variant === 'header' && (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#882455] to-[#a32d66] hover:from-[#721a44] hover:to-[#882455] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
          title="Download Android App on Web"
        >
          <Smartphone className="w-3.5 h-3.5 text-rose-200" />
          <span className="hidden sm:inline">Install Android App</span>
          <span className="sm:hidden font-extrabold">Android App</span>
        </button>
      )}

      {/* Banner Variant */}
      {variant === 'banner' && (
        <div className="mx-4 my-2.5 p-3.5 bg-gradient-to-r from-rose-50 via-white to-purple-50 border border-rose-200/90 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#882455] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Download className="w-5 h-5 text-rose-100" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold text-slate-900 truncate">
                  Kimana Android App
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.2 rounded-md">
                  PWA Ready
                </span>
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                Download to your phone for offline tracking & instant updates
              </div>
            </div>
          </div>

          <button
            onClick={handleInstallClick}
            className="px-3.5 py-1.5 bg-[#882455] hover:bg-[#721a44] text-white text-xs font-bold rounded-xl shadow-xs shrink-0 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Install / Download</span>
          </button>
        </div>
      )}

      {/* Drawer Variant */}
      {variant === 'drawer' && (
        <button
          onClick={handleInstallClick}
          className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl bg-rose-50/90 hover:bg-rose-100 text-[#882455] font-bold text-xs transition-colors text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-[#882455] text-white flex items-center justify-center">
            <Smartphone className="w-4 h-4 text-rose-100" />
          </div>
          <div>
            <div className="text-[#882455] font-extrabold">Download Android App</div>
            <div className="text-[10px] text-rose-800/80 font-normal">
              Install to phone home screen (PWA)
            </div>
          </div>
        </button>
      )}

      {/* Download & Install Android Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl space-y-4 border border-rose-100 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <ClusterLogo size={40} />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                    Kimana Cluster Android App
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Install or download to your device
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Sub-tabs */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">
              <button
                onClick={() => setActiveTab('install')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  activeTab === 'install'
                    ? 'bg-white text-[#882455] shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                Install Guide
              </button>
              <button
                onClick={() => setActiveTab('qr')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  activeTab === 'qr'
                    ? 'bg-white text-[#882455] shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                Scan on Phone
              </button>
              <button
                onClick={() => setActiveTab('package')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  activeTab === 'package'
                    ? 'bg-white text-[#882455] shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                Download File
              </button>
            </div>

            {/* TAB 1: INSTALL GUIDE FOR ANDROID */}
            {activeTab === 'install' && (
              <div className="space-y-3.5">
                {isInstallable && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col gap-2">
                    <span className="text-xs font-bold text-[#882455]">
                      Direct 1-Click Install Available
                    </span>
                    <button
                      onClick={async () => {
                        await install();
                        setShowModal(false);
                      }}
                      className="w-full py-2.5 bg-[#882455] hover:bg-[#701c44] text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>Install Kimana Android App Now</span>
                    </button>
                  </div>
                )}

                <div className="bg-slate-50 rounded-2xl p-3.5 space-y-3 text-xs text-slate-700 border border-slate-200">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-[#882455]" />
                    <span>How to Install on Android Mobile:</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#882455] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <p className="leading-snug">
                      Open this page on your Android phone using <strong>Chrome</strong>, <strong>Samsung Internet</strong>, or <strong>Firefox</strong>.
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#882455] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <p className="leading-snug">
                      Tap the <strong>three dots menu (⋮)</strong> in the top or bottom right corner of the browser.
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#882455] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <p className="leading-snug">
                      Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-[11px] text-emerald-800 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Launches full-screen with offline support and local data cache!
                  </span>
                </div>
              </div>
            )}

            {/* TAB 2: QR CODE FOR ANDROID */}
            {activeTab === 'qr' && (
              <div className="space-y-3 text-center">
                <p className="text-xs text-slate-600">
                  Scan this code with your <strong>Android Camera</strong> to open and install the app on your phone:
                </p>

                {/* SVG Visual QR Mockup */}
                <div className="mx-auto w-44 h-44 bg-white border-2 border-[#882455]/30 rounded-2xl p-3 flex flex-col items-center justify-center shadow-inner relative">
                  <div className="grid grid-cols-5 gap-1.5 w-full h-full p-2">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${
                          (i % 2 === 0 && i % 3 === 0) || i === 0 || i === 4 || i === 20 || i === 24 || i === 12
                            ? 'bg-[#882455]'
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white p-1 rounded-lg shadow-md border border-rose-100">
                      <ClusterLogo size={24} />
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 break-all px-2 font-mono">
                  {currentUrl}
                </div>
              </div>
            )}

            {/* TAB 3: DOWNLOAD PACKAGE */}
            {activeTab === 'package' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-600">
                  Download the Web Application Manifest and offline launcher configuration file directly:
                </p>

                <div className="bg-rose-50/60 border border-rose-100 rounded-2xl p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-800 font-bold">
                    <span>Kimana Android Manifest</span>
                    <span className="text-[10px] text-[#882455]">JSON / PWA</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Standalone configuration file containing offline assets, app metadata, icons, and display permissions.
                  </p>
                  <button
                    onClick={handleDownloadAppBundle}
                    className="w-full py-2 bg-[#882455] hover:bg-[#721a44] text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all mt-1"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>Download App Package (.json)</span>
                  </button>
                  {downloadSuccess && (
                    <div className="text-center text-[11px] text-emerald-700 font-bold">
                      Package downloaded successfully!
                    </div>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
