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
    { label: "Universities", value: universityCount, icon: <Building2 size={20} />, color: "text-blue-600", bg: "bg-blue-500/8" },
    { label: "Courses", value: courseCount, icon: <BookOpen size={20} />, color: "text-indigo-600", bg: "bg-indigo-500/8" },
    { label: "Users", value: userCount, icon: <Users size={20} />, color: "text-violet-600", bg: "bg-violet-500/8" },
    { label: "Countries", value: countryCount, icon: <MapPin size={20} />, color: "text-emerald-600", bg: "bg-emerald-500/8" },
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
            <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-card">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-[13px] font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                  </div>
                  <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                    {stat.icon}
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
