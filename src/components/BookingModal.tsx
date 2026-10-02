import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Facilitator, CoreActivityType } from '../types';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  BookOpen,
  Award,
  Sparkles,
} from 'lucide-react';

export const BookingModal: React.FC = () => {
  const {
    bookingModalOpen,
    setBookingModalOpen,
    selectedFacilitatorForBooking,
    neighborhoods,
    scheduleSession,
  } = useApp();

  // Selected date & time matching the template's calendar horizontal buttons
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('02:00 PM - 04:00 PM');
  const [activityType, setActivityType] = useState<CoreActivityType>('junior_youth');
  const [title, setTitle] = useState('');
  const [neighborhood, setNeighborhood] = useState(
    selectedFacilitatorForBooking?.primaryNeighborhood || 'Kimana Central'
  );
  const [venue, setVenue] = useState('');
  const [expectedParticipants, setExpectedParticipants] = useState(12);
  const [notes, setNotes] = useState('');

  if (!bookingModalOpen || !selectedFacilitatorForBooking) return null;

  // Generate 7 upcoming dates (matching the horizontal M 12, T 13, W 14... row in the template)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const calendarDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      fullDate: d.toISOString().split('T')[0],
      dayName: days[d.getDay()],
      dayNum: d.getDate(),
      month: months[d.getMonth()],
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
    };
  });

  const timeSlots = [
    '09:00 AM - 11:00 AM',
    '10:30 AM - 12:30 PM',
    '02:00 PM - 04:00 PM',
    '04:30 PM - 06:30 PM',
    '06:30 PM - 08:30 PM',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDate = calendarDates[selectedDateIndex].fullDate;
    const finalTitle = title.trim() || `${selectedFacilitatorForBooking.name} - ${activityType.replace('_', ' ')} Milestone`;
    const finalVenue = venue.trim() || `${neighborhood} Community Gathering Place`;

    scheduleSession({
      title: finalTitle,
      activityType,
      facilitatorName: selectedFacilitatorForBooking.name,
      facilitatorId: selectedFacilitatorForBooking.id,
      neighborhood,
      date: finalDate,
      time: selectedTimeSlot,
      status: 'scheduled',
      venue: finalVenue,
      notes,
      participantsExpected: Number(expectedParticipants),
      cycleNumber: 24,
    });

    setBookingModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-rose-50 via-white to-rose-50/50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#882455] text-white flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Schedule Activity Milestone</h3>
              <p className="text-[11px] text-slate-500 font-medium">Automated dispatch with push reminders</p>
            </div>
          </div>
          <button
            onClick={() => setBookingModalOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Facilitator Highlight Card (matching Doctor Card in template) */}
          <div className="p-3.5 bg-rose-50/60 border border-rose-100 rounded-2xl flex items-center gap-3">
            <img
              src={selectedFacilitatorForBooking.avatarUrl}
              alt={selectedFacilitatorForBooking.name}
              className="w-14 h-14 rounded-xl object-cover ring-2 ring-white shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 truncate">
                  {selectedFacilitatorForBooking.name}
                </span>
                <span className="text-[11px] font-bold text-[#882455] bg-white px-2 py-0.5 rounded-full border border-rose-100 shadow-2xs">
                  ★ {selectedFacilitatorForBooking.rating}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 truncate mt-0.5 font-medium">
                {selectedFacilitatorForBooking.role}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                <span>📍 {selectedFacilitatorForBooking.primaryNeighborhood}</span>
                <span>·</span>
                <span>👥 {selectedFacilitatorForBooking.participantsReached} accompanied</span>
              </div>
            </div>
          </div>

          {/* Activity Type Selection */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Activity Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'junior_youth', label: 'Junior Youth' },
                { type: 'children_class', label: "Children's Class" },
                { type: 'study_circle', label: 'Study Circle' },
                { type: 'devotional', label: 'Devotional' },
                { type: 'home_visit', label: 'Home Visit' },
                { type: 'youth_service', label: 'Youth Service' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.type}
                  onClick={() => setActivityType(item.type as CoreActivityType)}
                  className={`py-2 px-2 rounded-xl text-center font-semibold text-[11px] border transition-all ${
                    activityType === item.type
                      ? 'bg-[#882455] text-white border-[#882455] shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-rose-50/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Session Title */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Milestone / Session Title
            </label>
            <input
              type="text"
              placeholder={`e.g., Stars of Kimana Session 8 or Ruhi Book 1 Intensive`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#882455]/20 focus:border-[#882455]"
            />
          </div>

          {/* Horizontal Date Picker (matching template's exact calendar row) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Select Date
              </label>
              <span className="text-[11px] text-[#882455] font-semibold">
                {calendarDates[selectedDateIndex].month} 2026
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {calendarDates.map((item, idx) => {
                const isSelected = selectedDateIndex === idx;
                return (
                  <button
                    type="button"
                    key={item.fullDate}
                    onClick={() => setSelectedDateIndex(idx)}
                    className={`shrink-0 w-14 py-2.5 rounded-2xl flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#882455] text-white shadow-md shadow-[#882455]/25 transform scale-105'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-rose-50/40'
                    }`}
                  >
                    <span className={`text-[10px] font-medium ${isSelected ? 'text-rose-100' : 'text-slate-400'}`}>
                      {item.dayName}
                    </span>
                    <span className="text-base font-extrabold mt-0.5">
                      {item.dayNum}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots (matching template) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Time Slot
            </label>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setSelectedTimeSlot(slot)}
                  className={`py-2 px-3 rounded-xl text-center text-xs font-semibold border transition-all ${
                    selectedTimeSlot === slot
                      ? 'bg-rose-100/70 text-[#882455] border-[#882455] font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-rose-50/30'
                  }`}
                >
                  <Clock className="w-3 h-3 inline mr-1 text-[#882455]" />
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Neighborhood & Expected Participants */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Neighborhood
              </label>
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#882455]/20 focus:border-[#882455] font-medium"
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
                Expected Souls
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={expectedParticipants}
                onChange={(e) => setExpectedParticipants(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#882455]/20 focus:border-[#882455] font-bold"
              />
            </div>
          </div>

          {/* Venue & Notes */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Venue / Gathering Point
            </label>
            <input
              type="text"
              placeholder="e.g., Acacia Tree grounds / Grace's Veranda / Isinet Library"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#882455]/20 focus:border-[#882455]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Accompaniment Notes & Agenda
            </label>
            <textarea
              rows={2}
              placeholder="e.g., Lesson chapter, prayers to memorize, youth service activity supplies..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#882455]/20 focus:border-[#882455]"
            />
          </div>

          {/* Sticky CTA matching template */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-[#882455] hover:bg-[#721a44] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-[#882455]/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-rose-200" />
              Confirm Automated Schedule
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-2 font-medium">
              Automated push reminders and WhatsApp notices will be queued
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
