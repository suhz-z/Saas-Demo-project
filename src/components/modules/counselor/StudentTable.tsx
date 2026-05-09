"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteStudent } from "@/services/student";

export function StudentTable({ data, total, page, totalPages, query }: any) {
  const router = useRouter();
  const [search, setSearch] = useState(query);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/counselor/students?q=${encodeURIComponent(search)}&page=1`);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this student profile?")) {
      await deleteStudent(id);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md">
        <Input 
          placeholder="Search by name or email..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
        <Button type="submit" variant="secondary"><Search size={16} className="mr-2"/> Search</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Education</TableHead>
            <TableHead>Grades</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">No students found</TableCell>
            </TableRow>
          ) : data.map((student: any) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.firstName} {student.lastName}</TableCell>
              <TableCell>
                 <div className="text-sm">{student.email || "No email"}</div>
                 <div className="text-xs text-gray-500">{student.phone || "No phone"}</div>
              </TableCell>
              <TableCell>{student.highestLevel.replace("_", " ")}</TableCell>
              <TableCell>GPA: {student.gradMarks || "-"} | IELTS: {student.ieltsOverall || "-"}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="ghost" size="sm" onClick={() => router.push(`/counselor/search?studentId=${student.id}`)}>
                  <Eye size={16} className="text-emerald-600" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(student.id)}>
                  <Trash2 size={16} className="text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between pt-4 border-t">
        <span className="text-sm text-gray-500">Showing {data.length} of {total} students</span>
        <div className="space-x-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => router.push(`/counselor/students?q=${query}&page=${page - 1}`)}>Previous</Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => router.push(`/counselor/students?q=${query}&page=${page + 1}`)}>Next</Button>
        </div>
      </div>
    </div>
  );
}
