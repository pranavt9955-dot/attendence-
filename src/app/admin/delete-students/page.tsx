"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trash2,
  Users,
  Search,
  Filter,
  AlertTriangle,
  RotateCcw,
  CheckSquare,
  Square,
  Eye,
  Edit2,
  ShieldAlert,
  ArrowLeft,
  RefreshCw,
  Archive,
} from "lucide-react";
import { COURSES, CLASSES, SECTIONS } from "@/lib/constants";
import { useToast } from "@/components/ToastContext";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function DeleteStudentRecordsPage() {
  const { showToast } = useToast();

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterStatus, setFilterStatus] = useState("ACTIVE"); // "ACTIVE", "DELETED", "ALL"

  // Dialog State
  const [deleteSelectedModalOpen, setDeleteSelectedModalOpen] = useState(false);
  const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false);
  const [singleDeleteStudent, setSingleDeleteStudent] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  // View / Edit Modal
  const [viewStudent, setViewStudent] = useState<any | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (filterCourse) params.set("course", filterCourse);
      if (filterClass) params.set("className", filterClass);
      params.set("status", filterStatus);

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
  }, [searchQuery, filterCourse, filterClass, filterStatus]);

  // Checkbox selection logic
  const handleToggleStudent = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const allIds = students.map((s) => s.id);
    setSelectedIds(allIds);
    showToast(`Selected all ${allIds.length} currently displayed students.`, "info");
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  // Perform Selected Deletion (Soft delete / archive with recovery)
  const handleConfirmDeleteSelected = async () => {
    if (selectedIds.length === 0) return;

    try {
      setDeleting(true);
      const res = await fetch("/api/students/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentIds: selectedIds,
          action: "SOFT_DELETE",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Bulk deletion failed", "error");
        return;
      }

      showToast(data.message || `Successfully archived ${selectedIds.length} records.`, "success");
      setDeleteSelectedModalOpen(false);
      setSelectedIds([]);
      fetchStudents();
    } catch {
      showToast("Network error occurred during bulk deletion.", "error");
    } finally {
      setDeleting(false);
    }
  };

  // Perform Delete All Records (Requires typing "DELETE ALL")
  const handleConfirmDeleteAll = async () => {
    try {
      setDeleting(true);
      const res = await fetch("/api/students/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deleteAll: true,
          confirmationText: "DELETE ALL",
          action: "SOFT_DELETE",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Wipe operation failed", "error");
        return;
      }

      showToast(data.message || "All student records safely archived.", "success");
      setDeleteAllModalOpen(false);
      setSelectedIds([]);
      fetchStudents();
    } catch {
      showToast("Network error.", "error");
    } finally {
      setDeleting(false);
    }
  };

  // Single Record Deletion
  const handleConfirmSingleDelete = async () => {
    if (!singleDeleteStudent) return;

    try {
      const res = await fetch(`/api/students/${singleDeleteStudent.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        setSingleDeleteStudent(null);
        fetchStudents();
      } else {
        showToast(data.error || "Deletion failed", "error");
      }
    } catch {
      showToast("Network error.", "error");
    }
  };

  // Restore archived student
  const handleRestoreStudent = async (id: string) => {
    try {
      const res = await fetch(`/api/students/bulk-delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentIds: [id],
          action: "RESTORE",
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Student record restored successfully.", "success");
        fetchStudents();
      }
    } catch {
      showToast("Restore failed.", "error");
    }
  };

  const isAllSelected = students.length > 0 && selectedIds.length === students.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-red-50 text-red-600">
                <Trash2 className="w-6 h-6" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Delete Student Records &amp; Data Retention
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1 pl-7">
            Manage bulk record archival, safe soft deletion, and recovery with security confirmation safeguards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pl-7 sm:pl-0">
          <button
            onClick={() => {
              setFilterCourse("");
              setFilterClass("");
              setSearchQuery("");
              setFilterStatus("ALL");
              fetchStudents();
              showToast("Showing all registered student records.", "info");
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-colors"
          >
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Show All Students</span>
          </button>

          <button
            onClick={() => setDeleteAllModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-md shadow-rose-700/25 transition-all hover:scale-105"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Delete All Records</span>
          </button>
        </div>
      </div>

      {/* Safety Notice Card */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-900 text-xs flex items-start gap-3 shadow-xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-amber-900">Institutional Data Retention Policy</h4>
          <p className="mt-0.5 text-amber-800 leading-relaxed">
            By default, all deletion operations in this portal perform non-destructive **soft deletion (archival)**. Student academic histories and attendance records are safely preserved and can be restored at any time. Permanent deletion requires explicit database administrator elevation.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[220px] flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, roll no, or admission no..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
          >
            <option value="">All Courses</option>
            {COURSES.map((c) => (
              <option key={c.code} value={c.name}>{c.name}</option>
            ))}
          </select>

          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
          >
            <option value="">All Classes</option>
            {CLASSES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
          >
            <option value="ACTIVE">Active Students</option>
            <option value="DELETED">Archived / Deleted</option>
            <option value="ALL">All Records</option>
          </select>
        </div>

        {/* Selection Actions */}
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              {selectedIds.length} Selected
            </span>
          )}

          <button
            type="button"
            onClick={isAllSelected ? handleDeselectAll : handleSelectAll}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            {isAllSelected ? "Deselect All" : "Select All"}
          </button>

          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={() => setDeleteSelectedModalOpen(true)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all ${
              selectedIds.length === 0
                ? "bg-slate-300 cursor-not-allowed opacity-60"
                : "bg-rose-600 hover:bg-rose-500 shadow-rose-600/30 hover:scale-105"
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Selected ({selectedIds.length})</span>
          </button>
        </div>
      </div>

      {/* Student Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading student records...</div>
        ) : students.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            No student records match the current filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={isAllSelected ? handleDeselectAll : handleSelectAll}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4 w-32">Admission No</th>
                  <th className="py-3 px-4 w-20">Roll No</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4 w-20">Section</th>
                  <th className="py-3 px-4 w-24">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => {
                  const isChecked = selectedIds.includes(st.id);
                  const isDeleted = st.status === "DELETED";

                  return (
                    <tr
                      key={st.id}
                      className={`transition-colors ${
                        isChecked
                          ? "bg-indigo-50/60"
                          : isDeleted
                          ? "bg-rose-50/30 text-slate-500"
                          : "hover:bg-slate-50/80"
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleStudent(st.id)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {st.admissionNumber}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                        {st.rollNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{st.fullName}</div>
                        <div className="text-[11px] text-slate-400">{st.email}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {st.course}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {st.className}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {st.section}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            st.status === "ACTIVE"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {st.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewStudent(st)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {isDeleted ? (
                            <button
                              onClick={() => handleRestoreStudent(st.id)}
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="Restore Student"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => setSingleDeleteStudent(st)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal: Delete Selected */}
      <ConfirmDialog
        isOpen={deleteSelectedModalOpen}
        title="Confirm Deletion of Selected Records"
        message={`Are you sure you want to archive ${selectedIds.length} selected student records? Their academic profiles will be moved to archives and can be restored whenever needed.`}
        confirmText={`Delete ${selectedIds.length} Records`}
        isDangerous
        onConfirm={handleConfirmDeleteSelected}
        onCancel={() => setDeleteSelectedModalOpen(false)}
      />

      {/* Confirmation Modal: Delete All Records (Requires typing "DELETE ALL") */}
      <ConfirmDialog
        isOpen={deleteAllModalOpen}
        title="DANGER: Bulk Delete All Student Records"
        message="This operation will archive all registered student records currently in the system. To prevent accidental bulk loss, you must explicitly type DELETE ALL below to proceed."
        confirmText="Confirm Bulk Deletion"
        requireTypedWord="DELETE ALL"
        isDangerous
        onConfirm={handleConfirmDeleteAll}
        onCancel={() => setDeleteAllModalOpen(false)}
      />

      {/* Confirmation Modal: Single Record Delete */}
      <ConfirmDialog
        isOpen={!!singleDeleteStudent}
        title={`Delete Record for ${singleDeleteStudent?.fullName}?`}
        message={`This will archive ${singleDeleteStudent?.fullName} (Admission No: ${singleDeleteStudent?.admissionNumber}). The record can be restored from the Archived status filter.`}
        confirmText="Archive Record"
        isDangerous
        onConfirm={handleConfirmSingleDelete}
        onCancel={() => setSingleDeleteStudent(null)}
      />

      {/* View Student Profile Modal */}
      {viewStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden p-6 border border-slate-200">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                  {viewStudent.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{viewStudent.fullName}</h3>
                  <p className="text-xs text-indigo-600 font-mono font-semibold">
                    {viewStudent.admissionNumber} • Roll: {viewStudent.rollNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewStudent(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Course:</span>
                <span className="font-semibold text-slate-800">{viewStudent.course}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Class &amp; Section:</span>
                <span className="font-semibold text-slate-800">
                  {viewStudent.className} - {viewStudent.section}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Email Address:</span>
                <span className="font-semibold text-slate-800">{viewStudent.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Mobile Number:</span>
                <span className="font-semibold text-slate-800">{viewStudent.mobileNumber || "—"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Guardian Contact:</span>
                <span className="font-semibold text-slate-800">{viewStudent.guardianContact || "—"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Status:</span>
                <span className="font-bold text-emerald-700">{viewStudent.status}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-right">
              <button
                onClick={() => setViewStudent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
