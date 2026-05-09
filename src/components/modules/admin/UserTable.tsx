"use client";

import { useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteUser, updateUserStatus } from "@/services/user";

type UserRow = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "COUNSELOR";
  isActive: boolean;
  createdAt: Date | string;
};

type UserTableProps = {
  data: UserRow[];
  total: number;
  page: number;
  totalPages: number;
  query: string;
};

export function UserTable({ data, total, page, totalPages, query }: UserTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState(query);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/admin/users?q=${encodeURIComponent(search)}&page=1`);
  };

  const handleStatusChange = async (id: string, isActive: boolean) => {
    await updateUserStatus(id, isActive);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Deactivate this user account?")) {
      await deleteUser(id);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button type="submit" variant="secondary">
          <Search size={16} className="mr-2" /> Search
        </Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            data.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(user.id, !user.isActive)}
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </button>
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)}>
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between pt-4 border-t">
        <span className="text-sm text-gray-500">Showing {data.length} of {total} results</span>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => router.push(`/admin/users?q=${encodeURIComponent(query)}&page=${page - 1}`)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => router.push(`/admin/users?q=${encodeURIComponent(query)}&page=${page + 1}`)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
