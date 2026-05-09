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
          <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-card">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-[13px] font-medium text-muted-foreground">Available Courses</p>
                  <p className="text-3xl font-bold tracking-tight">{courseCount}</p>
                  <p className="text-[12px] text-emerald-600 font-medium flex items-center gap-1">
                    <TrendingUp size={12} />
                    +12% from last month
                  </p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-primary/8 flex items-center justify-center text-primary">
                  <GraduationCap size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-card">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-[13px] font-medium text-muted-foreground">Active Students</p>
                  <p className="text-3xl font-bold tracking-tight">0</p>
                  <p className="text-[12px] text-muted-foreground font-medium flex items-center gap-1">
                    No active students
                  </p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-primary/8 flex items-center justify-center text-primary">
                  <Users size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Link href="/counselor/search" className="block h-full">
            <Card className="h-full border border-primary/15 bg-primary/[0.03] hover:bg-primary/[0.06] hover:border-primary/25 transition-all duration-300 group cursor-pointer shadow-sm">
              <CardContent className="pt-6 flex flex-col justify-between h-full">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-[13px] font-medium text-muted-foreground">Course Search</p>
                    <p className="text-lg font-semibold tracking-tight text-foreground">Find matches</p>
                    <p className="text-[12px] text-primary font-medium flex items-center gap-1">
                      Open engine
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Search size={20} />
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
