import Link from "next/link";
import { GraduationCap, ShieldCheck, UserCheck, ArrowRight, CheckCircle2, Clock, FileCheck2, BarChart2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-indigo-950 text-white flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b border-slate-700/60 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">Apex Academy</h1>
            <p className="text-xs text-indigo-200">Attendance & Academic Management</p>
          </div>
        </div>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
        >
          <span>Sign In to Portal</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </header>

      {/* Main Hero & Portals */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 flex flex-col justify-center">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Integrated Campus Management System
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Smart Attendance & Student Operations
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Real-time session recording, student profile directories, assignment publishing with document previews, and detailed analytics for higher education institutions.
          </p>
        </div>

        {/* Dual Portal Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
          {/* Admin Portal Card */}
          <div className="group relative rounded-3xl bg-slate-800/80 border border-slate-700/80 p-8 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:border-indigo-500 hover:shadow-indigo-500/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="p-3.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Faculty & Admin
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">Admin Portal</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Full administrative authority over student enrollment, live and batch attendance sessions, assignment distribution, and audit logs.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Student registration with duplicate admission validation</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Interactive & Live attendance marking sessions</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Publish assignments with PDF & document uploads</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <BarChart2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Export attendance reports to CSV & printable PDF</span>
                </li>
              </ul>
            </div>

            <Link
              href="/login?role=ADMIN"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all group-hover:shadow-indigo-500/50"
            >
              <span>Access Admin Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Student Portal Card */}
          <div className="group relative rounded-3xl bg-slate-800/80 border border-slate-700/80 p-8 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:border-emerald-500 hover:shadow-emerald-500/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="p-3.5 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 group-hover:scale-110 transition-transform">
                  <UserCheck className="w-8 h-8" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Student Access
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">Student Portal</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Self-service portal for registered students to track daily attendance, view attendance percentages, and access coursework.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Today's real-time lecture attendance records</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Cumulative attendance percentage & progress metrics</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Course assignments & in-browser PDF previews</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <BarChart2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Institutional policy alerts (&gt;75% requirement)</span>
                </li>
              </ul>
            </div>

            <Link
              href="/login?role=STUDENT"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all group-hover:shadow-emerald-500/50"
            >
              <span>Access Student Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 text-center py-6 text-xs text-slate-500">
        &copy; 2026 Apex Academy. All Rights Reserved. Student Attendance Management System.
      </footer>
    </div>
  );
}
