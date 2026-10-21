"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  FileSpreadsheet,
  Printer,
  Calendar,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Search,
} from "lucide-react";
import {
  COURSES,
  CLASSES,
  SECTIONS,
  SUBJECTS,
  INSTITUTION_NAME,
  INSTITUTION_SHORT,
} from "@/lib/constants";
import { useToast } from "@/components/ToastContext";

export default function AttendanceReportsPage() {
  const { showToast } = useToast();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [course, setCourse] = useState("");
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [subjectCode, setSubjectCode] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);
      if (course) params.set("course", course);
      if (className) params.set("className", className);
      if (section) params.set("section", section);
      if (subjectCode) params.set("subjectCode", subjectCode);

      const res = await fetch(`/api/attendance?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setSessions(data.sessions);
      }
    } catch {
      showToast("Failed to load reports.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [startDate, endDate, course, className, section, subjectCode]);

  const handlePrint = () => {
    window.print();
  };

  // Cumulative metrics across filtered sessions
  let totalRecords = 0;
  let totalPresent = 0;
  let totalAbsent = 0;
  let totalLate = 0;
  let totalLeave = 0;

  for (const s of sessions) {
    if (s.summary) {
      totalRecords += s.summary.total;
      totalPresent += s.summary.present;
      totalAbsent += s.summary.absent;
      totalLate += s.summary.late;
      totalLeave += s.summary.leave;
    }
  }

  const overallAvgRate =
    totalRecords > 0 ? Math.round(((totalPresent + totalLate) / totalRecords) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Export Actions (Hidden on Print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Attendance Reports &amp; Analytics
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Generate official institutional attendance summaries, export to CSV/Excel, and print PDF ledgers
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-md transition-all hover:scale-105"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
          <a
            href={`/api/reports/export?${new URLSearchParams({
              startDate,
              endDate,
              course,
              className,
              section,
              subjectCode,
            }).toString()}`}
            download
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition-all hover:scale-105"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Filter Bar (Hidden on Print) */}
      <div className="no-print bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3">
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
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Course</label>
          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
          >
            <option value="">All Courses</option>
            {COURSES.map((c) => (
              <option key={c.code} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Class</label>
          <select
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
          >
            <option value="">All Classes</option>
            {CLASSES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Section</label>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
          >
            <option value="">All Sections</option>
            {SECTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Subject</label>
          <select
            value={subjectCode}
            onChange={(e) => setSubjectCode(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
          >
            <option value="">All Subjects</option>
            {SUBJECTS.map((s) => (
              <option key={s.code} value={s.code}>{s.code} - {s.name}</option>
            ))}
          </select>
        </div>

        {(startDate || endDate || course || className || section || subjectCode) && (
          <button
            onClick={() => {
              setStartDate("");
              setEndDate("");
              setCourse("");
              setClassName("");
              setSection("");
              setSubjectCode("");
            }}
            className="mt-4 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Aggregate Metric Highlights (Hidden on Print) */}
      <div className="no-print grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Counted</span>
          <div className="text-xl font-extrabold text-slate-900 mt-1">{totalRecords}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-emerald-600">Present</span>
          <div className="text-xl font-extrabold text-emerald-700 mt-1">{totalPresent}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-rose-600">Absent</span>
          <div className="text-xl font-extrabold text-rose-700 mt-1">{totalAbsent}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-amber-600">Late Arrivals</span>
          <div className="text-xl font-extrabold text-amber-700 mt-1">{totalLate}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold uppercase text-indigo-600">Avg Attendance Rate</span>
          <div className="text-xl font-extrabold text-indigo-700 mt-1">{overallAvgRate}%</div>
        </div>
      </div>

      {/* Printable Report Ledger */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        {/* College Header (Visible in Print & Screen) */}
        <div className="border-b-2 border-slate-800 pb-4 mb-6 text-center">
          <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-slate-900">
            {INSTITUTION_NAME}
          </h2>
          <p className="text-xs font-semibold text-slate-600 mt-0.5">
            OFFICIAL STUDENT ATTENDANCE REPORT &amp; AUDIT LEDGER
          </p>
          <div className="text-[11px] text-slate-500 mt-2 flex justify-center gap-4">
            <span>Academic Session: 2025-2026</span>
            <span>•</span>
            <span>Generated: {new Date().toLocaleDateString()}</span>
            <span>•</span>
            <span>Total Sessions: {sessions.length}</span>
          </div>
        </div>

        {/* Ledger Table */}
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading report records...</div>
        ) : sessions.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            No attendance records match the selected date and class filters.
          </div>
        ) : (
          <div className="space-y-6">
            {sessions.map((s) => (
              <div key={s.id} className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                <div className="bg-slate-100 px-4 py-2.5 flex flex-wrap items-center justify-between text-xs font-bold text-slate-800 border-b border-slate-200">
                  <div>
                    <span>{s.sessionDate}</span> • <span>Period {s.periodNumber}</span> •{" "}
                    <span className="text-indigo-700">{s.subjectName} ({s.subjectCode})</span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-semibold">
                    {s.className} - {s.section} | Faculty: {s.facultyName} | Rate:{" "}
                    <span className="text-emerald-700 font-bold">{s.summary.attendanceRate}%</span>
                  </div>
                </div>

                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3 w-16">Roll No</th>
                      <th className="py-2 px-3 w-32">Admission No</th>
                      <th className="py-2 px-3">Student Full Name</th>
                      <th className="py-2 px-3 w-28">Status</th>
                      <th className="py-2 px-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {s.records.map((r: any) => (
                      <tr key={r.id} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 font-mono font-bold text-slate-900">{r.student.rollNumber}</td>
                        <td className="py-2 px-3 font-mono text-slate-600">{r.student.admissionNumber}</td>
                        <td className="py-2 px-3 font-semibold text-slate-800">{r.student.fullName}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                              r.status === "PRESENT"
                                ? "bg-emerald-100 text-emerald-800"
                                : r.status === "ABSENT"
                                ? "bg-rose-100 text-rose-800"
                                : r.status === "LATE"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-sky-100 text-sky-800"
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-500">{r.remarks || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
