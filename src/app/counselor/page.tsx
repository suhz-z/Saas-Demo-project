import { prisma } from "@/lib/prisma";
import DashboardClient from "@/components/modules/counselor/DashboardClient";

export default async function CounselorDashboard() {
  const courseCount = await prisma.course.count();

  return <DashboardClient courseCount={courseCount} />;
}


