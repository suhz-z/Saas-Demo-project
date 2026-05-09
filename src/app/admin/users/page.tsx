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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">System Users</h1>
          <p className="text-muted-foreground text-[15px]">Manage counselor accounts and administrative access.</p>
        </div>
        <div className="flex gap-2">
          <UserFormDialog />
        </div>
      </div>
      <UserTable data={result.data} total={result.total} page={result.page} totalPages={result.totalPages} query={query} />
    </div>
  );
}
