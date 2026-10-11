import React, { useState, useEffect } from "react";
import {
  Kanban,
  Plus,
  Calendar,
  Building,
  MapPin,
  Clock,
  MoreVertical,
  CheckCircle,
  XCircle,
  FileText,
  Trash2,
  Edit2,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Application, ApplicationStatus } from "../../types";
import { api } from "../../services/api";

const COLUMNS: { id: ApplicationStatus; label: string; color: string; badgeBg: string }[] = [
  { id: "Saved", label: "Saved", color: "border-slate-300 dark:border-slate-700", badgeBg: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  { id: "Applied", label: "Applied", color: "border-indigo-400 dark:border-indigo-600", badgeBg: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300" },
  { id: "Interview", label: "Interview", color: "border-amber-400 dark:border-amber-600", badgeBg: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  { id: "Offer", label: "Offer", color: "border-emerald-400 dark:border-emerald-600", badgeBg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  { id: "Rejected", label: "Archived / Rejected", color: "border-rose-300 dark:border-rose-800", badgeBg: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300" },
];

export const TrackerView: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New application form state
  const [newRole, setNewRole] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newLocation, setNewLocation] = useState("Bengaluru");
  const [newLpa, setNewLpa] = useState("16-24 LPA");
  const [newStatus, setNewStatus] = useState<ApplicationStatus>("Applied");
  const [newNotes, setNewNotes] = useState("");
  const [newFollowUp, setNewFollowUp] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const list = await api.getApplications();
      setApplications(list);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId: string, nextStatus: ApplicationStatus) => {
    const updated = await api.updateApplication(appId, { status: nextStatus });
    setApplications(updated);
  };

  const handleDelete = async (appId: string) => {
    if (confirm("Are you sure you want to remove this application from the tracker?")) {
      const updated = await api.deleteApplication(appId);
      setApplications(updated);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole || !newCompany) return;

    await api.addApplication({
      jobId: "custom-" + Date.now(),
      jobTitle: newRole,
      company: newCompany,
      location: newLocation,
      lpa: newLpa,
      status: newStatus,
      appliedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      followUpDate: newFollowUp || undefined,
      notes: newNotes || "Added via Tracker.",
    });

    setShowAddModal(false);
    setNewRole("");
    setNewCompany("");
    setNewNotes("");
    setNewFollowUp("");
    loadApplications();
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Kanban className="w-6 h-6 text-[#3B3FD8]" /> Application Pipeline Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Kanban stages, interview schedule reminders, follow-ups, and negotiation notes.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B3FD8] hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Application</span>
        </button>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const colApps = applications.filter((a) => a.status === col.id);

          return (
            <div
              key={col.id}
              className="flex flex-col min-w-[240px] bg-slate-100/70 dark:bg-[#0B1437]/70 rounded-3xl p-3.5 border border-slate-200/80 dark:border-slate-800"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-2 py-1.5 mb-3">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {col.label}
                </span>
                <span
                  className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${col.badgeBg}`}
                >
                  {colApps.length}
                </span>
              </div>

              {/* Application Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colApps.length === 0 ? (
                  <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-[11px] text-slate-400">
                    No applications
                  </div>
                ) : (
                  colApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-2xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-2.5 group"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
                            {app.jobTitle}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-semibold">
                            <Building className="w-3 h-3" /> {app.company}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-[#3B3FD8] dark:text-indigo-400">
                          {app.lpa}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {app.location}
                        </span>
                      </div>

                      {app.followUpDate && (
                        <div className="flex items-center gap-1.5 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-lg">
                          <Clock className="w-3 h-3" />
                          <span>Follow up: {app.followUpDate}</span>
                        </div>
                      )}

                      {app.notes && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 italic bg-slate-50 dark:bg-[#0B1437] p-2 rounded-xl">
                          "{app.notes}"
                        </p>
                      )}

                      {/* Move Stage Selector */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Move:</span>
                        <select
                          value={app.status}
                          onChange={(e) =>
                            handleStatusChange(app.id, e.target.value as ApplicationStatus)
                          }
                          className="text-[10px] font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 border-none px-2 py-1 text-slate-700 dark:text-slate-200 focus:ring-0 cursor-pointer"
                        >
                          {COLUMNS.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#111C44] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Add Role to Pipeline
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
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Role Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Backend Engineer"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#0B1437] border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#3B3FD8] text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Swiggy or Razorpay"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#0B1437] border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#3B3FD8] text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#0B1437] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    LPA Band
                  </label>
                  <input
                    type="text"
                    value={newLpa}
                    onChange={(e) => setNewLpa(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#0B1437] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#0B1437] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                >
                  {COLUMNS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Referral contact or round feedback..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#0B1437] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#3B3FD8] text-white text-xs font-semibold shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackerView;
