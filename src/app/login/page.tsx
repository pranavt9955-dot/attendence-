"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Info,
} from "lucide-react";
import { useToast } from "@/components/ToastContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "STUDENT" ? "STUDENT" : "ADMIN";

  const [portalRole, setPortalRole] = useState<"ADMIN" | "STUDENT">(initialRole);
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "STUDENT" || roleParam === "ADMIN") {
      setPortalRole(roleParam);
    }
  }, [searchParams]);

  // Set default credentials when switching role tab for easy testing
  const handleQuickFill = (type: "admin" | "student1" | "student2") => {
    if (type === "admin") {
      setPortalRole("ADMIN");
      setLoginId("admin@school.edu");
      setPassword("Admin@123");
    } else if (type === "student1") {
      setPortalRole("STUDENT");
      setLoginId("student1@school.edu");
      setPassword("Student@123");
    } else if (type === "student2") {
      setPortalRole("STUDENT");
      setLoginId("ADM-2023-0102");
      setPassword("Student@123");
    }
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!loginId.trim() || !password.trim()) {
      setErrorMessage("Please enter both Login ID and Password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loginId: loginId.trim(),
          password: password.trim(),
          portalRole,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Authentication failed.");
        showToast(data.error || "Login failed.", "error");
        setLoading(false);
        return;
      }

      showToast(`Welcome back, ${data.user.fullName}!`, "success");

      // Redirect user to their respective portal
      if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/student");
      }
      router.refresh();
    } catch (err: any) {
      setErrorMessage("Network error occurred during login. Please try again.");
      showToast("Network error. Please try again.", "error");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* App Branding */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-brand-500/25 group-hover:scale-105 transition-transform">
            <GraduationCap className="h-7 w-7" />
          </div>
          <div className="text-left">
            <h1 className="text-xl font-extrabold tracking-tight text-white">Apex Academy</h1>
            <p className="text-xs text-indigo-300 font-medium">Student Attendance Portal</p>
          </div>
        </Link>
        <p className="text-xs text-slate-400">Sign in to access your dashboard and records</p>
      </div>

      {/* Portal Switcher Tabs */}
      <div className="bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700 mb-6 grid grid-cols-2 gap-1 shadow-inner">
        <button
          type="button"
          onClick={() => {
            setPortalRole("ADMIN");
            setErrorMessage("");
          }}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
            portalRole === "ADMIN"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Admin Portal</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setPortalRole("STUDENT");
            setErrorMessage("");
          }}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
            portalRole === "STUDENT"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Student Portal</span>
        </button>
      </div>

      {/* Login Card */}
      <div className="bg-slate-800/90 rounded-3xl border border-slate-700/80 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            {portalRole === "ADMIN" ? (
              <>
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                Admin Sign In
              </>
            ) : (
              <>
                <UserCheck className="w-5 h-5 text-emerald-400" />
                Student Sign In
              </>
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {portalRole === "ADMIN"
              ? "Enter your administrator email and master password."
              : "Enter your registered Email, Admission No, or Username."}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
            <Info className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {portalRole === "ADMIN" ? "Admin Email or Username" : "Student Email / Admission No / Username"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder={
                  portalRole === "ADMIN"
                    ? "admin@school.edu"
                    : "student1@school.edu or ADM-2023-0101"
                }
                required
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-2 py-3 px-4 rounded-xl text-xs font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
              loading
                ? "bg-slate-700 cursor-not-allowed opacity-70"
                : portalRole === "ADMIN"
                ? "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30"
                : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30"
            }`}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In as {portalRole === "ADMIN" ? "Admin" : "Student"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Fill Pills */}
        <div className="mt-6 pt-5 border-t border-slate-700/60">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Quick Test Fill (One-Click Login):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill("admin")}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-200 text-[11px] font-medium transition-colors"
            >
              Admin (admin@school.edu)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("student1")}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-200 text-[11px] font-medium transition-colors"
            >
              Student 1 (Aryan Sharma)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("student2")}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-200 text-[11px] font-medium transition-colors"
            >
              Student 2 (Priya Patel)
            </button>
          </div>
        </div>
      </div>

      {/* Back Link */}
      <div className="text-center mt-6">
        <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
          &larr; Return to Homepage
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black text-slate-100">
      <Suspense fallback={<div className="text-white text-xs">Loading login portal...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
