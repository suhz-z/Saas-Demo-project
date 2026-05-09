"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trash2, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteCourse } from "@/services/course";
import { EligibilityDialog } from "./EligibilityDialog";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

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
    <div className="space-y-6 mt-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <form onSubmit={handleSearch} className="relative w-full max-w-sm group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 bg-white dark:bg-card border-border/50 focus-visible:ring-primary/20 rounded-lg text-[13px]"
          />
        </form>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border/40">
              <TableHead className="py-3 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Course Name</TableHead>
              <TableHead className="py-3 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">University</TableHead>
              <TableHead className="py-3 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Study Level</TableHead>
              <TableHead className="py-3 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Duration</TableHead>
              <TableHead className="py-3 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Fees</TableHead>
              <TableHead className="py-3 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Search size={32} className="opacity-15" />
                      <p className="text-[14px] font-medium">No courses found</p>
                      <p className="text-[12px]">Try adjusting your search terms</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : data.map((course: any, idx: number) => (
                <motion.tr
                  key={course.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="group hover:bg-muted/30 border-b border-border/30 transition-colors"
                >
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/8 flex items-center justify-center text-[11px] font-bold text-primary shrink-0">
                        <BookOpen size={14} />
                      </div>
                      <span className="text-[13px] font-semibold text-foreground flex items-center gap-1.5">
                        {course.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <span className="text-[13px] font-medium text-foreground/80">{course.university?.name}</span>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <Badge variant="secondary" className="text-[11px] font-medium">
                      {course.studyLevel.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <span className="text-[13px] font-medium text-foreground/80">{course.duration} mo</span>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <span className="text-[13px] font-medium text-foreground/80">
                      {course.currency} {course.tuitionFees.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <EligibilityDialog courseId={course.id} courseName={course.name} />
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-destructive/8 hover:text-destructive" onClick={() => handleDelete(course.id)}>
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-muted-foreground">
          {data.length} of {total} courses
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => router.push(`/admin/courses?q=${query}&page=${page - 1}`)}
            className="h-8 rounded-lg text-[12px] px-3"
          >
            Previous
          </Button>
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              variant={page === i + 1 ? "default" : "ghost"}
              size="sm"
              className={`h-8 w-8 rounded-lg text-[12px] ${page === i + 1 ? "shadow-sm" : ""}`}
              onClick={() => router.push(`/admin/courses?q=${query}&page=${i + 1}`)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => router.push(`/admin/courses?q=${query}&page=${page + 1}`)}
            className="h-8 rounded-lg text-[12px] px-3"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
