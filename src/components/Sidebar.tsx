"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UserPlus,
  CalendarCheck2,
  Radio,
  FileSpreadsheet,
  Trash2,
  Users,
  BarChart3,
  History,
  BookOpen,
  UserCheck,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useToast } from "./ToastContext";

interface SidebarProps {
  portal: "ADMIN" | "STUDENT";
}

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
}

export default function Sidebar({ portal }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      showToast("Logged out successfully.", "info");
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  };

  const adminNav: NavItem[] = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Add Student", href: "/admin/add-student", icon: UserPlus },
    { name: "Attendance Management", href: "/admin/attendance", icon: CalendarCheck2 },
    { name: "Live Attendance", href: "/admin/attendance/live", icon: Radio, badge: "Live" },
    { name: "Assignment Management", href: "/admin/assignments", icon: BookOpen },
    { name: "Delete Student Records", href: "/admin/delete-students", icon: Trash2 },
    { name: "Student Directory", href: "/admin/students", icon: Users },
    { name: "Reports & Analytics", href: "/admin/reports", icon: BarChart3 },
    { name: "Audit Logs", href: "/admin/audit-logs", icon: History },
  ];

  const studentNav: NavItem[] = [
    { name: "Dashboard", href: "/student", icon: LayoutDashboard },
    { name: "My Profile", href: "/student/profile", icon: UserCheck },
    { name: "My Attendance", href: "/student/attendance", icon: CalendarCheck2 },
    { name: "My Assignments", href: "/student/assignments", icon: BookOpen },
  ];

  const navItems = portal === "ADMIN" ? adminNav : studentNav;

  return (
    <>
      {/* Mobile Top Toggle Button */}
      <div className="lg:hidden flex items-center justify-between bg-slate-900 text-white px-4 py-2.5">
        <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
          Navigation Menu
        </span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 z-40 h-[calc(100vh-4rem)] w-64 shrink-0 flex flex-col justify-between border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="flex-1 overflow-y-auto py-5 px-3">
          <div className="px-3 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {portal === "ADMIN" ? "Administrative Modules" : "Student Menu"}
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin" || item.href === "/student"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? portal === "ADMIN"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                        : "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive
                          ? "text-white"
                          : portal === "ADMIN"
                          ? "text-indigo-600"
                          : "text-emerald-600"
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}

                  {!item.badge && isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-white/80" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom System Info & Logout */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/80">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>Academic Year</span>
              <span className="font-semibold text-slate-700">2025-2026</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mt-1">
              <span>System Status</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl transition-colors border border-transparent hover:border-rose-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
