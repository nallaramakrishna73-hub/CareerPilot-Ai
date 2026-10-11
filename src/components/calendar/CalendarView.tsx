import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Video,
  ExternalLink,
  Download,
  CheckCircle2,
  AlertCircle,
  Building,
  Mail,
  Copy,
  Check,
  Trash2,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { CalendarEvent, CalendarEventType } from "../../types";
import { api } from "../../services/api";

export const CalendarView: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  // New event form state
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("Razorpay");
  const [eventType, setEventType] = useState<CalendarEventType>("Interview Round");
  const [date, setDate] = useState("2026-10-14");
  const [time, setTime] = useState("16:00");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [locationOrUrl, setLocationOrUrl] = useState("https://meet.google.com/abc-tech");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await api.getCalendarEvents();
      setEvents(data);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (event: CalendarEvent) => {
    const updated = await api.updateCalendarEvent(event.id, {
      completed: !event.completed,
    });
    setEvents(updated);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Remove this calendar event?")) {
      const updated = await api.deleteCalendarEvent(id);
      setEvents(updated);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    await api.addCalendarEvent({
      title,
      company,
      eventType,
      date,
      time,
      durationMinutes,
      locationOrUrl,
      notes,
      completed: false,
    });

    setShowAddModal(false);
    setTitle("");
    setNotes("");
    loadEvents();
  };

  const followUpTemplates = [
    {
      id: "post-interview",
      title: "Post-Interview Thank You & Next Steps (Send within 24h)",
      subject: "Thank You - [Role] Interview Round - [Candidate Name]",
      body: `Dear [Interviewer/Recruiter Name],

Thank you for taking the time to speak with me today regarding the [Role Title] position at [Company]. I really enjoyed learning more about your engineering team's work on [mention topic, e.g., low-latency microservices / UPI scale].

Our discussion reinforced my enthusiasm for the role, particularly how my background in React, Node.js, and high-concurrency PostgreSQL aligns with your current roadmap.

Please let me know if you need any additional code samples or references. I look forward to hearing about the next steps.

Best regards,
Ramakrishna Janhvi
+91 98480 12345`,
    },
    {
      id: "five-day-checkin",
      title: "Polite 5-Day Recruiter Status Follow-Up",
      subject: "Follow-Up on Application Status - [Role Title] - Ramakrishna Janhvi",
      body: `Hi [Recruiter Name],

I hope you are having a productive week.

I am writing to gently follow up on the status of my candidacy for the [Role Title] opening at [Company]. As mentioned, I am on a 30-day notice period and actively targeting opportunities in [City] with top engineering squads like yours.

Could you please share if there are any updates regarding the next evaluation round?

Thank you for your time and guidance.

Warm regards,
Ramakrishna Janhvi`,
    },
  ];

  const handleCopyTemplate = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate(id);
    setTimeout(() => setCopiedTemplate(null), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-[#3B3FD8]" /> Interview Calendar & Follow-Up Sync
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            One-click Google Calendar integration, iCal (.ics) exports, and automated recruiter follow-up workflows.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B3FD8] hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Event</span>
        </button>
      </div>

      {/* Main Grid: Scheduled Events vs Follow-Up Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 Cols): Scheduled Rounds List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Upcoming Interview Milestones ({events.length})
            </h3>
            <span className="text-xs text-slate-400">All times shown in IST (UTC+5:30)</span>
          </div>

          <div className="space-y-3">
            {events.map((event) => {
              const googleCalUrl = api.generateGoogleCalendarUrl(event);
              return (
                <div
                  key={event.id}
                  className={`p-5 rounded-3xl border transition-all ${
                    event.completed
                      ? "bg-slate-50 dark:bg-[#0B1437] border-slate-200 dark:border-slate-800 opacity-60"
                      : "bg-white dark:bg-[#111C44] border-slate-200 dark:border-slate-800 shadow-sm"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={event.completed}
                        onChange={() => handleToggleComplete(event)}
                        className="mt-1 w-4 h-4 rounded text-[#3B3FD8] cursor-pointer"
                        title="Mark as completed"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4
                            className={`font-bold text-sm sm:text-base ${
                              event.completed
                                ? "line-through text-slate-400"
                                : "text-slate-900 dark:text-white"
                            }`}
                          >
                            {event.title}
                          </h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              event.eventType === "Interview Round"
                                ? "bg-indigo-100 text-[#3B3FD8] dark:bg-indigo-950 dark:text-indigo-300"
                                : event.eventType === "Mock Practice"
                                ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                                : event.eventType === "Offer Deadline"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                            }`}
                          >
                            {event.eventType}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                          <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                            <Building className="w-3.5 h-3.5" /> {event.company}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-[#3B3FD8] dark:text-indigo-400 font-medium">
                            <Clock className="w-3.5 h-3.5" /> {event.date} at {event.time} IST ({event.durationMinutes}m)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="p-1 text-slate-300 hover:text-rose-500 rounded-lg transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {event.notes && (
                    <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#0B1437] p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <strong>Prep Note:</strong> {event.notes}
                    </p>
                  )}

                  {/* Sync Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Video className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[200px]">{event.locationOrUrl}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={googleCalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#3B3FD8] text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <CalendarIcon className="w-3.5 h-3.5 text-[#4285F4]" />
                        <span>Add to Google Calendar</span>
                        <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                      </a>

                      <button
                        onClick={() => api.generateIcsFile(event)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-all"
                        title="Download for Outlook/Apple Calendar"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>.ICS</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right (1 Col): Recruiter Follow-Up Templates */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#14B8A6]" /> Automated Follow-Up Email Scripts
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Professional communication templates optimized for Indian tech hiring cycles.
          </p>

          <div className="space-y-3.5">
            {followUpTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="p-4 rounded-3xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    {tpl.title}
                  </h4>
                  <button
                    onClick={() => handleCopyTemplate(tpl.id, tpl.body)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-[#3B3FD8] dark:text-indigo-400 flex items-center gap-1"
                  >
                    {copiedTemplate === tpl.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Script</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#0B1437] p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 line-clamp-4">
                  {tpl.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#111C44] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Add Calendar Event / Reminder
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Swiggy Machine Coding Round"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#0B1437] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#0B1437] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Event Type
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as CalendarEventType)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#0B1437] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Interview Round">Interview Round</option>
                    <option value="Mock Practice">Mock Practice</option>
                    <option value="Follow-up Reminder">Follow-up Reminder</option>
                    <option value="Offer Deadline">Offer Deadline</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#0B1437] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Time (IST)
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#0B1437] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Minutes
                  </label>
                  <input
                    type="number"
                    min={15}
                    max={240}
                    step={15}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#0B1437] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Meeting Link or Location
                </label>
                <input
                  type="text"
                  placeholder="https://meet.google.com/..."
                  value={locationOrUrl}
                  onChange={(e) => setLocationOrUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#0B1437] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Preparation Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="System design diagrams, question topics..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#0B1437] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#3B3FD8] text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
                >
                  Save to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
