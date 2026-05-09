"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, GraduationCap, ArrowRight, TrendingUp, Users, BookOpen, Clock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardClient({ courseCount }: { courseCount: number }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-[15px]">Overview of your counseling activity and student pipeline.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <motion.div variants={item}>
          <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                  <GraduationCap size={16} />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider truncate">Available Courses</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-xl font-bold tracking-tight text-foreground truncate">{courseCount.toLocaleString()}</p>
                    <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5">
                      <TrendingUp size={10} /> +12%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600">
                  <Users size={16} />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider truncate">Active Students</p>
                  <p className="text-xl font-bold tracking-tight text-foreground truncate">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Link href="/counselor/search" className="block h-full">
            <Card className="h-full border border-primary/20 bg-primary/[0.02] hover:bg-primary/[0.04] transition-colors group cursor-pointer shadow-sm">
              <CardContent className="p-4 flex h-full">
                <div className="flex items-center gap-4 w-full">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Search size={16} />
                  </div>
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider truncate">Course Search</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold tracking-tight text-foreground truncate">Find matches</p>
                      <ArrowRight size={14} className="text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </div>

    </motion.div>
  );
}
