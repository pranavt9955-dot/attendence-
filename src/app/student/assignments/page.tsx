"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Search,
  Clock,
  Paperclip,
  Download,
  Eye,
  FileText,
  AlertCircle,
  Calendar,
  CheckCircle2,
  X,
} from "lucide-react";
import { useToast } from "@/components/ToastContext";
import FilePreviewModal from "@/components/FilePreviewModal";

export default function StudentAssignmentsPage() {
  const { showToast } = useToast();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Selected assignment for viewing details modal
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);

  // File Preview Modal
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string; type: string } | null>(null);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);

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
  }, [search]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                My Assignments &amp; Coursework
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Official coursework distributed to your course, class, and section with in-browser previews
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assignments by title or subject..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
          />
        </div>
      </div>

      {/* Assignments List / Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading your coursework...</div>
      ) : assignments.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/80 shadow-xs text-center max-w-lg mx-auto">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No Assignments Currently Available</h3>
          <p className="text-xs text-slate-500 mt-1">
            There are no published assignments scheduled for your enrolled course and section right now.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assignments.map((a) => {
            const hasAttachments = a.attachments && a.attachments.length > 0;

            return (
              <div
                key={a.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 font-mono">
                      {a.subjectCode}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                      <Clock className="w-3.5 h-3.5" />
                      Due {a.deadline}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 mb-1">
                    {a.title}
                  </h3>
                  <div className="text-[11px] text-slate-500 font-medium mb-3">
                    {a.subjectName} • {a.teacherName}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {a.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{a.maxMarks} Marks</span>
                    {hasAttachments && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md">
                        <Paperclip className="w-3 h-3" />
                        {a.attachments.length} File{a.attachments.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedAssignment(a)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition-colors"
                  >
                    <span>View &amp; Files</span>
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Assignment Details & File Preview Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-800 font-mono">
                    {selectedAssignment.subjectCode}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {selectedAssignment.subjectName}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                  {selectedAssignment.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Instructor: <span className="font-semibold text-slate-700">{selectedAssignment.teacherName}</span> • Maximum Score: <span className="font-bold text-slate-800">{selectedAssignment.maxMarks} Points</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedAssignment(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-auto p-6 space-y-5">
              {/* Deadline & Dates Banner */}
              <div className="flex flex-wrap items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs gap-3">
                <div>
                  <span className="text-slate-400 font-medium">Issued Date: </span>
                  <span className="font-semibold text-slate-700">{selectedAssignment.issueDate}</span>
                </div>
                <div>
                  <span className="text-rose-600 font-bold flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    Deadline: {selectedAssignment.deadline}
                  </span>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Assignment Instructions &amp; Specifications
                </h4>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedAssignment.description}
                </div>
              </div>

              {/* Attachments & In-app preview triggers */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Attached Resources &amp; Handouts ({selectedAssignment.attachments?.length || 0})
                </h4>

                {!selectedAssignment.attachments || selectedAssignment.attachments.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                    No files attached to this assignment.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedAssignment.attachments.map((att: any) => (
                      <div
                        key={att.id}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-xs"
                      >
                        <div className="flex items-center gap-3 truncate pr-3">
                          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <div className="text-xs font-bold text-slate-800 truncate">
                              {att.fileName}
                            </div>
                            <div className="text-[10px] text-slate-400 uppercase font-mono">
                              {att.fileType || "Document"} • {(att.fileSize / 1024).toFixed(0)} KB
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewFile({
                                url: att.fileUrl,
                                name: att.fileName,
                                type: att.fileType,
                              })
                            }
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold border border-indigo-200 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>
                          <a
                            href={att.fileUrl}
                            download={att.fileName}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setSelectedAssignment(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-browser File Preview Modal (PDF / Images / Docs) */}
      {previewFile && (
        <FilePreviewModal
          isOpen={!!previewFile}
          onClose={() => setPreviewFile(null)}
          fileUrl={previewFile.url}
          fileName={previewFile.name}
          fileType={previewFile.type}
        />
      )}
    </div>
  );
}
