import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, GraduationCap } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CounselorDashboard() {
  const courseCount = await prisma.course.count();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome, Counselor!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Available Courses</CardTitle>
            <GraduationCap className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{courseCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Ready to be matched</p>
          </CardContent>
        </Card>
        
        <Card className="bg-emerald-50 border-emerald-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-800">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/counselor/search" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium">
              <Search size={16} /> Open Intelligent Search Engine
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
