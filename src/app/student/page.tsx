"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarCheck2,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  User,
  Sparkles,
  Calendar,
} from "lucide-react";
import { ATTENDANCE_STATUS_COLORS } from "@/lib/constants";

export default function StudentDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStudentDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard/stats");
      const result = await res.json();
      if (result.success) {
        setData(result.stats);
      }
    } catch (e) {
      console.error("Failed to load student dashboard stats", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentDashboard();
  }, []);

  const student = data?.student;
  const overallPercentage = data?.overallPercentage ?? 100;
  const isSatisfactory = overallPercentage >= 75;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Student Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white/10 border-2 border-white/20 flex items-center justify-center font-bold text-2xl text-emerald-300 shrink-0 shadow-lg">
            {student?.profilePhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={student.profilePhoto}
                alt={student.fullName}
                className="w-full h-full object-cover"
              />
            ) : student?.fullName ? (
              student.fullName.charAt(0)
            ) : (
              <User className="w-8 h-8" />
            )}
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student Self-Service Portal</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {student?.fullName || "Student"}!
            </h1>
            <div className="text-xs sm:text-sm text-slate-300 mt-1 flex flex-wrap items-center gap-2">
              <span className="font-mono bg-white/10 px-2 py-0.5 rounded font-semibold text-white">
                Adm: {student?.admissionNumber || "—"}
              </span>
              <span>•</span>
              <span className="font-mono bg-white/10 px-2 py-0.5 rounded font-semibold text-white">
                Roll: {student?.rollNumber || "—"}
              </span>
              <span>•</span>
              <span>{student?.course}</span>
            </div>
            <div className="text-xs text-emerald-300/90 font-medium mt-1">
              {student?.className} • {student?.section} • Session: {student?.academicSession || "2025-2026"}
            </div>
          </div>
        </div>

        {/* Attendance Rate Pill */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex items-center gap-4 self-start md:self-auto">
          <div>
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
              Overall Attendance
            </span>
            <div className="text-3xl font-black text-white">{overallPercentage}%</div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 mt-0.5 ${
                isSatisfactory ? "text-emerald-300" : "text-amber-300"
              }`}
            >
              {isSatisfactory ? "Eligible (Above 75%)" : "Shortage Warning (<75%)"}
            </span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-emerald-400 flex items-center justify-center font-bold text-xs text-white">
            {overallPercentage}%
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Classes Attended */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Classes Attended
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {loading ? "..." : data?.attendedClasses ?? 0}
            </span>
            <span className="text-xs text-slate-500 font-medium ml-2">
              of {data?.totalClasses ?? 0} conducted
            </span>
          </div>
        </div>

        {/* Classes Missed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Absences
            </span>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {loading ? "..." : (data?.totalClasses ?? 0) - (data?.attendedClasses ?? 0)}
            </span>
            <span className="text-xs text-rose-600 font-semibold ml-2">Missed Lectures</span>
          </div>
        </div>

        {/* Published Course Assignments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Coursework
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {loading ? "..." : data?.totalPublishedAssignments ?? 0}
            </span>
            <span className="text-xs text-indigo-600 font-semibold ml-2">Active Assignments</span>
          </div>
        </div>

        {/* Attendance Progress Bar Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Policy Standing
            </span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-700">Exam Eligibility</span>
              <span className={isSatisfactory ? "text-emerald-600" : "text-amber-600"}>
                {overallPercentage}% / 75% Min
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isSatisfactory ? "bg-emerald-500" : "bg-amber-500"
                }`}
                style={{ width: `${Math.min(overallPercentage, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Columns: Today's Attendance Activity & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Lecture Roll-Call */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Today&apos;s Lecture Status</h2>
              <p className="text-xs text-slate-500 mt-0.5">Recorded periods for the current date</p>
            </div>
            <Link
              href="/student/attendance"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
            >
              <span>Full Attendance</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 flex-1">
            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading today&apos;s records...</div>
            ) : !data?.todayRecords || data.todayRecords.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No attendance sessions have been recorded for your class yet today.
              </div>
            ) : (
              <div className="space-y-3">
                {data.todayRecords.map((r: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{r.subjectName}</span>
                        <span className="text-[10px] font-semibold text-slate-500">
                          Period {r.periodNumber}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-indigo-600">{r.subjectCode}</span>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        ATTENDANCE_STATUS_COLORS[r.status]?.badge || "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Assignment Deadlines */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Upcoming Assignment Deadlines</h2>
              <p className="text-xs text-slate-500 mt-0.5">Coursework due in your subjects</p>
            </div>
            <Link
              href="/student/assignments"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 flex-1">
            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading deadlines...</div>
            ) : !data?.upcomingDeadlines || data.upcomingDeadlines.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No upcoming assignments due. You are all caught up!
              </div>
            ) : (
              <div className="space-y-3">
                {data.upcomingDeadlines.map((a: any) => (
                  <Link
                    key={a.id}
                    href="/student/assignments"
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-100/80 transition-colors flex items-center justify-between block group"
                  >
                    <div className="max-w-xs truncate">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 truncate">
                        {a.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {a.subjectName} ({a.subjectCode}) • Max {a.maxMarks} Marks
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                        <Clock className="w-3.5 h-3.5" />
                        Due {a.deadline}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
