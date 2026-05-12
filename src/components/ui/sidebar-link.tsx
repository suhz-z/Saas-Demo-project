"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  className?: string;
}

export function SidebarLink({ href, icon, label, className }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  const isDashboard = href === "/admin" || href === "/counselor";
  const finalIsActive = isDashboard ? pathname === href : isActive;

  return (
    <Link
      href={href}
      title={label}
      className={cn(
        "relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-200 group font-medium overflow-hidden",
        className
      )}
      style={
        finalIsActive
          ? {
              background: "linear-gradient(135deg, oklch(0.68 0.22 290 / 0.18), oklch(0.62 0.20 195 / 0.08))",
              border: "1px solid oklch(0.68 0.22 290 / 0.25)",
              color: "oklch(0.78 0.18 290)",
              boxShadow: "0 0 16px oklch(0.68 0.22 290 / 0.1), inset 0 1px 0 oklch(1 0 0 / 0.04)",
            }
          : {
              background: "transparent",
              border: "1px solid transparent",
              color: "oklch(0.52 0.03 270)",
            }
      }
      onMouseEnter={(e) => {
        if (!finalIsActive) {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.background = "oklch(0.14 0.025 272 / 0.7)";
          el.style.color = "oklch(0.82 0.01 268)";
          el.style.borderColor = "oklch(0.26 0.04 272 / 0.6)";
        }
      }}
      onMouseLeave={(e) => {
        if (!finalIsActive) {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.background = "transparent";
          el.style.color = "oklch(0.52 0.03 270)";
          el.style.borderColor = "transparent";
        }
      }}
    >
      {/* Active left indicator */}
      {finalIsActive && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
          style={{ background: "linear-gradient(180deg, oklch(0.78 0.22 290), oklch(0.68 0.20 195))" }}
        />
      )}

      <span
        className="shrink-0 transition-all duration-200"
        style={{ color: finalIsActive ? "oklch(0.78 0.18 290)" : "inherit" }}
      >
        {icon}
      </span>

      {label && (
        <span className="truncate animate-in fade-in slide-in-from-left-1 duration-300">
          {label}
        </span>
      )}
    </Link>
  );
}
