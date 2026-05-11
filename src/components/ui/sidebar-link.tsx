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

  // To prevent `/admin` or `/counselor` from matching all sub-routes if we use exact matches for dashboard:
  const isDashboard = href === "/admin" || href === "/counselor";
  const finalIsActive = isDashboard ? pathname === href : isActive;

  return (
    <Link
      href={href}
      title={label}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] transition-all duration-150 group font-medium",
        finalIsActive
          ? "bg-primary/10 text-primary"
          : "hover:bg-sidebar-accent text-sidebar-foreground/70 hover:text-sidebar-foreground",
        className
      )}
    >
      <span
        className={cn(
          "transition-colors shrink-0",
          finalIsActive ? "text-primary" : "text-sidebar-foreground/50 group-hover:text-primary"
        )}
      >
        {icon}
      </span>
      {label && <span className="truncate animate-in fade-in slide-in-from-left-1 duration-300">{label}</span>}
    </Link>
  );
}
