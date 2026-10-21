"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  CalendarCheck2,
  Percent,
  BookOpen,
  UserPlus,
  Radio,
  Trash2,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (e) {
      console.error("Failed to load dashboard statistics:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Academic Session 2025-2026
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Administrator Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Live institution overview, real-time student attendance monitoring, assignment management, and audit records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/attendance"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <CalendarCheck2 className="w-4 h-4" />
            <span>Mark Attendance</span>
          </Link>
          <Link
            href="/admin/attendance/live"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Live Attendance</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Students
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {loading ? "..." : stats?.totalStudents ?? 0}
            </span>
            <span className="text-xs text-emerald-600 font-semibold ml-2">Active Enrolled</span>
          </div>
        </div>

        {/* Total Classes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Batches
            </span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {loading ? "..." : stats?.totalClassesCount ?? 0}
            </span>
            <span className="text-xs text-slate-500 font-medium ml-2">Course Sections</span>
          </div>
        </div>

        {/* Sessions Today */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Sessions Today
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {loading ? "..." : stats?.todaySessionsCount ?? 0}
            </span>
            <span className="text-xs text-emerald-600 font-semibold ml-2">Conducted</span>
          </div>
        </div>

        {/* Avg Attendance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Avg Attendance
            </span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {loading ? "..." : `${stats?.avgAttendancePercentage ?? 0}%`}
            </span>
            <span className="text-xs text-emerald-600 font-semibold ml-2 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> Institutional
            </span>
          </div>
        </div>

        {/* Published Assignments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Assignments
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {loading ? "..." : stats?.publishedAssignments ?? 0}
            </span>
            <span className="text-xs text-indigo-600 font-semibold ml-2">Published</span>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h2 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">
          Quick Administrative Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Link
            href="/admin/add-student"
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all text-center group"
          >
            <div className="p-2.5 rounded-xl bg-white shadow-xs text-indigo-600 mb-2 group-hover:scale-110 transition-transform">
              <UserPlus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-700">Add Student</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Register new record</span>
          </Link>

          <Link
            href="/admin/attendance"
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all text-center group"
          >
            <div className="p-2.5 rounded-xl bg-white shadow-xs text-blue-600 mb-2 group-hover:scale-110 transition-transform">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700">Attendance Mgmt</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Take & review sessions</span>
          </Link>

          <Link
            href="/admin/attendance/live"
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 transition-all text-center group"
          >
            <div className="p-2.5 rounded-xl bg-white shadow-xs text-rose-600 mb-2 group-hover:scale-110 transition-transform">
              <Radio className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-rose-700">Live Attendance</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Real-time roll call</span>
          </Link>

          <Link
            href="/admin/assignments"
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all text-center group"
          >
            <div className="p-2.5 rounded-xl bg-white shadow-xs text-emerald-600 mb-2 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">Assignments</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Upload coursework</span>
          </Link>

          <Link
            href="/admin/delete-students"
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all text-center group"
          >
            <div className="p-2.5 rounded-xl bg-white shadow-xs text-red-600 mb-2 group-hover:scale-110 transition-transform">
              <Trash2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-red-700">Delete Records</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Manage & archive</span>
          </Link>
        </div>
      </div>

      {/* Two Columns: Recent Attendance Activity & Recently Added Students */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Attendance Sessions */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Attendance Activity</h2>
              <p className="text-xs text-slate-500 mt-0.5">Latest lecture sessions conducted</p>
            </div>
            <Link
              href="/admin/attendance"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 flex-1">
            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading activity...</div>
            ) : !stats?.recentAttendanceActivity || stats.recentAttendanceActivity.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No attendance sessions recorded yet.</div>
            ) : (
              <div className="space-y-3">
                {stats.recentAttendanceActivity.map((session: any) => (
                  <div
                    key={session.id}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 flex items-center justify-between transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{session.subjectName}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                          {session.subjectCode}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500">
                          Period {session.periodNumber}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span>{session.className} - {session.section}</span>
                        <span>•</span>
                        <span>{session.sessionDate}</span>
                        <span>•</span>
                        <span>{session.facultyName}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-extrabold text-slate-900">
                        {session.attendanceRate}%
                      </div>
                      <span className="text-[10px] font-medium text-slate-500">
                        {session.totalStudents} Students
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recently Added Students */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recently Enrolled Students</h2>
              <p className="text-xs text-slate-500 mt-0.5">Latest registrations in database</p>
            </div>
            <Link
              href="/admin/students"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
            >
              <span>Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 flex-1">
            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading students...</div>
            ) : !stats?.recentStudents || stats.recentStudents.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No students registered yet.</div>
            ) : (
              <div className="space-y-3">
                {stats.recentStudents.map((s: any) => (
                  <div
                    key={s.id}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {s.fullName ? s.fullName.charAt(0) : "S"}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{s.fullName}</h4>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2">
                          <span className="font-mono text-indigo-600 font-semibold">{s.admissionNumber}</span>
                          <span>•</span>
                          <span>Roll: {s.rollNumber}</span>
                          <span>•</span>
                          <span>{s.section}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-[11px] text-slate-500 font-medium">
                      <span>{s.className}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
