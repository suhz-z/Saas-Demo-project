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

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Toggle Button */}
      <button
        className="fixed top-3 left-4 z-50 p-2 rounded-lg bg-sidebar text-sidebar-foreground md:hidden shadow-lg border border-sidebar-border"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border transition-all duration-300 ease-in-out md:relative",
          // Mobile state
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          // Desktop state
          isCollapsed ? "md:w-[5rem]" : "md:w-[17rem]"
        )}
      >
        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-3 top-12 w-6 h-6 bg-primary rounded-full items-center justify-center text-white border-2 border-sidebar shadow-lg hover:scale-110 transition-transform z-50"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Brand */}
        <div className={cn(
          "px-6 h-[3.75rem] flex items-center transition-all duration-300",
          isCollapsed ? "md:px-4 justify-center" : "gap-3.5"
        )}>
          <div className="bg-primary/90 shadow-lg shadow-primary/25 w-9 h-9 rounded-[10px] flex items-center justify-center text-[13px] font-extrabold text-white tracking-tight shrink-0">
            {brand.initials}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col gap-0.5 overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
              <span className="text-[15px] font-bold tracking-tight text-white leading-none truncate">
                {brand.name}
              </span>
              <span className="text-[10px] uppercase tracking-[0.12em] text-sidebar-foreground/40 font-semibold leading-none">
                {brand.role}
              </span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className={cn("mx-5 h-px bg-sidebar-border/60 transition-all", isCollapsed && "mx-3")} />

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto custom-scrollbar">
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
        <div className="px-3 pb-5 mt-auto">
          <div className={cn("mx-2 mb-4 h-px bg-sidebar-border/60 transition-all", isCollapsed && "mx-1")} />
          <form action={() => startTransition(async () => await signOutAction())}>
            <button 
              disabled={isPending}
              className={cn(
                "flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-[13px] hover:bg-white/[0.06] text-sidebar-foreground/50 hover:text-sidebar-foreground/80 transition-all duration-150 font-medium disabled:opacity-50",
                isCollapsed && "justify-center px-0"
              )}
            >
              {isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <LogOut size={16} />
              )}
              {!isCollapsed && <span>{isPending ? "Signing out..." : "Sign out"}</span>}
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
