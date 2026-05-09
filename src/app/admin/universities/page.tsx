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
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Universities</h1>
          <p className="text-muted-foreground text-[15px]">Manage partner institutions and their details.</p>
        </div>
      <UniversityTable data={result.data} total={result.total} page={result.page} totalPages={result.totalPages} query={query}>
        <BulkUploadDialog type="Universities" onUpload={bulkCreateUniversities} />
        <UniversityFormDialog />
      </UniversityTable>
    </div>
  );
}
