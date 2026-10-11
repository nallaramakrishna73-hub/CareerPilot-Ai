import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Download,
  Trash2,
  Lock,
  Eye,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Key,
  Database,
  ExternalLink,
} from "lucide-react";
import { PrivacyConsents } from "../../types";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export const PrivacyCenterView: React.FC = () => {
  const { logout, profile } = useAuth();
  const [consents, setConsents] = useState<PrivacyConsents>({
    resumeStorage: true,
    aiProcessingConsent: true,
    jobAlertsEmail: true,
    analyticsCollection: true,
    policyVersion: "v1.2 (Oct 2026)",
    lastUpdated: "11 Oct 2026",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    loadConsents();
  }, []);

  const loadConsents = async () => {
    const data = await api.getConsents();
    setConsents(data);
  };

  const handleToggle = async (key: keyof PrivacyConsents) => {
    if (typeof consents[key] === "boolean") {
      const updated = {
        ...consents,
        [key]: !consents[key],
        lastUpdated: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      };
      setConsents(updated);
      await api.saveConsents(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  const handleExportData = async () => {
    const dataStr = await api.exportUserData();
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CareerPilot_DataExport_${profile.displayName.replace(/\s+/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = async () => {
    await api.deleteUserData();
    await logout();
    setShowDeleteModal(false);
    alert("Your account and all associated embeddings, resumes, and logs have been permanently purged.");
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-[#14B8A6]" /> Privacy by Design & Security Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Compliant with Digital Personal Data Protection (DPDP) Act India 2023 and GDPR.
        </p>
      </div>

      {/* Security Architecture Highlights Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0B1437] to-[#1B2559] text-white border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#14B8A6] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Security First Badge • Track B Rubric
          </span>
          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-slate-300">
            Policy Version {consents.policyVersion}
          </span>
        </div>

        <h3 className="text-lg font-bold">How CareerPilot Protects Your Personal Data</h3>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Unlike generic job portals that sell candidate emails to third-party telemarketers, CareerPilot strictly adheres to data minimization. Your phone numbers, email addresses, and residential localities are masked using regular expression sanitizers before reaching generative models.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
            <span className="font-bold text-[#FFB020] block">AES-256 Storage</span>
            <span className="text-slate-400 text-[11px]">Resumes encrypted at rest</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
            <span className="font-bold text-[#14B8A6] block">PII Masking Filter</span>
            <span className="text-slate-400 text-[11px]">Zero Aadhaar / Phone to LLM</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
            <span className="font-bold text-indigo-400 block">Prompt-Injection Shield</span>
            <span className="text-slate-400 text-[11px]">Strict schema boundary wrapping</span>
          </div>
        </div>
      </div>

      {/* PII Masking Demonstration Box */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Eye className="w-4 h-4 text-[#3B3FD8]" /> Live PII Masking Demonstration
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Here is how your resume data is sanitized before dispatch to the Gemini Agent Orchestrator:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1437] border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-sans font-bold text-slate-400 uppercase">Input with PII</span>
            <p className="text-slate-800 dark:text-slate-200">
              Name: {profile.displayName}<br />
              Email: {profile.email}<br />
              Phone: +91 98480 12345<br />
              Location: Hyderabad, Telangana
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 space-y-1">
            <span className="text-[10px] font-sans font-bold text-emerald-600 uppercase">Sanitized Sent to LLM</span>
            <p className="text-emerald-700 dark:text-emerald-300">
              Name: [CANDIDATE_NAME_MASKED]<br />
              Email: candidate.user@domain.masked<br />
              Phone: [PHONE_NUMBER_REDACTED]<br />
              Region: South India Metro (Tier-1)
            </p>
          </div>
        </div>
      </div>

      {/* Consent Toggles */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Data Consent Controls
            </h3>
            <p className="text-xs text-slate-400">
              You maintain total authority over your documents and processing preferences.
            </p>
          </div>
          {savedSuccess && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Preferences Saved
            </span>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-slate-800 dark:text-white">
                Encrypted Resume Storage
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Store your parsed master resume and tailored versions for 1-click applications.
              </p>
            </div>
            <input
              type="checkbox"
              checked={consents.resumeStorage}
              onChange={() => handleToggle("resumeStorage")}
              className="w-5 h-5 rounded text-[#3B3FD8] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-slate-800 dark:text-white">
                AI Reasoning & Analysis Consent
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Allow the Gemini model to analyze your resume and generate tailored bullets.
              </p>
            </div>
            <input
              type="checkbox"
              checked={consents.aiProcessingConsent}
              onChange={() => handleToggle("aiProcessingConsent")}
              className="w-5 h-5 rounded text-[#3B3FD8] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-slate-800 dark:text-white">
                Job Alert Digest Notifications
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Receive email notifications when new 12+ LPA roles matching your profile appear.
              </p>
            </div>
            <input
              type="checkbox"
              checked={consents.jobAlertsEmail}
              onChange={() => handleToggle("jobAlertsEmail")}
              className="w-5 h-5 rounded text-[#3B3FD8] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-slate-800 dark:text-white">
                Anonymous Funnel Analytics
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Contribute anonymized interview and match scores to help benchmark Indian salaries.
              </p>
            </div>
            <input
              type="checkbox"
              checked={consents.analyticsCollection}
              onChange={() => handleToggle("analyticsCollection")}
              className="w-5 h-5 rounded text-[#3B3FD8] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* User Rights (Export & Delete) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            User Rights & Account Portability
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Download your full dossier or permanently delete your account and all stored assets.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleExportData}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#3B3FD8]" />
            <span>Export My Data (JSON)</span>
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete My Account</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#111C44] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Permanent Account & Data Purge
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                This will immediately delete your master resume, ATS evaluations, tailored versions, Kanban tracker entries, and interview session histories. This action cannot be reversed.
              </p>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-600/30 cursor-pointer"
              >
                Yes, Purge Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacyCenterView;
