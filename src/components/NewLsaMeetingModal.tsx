import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Landmark, Plus, Trash2, Calendar, Clock, MapPin } from 'lucide-react';

interface NewLsaMeetingModalProps {
  onClose: () => void;
}

export const NewLsaMeetingModal: React.FC<NewLsaMeetingModalProps> = ({ onClose }) => {
  const { addLsaMeeting } = useApp();

  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('6:30 PM - 8:30 PM');
  const [venue, setVenue] = useState('Kimana Bahá\'í Centre / Hybrid');
  const [chairperson, setChairperson] = useState('');
  const [secretary, setSecretary] = useState('');
  const [attendeesCount, setAttendeesCount] = useState(9);

  const [agendaItems, setAgendaItems] = useState<
    { id: string; title: string; description: string; category: any; status: any }[]
  >([]);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<any>('institute_goals');

  const handleAddAgenda = () => {
    if (!newTitle.trim()) return;
    setAgendaItems([
      ...agendaItems,
      {
        id: `ag-${Date.now()}`,
        title: newTitle.trim(),
        description: 'Scheduled for assembly consultation.',
        category: newCategory,
        status: 'pending',
      },
    ]);
    setNewTitle('');
  };

  const handleRemoveAgenda = (id: string) => {
    setAgendaItems(agendaItems.filter((item) => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAgenda =
      agendaItems.length > 0
        ? agendaItems
        : [
            {
              id: `ag-${Date.now()}`,
              title: 'Consultation on Kimana Neighborhood Growth & Institute Accompaniment',
              description: 'Reviewing core activities and coordinator accompaniment across neighborhoods.',
              category: 'cluster_growth' as const,
              status: 'pending' as const,
            },
          ];

    addLsaMeeting({
      date,
      time,
      venue: venue.trim() || "Kimana Bahá'í Centre / Hybrid",
      status: 'upcoming',
      chairperson: chairperson.trim() || 'Assembly Chairperson',
      secretary: secretary.trim() || 'Assembly Secretary',
      attendeesCount: Number(attendeesCount),
      agendaItems: finalAgenda,
      resolutions: [],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        <div className="px-5 py-4 bg-purple-50/70 border-b border-purple-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-800 text-white flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Convene LSA Kimana Meeting</h3>
              <p className="text-[11px] text-slate-500">Local Spiritual Assembly Agenda & Governance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Meeting Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Time
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Chairperson
              </label>
              <input
                type="text"
                value={chairperson}
                onChange={(e) => setChairperson(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Secretary
              </label>
              <input
                type="text"
                value={secretary}
                onChange={(e) => setSecretary(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Venue
              </label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Expected Attendees (Quorum $\ge$ 5)
              </label>
              <input
                type="number"
                min="1"
                max="9"
                value={attendeesCount}
                onChange={(e) => setAttendeesCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
          </div>

          {/* Agenda items list */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Consultation Agenda Items ({agendaItems.length})
            </label>
            <div className="space-y-2 mb-2">
              {agendaItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase text-purple-700 block">
                      {idx + 1}. {item.category.replace('_', ' ')}
                    </span>
                    <span className="font-semibold text-slate-800 line-clamp-1">{item.title}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAgenda(item.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add agenda row */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Add agenda topic for consultation..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px]"
              >
                <option value="institute_goals">Institute Goals</option>
                <option value="cluster_growth">Cluster Growth</option>
                <option value="nineteen_day_feast">19-Day Feast</option>
                <option value="community_welfare">Community Welfare</option>
                <option value="treasury">Cluster Fund</option>
              </select>
              <button
                type="button"
                onClick={handleAddAgenda}
                className="px-3 py-2 bg-purple-700 text-white font-bold rounded-xl"
              >
                Add
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-purple-900/20 active:scale-95 transition-all"
            >
              Convene Assembly Meeting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
