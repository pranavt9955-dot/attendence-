import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ToastContext";

export const metadata: Metadata = {
  title: "Apex Academy - Student Attendance Management System",
  description: "Complete full-stack educational attendance management system with Admin and Student portals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
