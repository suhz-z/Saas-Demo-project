import { getCourses, getUniversityOptions, bulkCreateCourses } from "@/services/course";
import { CourseTable } from "@/components/modules/admin/CourseTable";
import { CourseFormDialog } from "@/components/modules/admin/CourseFormDialog";
import { BulkUploadDialog } from "@/components/modules/admin/BulkUploadDialog";

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const query = (resolvedParams.q as string) || "";
  const page = parseInt((resolvedParams.page as string) || "1");

  const [result, universities] = await Promise.all([
    getCourses(query, page, 10),
    getUniversityOptions(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground text-[15px]">Manage course listings, fees, and eligibility criteria.</p>
        </div>
        <div className="flex gap-2">
          <BulkUploadDialog type="Courses" onUpload={bulkCreateCourses} />
          <CourseFormDialog universities={universities} />
        </div>
      </div>
      <CourseTable data={result.data} total={result.total} page={result.page} totalPages={result.totalPages} query={query} />
    </div>
  );
}
