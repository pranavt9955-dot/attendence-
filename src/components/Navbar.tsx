"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, LogOut, User as UserIcon, Shield, Sparkles } from "lucide-react";
import { useToast } from "./ToastContext";

interface NavbarProps {
  user?: {
    fullName?: string;
    email?: string;
    username?: string;
    role?: string;
    studentProfile?: any;
  } | null;
  portal: "ADMIN" | "STUDENT";
}

export default function Navbar({ user, portal }: NavbarProps) {
  const router = useRouter();
  const { showToast } = useToast();

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

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 md:px-8 shadow-xs backdrop-blur-md">
      {/* Brand & Portal Label */}
      <div className="flex items-center gap-3">
        <Link href={portal === "ADMIN" ? "/admin" : "/student"} className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-700 to-indigo-600 text-white shadow-md shadow-brand-500/20 transition-transform group-hover:scale-105">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-slate-900 leading-tight">
              Apex Academy
            </span>
            <span className="text-xs font-medium text-slate-500 hidden sm:inline">
              Student Attendance System
            </span>
          </div>
        </Link>

        <span className="text-slate-300 font-light mx-1 hidden sm:inline">|</span>

        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
            portal === "ADMIN"
              ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
          }`}
        >
          {portal === "ADMIN" ? (
            <>
              <Shield className="w-3.5 h-3.5 text-indigo-600" /> Admin Portal
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Student Portal
            </>
          )}
        </span>
      </div>

      {/* Right User Bar & Logout */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* User Badge */}
        <div className="flex items-center gap-3 py-1 px-3 rounded-full bg-slate-50 border border-slate-200">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 text-white font-semibold text-xs shadow-xs">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-800 leading-none">
              {user?.fullName || (portal === "ADMIN" ? "Administrator" : "Student User")}
            </span>
            <span className="text-[11px] text-slate-500 font-medium leading-none mt-1">
              {user?.studentProfile?.admissionNumber || user?.email || user?.username}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          title="Logout"
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 hover:text-rose-800 border border-rose-200/80 rounded-xl transition-all shadow-xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
