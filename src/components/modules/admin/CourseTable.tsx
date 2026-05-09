"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteCourse } from "@/services/course";
import { EligibilityDialog } from "./EligibilityDialog";

export function CourseTable({ data, total, page, totalPages, query }: any) {
  const router = useRouter();
  const [search, setSearch] = useState(query);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/admin/courses?q=${encodeURIComponent(search)}&page=1`);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      await deleteCourse(id);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md">
        <Input 
          placeholder="Search courses..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
        <Button type="submit" variant="secondary"><Search size={16} className="mr-2"/> Search</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course Name</TableHead>
            <TableHead>University</TableHead>
            <TableHead>Study Level</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Fees</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">No courses found</TableCell>
            </TableRow>
          ) : data.map((course: any) => (
            <TableRow key={course.id}>
              <TableCell className="font-medium">{course.name}</TableCell>
              <TableCell>{course.university?.name}</TableCell>
              <TableCell>{course.studyLevel.replace("_", " ")}</TableCell>
              <TableCell>{course.duration} months</TableCell>
              <TableCell>{course.currency} {course.tuitionFees.toLocaleString()}</TableCell>
              <TableCell className="text-right space-x-2">
                <EligibilityDialog courseId={course.id} courseName={course.name} />
                <Button variant="ghost" size="sm" onClick={() => handleDelete(course.id)}>
                  <Trash2 size={16} className="text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Basic Pagination */}
      <div className="flex items-center justify-between pt-4 border-t">
        <span className="text-sm text-gray-500">Showing {data.length} of {total} results</span>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page <= 1}
            onClick={() => router.push(`/admin/courses?q=${query}&page=${page - 1}`)}
          >
            Previous
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page >= totalPages}
            onClick={() => router.push(`/admin/courses?q=${query}&page=${page + 1}`)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
