import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CoreActivityType } from '../types';
import { X, Plus, BookOpen, MapPin, Users, Sparkles, Heart } from 'lucide-react';

interface NewActivityModalProps {
  onClose: () => void;
}

export const NewActivityModal: React.FC<NewActivityModalProps> = ({ onClose }) => {
  const { neighborhoods, facilitators, addNewCoreActivity } = useApp();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<CoreActivityType>('junior_youth');
  const [neighborhood, setNeighborhood] = useState(neighborhoods[0]?.name || 'Kimana Central');
  const [facilitatorId, setFacilitatorId] = useState(facilitators[0]?.id || 'custom');
  const [customFacilitatorName, setCustomFacilitatorName] = useState('');
  const [coFacilitator, setCoFacilitator] = useState('');
  const [participantsCount, setParticipantsCount] = useState(12);
  const [friendsOfFaithCount, setFriendsOfFaithCount] = useState(8);
  const [meetingDayTime, setMeetingDayTime] = useState('Saturday 2:00 PM');
  const [location, setLocation] = useState('');
  const [currentBookOrLesson, setCurrentBookOrLesson] = useState('Breezes of Confirmation');
  const [currentUnitOrChapter, setCurrentUnitOrChapter] = useState(1);
  const [totalUnitsOrChapters, setTotalUnitsOrChapters] = useState(14);
  const [virtueOrTheme, setVirtueOrTheme] = useState('');
  const [gradeLevel, setGradeLevel] = useState('Grade 1');
  const [serviceProjectTitle, setServiceProjectTitle] = useState('');
  const [frequency, setFrequency] = useState('Weekly');

  const handleTypeChange = (newType: CoreActivityType) => {
    setType(newType);
    if (newType === 'children_class') {
      setCurrentBookOrLesson('Ruhi Book 3 (Grade 1)');
      setVirtueOrTheme('Truthfulness & Radiance');
      setTotalUnitsOrChapters(24);
    } else if (newType === 'junior_youth') {
      setCurrentBookOrLesson('Breezes of Confirmation');
      setTotalUnitsOrChapters(14);
      setServiceProjectTitle('Neighborhood Environmental Cleanup & Tree Care');
    } else if (newType === 'study_circle') {
      setCurrentBookOrLesson('Ruhi Book 1: Reflections on the Life of the Spirit');
      setTotalUnitsOrChapters(3);
    } else if (newType === 'devotional') {
      setCurrentBookOrLesson('');
      setVirtueOrTheme('Oneness of Humanity & Healing of the World');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fac = facilitators.find((f) => f.id === facilitatorId);
    const finalFacName = fac ? fac.name : (customFacilitatorName.trim() || 'Area Facilitator');
    const finalFacId = fac ? fac.id : (facilitatorId !== 'custom' ? facilitatorId : `fac-${Date.now()}`);

    addNewCoreActivity({
      title: title.trim() || `${neighborhood} ${type.replace('_', ' ')} Group`,
      type,
      neighborhood,
      facilitatorId: finalFacId,
      facilitatorName: finalFacName,
      coFacilitator: coFacilitator.trim() || undefined,
      participantsCount: Number(participantsCount),
      friendsOfFaithCount: Number(friendsOfFaithCount),
      meetingDayTime,
      location: location.trim() || `${neighborhood} Community Gathering Place`,
      currentBookOrLesson: currentBookOrLesson.trim() || undefined,
      currentUnitOrChapter: Number(currentUnitOrChapter),
      totalUnitsOrChapters: Number(totalUnitsOrChapters),
      gradeLevel: type === 'children_class' ? gradeLevel : undefined,
      virtueOrTheme: virtueOrTheme.trim() || undefined,
      frequency,
      status: 'active',
      serviceProject:
        type === 'junior_youth' && serviceProjectTitle.trim()
          ? {
              title: serviceProjectTitle.trim(),
              description: 'Community service initiative led by junior youth.',
              status: 'planning',
              hoursServed: 0,
            }
          : undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        <div className="px-5 py-4 bg-rose-50/60 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#882455] text-white flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Register New Cluster Activity</h3>
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
              onChange={(e) => handleTypeChange(e.target.value as CoreActivityType)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[#882455]"
            >
              <option value="children_class">Children's Moral Education Class (Ages 5-10)</option>
              <option value="junior_youth">Junior Youth Group (Ages 11-14)</option>
              <option value="study_circle">Ruhi Institute Study Circle (Books 1-14)</option>
              <option value="devotional">Neighborhood Devotional Gathering</option>
              <option value="home_visit">Systematic Home Visits Program</option>
              <option value="youth_service">Youth Community Service Project</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Group / Gathering Title
            </label>
            <input
              type="text"
              placeholder="e.g., Rising Lights Junior Youth or Children's Class Grade 1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
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
                Facilitator / Animator
              </label>
              {facilitators.length > 0 ? (
                <div className="space-y-1.5">
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
                    <option value="custom">+ Enter Facilitator Name...</option>
                  </select>
                  {facilitatorId === 'custom' && (
                    <input
                      type="text"
                      placeholder="e.g., Grace Kapei"
                      value={customFacilitatorName}
                      onChange={(e) => setCustomFacilitatorName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-xs"
                      required
                    />
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="e.g., Grace Kapei (Animator)"
                  value={customFacilitatorName}
                  onChange={(e) => setCustomFacilitatorName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  required
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Co-Facilitator / Assistant (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., David Lemayian"
              value={coFacilitator}
              onChange={(e) => setCoFacilitator(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
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

          {/* Children's class grade level */}
          {type === 'children_class' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Grade Level
                </label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="Grade 1">Grade 1 (Ages 5-6)</option>
                  <option value="Grade 2">Grade 2 (Ages 7-8)</option>
                  <option value="Grade 3">Grade 3 (Ages 9-10)</option>
                  <option value="Grade 4">Grade 4 (Ages 10-11)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Virtue / Theme Focus
                </label>
                <input
                  type="text"
                  placeholder="e.g., Truthfulness, Kindness, Justice"
                  value={virtueOrTheme}
                  onChange={(e) => setVirtueOrTheme(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          )}

          {/* Junior Youth Service project */}
          {type === 'junior_youth' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Planned Service Project
              </label>
              <input
                type="text"
                placeholder="e.g., Tree planting, elder assistance, cleaning clinic"
                value={serviceProjectTitle}
                onChange={(e) => setServiceProjectTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          )}

          {/* Curriculum and Chapters */}
          {(type === 'junior_youth' || type === 'study_circle' || type === 'children_class') && (
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Curriculum / Text
                </label>
                <input
                  type="text"
                  value={currentBookOrLesson}
                  onChange={(e) => setCurrentBookOrLesson(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Total Ch/Units
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={totalUnitsOrChapters}
                  onChange={(e) => setTotalUnitsOrChapters(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>
            </div>
          )}

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
                placeholder="e.g., Primary School Grounds"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-[#882455] hover:bg-[#701c44] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-[#882455]/20 active:scale-95 transition-all"
            >
              Add to Kimana Growth Registry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
