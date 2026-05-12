"use client";

import { Building2, BookOpen, Users, MapPin, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

interface AdminDashboardProps {
  universityCount: number;
  courseCount: number;
  userCount: number;
  countryCount: number;
}

const STATS = (u: number, c: number, us: number, co: number) => [
  {
    label: "Universities",
    value: u,
    icon: <Building2 size={18} />,
    accent: "oklch(0.68 0.22 290)",
    accentFaded: "oklch(0.68 0.22 290 / 0.12)",
    accentBorder: "oklch(0.68 0.22 290 / 0.25)",
    description: "Partner institutions",
    href: "/admin/universities",
  },
  {
    label: "Courses",
    value: c,
    icon: <BookOpen size={18} />,
    accent: "oklch(0.62 0.20 195)",
    accentFaded: "oklch(0.62 0.20 195 / 0.10)",
    accentBorder: "oklch(0.62 0.20 195 / 0.22)",
    description: "Available programs",
    href: "/admin/courses",
  },
  {
    label: "Users",
    value: us,
    icon: <Users size={18} />,
    accent: "oklch(0.58 0.20 255)",
    accentFaded: "oklch(0.58 0.20 255 / 0.11)",
    accentBorder: "oklch(0.58 0.20 255 / 0.23)",
    description: "Active accounts",
    href: "/admin/users",
  },
  {
    label: "Countries",
    value: co,
    icon: <MapPin size={18} />,
    accent: "oklch(0.65 0.18 160)",
    accentFaded: "oklch(0.65 0.18 160 / 0.10)",
    accentBorder: "oklch(0.65 0.18 160 / 0.22)",
    description: "Global coverage",
    href: "/admin",
  },
];

export default function AdminDashboardClient({
  universityCount,
  courseCount,
  userCount,
  countryCount,
}: AdminDashboardProps) {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  const stats = STATS(universityCount, courseCount, userCount, countryCount);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">

      {/* Page Header */}
      <motion.div variants={item} className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span
            className="text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: "oklch(0.68 0.22 290 / 0.7)" }}
          >
            ◆ System
          </span>
        </div>
        <h1 className="text-[2rem] font-bold tracking-tight" style={{ color: "oklch(0.92 0.012 268)" }}>
          System Overview
        </h1>
        <p className="text-[14px]" style={{ color: "oklch(0.52 0.03 270)" }}>
          Central command for data management and user administration.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div key={idx} variants={item}>
            <div
              className="relative rounded-2xl p-5 overflow-hidden group cursor-default transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: `linear-gradient(145deg, oklch(0.11 0.022 272 / 0.75), oklch(0.09 0.018 275 / 0.65))`,
                border: `1px solid ${stat.accentBorder}`,
                backdropFilter: "blur(20px)",
                boxShadow: `0 4px 20px oklch(0 0 0 / 0.25), 0 0 0 1px ${stat.accentFaded}`,
              }}
            >
              {/* Grain */}
              <div
                className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E")`,
                  backgroundSize: "128px 128px",
                }}
              />

              {/* Top glow line */}
              <div
                className="absolute top-0 inset-x-0 h-[1px] pointer-events-none transition-opacity duration-300 opacity-70 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(90deg, transparent, ${stat.accent}, transparent)`,
                }}
              />

              {/* Hover bg glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(ellipse at top left, ${stat.accentFaded}, transparent 70%)` }}
              />

              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 relative z-10"
                style={{
                  background: stat.accentFaded,
                  border: `1px solid ${stat.accentBorder}`,
                  color: stat.accent,
                  boxShadow: `0 0 20px ${stat.accentFaded}`,
                }}
              >
                {stat.icon}
              </div>

              {/* Content */}
              <div className="relative z-10">
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.18em] mb-1"
                  style={{ color: "oklch(0.45 0.03 270)" }}
                >
                  {stat.label}
                </p>
                <p
                  className="text-3xl font-bold tracking-tight mb-1"
                  style={{ color: "oklch(0.92 0.012 268)" }}
                >
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-[12px]" style={{ color: "oklch(0.40 0.03 270)" }}>
                  {stat.description}
                </p>
              </div>

              {/* Arrow icon */}
              <ArrowUpRight
                size={14}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-60 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                style={{ color: stat.accent }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick actions row */}
      <motion.div variants={item}>
        <div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: "oklch(0.09 0.018 272 / 0.6)",
            border: "1px solid oklch(0.22 0.03 272 / 0.6)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div
            className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E")`,
              backgroundSize: "128px 128px",
            }}
          />
          <p
            className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4"
            style={{ color: "oklch(0.45 0.03 270)" }}
          >
            Quick overview
          </p>
          <div className="flex items-center gap-8">
            {[
              { label: "Data entries indexed", value: (universityCount + courseCount).toLocaleString() },
              { label: "Platform health", value: "Optimal" },
              { label: "Last sync", value: "Just now" },
            ].map((q) => (
              <div key={q.label}>
                <p
                  className="text-[18px] font-bold"
                  style={{ color: "oklch(0.88 0.012 268)" }}
                >
                  {q.value}
                </p>
                <p className="text-[11px]" style={{ color: "oklch(0.40 0.03 270)" }}>{q.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
