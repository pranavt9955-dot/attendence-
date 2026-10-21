"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UserPlus,
  RotateCcw,
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldAlert,
  ArrowLeft,
  FileCheck2,
} from "lucide-react";
import {
  COURSES,
  DEPARTMENTS,
  CLASSES,
  SECTIONS,
  SEMESTERS,
  ACADEMIC_SESSIONS,
} from "@/lib/constants";
import { useToast } from "@/components/ToastContext";

const INITIAL_FORM_STATE = {
  fullName: "",
  profilePhoto: "",
  dateOfBirth: "",
  gender: "Male",
  admissionNumber: "",
  rollNumber: "",
  course: COURSES[0].name,
  department: COURSES[0].department,
  className: CLASSES[2], // Year 3
  section: SECTIONS[0], // Section A
  semester: SEMESTERS[4], // Semester 5
  academicSession: ACADEMIC_SESSIONS[0],
  email: "",
  mobileNumber: "",
  fatherName: "",
  motherName: "",
  guardianContact: "",
  residentialAddress: "",
  admissionDate: new Date().toISOString().split("T")[0],
  studentLoginId: "",
  password: "Student@123",
  remarks: "",
};

export default function AddStudentPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successInfo, setSuccessInfo] = useState<any | null>(null);

  // Auto-generate Admission Number & Login ID
  const handleGenerateId = () => {
    const year = new Date().getFullYear();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const generatedAdmission = `ADM-${year}-${randomDigits}`;
    setFormData((prev) => ({
      ...prev,
      admissionNumber: generatedAdmission,
      studentLoginId: generatedAdmission.toLowerCase(),
    }));
    showToast(`Generated Admission Number: ${generatedAdmission}`, "info");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Auto update department if course changed
      if (name === "course") {
        const found = COURSES.find((c) => c.name === value);
        if (found) {
          updated.department = found.department;
        }
      }

      // Auto mirror login ID if admissionNumber changed
      if (name === "admissionNumber" && !prev.studentLoginId) {
        updated.studentLoginId = value.toLowerCase();
      }

      return updated;
    });

    setErrorMessage("");
  };

  // Profile Photo Upload Handler
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Photo size exceeds 5MB limit.");
      return;
    }

    try {
      setPhotoUploading(true);
      const data = new FormData();
      data.append("file", file);
      data.append("category", "avatars");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to upload photo");
      }

      setFormData((prev) => ({ ...prev, profilePhoto: result.fileUrl }));
      setPhotoPreview(result.fileUrl);
      showToast("Profile photo uploaded successfully.", "success");
    } catch (err: any) {
      setErrorMessage(err.message);
      showToast(err.message, "error");
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setPhotoPreview(null);
    setErrorMessage("");
    setSuccessInfo(null);
    showToast("Form fields reset to default.", "info");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessInfo(null);

    // Validation checks
    if (!formData.fullName.trim()) {
      setErrorMessage("Student Full Name is required.");
      return;
    }
    if (!formData.admissionNumber.trim()) {
      setErrorMessage("Admission Number is required.");
      return;
    }
    if (!formData.rollNumber.trim()) {
      setErrorMessage("Roll Number is required.");
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage("Student Email Address is required.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to register student.");
        showToast(data.error || "Failed to register student.", "error");
        setSubmitting(false);
        return;
      }

      showToast(data.message, "success");
      setSuccessInfo(data.student);
      setSubmitting(false);
    } catch (err: any) {
      setErrorMessage("Network error occurred while submitting student record.");
      showToast("Network error. Please try again.", "error");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Student Registration Portal
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 pl-7">
            Add a new student profile, allocate roll numbers, and generate secure student login credentials.
          </p>
        </div>

        <div className="flex items-center gap-2.5 pl-7 sm:pl-0">
          <button
            type="button"
            onClick={handleGenerateId}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold border border-indigo-200 transition-all shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Generate Admission No.</span>
          </button>
          <Link
            href="/admin/students"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors"
          >
            <span>View All Students</span>
          </Link>
        </div>
      </div>

      {/* Success Banner */}
      {successInfo && (
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-emerald-900">
                Student Registered Successfully!
              </h3>
              <p className="text-xs text-emerald-700 mt-0.5">
                <span className="font-semibold">{successInfo.fullName}</span> has been enrolled with Admission Number{" "}
                <span className="font-mono font-bold">{successInfo.admissionNumber}</span> and Roll No.{" "}
                <span className="font-semibold">{successInfo.rollNumber}</span>.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSuccessInfo(null);
                handleReset();
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-xs"
            >
              Add Another Student
            </button>
            <Link
              href="/admin/students"
              className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-xs font-semibold hover:bg-emerald-100/50"
            >
              Go to Directory
            </Link>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3 animate-in shake">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="font-medium">{errorMessage}</div>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Personal Details */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                1. Personal Details
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Primary identification & photo</p>
            </div>
            <span className="text-[11px] text-rose-500 font-semibold">* Marked fields are required</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Photo Uploader */}
            <div className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50">
              <div className="relative w-28 h-28 rounded-full overflow-hidden bg-slate-200 mb-3 border-2 border-white shadow-md flex items-center justify-center">
                {photoPreview || formData.profilePhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoPreview || formData.profilePhoto}
                    alt="Student Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-bold text-slate-400">No Photo</span>
                )}
                {photoUploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  </div>
                )}
              </div>

              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 shadow-xs">
                <Upload className="w-3.5 h-3.5" />
                <span>{photoUploading ? "Uploading..." : "Upload Photo"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={photoUploading}
                  className="hidden"
                />
              </label>
              <span className="text-[10px] text-slate-400 mt-1">JPG, PNG (Max 5MB)</span>
            </div>

            {/* Name, DOB, Gender */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Aryan Sharma"
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Admission Date
                </label>
                <input
                  type="date"
                  name="admissionDate"
                  value={formData.admissionDate}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Academic Session
                </label>
                <select
                  name="academicSession"
                  value={formData.academicSession}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                  {ACADEMIC_SESSIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Academic Details */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="pb-4 mb-5 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              2. Academic Allocation & Class Enrollment
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Unique institution registration identifiers and section assignment
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Admission Number <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Unique</span>
              </div>
              <input
                type="text"
                name="admissionNumber"
                value={formData.admissionNumber}
                onChange={handleChange}
                placeholder="e.g. ADM-2023-0109"
                required
                className="w-full px-3.5 py-2.5 text-xs font-mono uppercase bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Roll Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                placeholder="e.g. CS-28"
                required
                className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Course / Program <span className="text-rose-500">*</span>
              </label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
              >
                {COURSES.map((c) => (
                  <option key={c.code} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Class / Year <span className="text-rose-500">*</span>
              </label>
              <select
                name="className"
                value={formData.className}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
              >
                {CLASSES.map((cl) => (
                  <option key={cl} value={cl}>{cl}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section <span className="text-rose-500">*</span>
              </label>
              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
              >
                {SECTIONS.map((sec) => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Semester
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
              >
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Contact & Guardian Details */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="pb-4 mb-5 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              3. Contact & Guardian Details
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Emergency points of contact and residence</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@school.edu"
                required
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="+91 98765 00000"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Father&apos;s Name
              </label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                placeholder="Father's full name"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mother&apos;s Name
              </label>
              <input
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                placeholder="Mother's full name"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Guardian Contact Number
              </label>
              <input
                type="tel"
                name="guardianContact"
                value={formData.guardianContact}
                onChange={handleChange}
                placeholder="+91 98765 11111"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Residential Address
              </label>
              <textarea
                name="residentialAddress"
                value={formData.residentialAddress}
                onChange={handleChange}
                rows={2}
                placeholder="Apartment, Street address, City, State, Postal Code"
                className="w-full px-3.5 py-2 text-xs bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Account Credentials & Remarks */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="pb-4 mb-5 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              4. Student Portal Login & Account Credentials
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Used by the student to access their self-service attendance portal
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Login ID / Username
              </label>
              <input
                type="text"
                name="studentLoginId"
                value={formData.studentLoginId}
                onChange={handleChange}
                placeholder="Defaults to admission number"
                className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                The student can log in using either this username, their email, or admission number.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Initial Account Password
              </label>
              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Default: Student@123"
                className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Hashed with bcrypt before storage in database.
              </span>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Additional Remarks / Special Notes
              </label>
              <input
                type="text"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Scholarships, extracurriculars, medical notes, etc."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Buttons: Save Student, Reset, Cancel */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Form</span>
            </button>

            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all ${
                submitting
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30 hover:scale-105"
              }`}
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Save Student</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
