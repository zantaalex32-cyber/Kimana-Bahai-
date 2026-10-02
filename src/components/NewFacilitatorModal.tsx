import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, UserPlus, Award, BookOpen, MapPin, Phone } from 'lucide-react';

interface NewFacilitatorModalProps {
  onClose: () => void;
}

export const NewFacilitatorModal: React.FC<NewFacilitatorModalProps> = ({ onClose }) => {
  const { neighborhoods, addNewFacilitator } = useApp();

  const [name, setName] = useState('');
  const [role, setRole] = useState('Junior Youth Animator');
  const [neighborhood, setNeighborhood] = useState(neighborhoods[0]?.name || 'Kimana Central');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [selectedBooks, setSelectedBooks] = useState<string[]>(['Book 1', 'Book 5']);

  const ruhiBooksList = [
    'Book 1',
    'Book 2',
    'Book 3',
    'Book 4',
    'Book 5',
    'Book 6',
    'Book 7',
    'Book 8',
    'Book 9',
  ];

  const toggleBook = (b: string) => {
    setSelectedBooks((prev) =>
      prev.includes(b) ? prev.filter((item) => item !== b) : [...prev, b]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addNewFacilitator({
      name: name.trim(),
      role,
      primaryNeighborhood: neighborhood,
      phone: phone.trim() || '+254 700 000 000',
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      rating: 5.0,
      activitiesCount: 0,
      participantsReached: 0,
      instituteCompleted: selectedBooks,
      bio:
        bio.trim() ||
        `Active ${role} serving Kimana cluster in ${neighborhood}.`,
      isAvailableForChat: true,
      upcomingMilestone: 'Accompaniment in planning',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        <div className="px-5 py-4 bg-rose-50/60 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#882455] text-white flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Add Coordinator / Facilitator</h3>
              <p className="text-[11px] text-slate-500">Kimana Cluster Directory</p>
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
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g., Grace Kapei or Joseph Saitoti"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Role / Capacity
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="Junior Youth Animator">Junior Youth Animator</option>
                <option value="Children's Class Teacher">Children's Class Teacher</option>
                <option value="Ruhi Study Circle Tutor">Ruhi Study Circle Tutor</option>
                <option value="Devotional Gathering Host">Devotional Gathering Host</option>
                <option value="Cluster Coordinator">Cluster Coordinator</option>
                <option value="LSA Member">LSA Member</option>
              </select>
            </div>

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
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="+254 7..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Ruhi Institute Completed Books
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ruhiBooksList.map((book) => {
                const isSelected = selectedBooks.includes(book);
                return (
                  <button
                    type="button"
                    key={book}
                    onClick={() => toggleBook(book)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      isSelected
                        ? 'bg-[#882455] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {book}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Service Notes / Bio
            </label>
            <textarea
              rows={2}
              placeholder="e.g., Experienced in animating junior youth and accompanying new teachers..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#882455] hover:bg-[#721a44] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-[#882455]/20 active:scale-95 transition-all"
            >
              Save Facilitator
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
