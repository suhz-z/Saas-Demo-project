"use client";

import { Search, GraduationCap, ArrowRight, TrendingUp, Users, BookOpen } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardClient({ courseCount }: { courseCount: number }) {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  const metricCards = [
    {
      label: "Available Courses",
      value: courseCount.toLocaleString(),
      badge: "+12%",
      badgeColor: "oklch(0.65 0.18 160)",
      badgeBg: "oklch(0.65 0.18 160 / 0.12)",
      icon: <GraduationCap size={18} />,
      accent: "oklch(0.65 0.18 160)",
      accentFaded: "oklch(0.65 0.18 160 / 0.10)",
      accentBorder: "oklch(0.65 0.18 160 / 0.22)",
      description: "Across all universities",
    },
    {
      label: "Active Students",
      value: "0",
      badge: null,
      icon: <Users size={18} />,
      accent: "oklch(0.62 0.20 195)",
      accentFaded: "oklch(0.62 0.20 195 / 0.10)",
      accentBorder: "oklch(0.62 0.20 195 / 0.22)",
      description: "In your pipeline",
    },
    {
      label: "Saved Courses",
      value: "0",
      badge: null,
      icon: <BookOpen size={18} />,
      accent: "oklch(0.68 0.22 290)",
      accentFaded: "oklch(0.68 0.22 290 / 0.10)",
      accentBorder: "oklch(0.68 0.22 290 / 0.22)",
      description: "Bookmarked for review",
    },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">

      {/* Header */}
      <motion.div variants={item} className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span
            className="text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: "oklch(0.62 0.20 195 / 0.7)" }}
          >
            ◆ Counselor
          </span>
        </div>
        <h1 className="text-[2rem] font-bold tracking-tight" style={{ color: "oklch(0.92 0.012 268)" }}>
          Dashboard
        </h1>
        <p className="text-[14px]" style={{ color: "oklch(0.52 0.03 270)" }}>
          Overview of your counseling activity and student pipeline.
        </p>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metricCards.map((card, idx) => (
          <motion.div key={idx} variants={item}>
            <div
              className="relative rounded-2xl p-5 overflow-hidden group transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(145deg, oklch(0.11 0.022 272 / 0.75), oklch(0.09 0.018 275 / 0.65))",
                border: `1px solid ${card.accentBorder}`,
                backdropFilter: "blur(20px)",
                boxShadow: `0 4px 20px oklch(0 0 0 / 0.25)`,
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
                className="absolute top-0 inset-x-0 h-[1px] pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(90deg, transparent, ${card.accent}, transparent)` }}
              />

              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(ellipse at top left, ${card.accentFaded}, transparent 70%)` }}
              />

              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 relative z-10"
                style={{
                  background: card.accentFaded,
                  border: `1px solid ${card.accentBorder}`,
                  color: card.accent,
                  boxShadow: `0 0 20px ${card.accentFaded}`,
                }}
              >
                {card.icon}
              </div>

              {/* Text */}
              <div className="relative z-10">
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.18em] mb-1"
                  style={{ color: "oklch(0.45 0.03 270)" }}
                >
                  {card.label}
                </p>
                <div className="flex items-baseline gap-2 mb-0.5">
                  <p className="text-3xl font-bold tracking-tight" style={{ color: "oklch(0.92 0.012 268)" }}>
                    {card.value}
                  </p>
                  {card.badge && (
                    <span
                      className="text-[10px] font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded-full"
                      style={{ color: card.badgeColor, background: card.badgeBg }}
                    >
                      <TrendingUp size={9} />
                      {card.badge}
                    </span>
                  )}
                </div>
                <p className="text-[12px]" style={{ color: "oklch(0.40 0.03 270)" }}>
                  {card.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA — Course Search */}
      <motion.div variants={item}>
        <Link href="/counselor/search" className="block group">
          <div
            className="relative rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, oklch(0.68 0.22 290 / 0.10), oklch(0.62 0.20 195 / 0.07))",
              border: "1px solid oklch(0.68 0.22 290 / 0.25)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 4px 24px oklch(0 0 0 / 0.25), 0 0 40px oklch(0.68 0.22 290 / 0.06)",
            }}
          >
            {/* Grain */}
            <div
              className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E")`,
                backgroundSize: "128px 128px",
              }}
            />

            {/* Top glow */}
            <div
              className="absolute top-0 inset-x-0 h-[1px] pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity"
              style={{ background: "linear-gradient(90deg, transparent, oklch(0.68 0.22 290), oklch(0.62 0.20 195), transparent)" }}
            />

            {/* Hover glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-2xl"
              style={{ background: "radial-gradient(ellipse 80% 60% at 20% 50%, oklch(0.68 0.22 290 / 0.06), transparent)" }}
            />

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.65 0.22 290), oklch(0.58 0.22 260))",
                    boxShadow: "0 0 24px oklch(0.68 0.22 290 / 0.35)",
                    color: "white",
                  }}
                >
                  <Search size={20} />
                </div>
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1"
                    style={{ color: "oklch(0.68 0.22 290 / 0.6)" }}
                  >
                    Quick Action
                  </p>
                  <p
                    className="text-[17px] font-bold"
                    style={{ color: "oklch(0.90 0.012 268)" }}
                  >
                    Start Course Search
                  </p>
                  <p className="text-[13px]" style={{ color: "oklch(0.50 0.03 270)" }}>
                    Find perfect academic matches for your students
                  </p>
                </div>
              </div>
              <ArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-1.5 shrink-0"
                style={{ color: "oklch(0.68 0.22 290 / 0.6)" }}
              />
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
