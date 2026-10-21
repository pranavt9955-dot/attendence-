"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  UserPlus,
  Eye,
  Edit2,
  Trash2,
  CalendarCheck2,
  Mail,
  Phone,
  GraduationCap,
  Sparkles,
  ArrowRight,
  RefreshCw,
  X,
  Save,
} from "lucide-react";
import { COURSES, CLASSES, SECTIONS } from "@/lib/constants";
import { useToast } from "@/components/ToastContext";

export default function StudentDirectoryPage() {
  const { showToast } = useToast();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");

  // View / Edit Student Modal
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (courseFilter) params.set("course", courseFilter);
      if (classFilter) params.set("className", classFilter);

      const res = await fetch(`/api/students?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setStudents(data.students);
      }
    } catch {
      showToast("Failed to fetch students.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, courseFilter, classFilter]);

  const handleOpenStudent = (s: any, edit = false) => {
    setSelectedStudent(s);
    setIsEditing(edit);
    setEditFormData({
      fullName: s.fullName,
      admissionNumber: s.admissionNumber,
      rollNumber: s.rollNumber,
      course: s.course,
      className: s.className,
      section: s.section,
      email: s.email,
      mobileNumber: s.mobileNumber || "",
      fatherName: s.fatherName || "",
      guardianContact: s.guardianContact || "",
      residentialAddress: s.residentialAddress || "",
      remarks: s.remarks || "",
    });
  };

  const handleSaveEdit = async () => {
    if (!selectedStudent) return;
    try {
      setSavingEdit(true);
      const res = await fetch(`/api/students/${selectedStudent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to update student", "error");
        return;
      }

      showToast("Student profile updated successfully.", "success");
      setSelectedStudent(null);
      setIsEditing(false);
      fetchStudents();
    } catch {
      showToast("Network error.", "error");
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Student Directory
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Browse student profiles, edit details, and inspect enrollment records
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/admin/add-student"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Student</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[220px] flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, roll no, admission no..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
          >
            <option value="">All Courses</option>
            {COURSES.map((c) => (
              <option key={c.code} value={c.name}>{c.name}</option>
            ))}
          </select>

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
          >
            <option value="">All Classes</option>
            {CLASSES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Total Students: <span className="font-bold text-slate-800">{students.length}</span>
        </div>
      </div>

      {/* Students Directory Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading directory...</div>
      ) : students.length === 0 ? (
        <div className="py-20 text-center text-xs text-slate-400">
          No students found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((st) => (
            <div
              key={st.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center font-bold text-sm text-indigo-700 border border-slate-200 shrink-0">
                      {st.profilePhoto ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={st.profilePhoto}
                          alt={st.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        st.fullName.charAt(0)
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">{st.fullName}</h3>
                      <span className="text-xs font-mono font-semibold text-indigo-600 block mt-0.5">
                        {st.admissionNumber}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                    Roll: {st.rollNumber}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{st.course}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{st.className} • {st.section}</span>
                    <span>Session: {st.academicSession}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{st.email}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {st._count?.attendanceRecords ?? 0} Recorded Sessions
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenStudent(st, false)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="View Profile"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenStudent(st, true)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Edit Details"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View & Edit Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isEditing ? "Edit Student Details" : "Student Profile"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedStudent.admissionNumber} • Roll: {selectedStudent.rollNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-4">
              {isEditing ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editFormData.fullName}
                      onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Admission Number</label>
                      <input
                        type="text"
                        value={editFormData.admissionNumber}
                        onChange={(e) => setEditFormData({ ...editFormData, admissionNumber: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl font-mono uppercase"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Roll Number</label>
                      <input
                        type="text"
                        value={editFormData.rollNumber}
                        onChange={(e) => setEditFormData({ ...editFormData, rollNumber: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Class</label>
                      <select
                        value={editFormData.className}
                        onChange={(e) => setEditFormData({ ...editFormData, className: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl"
                      >
                        {CLASSES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Section</label>
                      <select
                        value={editFormData.section}
                        onChange={(e) => setEditFormData({ ...editFormData, section: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl"
                      >
                        {SECTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Mobile Number</label>
                      <input
                        type="text"
                        value={editFormData.mobileNumber}
                        onChange={(e) => setEditFormData({ ...editFormData, mobileNumber: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Guardian Contact</label>
                      <input
                        type="text"
                        value={editFormData.guardianContact}
                        onChange={(e) => setEditFormData({ ...editFormData, guardianContact: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Remarks</label>
                    <input
                      type="text"
                      value={editFormData.remarks}
                      onChange={(e) => setEditFormData({ ...editFormData, remarks: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-indigo-600 text-white font-bold text-xl flex items-center justify-center shrink-0">
                      {selectedStudent.profilePhoto ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={selectedStudent.profilePhoto}
                          alt={selectedStudent.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        selectedStudent.fullName.charAt(0)
                      )}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{selectedStudent.fullName}</h4>
                      <div className="text-xs text-indigo-600 font-mono font-semibold">
                        {selectedStudent.admissionNumber}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Enrolled: {selectedStudent.admissionDate || "2023-08-01"}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Course</span>
                      <span className="font-semibold text-slate-800">{selectedStudent.course}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Class &amp; Section</span>
                      <span className="font-semibold text-slate-800">
                        {selectedStudent.className} - {selectedStudent.section}
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Email</span>
                      <span className="font-semibold text-slate-800 truncate block">{selectedStudent.email}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Contact</span>
                      <span className="font-semibold text-slate-800">{selectedStudent.mobileNumber || "—"}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Residential Address</span>
                    <span className="text-slate-700">{selectedStudent.residentialAddress || "Not provided"}</span>
                  </div>

                  {selectedStudent.remarks && (
                    <div className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-100">
                      <span className="text-[10px] uppercase font-bold text-indigo-700 block">Special Remarks</span>
                      <span className="text-indigo-900">{selectedStudent.remarks}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={savingEdit}
                    className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingEdit ? "Saving..." : "Save Changes"}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
