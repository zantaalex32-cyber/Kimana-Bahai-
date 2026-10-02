import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CoreActivityType } from '../types';
import { X, Plus, BookOpen, MapPin, Users, Sparkles } from 'lucide-react';

interface NewActivityModalProps {
  onClose: () => void;
}

export const NewActivityModal: React.FC<NewActivityModalProps> = ({ onClose }) => {
  const { neighborhoods, facilitators, addNewCoreActivity } = useApp();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<CoreActivityType>('junior_youth');
  const [neighborhood, setNeighborhood] = useState(neighborhoods[0].name);
  const [facilitatorId, setFacilitatorId] = useState(facilitators[0].id);
  const [participantsCount, setParticipantsCount] = useState(12);
  const [friendsOfFaithCount, setFriendsOfFaithCount] = useState(8);
  const [meetingDayTime, setMeetingDayTime] = useState('Saturday 2:00 PM');
  const [location, setLocation] = useState('');
  const [currentBookOrLesson, setCurrentBookOrLesson] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fac = facilitators.find((f) => f.id === facilitatorId) || facilitators[0];

    addNewCoreActivity({
      title: title.trim() || `${neighborhood} ${type.replace('_', ' ')} Group`,
      type,
      neighborhood,
      facilitatorId: fac.id,
      facilitatorName: fac.name,
      participantsCount: Number(participantsCount),
      friendsOfFaithCount: Number(friendsOfFaithCount),
      meetingDayTime,
      location: location.trim() || `${neighborhood} Community Gathering Place`,
      currentBookOrLesson: currentBookOrLesson.trim() || 'Ruhi Institute Curriculum',
      status: 'active',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        <div className="px-5 py-4 bg-rose-50/60 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#882455] text-white flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Register New Core Activity</h3>
              <p className="text-[11px] text-slate-500">Kimana Cluster Community Building</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-3.5 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Activity Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as CoreActivityType)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
            >
              <option value="junior_youth">Junior Youth Group (Ages 11-14)</option>
              <option value="children_class">Children's Moral Education Class</option>
              <option value="study_circle">Ruhi Institute Study Circle</option>
              <option value="devotional">Neighborhood Devotional Gathering</option>
              <option value="home_visit">Systematic Home Visits Program</option>
              <option value="youth_service">Youth Community Service Initiative</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Group / Activity Title
            </label>
            <input
              type="text"
              placeholder="e.g., Rising Lights Junior Youth or Ruhi Book 3 Grade 1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Neighborhood
              </label>
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                {neighborhoods.map((n) => (
                  <option key={n.id} value={n.name}>
                    {n.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Facilitator / Tutor
              </label>
              <select
                value={facilitatorId}
                onChange={(e) => setFacilitatorId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                {facilitators.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.primaryNeighborhood})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Total Participants
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={participantsCount}
                onChange={(e) => setParticipantsCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Friends of the Faith
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={friendsOfFaithCount}
                onChange={(e) => setFriendsOfFaithCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Curriculum / Book Title
            </label>
            <input
              type="text"
              placeholder="e.g., Breezes of Confirmation / Ruhi Book 1 Unit 2"
              value={currentBookOrLesson}
              onChange={(e) => setCurrentBookOrLesson(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Day & Time
              </label>
              <input
                type="text"
                placeholder="e.g., Saturday 2:00 PM"
                value={meetingDayTime}
                onChange={(e) => setMeetingDayTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Location / Venue
              </label>
              <input
                type="text"
                placeholder="e.g., Primary School Hall"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 bg-[#882455] hover:bg-[#701c44] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-[#882455]/20 active:scale-95 transition-all"
            >
              Add to Kimana Growth Registry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
