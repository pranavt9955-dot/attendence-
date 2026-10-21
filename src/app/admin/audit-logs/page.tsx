"use client";

import React, { useState, useEffect } from "react";
import { History, Shield, RefreshCw, Clock, User, Activity } from "lucide-react";
import { useToast } from "@/components/ToastContext";

export default function AuditLogsPage() {
  const { showToast } = useToast();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/audit-logs?limit=100");
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch {
      showToast("Failed to fetch audit logs.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                System Audit Trail &amp; Activity Log
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Cryptographically tracked administrative mutations, roll-call edits, and bulk deletions
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchLogs}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading audit trail...</div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">No audit events recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-44">Timestamp</th>
                  <th className="py-3 px-4 w-48">Actor</th>
                  <th className="py-3 px-4 w-44">Action</th>
                  <th className="py-3 px-4 w-28">Entity</th>
                  <th className="py-3 px-4">Event Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-semibold truncate max-w-xs">
                      {log.userEmail || "system"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.action.includes("DELETE")
                            ? "bg-rose-100 text-rose-800"
                            : log.action.includes("CREATE")
                            ? "bg-emerald-100 text-emerald-800"
                            : log.action.includes("EDIT") || log.action.includes("UPDATE")
                            ? "bg-amber-100 text-amber-800"
                            : "bg-indigo-100 text-indigo-800"
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-bold">
                      {log.entityType}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-sans text-xs">
                      {log.details ? (
                        <div className="truncate max-w-md bg-slate-50 px-2 py-1 rounded border border-slate-100 font-mono text-[10px]">
                          {log.details}
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
