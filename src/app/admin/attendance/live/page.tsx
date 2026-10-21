"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Radio,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Lock,
  RefreshCw,
  Save,
  Sparkles,
  AlertCircle,
  Play,
  RotateCcw,
} from "lucide-react";
import {
  COURSES,
  DEPARTMENTS,
  CLASSES,
  SECTIONS,
  SEMESTERS,
  SUBJECTS,
  PERIODS,
} from "@/lib/constants";
import { useToast } from "@/components/ToastContext";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function LiveAttendancePage() {
  const { showToast } = useToast();
  const todayStr = new Date().toISOString().split("T")[0];

  // Session Config
  const [sessionDate, setSessionDate] = useState(todayStr);
  const [course, setCourse] = useState(COURSES[0].name);
  const [department, setDepartment] = useState(COURSES[0].department);
  const [className, setClassName] = useState(CLASSES[2]); // Year 3
  const [section, setSection] = useState(SECTIONS[0]); // Section A
  const [semester, setSemester] = useState(SEMESTERS[4]); // Semester 5
  const [subjectCode, setSubjectCode] = useState("CS-501");
  const [subjectName, setSubjectName] = useState("Database Management Systems");
  const [facultyName, setFacultyName] = useState("Dr. Arvind Raghavan");
  const [periodNumber, setPeriodNumber] = useState("1");

  // Live Session State
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [liveSessionId, setLiveSessionId] = useState<string | null>(null);
  const [liveRecords, setLiveRecords] = useState<any[]>([]);
  const [startingSession, setStartingSession] = useState(false);
  const [updatingStudentId, setUpdatingStudentId] = useState<string | null>(null);
  const [finalizeConfirmOpen, setFinalizeConfirmOpen] = useState(false);
  const [closingSession, setClosingSession] = useState(false);

  // Sync Subject
  const handleSubjectChange = (code: string) => {
    setSubjectCode(code);
    const found = SUBJECTS.find((s) => s.code === code);
    if (found) setSubjectName(found.name);
  };

  // Start or restore live session
  const handleStartLiveSession = async () => {
    try {
      setStartingSession(true);
      const res = await fetch("/api/attendance/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionDate,
          course,
          department,
          className,
          section,
          semester,
          subjectName,
          subjectCode,
          facultyName,
          periodNumber,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to start live session.", "error");
        setStartingSession(false);
        return;
      }

      setLiveSessionId(data.session.id);
      setLiveRecords(
        data.session.records.map((r: any) => ({
          recordId: r.id,
          studentId: r.student.id,
          fullName: r.student.fullName,
          admissionNumber: r.student.admissionNumber,
          rollNumber: r.student.rollNumber,
          status: r.status,
          remarks: r.remarks || "",
        }))
      );
      setIsLiveActive(true);
      showToast(
        data.isReopened
          ? "Restored existing session for live roll call."
          : "Live roll call session initialized!",
        "success"
      );
    } catch {
      showToast("Network error starting live attendance.", "error");
    } finally {
      setStartingSession(false);
    }
  };

  // Instant Real-time update for a student
  const handleMarkStudent = async (studentId: string, status: "PRESENT" | "ABSENT" | "LATE" | "LEAVE") => {
    if (!liveSessionId) return;

    // Optimistic UI update
    setLiveRecords((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, status } : r))
    );
    setUpdatingStudentId(studentId);

    try {
      const res = await fetch("/api/attendance/live", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: liveSessionId,
          studentId,
          status,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to sync record");
      }
    } catch {
      showToast("Sync error: Unable to update student status in database.", "error");
    } finally {
      setUpdatingStudentId(null);
    }
  };

  // Finalize & Close Live Session
  const handleFinalizeSession = async () => {
    if (!liveSessionId) return;

    try {
      setClosingSession(true);
      const res = await fetch("/api/attendance/live", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: liveSessionId }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to finalize session.", "error");
        return;
      }

      showToast("Live session finalized and saved to database!", "success");
      setFinalizeConfirmOpen(false);
      setIsLiveActive(false);
      setLiveSessionId(null);
    } catch {
      showToast("Network error while finalizing session.", "error");
    } finally {
      setClosingSession(false);
    }
  };

  // Live Counters & Progress
  const totalStudents = liveRecords.length;
  const presentCount = liveRecords.filter((r) => r.status === "PRESENT").length;
  const absentCount = liveRecords.filter((r) => r.status === "ABSENT").length;
  const lateCount = liveRecords.filter((r) => r.status === "LATE").length;
  const leaveCount = liveRecords.filter((r) => r.status === "LEAVE").length;
  const percentagePresent =
    totalStudents > 0 ? Math.round(((presentCount + lateCount) / totalStudents) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/attendance"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Live Attendance Room
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1 pl-7">
            Real-time interactive attendance marking with instant auto-save to database
          </p>
        </div>

        {isLiveActive && (
          <div className="flex items-center gap-3 pl-7 sm:pl-0">
            <button
              onClick={() => setFinalizeConfirmOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
            >
              <Lock className="w-4 h-4" />
              <span>Finalize &amp; Close Session</span>
            </button>
          </div>
        )}
      </div>

      {/* When live session is NOT started yet */}
      {!isLiveActive ? (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs max-w-3xl mx-auto space-y-6">
          <div className="text-center max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-200 shadow-md shadow-rose-500/10">
              <Radio className="w-7 h-7 animate-pulse" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Initialize Real-time Roll Call</h2>
            <p className="text-xs text-slate-500 mt-1">
              Select your lecture slot. The live roster will load instantly and save each student status in real-time as you tap.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Session Date</label>
              <input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Course</label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
              >
                {COURSES.map((c) => (
                  <option key={c.code} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Class / Year</label>
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
              >
                {CLASSES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Section</label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
              >
                {SECTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
              <select
                value={subjectCode}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
              >
                {SUBJECTS.map((s) => (
                  <option key={s.code} value={s.code}>{s.code} - {s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Period</label>
              <select
                value={periodNumber}
                onChange={(e) => setPeriodNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
              >
                {PERIODS.map((p) => (
                  <option key={p.number} value={p.number}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleStartLiveSession}
              disabled={startingSession}
              className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {startingSession ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Initializing Live Session...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Open Live Attendance Session</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* When LIVE Session is active */
        <div className="space-y-6">
          {/* Live Session Status Banner & KPI Gauge */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold mb-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
                  LIVE ROLL CALL IN PROGRESS
                </div>
                <h2 className="text-xl sm:text-2xl font-bold">
                  {subjectName} ({subjectCode})
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {sessionDate} • Period {periodNumber} • {className} {section} • Faculty: {facultyName}
                </p>
              </div>

              {/* Attendance Rate Dial */}
              <div className="flex items-center gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-400">{percentagePresent}%</div>
                  <div className="text-[11px] text-slate-400 font-semibold">Attendance Rate</div>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-emerald-400 flex items-center justify-center font-bold text-xs text-white">
                  {presentCount + lateCount}/{totalStudents}
                </div>
              </div>
            </div>

            {/* Live Counter Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-emerald-950/60 border border-emerald-700/60 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-400 font-bold uppercase">Present</span>
                  <div className="text-xl font-black text-emerald-100">{presentCount}</div>
                </div>
                <CheckCircle2 className="w-6 h-6 text-emerald-500/40" />
              </div>

              <div className="bg-rose-950/60 border border-rose-700/60 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-rose-400 font-bold uppercase">Absent</span>
                  <div className="text-xl font-black text-rose-100">{absentCount}</div>
                </div>
                <XCircle className="w-6 h-6 text-rose-500/40" />
              </div>

              <div className="bg-amber-950/60 border border-amber-700/60 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-amber-400 font-bold uppercase">Late</span>
                  <div className="text-xl font-black text-amber-100">{lateCount}</div>
                </div>
                <Clock className="w-6 h-6 text-amber-500/40" />
              </div>

              <div className="bg-sky-950/60 border border-sky-700/60 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-sky-400 font-bold uppercase">Leave</span>
                  <div className="text-xl font-black text-sky-100">{leaveCount}</div>
                </div>
                <Sparkles className="w-6 h-6 text-sky-500/40" />
              </div>
            </div>
          </div>

          {/* Interactive Roster Grid */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Interactive Student Roster ({liveRecords.length} Students)
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                Tap button to immediately update database
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {liveRecords.map((r) => (
                <div
                  key={r.studentId}
                  className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                      {r.rollNumber}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{r.fullName}</h4>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span className="font-mono text-indigo-600 font-semibold">{r.admissionNumber}</span>
                        {updatingStudentId === r.studentId && (
                          <span className="text-indigo-600 font-bold animate-pulse text-[10px]">
                            • Saving...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Real-time Status Buttons */}
                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleMarkStudent(r.studentId, "PRESENT")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                        r.status === "PRESENT"
                          ? "bg-emerald-600 text-white ring-2 ring-emerald-600/30 scale-105"
                          : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                    >
                      Present
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMarkStudent(r.studentId, "ABSENT")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                        r.status === "ABSENT"
                          ? "bg-rose-600 text-white ring-2 ring-rose-600/30 scale-105"
                          : "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700"
                      }`}
                    >
                      Absent
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMarkStudent(r.studentId, "LATE")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                        r.status === "LATE"
                          ? "bg-amber-500 text-white ring-2 ring-amber-500/30 scale-105"
                          : "bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700"
                      }`}
                    >
                      Late
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMarkStudent(r.studentId, "LEAVE")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                        r.status === "LEAVE"
                          ? "bg-sky-600 text-white ring-2 ring-sky-600/30 scale-105"
                          : "bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-700"
                      }`}
                    >
                      Leave
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Changes are saved to the database immediately.
              </span>
              <button
                type="button"
                onClick={() => setFinalizeConfirmOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
              >
                <Lock className="w-4 h-4" />
                <span>Finalize Session</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation modal before closing session */}
      <ConfirmDialog
        isOpen={finalizeConfirmOpen}
        title="Finalize Live Attendance Session?"
        message="This will lock the live session, mark it as completed, and record an audit entry. You will be able to review and export it from Attendance History."
        confirmText="Finalize & Save"
        cancelText="Continue Live Marking"
        onConfirm={handleFinalizeSession}
        onCancel={() => setFinalizeConfirmOpen(false)}
      />
    </div>
  );
}
