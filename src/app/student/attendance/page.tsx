"use client";

import React, { useState, useEffect } from "react";
import {
  CalendarCheck2,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Filter,
  BarChart2,
  RefreshCw,
  Search,
  BookOpen,
} from "lucide-react";
import { ATTENDANCE_STATUS_COLORS } from "@/lib/constants";
import { useToast } from "@/components/ToastContext";

export default function StudentAttendancePage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"TODAY" | "ALL">("TODAY");

  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [todayDate, setTodayDate] = useState("");
  const [todayRecords, setTodayRecords] = useState<any[]>([]);
  const [historyRecords, setHistoryRecords] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);

  // Filters for History
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);
      if (subjectFilter) params.set("subject", subjectFilter);
      if (statusFilter !== "ALL") params.set("status", statusFilter);

      const res = await fetch(`/api/attendance/student-stats?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setStudent(data.student);
        setTodayDate(data.todayDate);
        setTodayRecords(data.todayRecords);
        setHistoryRecords(data.history);
        setMetrics(data.metrics);
      }
    } catch {
      showToast("Failed to fetch attendance data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [startDate, endDate, subjectFilter, statusFilter]);

  const percentage = metrics?.attendancePercentage ?? 100;
  const isSatisfactory = percentage >= 75;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CalendarCheck2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                My Attendance Portal
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Official institutional attendance records, daily roll call statuses, and academic eligibility
              </p>
            </div>
          </div>
        </div>

        {/* Tab Buttons as explicitly requested in prompt */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab("TODAY")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "TODAY"
                ? "bg-white text-emerald-700 shadow-md shadow-emerald-500/10"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            1. Today&apos;s Attendance
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "ALL"
                ? "bg-white text-emerald-700 shadow-md shadow-emerald-500/10"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            2. All Attendance
          </button>
        </div>
      </div>

      {/* Summary KPI Cards & Visual Progress Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400">Total Counted</span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {loading ? "..." : metrics?.totalClasses ?? 0}
            </div>
            <span className="text-[10px] text-slate-500">Lectures</span>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100">
            <span className="text-[10px] font-bold uppercase text-emerald-700">Attended</span>
            <div className="text-2xl font-black text-emerald-800 mt-1">
              {loading ? "..." : metrics?.attendedClasses ?? 0}
            </div>
            <span className="text-[10px] text-emerald-600">Present + Late</span>
          </div>

          <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-100">
            <span className="text-[10px] font-bold uppercase text-rose-700">Missed</span>
            <div className="text-2xl font-black text-rose-800 mt-1">
              {loading ? "..." : metrics?.missedClasses ?? 0}
            </div>
            <span className="text-[10px] text-rose-600">Unexcused</span>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-100">
            <span className="text-[10px] font-bold uppercase text-amber-700">Late Arrivals</span>
            <div className="text-2xl font-black text-amber-800 mt-1">
              {loading ? "..." : metrics?.lateArrivals ?? 0}
            </div>
            <span className="text-[10px] text-amber-600">Counted as Present</span>
          </div>

          <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold uppercase text-indigo-700">Percentage</span>
            <div className="text-2xl font-black text-indigo-900 mt-1">
              {loading ? "..." : `${percentage}%`}
            </div>
            <span className="text-[10px] text-indigo-600 font-semibold">Overall Score</span>
          </div>
        </div>

        {/* Attendance Visual Progress Bar */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-700 flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-emerald-600" />
              Cumulative Attendance Percentage Progress
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                isSatisfactory
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {metrics?.statusBadge || "Good Standing"}
            </span>
          </div>

          <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isSatisfactory ? "bg-emerald-500" : "bg-amber-500"
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>0%</span>
            <span className="text-slate-600 font-bold">75% Institutional Threshold</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* TAB 1: TODAY'S ATTENDANCE */}
      {activeTab === "TODAY" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Today&apos;s Attendance Records ({todayDate})</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Displaying real-time lecture roll calls marked for you today in Asia/Kolkata timezone
              </p>
            </div>
            <button
              onClick={fetchAttendance}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center text-xs text-slate-400">Loading today&apos;s roll call...</div>
          ) : todayRecords.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-500">
              No attendance records have been posted for your class today yet ({todayDate}).
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Section</th>
                    <th className="py-3 px-4">Lecture / Period</th>
                    <th className="py-3 px-4 text-center">Attendance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {todayRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-900">{r.date}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        <div>{r.subjectName}</div>
                        <span className="text-[10px] font-mono text-slate-500">{r.subjectCode}</span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">{r.className}</td>
                      <td className="py-3 px-4 font-medium text-slate-700">{r.section}</td>
                      <td className="py-3 px-4 text-slate-600">
                        Period {r.periodNumber} ({r.startTime || "09:00"} - {r.endTime || "10:00"})
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                            ATTENDANCE_STATUS_COLORS[r.status]?.badge || "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ALL ATTENDANCE HISTORY */}
      {activeTab === "ALL" && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">From Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">To Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Subject Keyword</label>
              <input
                type="text"
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                placeholder="e.g. DBMS, Networks"
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="ALL">All Statuses</option>
                <option value="PRESENT">Present</option>
                <option value="ABSENT">Absent</option>
                <option value="LATE">Late</option>
                <option value="LEAVE">Leave</option>
              </select>
            </div>

            {(startDate || endDate || subjectFilter || statusFilter !== "ALL") && (
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  setSubjectFilter("");
                  setStatusFilter("ALL");
                }}
                className="mt-4 text-xs font-semibold text-emerald-600 hover:text-emerald-800"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Full History Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Official Attendance History ({historyRecords.length} Sessions)
              </h3>
              <span className="text-xs text-slate-400">Read-Only Official Ledger</span>
            </div>

            {loading ? (
              <div className="py-16 text-center text-xs text-slate-400">Loading history records...</div>
            ) : historyRecords.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-500">
                No attendance sessions match the selected filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Subject Name</th>
                      <th className="py-3 px-4">Code</th>
                      <th className="py-3 px-4">Class</th>
                      <th className="py-3 px-4">Section</th>
                      <th className="py-3 px-4">Lecture / Period</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4">Faculty Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {historyRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-medium text-slate-900">{r.date}</td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{r.subjectName}</td>
                        <td className="py-3 px-4 font-mono text-slate-500">{r.subjectCode}</td>
                        <td className="py-3 px-4 text-slate-600">{r.className}</td>
                        <td className="py-3 px-4 text-slate-600">{r.section}</td>
                        <td className="py-3 px-4 text-slate-600">Period {r.periodNumber}</td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                              ATTENDANCE_STATUS_COLORS[r.status]?.badge || "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500">{r.remarks || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
