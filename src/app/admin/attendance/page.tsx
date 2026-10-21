"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarCheck2,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  AlertCircle,
  Save,
  Radio,
  FileSpreadsheet,
  Printer,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import {
  COURSES,
  DEPARTMENTS,
  CLASSES,
  SECTIONS,
  SEMESTERS,
  SUBJECTS,
  PERIODS,
  ACADEMIC_SESSIONS,
  ATTENDANCE_STATUS_COLORS,
} from "@/lib/constants";
import { useToast } from "@/components/ToastContext";
import ConfirmDialog from "@/components/ConfirmDialog";

interface StudentRosterItem {
  id: string;
  fullName: string;
  admissionNumber: string;
  rollNumber: string;
  course: string;
  className: string;
  section: string;
}

interface StudentAttendanceEntry {
  studentId: string;
  student: StudentRosterItem;
  status: "PRESENT" | "ABSENT" | "LATE" | "LEAVE";
  remarks: string;
}

export default function AttendanceManagementPage() {
  const { showToast } = useToast();
  const todayStr = new Date().toISOString().split("T")[0];

  // Active Tab: "NEW_SESSION" or "SAVED_HISTORY"
  const [activeTab, setActiveTab] = useState<"NEW_SESSION" | "SAVED_HISTORY">("NEW_SESSION");

  // Session Form State
  const [sessionDate, setSessionDate] = useState(todayStr);
  const [course, setCourse] = useState(COURSES[0].name);
  const [department, setDepartment] = useState(COURSES[0].department);
  const [className, setClassName] = useState(CLASSES[2]); // Year 3
  const [section, setSection] = useState(SECTIONS[0]); // Section A
  const [semester, setSemester] = useState(SEMESTERS[4]); // Semester 5
  const [academicSession, setAcademicSession] = useState(ACADEMIC_SESSIONS[0]);
  const [subjectCode, setSubjectCode] = useState("CS-501");
  const [subjectName, setSubjectName] = useState("Database Management Systems");
  const [facultyName, setFacultyName] = useState("Dr. Arvind Raghavan");
  const [periodNumber, setPeriodNumber] = useState("1");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  // Roster & Attendance Entries
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [attendanceEntries, setAttendanceEntries] = useState<StudentAttendanceEntry[]>([]);
  const [savingSession, setSavingSession] = useState(false);
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [overwriteConfirmed, setOverwriteConfirmed] = useState(false);

  // Saved Records State & Filters
  const [savedSessions, setSavedSessions] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [searchStudent, setSearchStudent] = useState("");
  const [filterClass, setFilterClass] = useState("");

  // Edit / View Modal
  const [selectedSessionForView, setSelectedSessionForView] = useState<any | null>(null);
  const [isEditingSession, setIsEditingSession] = useState(false);
  const [editingRecords, setEditingRecords] = useState<any[]>([]);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null);

  // Sync Department when course changes
  const handleCourseChange = (newCourse: string) => {
    setCourse(newCourse);
    const found = COURSES.find((c) => c.name === newCourse);
    if (found) setDepartment(found.department);
  };

  // Sync Subject details when subject dropdown changes
  const handleSubjectChange = (code: string) => {
    setSubjectCode(code);
    const found = SUBJECTS.find((s) => s.code === code);
    if (found) setSubjectName(found.name);
  };

  // Sync Period times
  const handlePeriodChange = (num: string) => {
    setPeriodNumber(num);
    const p = PERIODS.find((per) => per.number === num);
    if (p) {
      setStartTime(p.start);
      setEndTime(p.end);
    }
  };

  // Fetch roster whenever class, section, or course changes
  const fetchRoster = async () => {
    try {
      setLoadingRoster(true);
      const params = new URLSearchParams({ course, className, section });
      const res = await fetch(`/api/students/roster?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        const entries: StudentAttendanceEntry[] = data.students.map((st: StudentRosterItem) => ({
          studentId: st.id,
          student: st,
          status: "PRESENT", // Default to present
          remarks: "",
        }));
        setAttendanceEntries(entries);
      }
    } catch (e: any) {
      showToast("Failed to load class roster.", "error");
    } finally {
      setLoadingRoster(false);
    }
  };

  useEffect(() => {
    fetchRoster();
  }, [course, className, section]);

  // Fetch saved attendance sessions for history tab
  const fetchSavedSessions = async () => {
    try {
      setLoadingHistory(true);
      const params = new URLSearchParams();
      if (filterDate) params.set("date", filterDate);
      if (filterClass) params.set("className", filterClass);
      if (filterSubject) params.set("subjectCode", filterSubject);

      const res = await fetch(`/api/attendance?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setSavedSessions(data.sessions);
      }
    } catch {
      showToast("Failed to load attendance history.", "error");
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeTab === "SAVED_HISTORY") {
      fetchSavedSessions();
    }
  }, [activeTab, filterDate, filterClass, filterSubject]);

  // Bulk status changers
  const handleMarkAll = (status: "PRESENT" | "ABSENT" | "LATE" | "LEAVE") => {
    setAttendanceEntries((prev) =>
      prev.map((e) => ({
        ...e,
        status,
      }))
    );
    showToast(`Marked all students as ${status}.`, "info");
  };

  const handleStatusChange = (
    studentId: string,
    status: "PRESENT" | "ABSENT" | "LATE" | "LEAVE"
  ) => {
    setAttendanceEntries((prev) =>
      prev.map((e) => (e.studentId === studentId ? { ...e, status } : e))
    );
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendanceEntries((prev) =>
      prev.map((e) => (e.studentId === studentId ? { ...e, remarks } : e))
    );
  };

  // Submit attendance to server
  const handleSaveAttendance = async () => {
    if (attendanceEntries.length === 0) {
      showToast("Cannot save empty roster. No students enrolled in this section.", "warning");
      return;
    }

    try {
      setSavingSession(true);
      const payload = {
        sessionDate,
        course,
        department,
        className,
        section,
        semester,
        academicSession,
        subjectName,
        subjectCode,
        facultyName,
        periodNumber,
        startTime,
        endTime,
        records: attendanceEntries.map((e) => ({
          studentId: e.studentId,
          status: e.status,
          remarks: e.remarks,
        })),
        overwriteExisting: overwriteConfirmed,
      };

      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          // Duplicate session slot warning
          showToast(data.error, "warning");
          if (confirm("Duplicate session slot detected! Do you want to overwrite and update the existing attendance record for this period?")) {
            setOverwriteConfirmed(true);
            setConfirmSaveOpen(true);
          }
        } else {
          showToast(data.error || "Failed to save attendance.", "error");
        }
        setSavingSession(false);
        return;
      }

      showToast(data.message || "Attendance saved successfully!", "success");
      setConfirmSaveOpen(false);
      setOverwriteConfirmed(false);
      setActiveTab("SAVED_HISTORY");
    } catch (e: any) {
      showToast("Network error occurred while saving attendance.", "error");
    } finally {
      setSavingSession(false);
    }
  };

  // View / Edit Session modal logic
  const handleOpenViewSession = (session: any) => {
    setSelectedSessionForView(session);
    setEditingRecords(
      session.records.map((r: any) => ({
        id: r.id,
        studentId: r.student.id,
        fullName: r.student.fullName,
        rollNumber: r.student.rollNumber,
        admissionNumber: r.student.admissionNumber,
        status: r.status,
        remarks: r.remarks || "",
      }))
    );
    setIsEditingSession(false);
  };

  const handleSaveEditedSession = async () => {
    if (!selectedSessionForView) return;

    try {
      setSavingEdit(true);
      const res = await fetch(`/api/attendance/${selectedSessionForView.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          records: editingRecords,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to update attendance.", "error");
        return;
      }

      showToast("Attendance records updated successfully with audit trail.", "success");
      setIsEditingSession(false);
      fetchSavedSessions();
    } catch {
      showToast("Network error while updating records.", "error");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteSession = async () => {
    if (!deleteSessionId) return;

    try {
      const res = await fetch(`/api/attendance/${deleteSessionId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast("Attendance session deleted successfully.", "success");
        setDeleteSessionId(null);
        setSelectedSessionForView(null);
        fetchSavedSessions();
      } else {
        showToast(data.error || "Failed to delete session.", "error");
      }
    } catch {
      showToast("Network error.", "error");
    }
  };

  // Summary counts for current session
  const presentCount = attendanceEntries.filter((e) => e.status === "PRESENT").length;
  const absentCount = attendanceEntries.filter((e) => e.status === "ABSENT").length;
  const lateCount = attendanceEntries.filter((e) => e.status === "LATE").length;
  const leaveCount = attendanceEntries.filter((e) => e.status === "LEAVE").length;
  const totalCount = attendanceEntries.length;
  const currentRate = totalCount > 0 ? Math.round(((presentCount + lateCount) / totalCount) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <CalendarCheck2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Attendance Management
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Record batch lecture attendance, audit past records, and export reports
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/attendance/live"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all hover:scale-105"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Switch to Live Roll Call</span>
          </Link>
          <a
            href="/api/reports/export"
            download
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab("NEW_SESSION")}
          className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "NEW_SESSION"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <CalendarCheck2 className="w-4 h-4" />
          <span>Record New Session</span>
        </button>
        <button
          onClick={() => setActiveTab("SAVED_HISTORY")}
          className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "SAVED_HISTORY"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Attendance History &amp; Records</span>
        </button>
      </div>

      {/* TAB 1: RECORD NEW SESSION */}
      {activeTab === "NEW_SESSION" && (
        <div className="space-y-6">
          {/* Session Parameters Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Attendance Session Configuration
              </h2>
              <span className="text-[11px] font-semibold text-indigo-600">
                Academic Session: {academicSession}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Attendance Date
                </label>
                <input
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Course / Program
                </label>
                <select
                  value={course}
                  onChange={(e) => handleCourseChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  {COURSES.map((c) => (
                    <option key={c.code} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Class / Year
                </label>
                <select
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  {CLASSES.map((cl) => (
                    <option key={cl} value={cl}>{cl}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section
                </label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  {SECTIONS.map((sec) => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject
                </label>
                <select
                  value={subjectCode}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  {SUBJECTS.map((sub) => (
                    <option key={sub.code} value={sub.code}>
                      {sub.code} - {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Faculty / Teacher Name
                </label>
                <input
                  type="text"
                  value={facultyName}
                  onChange={(e) => setFacultyName(e.target.value)}
                  placeholder="e.g. Dr. Arvind Raghavan"
                  className="w-full px-3 py-2 text-xs bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Period / Lecture
                </label>
                <select
                  value={periodNumber}
                  onChange={(e) => handlePeriodChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  {PERIODS.map((p) => (
                    <option key={p.number} value={p.number}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Roster & Attendance Marking Section */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Class Roster ({attendanceEntries.length} Enrolled Students)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {course} • {className} • {section}
                </p>
              </div>

              {/* Status summary pills & Quick Mark Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold mr-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  <span className="text-emerald-700">Present: {presentCount}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-rose-700">Absent: {absentCount}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-amber-700">Late: {lateCount}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-sky-700">Leave: {leaveCount}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-indigo-700 font-bold">{currentRate}%</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleMarkAll("PRESENT")}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 text-xs font-semibold transition-colors"
                >
                  Mark All Present
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkAll("ABSENT")}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-300 text-xs font-semibold transition-colors"
                >
                  Mark All Absent
                </button>
              </div>
            </div>

            {loadingRoster ? (
              <div className="py-16 text-center text-xs text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                Loading matching student roster...
              </div>
            ) : attendanceEntries.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-500">
                No active students found in this course/class/section combination.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 w-16">Roll No</th>
                      <th className="py-3 px-4 w-32">Admission No</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4 w-72">Attendance Status</th>
                      <th className="py-3 px-4">Remarks (Optional)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attendanceEntries.map((entry) => (
                      <tr key={entry.studentId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {entry.student.rollNumber}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {entry.student.admissionNumber}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {entry.student.fullName}
                        </td>
                        <td className="py-3 px-4">
                          <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200 gap-1">
                            <button
                              type="button"
                              onClick={() => handleStatusChange(entry.studentId, "PRESENT")}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                entry.status === "PRESENT"
                                  ? "bg-emerald-600 text-white shadow-xs"
                                  : "text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              Present
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(entry.studentId, "ABSENT")}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                entry.status === "ABSENT"
                                  ? "bg-rose-600 text-white shadow-xs"
                                  : "text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              Absent
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(entry.studentId, "LATE")}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                entry.status === "LATE"
                                  ? "bg-amber-600 text-white shadow-xs"
                                  : "text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              Late
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(entry.studentId, "LEAVE")}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                entry.status === "LEAVE"
                                  ? "bg-sky-600 text-white shadow-xs"
                                  : "text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              Leave
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={entry.remarks}
                            onChange={(e) => handleRemarksChange(entry.studentId, e.target.value)}
                            placeholder="e.g. Late by 10m, Sick note"
                            className="w-full px-2.5 py-1.5 text-xs bg-transparent border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Bottom Save Action */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Verify individual records before permanent commit to database.
              </span>
              <button
                type="button"
                onClick={() => setConfirmSaveOpen(true)}
                disabled={attendanceEntries.length === 0 || savingSession}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
              >
                <Save className="w-4 h-4" />
                <span>Save Attendance Session</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SAVED ATTENDANCE HISTORY & AUDIT */}
      {activeTab === "SAVED_HISTORY" && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Filter Date</label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Filter Class</label>
                <select
                  value={filterClass}
                  onChange={(e) => setFilterClass(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value="">All Classes</option>
                  {CLASSES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Filter Subject</label>
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value="">All Subjects</option>
                  {SUBJECTS.map((s) => (
                    <option key={s.code} value={s.code}>{s.code} - {s.name}</option>
                  ))}
                </select>
              </div>

              {(filterDate || filterClass || filterSubject) && (
                <button
                  onClick={() => {
                    setFilterDate("");
                    setFilterClass("");
                    setFilterSubject("");
                  }}
                  className="mt-4 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Clear Filters
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchSavedSessions}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Refresh Table"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <a
                href="/api/reports/export"
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-semibold hover:bg-emerald-100 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export Report (CSV)</span>
              </a>
            </div>
          </div>

          {/* History Sessions Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Saved Attendance Sessions ({savedSessions.length} Records)
              </h3>
            </div>

            {loadingHistory ? (
              <div className="py-16 text-center text-xs text-slate-400">Loading saved sessions...</div>
            ) : savedSessions.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-400">No attendance records found matching filters.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4">Class &amp; Section</th>
                      <th className="py-3 px-4">Period</th>
                      <th className="py-3 px-4">Faculty</th>
                      <th className="py-3 px-4">Summary (P/A/L)</th>
                      <th className="py-3 px-4 text-center">Rate</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {savedSessions.map((session) => (
                      <tr key={session.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-medium text-slate-900">
                          {session.sessionDate}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block">{session.subjectName}</span>
                          <span className="text-[10px] font-semibold text-slate-500">{session.subjectCode}</span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-700">
                          {session.className} - {session.section}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-700">
                          Period {session.periodNumber}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {session.facultyName}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium">
                            <span className="text-emerald-700 font-bold">{session.summary.present}P</span>
                            <span className="text-rose-700 font-bold">{session.summary.absent}A</span>
                            <span className="text-amber-700 font-bold">{session.summary.late}L</span>
                            <span className="text-slate-400">/ {session.summary.total}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              session.summary.attendanceRate >= 75
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {session.summary.attendanceRate}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenViewSession(session)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                              title="View & Edit Records"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteSessionId(session.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Session"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Dialog before saving */}
      <ConfirmDialog
        isOpen={confirmSaveOpen}
        title="Confirm Attendance Submission"
        message={`You are about to permanently save attendance for ${attendanceEntries.length} students in ${subjectName} (${subjectCode}) for ${className} ${section} on ${sessionDate}. This action will create an audit entry.`}
        confirmText="Confirm & Save"
        cancelText="Review Again"
        onConfirm={handleSaveAttendance}
        onCancel={() => setConfirmSaveOpen(false)}
      />

      {/* Delete Session Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteSessionId}
        title="Delete Attendance Session?"
        message="This will permanently delete this session record and its associated individual student attendance entries from the database."
        confirmText="Delete Session"
        isDangerous
        onConfirm={handleDeleteSession}
        onCancel={() => setDeleteSessionId(null)}
      />

      {/* View & Edit Session Modal */}
      {selectedSessionForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedSessionForView.subjectName} ({selectedSessionForView.subjectCode})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedSessionForView.sessionDate} • Period {selectedSessionForView.periodNumber} • {selectedSessionForView.className} {selectedSessionForView.section} • Faculty: {selectedSessionForView.facultyName}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {!isEditingSession ? (
                  <button
                    onClick={() => setIsEditingSession(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold border border-indigo-200 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Attendance</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSaveEditedSession}
                    disabled={savingEdit}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingEdit ? "Saving..." : "Save Changes"}</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedSessionForView(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Records Table */}
            <div className="flex-1 overflow-auto p-6">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Roll No</th>
                    <th className="py-2.5 px-3">Admission No</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {editingRecords.map((r, idx) => (
                    <tr key={r.id || idx}>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{r.rollNumber}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{r.admissionNumber}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{r.fullName}</td>
                      <td className="py-2.5 px-3">
                        {isEditingSession ? (
                          <div className="inline-flex rounded-lg p-0.5 bg-slate-100 border border-slate-200 gap-1">
                            {["PRESENT", "ABSENT", "LATE", "LEAVE"].map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => {
                                  const updated = [...editingRecords];
                                  updated[idx].status = st;
                                  setEditingRecords(updated);
                                }}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  r.status === st
                                    ? "bg-indigo-600 text-white"
                                    : "text-slate-600 hover:text-slate-900"
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              ATTENDANCE_STATUS_COLORS[r.status]?.badge || "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {r.status}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        {isEditingSession ? (
                          <input
                            type="text"
                            value={r.remarks}
                            onChange={(e) => {
                              const updated = [...editingRecords];
                              updated[idx].remarks = e.target.value;
                              setEditingRecords(updated);
                            }}
                            className="w-full px-2 py-1 text-xs border rounded"
                          />
                        ) : (
                          <span className="text-slate-500">{r.remarks || "—"}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
