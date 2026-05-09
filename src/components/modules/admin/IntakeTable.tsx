"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, CalendarDays, Clock } from "lucide-react";
import { deleteAcademicCycle } from "@/services/intakes";
import { IntakeFormDialog } from "./IntakeFormDialog";
import { AcademicCycle } from "@prisma/client";
// using native Intl instead of date-fns

export function IntakeTable({ intakes }: { intakes: AcademicCycle[] }) {
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this intake?")) {
      try {
        await deleteAcademicCycle(id);
      } catch (err) {
        console.error(err);
        alert("Failed to delete intake.");
      }
    }
  };

  const getStatus = (deadline: Date) => {
    const now = new Date();
    if (deadline < now) {
      return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded-full"><Clock size={10} /> Closed</span>;
    }
    const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 30) {
      return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full"><Clock size={10} /> Closing Soon</span>;
    }
    return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full"><Clock size={10} /> Open</span>;
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Academic Cycles</h1>
          <p className="text-muted-foreground text-[15px]">Manage standardized application intakes and deadlines.</p>
        </div>
        <IntakeFormDialog />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border/40">
              <TableHead className="py-3 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider w-[250px]">Intake</TableHead>
              <TableHead className="py-3 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Start Date</TableHead>
              <TableHead className="py-3 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Application Deadline</TableHead>
              <TableHead className="py-3 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Status</TableHead>
              <TableHead className="py-3 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {intakes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No academic cycles found. Add your first intake.
                </TableCell>
              </TableRow>
            ) : (
              intakes.map((intake) => (
                <TableRow key={intake.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors group">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/8 flex items-center justify-center text-primary shrink-0">
                        <CalendarDays size={14} />
                      </div>
                      <span className="text-[13px] font-semibold text-foreground">
                        {intake.intakeName} {intake.year}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-[13px] text-muted-foreground font-medium">
                    {new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date(intake.year, intake.month - 1))}
                  </TableCell>
                  <TableCell className="py-3 text-[13px] text-muted-foreground font-medium">
                    {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(intake.applicationDeadline))}
                  </TableCell>
                  <TableCell className="py-3">
                    {getStatus(new Date(intake.applicationDeadline))}
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(intake.id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
