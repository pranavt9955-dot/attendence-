"use client";

import React from "react";
import { X, Download, FileText, ExternalLink } from "lucide-react";

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
  fileType?: string;
}

export default function FilePreviewModal({
  isOpen,
  onClose,
  fileUrl,
  fileName,
  fileType = "",
}: FilePreviewModalProps) {
  if (!isOpen) return null;

  const isPdf =
    fileType.toLowerCase().includes("pdf") || fileName.toLowerCase().endsWith(".pdf");
  const isImage =
    fileType.toLowerCase().includes("image") ||
    /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(fileName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3 truncate pr-4">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h3 className="text-sm font-bold text-slate-800 truncate">{fileName}</h3>
              <p className="text-xs text-slate-500 font-medium">In-app Document Preview</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={fileUrl}
              download={fileName}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download File</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-auto bg-slate-100 flex items-center justify-center min-h-[400px] max-h-[70vh] p-4">
          {isPdf ? (
            <iframe
              src={`${fileUrl}#toolbar=0`}
              className="w-full h-full min-h-[550px] rounded-lg border border-slate-300 bg-white"
              title={fileName}
            />
          ) : isImage ? (
            <div className="relative max-h-full max-w-full flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fileUrl}
                alt={fileName}
                className="max-h-[65vh] max-w-full object-contain rounded-lg shadow-md"
              />
            </div>
          ) : (
            <div className="text-center p-8 bg-white rounded-xl shadow-xs border border-slate-200 max-w-md">
              <FileText className="w-16 h-16 text-indigo-400 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800 mb-1">{fileName}</h4>
              <p className="text-xs text-slate-500 mb-4">
                This document format cannot be rendered directly in the inline viewer. You can download and open it in your desktop application.
              </p>
              <a
                href={fileUrl}
                download={fileName}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition-colors"
              >
                <Download className="w-4 h-4" />
                Download and Open
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
