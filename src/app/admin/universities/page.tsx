import { Suspense } from "react";
import { getUniversities, bulkCreateUniversities } from "@/services/university";
import { UniversityTable } from "@/components/modules/admin/UniversityTable";
import { UniversityFormDialog } from "@/components/modules/admin/UniversityFormDialog";
import { BulkUploadDialog } from "@/components/modules/admin/BulkUploadDialog";

export default async function UniversitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const query = (resolvedParams.q as string) || "";
  const page = parseInt((resolvedParams.page as string) || "1");

  const result = await getUniversities(query, page, 10);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Universities</h1>
        <div className="flex gap-2">
          <BulkUploadDialog type="Universities" onUpload={bulkCreateUniversities} />
          <UniversityFormDialog />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4">
        <UniversityTable data={result.data} total={result.total} page={result.page} totalPages={result.totalPages} query={query} />
      </div>
    </div>
  );
}
