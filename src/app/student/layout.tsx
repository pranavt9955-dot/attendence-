import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login?role=STUDENT");
  }

  // If Admin is logged in, they can view or we allow them
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar user={session} portal="STUDENT" />
      <div className="flex flex-1">
        <Sidebar portal="STUDENT" />
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
