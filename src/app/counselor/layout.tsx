import { ReactNode } from "react";
import { SidebarLink } from "@/components/ui/sidebar-link";
import { LayoutDashboard, Search, LogOut, Users, Sparkles } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function CounselorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-background subtle-grid">
      <aside className="w-[17rem] bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border relative z-20">
        {/* Brand */}
        <div className="px-6 py-7 flex items-center gap-3.5">
          <div className="bg-primary/90 shadow-lg shadow-primary/25 w-9 h-9 rounded-[10px] flex items-center justify-center text-[13px] font-extrabold text-white tracking-tight">
            SA
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[15px] font-bold tracking-tight text-white leading-none">SACDMS</span>
            <span className="text-[10px] uppercase tracking-[0.12em] text-sidebar-foreground/40 font-semibold leading-none">Counselor</span>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-5 h-px bg-sidebar-border/60" />

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-0.5">
          <SidebarLink href="/counselor" icon={<LayoutDashboard size={17} />} label="Dashboard" />
          <SidebarLink href="/counselor/search" icon={<Search size={17} />} label="Course Search" />
          <SidebarLink href="/counselor/students" icon={<Users size={17} />} label="Students" />
        </nav>

        {/* Footer */}
        <div className="px-3 pb-5 mt-auto">
          <div className="mx-2 mb-4 h-px bg-sidebar-border/60" />
          <form action={async () => {
            "use server";
            const c = await cookies();
            c.delete("auth_token");
            redirect("/login");
          }}>
            <button className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-[13px] hover:bg-white/[0.06] text-sidebar-foreground/50 hover:text-sidebar-foreground/80 transition-all duration-150 font-medium">
              <LogOut size={16} />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-background/80 backdrop-blur-xl border-b border-border/40 h-[3.75rem] flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-[15px] font-semibold tracking-tight text-foreground/80">Counselor Portal</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[11px] font-bold text-primary">
              JD
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8 custom-scrollbar">
          <div className="max-w-[76rem] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

