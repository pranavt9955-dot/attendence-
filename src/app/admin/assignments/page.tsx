"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Upload,
  FileText,
  Paperclip,
  Trash2,
  Edit2,
  Eye,
  CheckCircle2,
  X,
  Download,
  AlertCircle,
  Clock,
  Archive,
  Send,
} from "lucide-react";
import {
  COURSES,
  DEPARTMENTS,
  CLASSES,
  SECTIONS,
  SEMESTERS,
  SUBJECTS,
} from "@/lib/constants";
import { useToast } from "@/components/ToastContext";
import FilePreviewModal from "@/components/FilePreviewModal";
import ConfirmDialog from "@/components/ConfirmDialog";

interface AttachmentItem {
  id?: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

export default function AssignmentManagementPage() {
  const { showToast } = useToast();
  const todayStr = new Date().toISOString().split("T")[0];

  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingAssignmentId, setEditingAssignmentId] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterClass, setFilterClass] = useState("ALL");

  // Create / Edit Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState(COURSES[0].name);
  const [department, setDepartment] = useState(COURSES[0].department);
  const [className, setClassName] = useState(CLASSES[2]); // Year 3
  const [section, setSection] = useState("ALL");
  const [semester, setSemester] = useState(SEMESTERS[4]); // Semester 5
  const [subjectCode, setSubjectCode] = useState("CS-501");
  const [subjectName, setSubjectName] = useState("Database Management Systems");
  const [teacherName, setTeacherName] = useState("Dr. Arvind Raghavan");
  const [issueDate, setIssueDate] = useState(todayStr);
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]
  );
  const [maxMarks, setMaxMarks] = useState(100);
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED">("PUBLISHED");
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  // File Preview Modal
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string; type: string } | null>(null);

  // Delete Confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (filterStatus !== "ALL") params.set("status", filterStatus);
      if (filterClass !== "ALL") params.set("className", filterClass);

      const res = await fetch(`/api/assignments?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setAssignments(data.assignments);
      }
    } catch {
      showToast("Failed to fetch assignments.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [searchQuery, filterStatus, filterClass]);

  const handleSubjectChange = (code: string) => {
    setSubjectCode(code);
    const found = SUBJECTS.find((s) => s.code === code);
    if (found) setSubjectName(found.name);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingFiles(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", "assignments");

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          showToast(data.error || "File upload failed", "error");
          continue;
        }

        setAttachments((prev) => [
          ...prev,
          {
            fileName: data.fileName,
            fileUrl: data.fileUrl,
            fileType: data.fileType,
            fileSize: data.fileSize,
          },
        ]);
      }
      showToast("Attachments uploaded successfully.", "success");
    } catch {
      showToast("Network error uploading files.", "error");
    } finally {
      setUploadingFiles(false);
    }
  };

  const removeAttachment = (idx: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCourse(COURSES[0].name);
    setDepartment(COURSES[0].department);
    setClassName(CLASSES[2]);
    setSection("ALL");
    setSemester(SEMESTERS[4]);
    setSubjectCode("CS-501");
    setSubjectName("Database Management Systems");
    setTeacherName("Dr. Arvind Raghavan");
    setIssueDate(todayStr);
    setDeadline(new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]);
    setMaxMarks(100);
    setStatus("PUBLISHED");
    setAttachments([]);
    setEditingAssignmentId(null);
  };

  const handleOpenEdit = (a: any) => {
    setEditingAssignmentId(a.id);
    setTitle(a.title);
    setDescription(a.description);
    setCourse(a.course);
    setDepartment(a.department);
    setClassName(a.className);
    setSection(a.section);
    setSemester(a.semester);
    setSubjectCode(a.subjectCode);
    setSubjectName(a.subjectName);
    setTeacherName(a.teacherName);
    setIssueDate(a.issueDate);
    setDeadline(a.deadline);
    setMaxMarks(a.maxMarks);
    setStatus(a.status);
    setAttachments(a.attachments || []);
    setShowCreateModal(true);
  };

  const handleSubmit = async (submitStatus?: "DRAFT" | "PUBLISHED" | "ARCHIVED") => {
    const finalStatus = submitStatus || status;

    if (!title.trim() || !description.trim()) {
      showToast("Title and Description are required.", "warning");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: title.trim(),
        description: description.trim(),
        course,
        department,
        className,
        section,
        semester,
        subjectName,
        subjectCode,
        teacherName,
        issueDate,
        deadline,
        maxMarks: Number(maxMarks),
        status: finalStatus,
        attachments,
      };

      const url = editingAssignmentId ? `/api/assignments/${editingAssignmentId}` : "/api/assignments";
      const method = editingAssignmentId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Operation failed", "error");
        return;
      }

      showToast(data.message || "Assignment saved successfully!", "success");
      setShowCreateModal(false);
      resetForm();
      fetchAssignments();
    } catch {
      showToast("Network error submitting assignment.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/assignments/${deleteId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Assignment deleted.", "success");
        setDeleteId(null);
        fetchAssignments();
      } else {
        showToast(data.error || "Failed to delete assignment.", "error");
      }
    } catch {
      showToast("Network error.", "error");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "PUBLISHED" ? "ARCHIVED" : "PUBLISHED";
    try {
      const res = await fetch(`/api/assignments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        showToast(`Assignment ${nextStatus === "PUBLISHED" ? "published" : "archived"}.`, "success");
        fetchAssignments();
      }
    } catch {
      showToast("Error updating status.", "error");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Assignment Management
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Create, upload attachments (PDF, images, documents), and target coursework to student batches
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Upload &amp; Publish Assignment</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px] flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, subject, code, or teacher..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
          >
            <option value="ALL">All Classes</option>
            {CLASSES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{assignments.length}</span> assignments
        </div>
      </div>

      {/* Assignments Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading assignments...</div>
        ) : assignments.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No assignments match your search or filters. Click &quot;Upload &amp; Publish Assignment&quot; to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Title &amp; Subject</th>
                  <th className="py-3 px-4">Target Batch</th>
                  <th className="py-3 px-4">Deadline</th>
                  <th className="py-3 px-4">Max Marks</th>
                  <th className="py-3 px-4">Attachments</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assignments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="font-bold text-slate-900 block truncate">{a.title}</span>
                      <span className="text-[11px] text-slate-500">
                        {a.subjectName} ({a.subjectCode}) • {a.teacherName}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      <div>{a.className}</div>
                      <div className="text-[10px] text-slate-500">
                        {a.section === "ALL" ? "All Sections" : a.section}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-900">
                      <span className="flex items-center gap-1.5 text-slate-800">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {a.deadline}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {a.maxMarks} pts
                    </td>
                    <td className="py-3.5 px-4">
                      {a.attachments && a.attachments.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {a.attachments.map((att: any) => (
                            <button
                              key={att.id}
                              onClick={() =>
                                setPreviewFile({
                                  url: att.fileUrl,
                                  name: att.fileName,
                                  type: att.fileType,
                                })
                              }
                              className="inline-flex items-center gap-1.5 text-[11px] text-indigo-600 hover:text-indigo-800 font-medium truncate max-w-[180px]"
                            >
                              <Paperclip className="w-3 h-3 shrink-0" />
                              <span className="truncate">{att.fileName}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No attachments</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          a.status === "PUBLISHED"
                            ? "bg-emerald-100 text-emerald-800"
                            : a.status === "DRAFT"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggleStatus(a.id, a.status)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                          title={a.status === "PUBLISHED" ? "Archive" : "Publish"}
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(a)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(a.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload & Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[92vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingAssignmentId ? "Edit Assignment" : "Upload & Publish New Assignment"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Target students by course, class, and section with instructions and file attachments
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-auto p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assignment Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lab Assignment 4: Binary Search Trees & AVL Balancing"
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description / Detailed Instructions <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Provide complete submission guidelines, formatting expectations, problem statements, and evaluation criteria..."
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Course</label>
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    {COURSES.map((c) => (
                      <option key={c.code} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Class / Year</label>
                  <select
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    {CLASSES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Section</label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="ALL">All Sections (Entire Batch)</option>
                    {SECTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={subjectCode}
                    onChange={(e) => handleSubjectChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s.code} value={s.code}>{s.code} - {s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Faculty / Teacher</label>
                  <input
                    type="text"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Maximum Marks</label>
                  <input
                    type="number"
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Submission Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold text-rose-700"
                  />
                </div>
              </div>

              {/* Attachments Upload Zone */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Attachments (PDF, JPG, PNG, DOC, DOCX, PPT, PPTX)
                </label>
                <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/60 text-center">
                  <input
                    type="file"
                    id="attachment-file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.ppt,.pptx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="attachment-file"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 shadow-xs transition-colors"
                  >
                    <Upload className="w-4 h-4 text-indigo-600" />
                    <span>{uploadingFiles ? "Uploading Files..." : "Browse & Upload Attachments"}</span>
                  </label>
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Supported: PDF, Word (.docx), PowerPoint (.pptx), Images (Max 25MB each)
                  </p>
                </div>

                {/* Uploaded Attachments List */}
                {attachments.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    {attachments.map((att, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-100 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Paperclip className="w-4 h-4 text-indigo-600 shrink-0" />
                          <span className="font-semibold text-slate-800 truncate">{att.fileName}</span>
                          <span className="text-[10px] text-slate-500">
                            ({(att.fileSize / 1024).toFixed(0)} KB)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewFile({
                                url: att.fileUrl,
                                name: att.fileName,
                                type: att.fileType,
                              })
                            }
                            className="text-indigo-600 hover:text-indigo-800 font-semibold"
                          >
                            Preview
                          </button>
                          <button
                            type="button"
                            onClick={() => removeAttachment(idx)}
                            className="text-rose-500 hover:text-rose-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSubmit("DRAFT")}
                  disabled={submitting || uploadingFiles}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-colors shadow-xs"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit("PUBLISHED")}
                  disabled={submitting || uploadingFiles}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? "Publishing..." : "Publish Assignment"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {previewFile && (
        <FilePreviewModal
          isOpen={!!previewFile}
          onClose={() => setPreviewFile(null)}
          fileUrl={previewFile.url}
          fileName={previewFile.name}
          fileType={previewFile.type}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Assignment?"
        message="This will delete this assignment and remove its attachments. Students will no longer see this coursework."
        confirmText="Delete Assignment"
        isDangerous
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
