import { ReactNode } from "react";
import { LayoutDashboard, Search, Users } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/ui/app-sidebar";

export default async function CounselorLayout({ children }: { children: ReactNode }) {
  async function signOut() {
    "use server";
    const c = await cookies();
    c.delete("auth_token");
    redirect("/login");
  }

  const links = [
    { href: "/counselor", icon: <LayoutDashboard size={17} />, label: "Dashboard" },
    { href: "/counselor/search", icon: <Search size={17} />, label: "Course Search" },
    { href: "/counselor/students", icon: <Users size={17} />, label: "Students" },
  ];

  const brand = { initials: "SA", name: "SACDMS", role: "Counselor" };

  return (
    <div
      className="flex h-screen overflow-hidden relative"
      style={{ background: "oklch(0.075 0.018 275)" }}
    >
      {/* Full-page gassy background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.55] mix-blend-screen"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.1'/%3E%3C/svg%3E")`,
            backgroundSize: "256px 256px",
          }}
        />
        {/* Floating plasma orbs — teal-shifted for counselor */}
        <div
          className="absolute"
          style={{
            width: "45vw", height: "45vw",
            top: "-15%", left: "-8%",
            borderRadius: "50%",
            background: "radial-gradient(circle, oklch(0.62 0.20 195 / 0.10) 0%, transparent 70%)",
            filter: "blur(80px)",
            animation: "orb-float-2 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute"
          style={{
            width: "38vw", height: "38vw",
            bottom: "-12%", right: "5%",
            borderRadius: "50%",
            background: "radial-gradient(circle, oklch(0.68 0.22 290 / 0.09) 0%, transparent 70%)",
            filter: "blur(90px)",
            animation: "orb-float-1 16s ease-in-out infinite",
          }}
        />
        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid opacity-20" />
      </div>

      <AppSidebar links={links} brand={brand} signOutAction={signOut} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <header
          className="h-[3.75rem] flex items-center justify-between px-4 md:px-8 shrink-0 relative"
          style={{
            background: "oklch(0.075 0.018 275 / 0.75)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid oklch(0.22 0.03 272 / 0.5)",
          }}
        >
          <div
            className="absolute bottom-0 inset-x-0 h-[1px] pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent 5%, oklch(0.62 0.20 195 / 0.2) 40%, oklch(0.68 0.22 290 / 0.15) 60%, transparent 95%)",
            }}
          />

          <div className="flex items-center gap-3">
            <div className="w-10 md:hidden" />
            <div className="flex items-center gap-2.5">
              <span
                className="text-[11px] font-semibold"
                style={{ color: "oklch(0.62 0.20 195 / 0.7)" }}
              >
                ◆
              </span>
              <h2
                className="text-[14px] font-semibold tracking-tight"
                style={{ color: "oklch(0.75 0.02 268)" }}
              >
                Counselor Portal
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-bold"
              style={{
                background: "linear-gradient(135deg, oklch(0.62 0.20 195 / 0.25), oklch(0.68 0.22 290 / 0.15))",
                border: "1px solid oklch(0.62 0.20 195 / 0.35)",
                color: "oklch(0.72 0.18 195)",
                boxShadow: "0 0 12px oklch(0.62 0.20 195 / 0.2)",
              }}
            >
              JD
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
