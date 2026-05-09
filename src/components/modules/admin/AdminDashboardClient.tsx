"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, BookOpen, Users, MapPin, TrendingUp, ArrowUpRight, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface AdminDashboardProps {
  universityCount: number;
  courseCount: number;
  userCount: number;
  countryCount: number;
}

export default function AdminDashboardClient({
  universityCount,
  courseCount,
  userCount,
  countryCount
}: AdminDashboardProps) {

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

  const stats = [
    { label: "Universities", value: universityCount, icon: <Building2 size={16} />, color: "text-blue-600", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Courses", value: courseCount, icon: <BookOpen size={16} />, color: "text-indigo-600", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
    { label: "Users", value: userCount, icon: <Users size={16} />, color: "text-violet-600", bg: "bg-violet-500/10", border: "border-violet-500/20" },
    { label: "Countries", value: countryCount, icon: <MapPin size={16} />, color: "text-emerald-600", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
        <p className="text-muted-foreground text-[15px]">Central command for data management and user administration.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <motion.div key={idx} variants={item}>
            <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 shrink-0 rounded-lg ${stat.bg} border ${stat.border} flex items-center justify-center ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider truncate">{stat.label}</p>
                    <p className="text-xl font-bold tracking-tight text-foreground truncate">{stat.value.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

    </motion.div>
  );
}
