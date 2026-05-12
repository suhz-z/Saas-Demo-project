"use client";

import { useState, useEffect, useTransition } from "react";
import { SidebarLink } from "./sidebar-link";
import { Menu, X, LogOut, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface AppSidebarProps {
  links: {
    href: string;
    icon: React.ReactNode;
    label: string;
  }[];
  brand: {
    initials: string;
    name: string;
    role: string;
  };
  signOutAction: () => Promise<void>;
}

export function AppSidebar({ links, brand, signOutAction }: AppSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        style={{ background: "oklch(0 0 0 / 0.7)", backdropFilter: "blur(4px)" }}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Toggle */}
      <button
        id="sidebar-mobile-toggle"
        className="fixed top-3 left-4 z-50 p-2 rounded-xl md:hidden transition-all duration-200 hover:scale-105 active:scale-95"
        style={{
          background: "oklch(0.12 0.022 272 / 0.85)",
          border: "1px solid oklch(0.28 0.04 272 / 0.8)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 4px 16px oklch(0 0 0 / 0.4)",
          color: "oklch(0.88 0.012 268)",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col transition-all duration-300 ease-in-out md:relative",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          isCollapsed ? "md:w-[4.5rem]" : "md:w-[16.5rem]"
        )}
        style={{
          background: "oklch(0.055 0.016 275 / 0.97)",
          borderRight: "1px solid oklch(0.20 0.03 272 / 0.7)",
          backdropFilter: "blur(32px)",
        }}
      >
        {/* Sidebar inner grain */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.4] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`,
            backgroundSize: "256px 256px",
          }}
        />

        {/* Subtle sidebar plasma orb */}
        <div
          className="absolute top-0 left-0 w-full h-48 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 120% 80% at 50% 0%, oklch(0.68 0.22 290 / 0.08) 0%, transparent 80%)",
          }}
        />

        {/* Desktop collapse toggle */}
        <button
          id="sidebar-collapse-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-3.5 top-11 w-7 h-7 rounded-full items-center justify-center text-white border-2 transition-all duration-200 hover:scale-110 z-50"
          style={{
            background: "linear-gradient(135deg, oklch(0.65 0.22 290), oklch(0.58 0.22 260))",
            borderColor: "oklch(0.055 0.016 275)",
            boxShadow: "0 0 16px oklch(0.68 0.22 290 / 0.4)",
          }}
        >
          {isCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>

        {/* Brand */}
        <div
          className={cn(
            "px-5 h-[3.75rem] flex items-center transition-all duration-300 relative z-10",
            isCollapsed ? "md:px-3.5 justify-center" : "gap-3"
          )}
        >
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[12px] font-extrabold text-white tracking-tight shrink-0"
            style={{
              background: "linear-gradient(135deg, oklch(0.68 0.22 290), oklch(0.56 0.22 255))",
              boxShadow: "0 0 18px oklch(0.68 0.22 290 / 0.45), 0 3px 8px oklch(0 0 0 / 0.5)",
            }}
          >
            {brand.initials}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col gap-0.5 overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
              <span className="text-[14px] font-bold tracking-tight text-white/85 leading-none truncate">
                {brand.name}
              </span>
              <span
                className="text-[9px] uppercase tracking-[0.15em] font-semibold leading-none"
                style={{ color: "oklch(0.68 0.22 290)" }}
              >
                {brand.role}
              </span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div
          className={cn("mx-4 h-px transition-all relative z-10", isCollapsed && "mx-2")}
          style={{ background: "linear-gradient(90deg, transparent, oklch(0.28 0.04 272 / 0.8), transparent)" }}
        />

        {/* Navigation */}
        <nav className="flex-1 px-2.5 py-4 space-y-0.5 overflow-y-auto custom-scrollbar relative z-10">
          {links.map((link) => (
            <SidebarLink
              key={link.href}
              href={link.href}
              icon={link.icon}
              label={isCollapsed ? "" : link.label}
              className={isCollapsed ? "justify-center px-0" : ""}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="px-2.5 pb-5 mt-auto relative z-10">
          <div
            className={cn("mx-2 mb-4 h-px transition-all", isCollapsed && "mx-1")}
            style={{ background: "linear-gradient(90deg, transparent, oklch(0.28 0.04 272 / 0.8), transparent)" }}
          />
          <form action={() => startTransition(async () => await signOutAction())}>
            <button
              disabled={isPending}
              className={cn(
                "flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-[13px] transition-all duration-150 font-medium disabled:opacity-40",
                isCollapsed && "justify-center px-0"
              )}
              style={{
                color: "oklch(0.52 0.03 270)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.72 0.05 270)";
                (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.14 0.025 272 / 0.8)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.52 0.03 270)";
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              {isPending ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <LogOut size={15} />
              )}
              {!isCollapsed && (
                <span>{isPending ? "Signing out..." : "Sign out"}</span>
              )}
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
