import { getUsers } from "@/services/user";
import { UserTable } from "@/components/modules/admin/UserTable";
import { UserFormDialog } from "@/components/modules/admin/UserFormDialog";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const query = (resolvedParams.q as string) || "";
  const page = parseInt((resolvedParams.page as string) || "1");

  const result = await getUsers(query, page, 10);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Counselor Accounts</h1>
        <UserFormDialog />
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4">
        <UserTable data={result.data} total={result.total} page={result.page} totalPages={result.totalPages} query={query} />
      </div>
    </div>
  );
}
