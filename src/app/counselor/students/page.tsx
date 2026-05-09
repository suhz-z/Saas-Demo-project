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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Student Profiles</h1>
        <StudentFormDialog />
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4">
        <StudentTable data={result.data} total={result.total} page={result.page} totalPages={result.totalPages} query={query} />
      </div>
    </div>
  );
}
