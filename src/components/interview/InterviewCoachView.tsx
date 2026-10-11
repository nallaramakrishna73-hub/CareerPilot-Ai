import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Sparkles,
  Award,
  RefreshCw,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BarChart2,
  Volume2,
  Clock,
  ArrowRight,
  TrendingUp,
  Flame,
} from "lucide-react";
import { InterviewQuestion, InterviewTurn } from "../../types";
import { scoreInterviewAnswer } from "../../services/gemini";
import confetti from "canvas-confetti";

export const InterviewCoachView: React.FC = () => {
  const [role, setRole] = useState("Full Stack Engineer (Node & React)");
  const [level, setLevel] = useState<"Fresher (0-1 yrs)" | "Mid-Level (2-4 yrs)" | "Senior (5+ yrs)">("Mid-Level (2-4 yrs)");
  
  const questions: InterviewQuestion[] = [
    {
      id: "q-1",
      category: "System Design",
      question: "How would you design an idempotent payment processing endpoint in Node.js to prevent double-charging users during network retries?",
      expectedConcepts: ["Idempotency-Key header", "Redis distributed lock", "PostgreSQL transaction", "Database unique constraint"],
    },
    {
      id: "q-2",
      category: "Behavioral",
      question: "Describe a production outage or critical bug you encountered in a previous project. Walk me through how you diagnosed, mitigated, and resolved it using the STAR format.",
      expectedConcepts: ["Situation", "Task", "Action taken (metrics/logs)", "Result (downtime reduced, post-mortem)"],
    },
    {
      id: "q-3",
      category: "Coding / Core CS",
      question: "How does the Node.js event loop handle asynchronous I/O versus CPU-intensive workloads? When should you offload work to Worker Threads?",
      expectedConcepts: ["Libuv thread pool", "Event loop phases", "Call stack blocking", "Worker Threads vs Child Processes"],
    },
    {
      id: "q-4",
      category: "Scenario",
      question: "You have 30 days notice and receive an offer with 18 LPA, but another dream company asks you to wait 2 weeks for their final round. How would you handle this communication professionally?",
      expectedConcepts: ["Transparency with HR", "Holding period request", "Evaluating offer expiry", "Professional ethics"],
    },
  ];

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [turns, setTurns] = useState<InterviewTurn[]>([]);
  const [activeTurnResult, setActiveTurnResult] = useState<InterviewTurn | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API if supported
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-IN"; // English (India)

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setAnswer((prev) => (prev ? prev + " " + transcript : transcript));
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) {
      alert("Web Speech API is not supported in this browser. You can type your answer in the text box.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const currentQ = questions[currentQIndex];

  const handleSubmitAnswer = async () => {
    if (!answer.trim() || evaluating) return;
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setEvaluating(true);
    try {
      const result = await scoreInterviewAnswer(currentQ.question, answer, role);

      // Filler words analysis (Blueprint Section 6.4)
      const fillers = ["basically", "like", "actually", "um", "uh", "you know", "kind of"];
      const detectedFillers: string[] = [];
      const words = answer.toLowerCase().split(/\s+/);
      fillers.forEach((f) => {
        if (words.includes(f)) detectedFillers.push(f);
      });

      const turn: InterviewTurn = {
        id: "turn-" + Date.now(),
        question: currentQ.question,
        userAnswer: answer,
        timestamp: "Just now",
        scores: result.scores,
        quotedJustification: result.quotedJustification,
        feedback: result.feedback,
        improvementTip: result.improvementTip,
        speechMetrics: {
          wordCount: words.length,
          fillerWordsDetected: detectedFillers,
          wordsPerMinute: Math.min(160, Math.max(90, Math.round(words.length * 1.5))),
        },
      };

      setActiveTurnResult(turn);
      setTurns((prev) => [turn, ...prev]);

      if (turn.scores.overall >= 80) {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    setActiveTurnResult(null);
    setAnswer("");
    setCurrentQIndex((prev) => (prev + 1) % questions.length);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Mic className="w-6 h-6 text-[#3B3FD8]" /> AI Mock Interview Coach
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Voice-enabled practice with the 1 to 5 STAR rubric (Relevance, Structure, Technical Depth, Clarity).
          </p>
        </div>

        {/* Role & Level Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#3B3FD8]"
          >
            <option value="Full Stack Engineer (Node & React)">Full Stack (Node & React)</option>
            <option value="Backend Platform Engineer (Go / Java)">Backend Platform (Go / Java)</option>
            <option value="Frontend Specialist (React / Next.js)">Frontend React / Next.js</option>
            <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
          </select>

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as any)}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#3B3FD8]"
          >
            <option value="Fresher (0-1 yrs)">Fresher (0-1 yrs)</option>
            <option value="Mid-Level (2-4 yrs)">Mid-Level (2-4 yrs)</option>
            <option value="Senior (5+ yrs)">Senior (5+ yrs)</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Active Question & Rubric Scoring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 Cols): Question Card & Answer Workspace */}
        <div className="lg:col-span-2 space-y-5">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-[#3B3FD8] dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {currentQ.category}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Question {currentQIndex + 1} of {questions.length}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
              {currentQ.question}
            </h2>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
              <span className="font-semibold text-slate-400">Key Concepts Interviewers Look For:</span>
              {currentQ.expectedConcepts.map((concept, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* Answer Box with Web Speech API button */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Your Spoken or Written Response
              </label>

              {/* Web Speech API Mic Toggle */}
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  isListening
                    ? "bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" />
                    <span>Listening... (Click to stop)</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5 text-rose-500" />
                    <span>Speak with Microphone</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              rows={6}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Structure your answer using the STAR method:
Situation: In my previous fintech project...
Task: I needed to ensure zero duplicate payment charges...
Action: I implemented an Idempotency-Key in the Redis cache and wrapped the PostgreSQL ledger in a serializable transaction...
Result: We eliminated double deductions across 15,000 daily webhooks."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1437] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-[#3B3FD8] leading-relaxed resize-none"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-400">
                Word count: {answer.trim() ? answer.trim().split(/\s+/).length : 0} words
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  Skip Question
                </button>
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={!answer.trim() || evaluating}
                  className="px-5 py-2.5 rounded-xl bg-[#3B3FD8] hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer"
                >
                  {evaluating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Judging Answer with Rubric...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-[#FFB020]" />
                      <span>Score My Answer</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right (1 Col): Active Evaluation Feedback & Progress */}
        <div className="space-y-5">
          {activeTurnResult ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3B3FD8] dark:text-indigo-400">
                  Rubric Assessment
                </span>
                <div className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                  {activeTurnResult.scores.overall}/100
                </div>
              </div>

              {/* 4 Pillars Breakdown (1 to 5) */}
              <div className="space-y-3">
                {/* 1. Relevance */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">1. Relevance</span>
                    <span className="text-[#3B3FD8] dark:text-indigo-400">{activeTurnResult.scores.relevance} / 5</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-[#3B3FD8] rounded-full"
                      style={{ width: `${(activeTurnResult.scores.relevance / 5) * 100}%` }}
                    />
                  </div>
                </div>

                {/* 2. STAR Structure */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">2. Structure (STAR)</span>
                    <span className="text-[#14B8A6]">{activeTurnResult.scores.structureStar} / 5</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-[#14B8A6] rounded-full"
                      style={{ width: `${(activeTurnResult.scores.structureStar / 5) * 100}%` }}
                    />
                  </div>
                </div>

                {/* 3. Technical Depth */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">3. Technical Depth</span>
                    <span className="text-[#FFB020]">{activeTurnResult.scores.technicalDepth} / 5</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-[#FFB020] rounded-full"
                      style={{ width: `${(activeTurnResult.scores.technicalDepth / 5) * 100}%` }}
                    />
                  </div>
                </div>

                {/* 4. Clarity */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">4. Clarity</span>
                    <span className="text-emerald-500">{activeTurnResult.scores.clarity} / 5</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${(activeTurnResult.scores.clarity / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Speech & Pace diagnostics */}
              {activeTurnResult.speechMetrics && (
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B1437] border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Estimated Speaking Pace:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {activeTurnResult.speechMetrics.wordsPerMinute} WPM (Ideal: 120-150)
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Filler Words Detected:</span>
                    <span className="font-semibold text-amber-500">
                      {activeTurnResult.speechMetrics.fillerWordsDetected.length > 0
                        ? activeTurnResult.speechMetrics.fillerWordsDetected.join(", ")
                        : "None (Clean articulation!)"}
                    </span>
                  </div>
                </div>
              )}

              {/* Justification & Feedback */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-2 text-xs">
                <h5 className="font-bold text-[#3B3FD8] dark:text-indigo-300">Examiner Justification</h5>
                <p className="text-slate-600 dark:text-slate-300 italic">
                  "{activeTurnResult.quotedJustification}"
                </p>
                <p className="text-slate-700 dark:text-slate-200 font-medium">
                  {activeTurnResult.feedback}
                </p>
              </div>

              {/* Improvement tip */}
              <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-300">
                <strong>Next step:</strong> {activeTurnResult.improvementTip}
              </div>

              <button
                onClick={handleNextQuestion}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Practice Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111C44] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-[#FFB020]" /> 1 to 5 STAR Rubric Standards
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Interviews for Indian tech firms evaluate candidates on structured thinking. Answer using:
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1437]">
                  <strong className="text-[#3B3FD8]">S - Situation:</strong> Set the context and business scale.
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1437]">
                  <strong className="text-[#14B8A6]">T - Task:</strong> The specific engineering responsibility.
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1437]">
                  <strong className="text-[#FFB020]">A - Action:</strong> Tools, database queries, and architectural steps.
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1437]">
                  <strong className="text-emerald-500">R - Result:</strong> Latency reduced, TPS scaled, impact.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewCoachView;
