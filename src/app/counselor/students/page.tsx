import { getStudents } from "@/services/student";
import { StudentTable } from "@/components/modules/counselor/StudentTable";
import { StudentFormDialog } from "@/components/modules/counselor/StudentFormDialog";

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const query = (resolvedParams.q as string) || "";
  const page = parseInt((resolvedParams.page as string) || "1");

  const result = await getStudents(query, page, 10);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Student Profiles</h1>
          <p className="text-muted-foreground text-[15px]">Manage student profiles, academic records, and placements.</p>
        </div>
        <div className="flex gap-2">
        </div>
      </div>
      <StudentTable data={result.data} total={result.total} page={result.page} totalPages={result.totalPages} query={query} />
    </div>
  );
}
