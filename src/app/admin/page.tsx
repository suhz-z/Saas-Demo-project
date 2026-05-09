import { prisma } from "@/lib/prisma";
import AdminDashboardClient from "@/components/modules/admin/AdminDashboardClient";

export default async function AdminDashboard() {
  const [universityCount, courseCount, userCount, countryCount] = await Promise.all([
    prisma.university.count(),
    prisma.course.count(),
    prisma.user.count(),
    prisma.country.count(),
  ]);

  return (
    <AdminDashboardClient
      universityCount={universityCount}
      courseCount={courseCount}
      userCount={userCount}
      countryCount={countryCount}
    />
  );
}

