import { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, Building2, BookOpen, Users, LogOut } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-950 text-white flex flex-col">
        <div className="p-6 border-b border-emerald-900 flex items-center gap-3">
          <div className="bg-emerald-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">SA</div>
          <span className="text-xl font-bold tracking-tight">SACDMS</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 p-3 rounded-lg hover:bg-emerald-900 transition-colors">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/admin/universities" className="flex items-center gap-3 p-3 rounded-lg hover:bg-emerald-900 transition-colors">
            <Building2 size={20} /> Universities
          </Link>
          <Link href="/admin/courses" className="flex items-center gap-3 p-3 rounded-lg hover:bg-emerald-900 transition-colors">
            <BookOpen size={20} /> Courses
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 p-3 rounded-lg hover:bg-emerald-900 transition-colors opacity-50 cursor-not-allowed">
            <Users size={20} /> Users
          </Link>
        </nav>
        <div className="p-4 border-t border-emerald-900">
           <form action={async () => {
             "use server";
             const c = await cookies();
             c.delete("auth_token");
             redirect("/login");
           }}>
            <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-900/50 text-red-200 transition-colors">
              <LogOut size={20} /> Logout
            </button>
           </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b h-16 flex items-center px-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">Admin Portal</h2>
        </header>
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
