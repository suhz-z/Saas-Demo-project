import { ReactNode } from "react";
import { LayoutDashboard, Building2, BookOpen, Users, CalendarDays } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/ui/app-sidebar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  async function signOut() {
    "use server";
    const c = await cookies();
    c.delete("auth_token");
    redirect("/login");
  }

  const links = [
    { href: "/admin", icon: <LayoutDashboard size={17} />, label: "Dashboard" },
    { href: "/admin/universities", icon: <Building2 size={17} />, label: "Universities" },
    { href: "/admin/courses", icon: <BookOpen size={17} />, label: "Courses" },
    { href: "/admin/intakes", icon: <CalendarDays size={17} />, label: "Academic Cycles" },
    { href: "/admin/users", icon: <Users size={17} />, label: "Users" },
  ];

  const brand = {
    initials: "SA",
    name: "SACDMS",
    role: "Admin",
  };

  return (
    <div className="flex h-screen bg-background subtle-grid overflow-hidden">
      <AppSidebar links={links} brand={brand} signOutAction={signOut} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-background/80 backdrop-blur-xl border-b border-border/40 h-[3.75rem] flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-3">
            {/* Spacer for mobile toggle button */}
            <div className="w-10 md:hidden" />
            <h2 className="text-[15px] font-semibold tracking-tight text-foreground/80">Admin Portal</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[11px] font-bold text-primary">
              AD
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-[76rem] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

