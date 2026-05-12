"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trash2, Eye, UserPlus, Mail, Phone, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteStudent } from "@/services/student";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { StudentFormDialog } from "./StudentFormDialog";
import { Pagination } from "@/components/shared/Pagination";

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
    <div className="space-y-6">


      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <form onSubmit={handleSearch} className="relative w-full max-w-sm group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 rounded-xl text-[13px] text-white/70 placeholder:text-white/25 border-[oklch(0.26_0.04_272_/_0.6)] bg-[oklch(0.09_0.018_272_/_0.7)] focus-visible:border-[oklch(0.68_0.22_290_/_0.45)] focus-visible:ring-[oklch(0.68_0.22_290_/_0.12)] focus-visible:ring-3"
          />
        </form>
        <StudentFormDialog />
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden relative" style={{ background: "linear-gradient(145deg, oklch(0.11 0.022 272 / 0.75), oklch(0.09 0.018 275 / 0.65))", border: "1px solid oklch(0.24 0.035 272 / 0.65)", backdropFilter: "blur(20px)", boxShadow: "0 4px 24px oklch(0 0 0 / 0.25), inset 0 1px 0 oklch(1 0 0 / 0.03)" }}>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border/40">
              <TableHead className="py-3 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Student</TableHead>
              <TableHead className="py-3 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Contact</TableHead>
              <TableHead className="py-3 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Education</TableHead>
              <TableHead className="py-3 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Scores</TableHead>
              <TableHead className="py-3 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Search size={32} className="opacity-15" />
                      <p className="text-[14px] font-medium">No students found</p>
                      <p className="text-[12px]">Try adjusting your search terms</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : data.map((student: any, idx: number) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="group hover:bg-muted/30 border-b border-border/30 transition-colors"
                >
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/8 flex items-center justify-center text-[11px] font-bold text-primary shrink-0">
                        {student.firstName[0]}{student.lastName[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-semibold text-foreground">{student.firstName} {student.lastName}</span>
                        <span className="text-[11px] text-muted-foreground/60 font-mono">{student.id.slice(-6)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[12px] text-muted-foreground flex items-center gap-1.5">
                        <Mail size={11} className="text-muted-foreground/50" />
                        {student.email || "—"}
                      </span>
                      <span className="text-[12px] text-muted-foreground flex items-center gap-1.5">
                        <Phone size={11} className="text-muted-foreground/50" />
                        {student.phone || "—"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <span className="text-[13px] font-medium text-foreground/80">{student.highestLevel.replace("_", " ")}</span>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[11px] font-semibold">
                        GPA {student.gradMarks || "—"}
                      </Badge>
                      <Badge variant="secondary" className="text-[11px] font-semibold">
                        IELTS {student.ieltsOverall || "—"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/8 hover:text-primary" onClick={() => router.push(`/counselor/search?studentId=${student.id}`)}>
                        <Eye size={15} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-destructive/8 hover:text-destructive" onClick={() => handleDelete(student.id)}>
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

      <div className="flex items-center justify-between">
        <span className="text-[13px] text-muted-foreground">
          {data.length} of {total} students
        </span>
        <Pagination page={page} totalPages={totalPages} baseUrl="/counselor/students" />
      </div>
    </div>
  );
}
