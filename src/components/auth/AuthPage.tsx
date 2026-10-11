import React, { useState } from "react";
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  TrendingUp,
  Cpu
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Logo from "../Logo";

interface AuthPageProps {
  onSuccess?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const { 
    signInWithEmail, 
    signUpWithEmail, 
    signInWithGoogle, 
    signInAsDemo, 
    authError, 
    clearAuthError, 
    loading 
  } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setLocalError(null);

    if (!email || !password) {
      setLocalError("Please enter both email and password.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, displayName || "Tech Candidate");
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      // Handled via context
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    clearAuthError();
    setLocalError(null);
    setSubmitting(true);
    try {
      await signInWithGoogle();
      if (onSuccess) onSuccess();
    } catch (err) {
      // Handled in context
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemo = () => {
    signInAsDemo();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="min-h-screen w-full flex bg-[#070D24] text-slate-100 overflow-x-hidden font-sans">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#3B3FD8]/25 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#14B8A6]/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-[#FFB020]/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row min-h-screen">
        {/* Left Side: Product Showcase & Blueprint Positioning */}
        <div className="flex-1 p-6 sm:p-10 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/80">
          <div>
            <Logo size="lg" showWordmark={true} showSubtitle={true} theme="dark" />

            <div className="mt-12 space-y-6 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#FFB020]" />
                <span>Capabl Job Search AI Agent Project • Track B</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                One Conversational Copilot for the{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14B8A6] via-indigo-400 to-[#FFB020]">
                  Indian Job Market
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Replaces six separate tools: unified Indian job search across Tier-1 and Tier-2 hubs, explainable match scores (LPA normalisation & notice-period fit), ATS resume studio, company intel, and voice-assisted mock interviews.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-10 max-w-xl">
              <div className="p-3.5 rounded-2xl bg-[#0B1437]/90 border border-slate-800 backdrop-blur-md">
                <div className="w-8 h-8 rounded-xl bg-indigo-900/60 text-indigo-400 flex items-center justify-center mb-2">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-semibold text-white">India-First Matching</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  LPA normalization, 15/30/60/90-day notice fit, metro vs tier-2 (Warangal/Nirmal) filters.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0B1437]/90 border border-slate-800 backdrop-blur-md">
                <div className="w-8 h-8 rounded-xl bg-teal-900/60 text-teal-400 flex items-center justify-center mb-2">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-semibold text-white">Explainable ATS Scoring</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Detailed 6-part rubric breakdown (keyword gap, quantified impact, parse safety).
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0B1437]/90 border border-slate-800 backdrop-blur-md">
                <div className="w-8 h-8 rounded-xl bg-amber-900/60 text-[#FFB020] flex items-center justify-center mb-2">
                  <Cpu className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-semibold text-white">Voice Mock Interviews</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Web Speech API voice input with 1-5 STAR rubric scoring & pace diagnostics.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0B1437]/90 border border-slate-800 backdrop-blur-md">
                <div className="w-8 h-8 rounded-xl bg-emerald-900/60 text-emerald-400 flex items-center justify-center mb-2">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-semibold text-white">Privacy by Design</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Explicit consent, PII masking before LLM, encrypted storage, and one-click GDPR export.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Prepared for: Ramakrishna Janhvi</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Firebase Config Active
            </span>
          </div>
        </div>

        {/* Right Side: Authentication Box */}
        <div className="w-full lg:w-[480px] p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="w-full max-w-sm mx-auto bg-[#0B1437]/95 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            {/* Header Tabs */}
            <div className="flex rounded-2xl bg-slate-900/80 p-1 border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  clearAuthError();
                  setLocalError(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                  mode === "signin"
                    ? "bg-[#3B3FD8] text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  clearAuthError();
                  setLocalError(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                  mode === "signup"
                    ? "bg-[#3B3FD8] text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-white">
                {mode === "signin" ? "Welcome Back" : "Join CareerPilot AI"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {mode === "signin"
                  ? "Access your unified job searches, resumes, and interview feedback."
                  : "Start searching across 30+ Indian tech roles with AI coaching."}
              </p>
            </div>

            {/* Error banner */}
            {(authError || localError) && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{authError || localError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === "signup" && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Ramakrishna Janhvi"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-900/90 border border-slate-800 focus:border-[#3B3FD8] focus:outline-none text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-900/90 border border-slate-800 focus:border-[#3B3FD8] focus:outline-none text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-900/90 border border-slate-800 focus:border-[#3B3FD8] focus:outline-none text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || loading}
                className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-[#3B3FD8] to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>{mode === "signin" ? "Sign In to CareerPilot" : "Create My Account"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="bg-[#0B1437] px-3 text-slate-500 font-semibold">Or continue with</span>
              </div>
            </div>

            {/* Google Firebase Auth Button */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={submitting || loading}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-3 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Instant Demo Account / Viva Fast Access */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 text-center">
              <button
                type="button"
                onClick={handleDemo}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-500/15 to-emerald-500/15 border border-teal-500/30 hover:border-teal-400 text-teal-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFB020]" />
                <span>Instant Demo Access (Ramakrishna Profile)</span>
              </button>
              <p className="text-[10px] text-slate-500 mt-2">
                Connected to Firebase Project: <code className="text-slate-400">career-pilot-ai-f5e8d</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
