"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  GraduationCap,
  Mail,
  Phone,
  Home,
  Calendar,
  Sparkles,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/components/ToastContext";

export default function StudentProfilePage() {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.authenticated && data.user) {
        setProfile(data.user.studentProfile);
      }
    } catch {
      showToast("Failed to fetch profile.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-400">Loading student profile...</div>;
  }

  if (!profile) {
    return (
      <div className="bg-white p-8 rounded-2xl border text-center text-xs text-slate-500">
        No student profile linked to this account.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Banner Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-emerald-600 text-white font-bold text-3xl flex items-center justify-center shrink-0 shadow-md">
          {profile.profilePhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.profilePhoto} alt={profile.fullName} className="w-full h-full object-cover" />
          ) : (
            profile.fullName.charAt(0)
          )}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Active Enrolled Student</span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900">{profile.fullName}</h1>
          <div className="text-xs text-indigo-600 font-mono font-bold mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span>Admission No: {profile.admissionNumber}</span>
            <span>•</span>
            <span>Roll No: {profile.rollNumber}</span>
          </div>

          <p className="text-xs text-slate-500 mt-2 font-medium">
            {profile.course} • {profile.department}
          </p>
        </div>
      </div>

      {/* Profile Details Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Academic Details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>Academic Allocation</span>
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Class / Year:</span>
              <span className="font-semibold text-slate-800">{profile.className}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Section:</span>
              <span className="font-semibold text-slate-800">{profile.section}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Semester:</span>
              <span className="font-semibold text-slate-800">{profile.semester || "Semester 5"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Academic Session:</span>
              <span className="font-semibold text-slate-800">{profile.academicSession}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Enrollment Date:</span>
              <span className="font-semibold text-slate-800">{profile.admissionDate || "2023-08-01"}</span>
            </div>
          </div>
        </div>

        {/* Contact & Personal Details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Personal &amp; Contact Details</span>
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Email:</span>
              <span className="font-semibold text-slate-800">{profile.email}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Mobile Phone:</span>
              <span className="font-semibold text-slate-800">{profile.mobileNumber || "—"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Father&apos;s Name:</span>
              <span className="font-semibold text-slate-800">{profile.fatherName || "—"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Guardian Contact:</span>
              <span className="font-semibold text-slate-800">{profile.guardianContact || "—"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Gender / DOB:</span>
              <span className="font-semibold text-slate-800">
                {profile.gender || "—"} • {profile.dateOfBirth || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Residential Address */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Home className="w-4 h-4 text-emerald-600" />
            <span>Residential Address</span>
          </h3>
          <p className="text-xs text-slate-700 font-medium leading-relaxed">
            {profile.residentialAddress || "No residential address registered."}
          </p>
        </div>
      </div>
    </div>
  );
}
