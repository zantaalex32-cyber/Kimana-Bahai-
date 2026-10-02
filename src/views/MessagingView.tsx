import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Facilitator, ChatMessage } from '../types';
import {
  Search,
  Send,
  MessageSquare,
  Users,
  Sparkles,
  Phone,
  CheckCheck,
  Bot,
  Hash,
  ChevronLeft,
} from 'lucide-react';

export const MessagingView: React.FC = () => {
  const {
    messages,
    sendMessage,
    facilitators,
    triggerPushNotification,
  } = useApp();

  const [activeChannel, setActiveChannel] = useState<string>('general');
  const [selectedFacilitator, setSelectedFacilitator] = useState<Facilitator | null>(null);
  const [inputText, setInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Channels
  const channels = [
    { id: 'general', name: 'General Cluster Hub', count: 4 },
    { id: 'lsa_consultation', name: 'LSA Consultation Channel', count: 9 },
    { id: 'kimana_central', name: 'Kimana Central Team', count: 6 },
    { id: 'animators', name: 'Junior Youth Animators', count: 12 },
  ];

  // Filter messages for current channel or 1-on-1
  const displayedMessages = messages.filter((m) => {
    if (selectedFacilitator) {
      return (
        (m.senderId === 'current_user' && m.recipientId === selectedFacilitator.id) ||
        (m.senderId === selectedFacilitator.id && m.recipientId === 'current_user')
      );
    }
    return m.channelId === activeChannel;
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (selectedFacilitator) {
      sendMessage(inputText.trim(), undefined, selectedFacilitator.id);
    } else {
      sendMessage(inputText.trim(), activeChannel);
      triggerPushNotification(
        `Channel Update #${activeChannel} 💬`,
        `New message dispatched: "${inputText.slice(0, 50)}..."`,
        'reminder'
      );
    }

    setInputText('');
  };

  const handleQuickTemplate = (text: string) => {
    setInputText(text);
  };

  const filteredFacilitators = facilitators.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] max-w-md mx-auto">
      {/* Top Header / Channel Bar */}
      <div className="px-4 py-2.5 bg-white border-b border-rose-100 flex items-center justify-between gap-2 shrink-0">
        {selectedFacilitator ? (
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSelectedFacilitator(null)}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="relative">
              <img
                src={selectedFacilitator.avatarUrl}
                alt={selectedFacilitator.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-rose-100"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 truncate">
                {selectedFacilitator.name}
              </h3>
              <p className="text-[10px] text-slate-500 font-medium">
                {selectedFacilitator.role}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#882455] text-white flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-slate-900">
                Integrated Messaging Hub
              </h3>
              <p className="text-[10px] text-slate-500 font-medium">
                Real-time coordinator & facilitator dispatch
              </p>
            </div>
          </div>
        )}

        {selectedFacilitator && (
          <a
            href={`tel:${selectedFacilitator.phone}`}
            className="p-2 rounded-xl bg-rose-50 text-[#882455] hover:bg-rose-100 transition-colors"
            title="Call Coordinator"
          >
            <Phone className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* If not in direct chat, show channels row + available coordinators list */}
      {!selectedFacilitator && (
        <div className="px-4 py-2 border-b border-rose-100/70 bg-rose-50/40 space-y-2 shrink-0">
          {/* Channel selector chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {channels.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id)}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                  activeChannel === ch.id
                    ? 'bg-[#882455] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-rose-50'
                }`}
              >
                <Hash className="w-3 h-3" />
                <span>{ch.name}</span>
              </button>
            ))}
          </div>

          {/* Quick Facilitator Direct Message Avatars */}
          <div className="flex items-center gap-2.5 overflow-x-auto py-1 scrollbar-none">
            <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">
              Direct Chat:
            </span>
            {facilitators.map((fac) => (
              <button
                key={fac.id}
                onClick={() => setSelectedFacilitator(fac)}
                className="flex items-center gap-1.5 px-2 py-1 bg-white hover:bg-rose-50 rounded-full border border-rose-100 shrink-0 text-left transition-colors"
              >
                <div className="relative">
                  <img
                    src={fac.avatarUrl}
                    alt={fac.name}
                    className="w-5 h-5 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {fac.isAvailableForChat && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  )}
                </div>
                <span className="text-[10px] font-bold text-slate-700 max-w-[70px] truncate">
                  {fac.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {displayedMessages.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-600">No messages yet in this channel</p>
            <p className="text-[11px] mt-1">Start consultation or select a quick template below.</p>
          </div>
        ) : (
          displayedMessages.map((msg) => {
            const isMe = msg.senderId === 'current_user';
            const isBot = msg.isAutomated;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  isMe ? 'items-end' : isBot ? 'items-center my-2' : 'items-start'
                }`}
              >
                {/* Bot message pill */}
                {isBot ? (
                  <div className="w-full max-w-sm bg-amber-50/90 border border-amber-200/80 rounded-2xl p-2.5 text-center text-xs text-amber-900 shadow-2xs">
                    <div className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-0.5">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>{msg.senderName}</span>
                    </div>
                    <p className="leading-relaxed font-medium">{msg.text}</p>
                    <span className="text-[9px] text-amber-600 mt-1 block">{msg.timestamp}</span>
                  </div>
                ) : (
                  <div className="max-w-[85%] space-y-1">
                    {!isMe && (
                      <span className="text-[10px] font-bold text-slate-500 ml-1">
                        {msg.senderName} ({msg.senderRole})
                      </span>
                    )}

                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                        isMe
                          ? 'bg-[#882455] text-white rounded-br-xs'
                          : 'bg-white text-slate-800 border border-rose-100 rounded-bl-xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <div
                        className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                          isMe ? 'text-rose-200' : 'text-slate-400'
                        }`}
                      >
                        <span>{msg.timestamp}</span>
                        {isMe && <CheckCheck className="w-3 h-3 text-rose-200" />}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Quick Action Suggestion Chips */}
      <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
        {[
          '📅 Reminder: Upcoming reflection gathering on Saturday',
          '🤝 Are you available to accompany our JY group tomorrow?',
          '📖 Sharing quotation on oneness of humanity for our home visit',
          '📊 Weekly statistics summary submitted to LSA secretary',
        ].map((templateText, i) => (
          <button
            key={i}
            onClick={() => handleQuickTemplate(templateText)}
            className="text-[10px] font-medium bg-white text-slate-600 hover:text-[#882455] border border-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap shadow-2xs"
          >
            {templateText.slice(0, 32)}...
          </button>
        ))}
      </div>

      {/* Input Composer */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-white border-t border-rose-100 flex items-center gap-2 shrink-0 mb-1"
      >
        <input
          type="text"
          placeholder={
            selectedFacilitator
              ? `Message ${selectedFacilitator.name}...`
              : `Post in #${activeChannel}...`
          }
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-[#882455]/20 focus:border-[#882455]"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-10 h-10 rounded-2xl bg-[#882455] disabled:opacity-50 hover:bg-[#721a44] text-white flex items-center justify-center transition-all shrink-0 shadow-md shadow-[#882455]/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
