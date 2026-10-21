"use client";

import React, { useState } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  requireTypedWord?: string; // If set, user must type this exact string
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  requireTypedWord,
  isDangerous = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [typedInput, setTypedInput] = useState("");

  if (!isOpen) return null;

  const canConfirm = !requireTypedWord || typedInput.trim() === requireTypedWord;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-2xl shrink-0 ${
                isDangerous ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
              }`}
            >
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500 mt-1">{message}</p>
            </div>
          </div>

          {requireTypedWord && (
            <div className="mt-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl">
              <label className="block text-xs font-semibold text-rose-800 mb-1.5">
                Type <span className="font-mono bg-white px-1.5 py-0.5 rounded text-rose-900 font-bold border border-rose-300">{requireTypedWord}</span> to confirm this action:
              </label>
              <input
                type="text"
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                placeholder={requireTypedWord}
                className="w-full px-3 py-2 text-xs font-mono border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>
          )}

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={() => {
                setTypedInput("");
                onCancel();
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {cancelText}
            </button>
            <button
              disabled={!canConfirm}
              onClick={() => {
                setTypedInput("");
                onConfirm();
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-xl text-white shadow-sm transition-all flex items-center gap-1.5 ${
                !canConfirm
                  ? "bg-slate-300 cursor-not-allowed opacity-60"
                  : isDangerous
                  ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20"
              }`}
            >
              {isDangerous && <Trash2 className="w-3.5 h-3.5" />}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
