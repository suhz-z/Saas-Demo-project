"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Trash2, FileText, AlertCircle, Loader2, Search, BookOpen } from "lucide-react";
import { removeSavedCourse } from "@/services/shortlist";
import Link from "next/link";

export function SavedCoursesClient({ courses }: { courses: any[] }) {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleDelete = async (courseId: string) => {
    if (confirm("Are you sure you want to remove this course?")) {
      try {
        await removeSavedCourse(courseId);
        window.location.reload();
      } catch (err) {
        alert("Failed to remove course");
      }
    }
  };

  const handleExportPDF = async () => {
    setExporting("pdf");
    try {
      const response = await fetch("/api/export/pdf", { method: "POST" });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `saved-courses-${new Date().getTime()}.html`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Failed to generate PDF");
      }
    } catch (err) {
      alert("Failed to generate PDF");
      console.error(err);
    } finally {
      setExporting(null);
    }
  };

  const handleExportExcel = async () => {
    setExporting("excel");
    try {
      const response = await fetch("/api/export/excel", { method: "POST" });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `saved-courses-${new Date().getTime()}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Failed to generate Excel file");
      }
    } catch (err) {
      alert("Failed to generate Excel file");
      console.error(err);
    } finally {
      setExporting(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ELIGIBLE":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{ color: "oklch(0.65 0.18 160)", background: "oklch(0.65 0.18 160 / 0.12)", border: "1px solid oklch(0.65 0.18 160 / 0.25)" }}>
            ✓ Eligible
          </span>
        );
      case "BORDERLINE":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{ color: "oklch(0.72 0.18 80)", background: "oklch(0.72 0.18 80 / 0.12)", border: "1px solid oklch(0.72 0.18 80 / 0.25)" }}>
            ⚠ Borderline
          </span>
        );
      case "NOT_ELIGIBLE":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{ color: "oklch(0.60 0.22 27)", background: "oklch(0.60 0.22 27 / 0.12)", border: "1px solid oklch(0.60 0.22 27 / 0.25)" }}>
            ✕ Not Eligible
          </span>
        );
      default:
        return null;
    }
  };

  if (courses.length === 0) {
    return (
      <div
        className="rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-4"
        style={{
          background: "linear-gradient(145deg, oklch(0.11 0.022 272 / 0.75), oklch(0.09 0.018 275 / 0.65))",
          border: "1px solid oklch(0.24 0.035 272 / 0.65)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: "oklch(0.68 0.22 290 / 0.12)", border: "1px solid oklch(0.68 0.22 290 / 0.2)", color: "oklch(0.68 0.22 290)" }}
        >
          <BookOpen size={24} />
        </div>
        <div>
          <h3 className="text-[16px] font-bold mb-1" style={{ color: "oklch(0.88 0.012 268)" }}>No Saved Courses</h3>
          <p className="text-[13px]" style={{ color: "oklch(0.45 0.03 270)" }}>
            You haven't saved any courses yet. Go to the search page to find and save matching courses.
          </p>
        </div>
        <Link
          href="/counselor/search"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold text-white transition-all"
          style={{
            background: "linear-gradient(135deg, oklch(0.65 0.22 290), oklch(0.58 0.22 260))",
            boxShadow: "0 0 20px oklch(0.68 0.22 290 / 0.3)",
          }}
        >
          <Search size={14} /> Search Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Export Buttons */}
      <div
        className="rounded-2xl p-4 flex gap-2.5"
        style={{
          background: "linear-gradient(145deg, oklch(0.11 0.022 272 / 0.75), oklch(0.09 0.018 275 / 0.65))",
          border: "1px solid oklch(0.24 0.035 272 / 0.65)",
          backdropFilter: "blur(20px)",
        }}
      >
        <Button
          onClick={handleExportPDF}
          disabled={exporting !== null || courses.length === 0}
          variant="outline"
          className="flex items-center gap-2 rounded-xl text-[13px] font-medium"
          style={{
            background: "oklch(0.09 0.018 272 / 0.6)",
            border: "1px solid oklch(0.28 0.04 272 / 0.7)",
            color: "oklch(0.75 0.02 268)",
          }}
        >
          {exporting === "pdf" ? (
            <><Loader2 className="h-4 w-4 animate-spin" />Generating PDF...</>
          ) : (
            <><FileText size={15} />Export as PDF</>
          )}
        </Button>
        <Button
          onClick={handleExportExcel}
          disabled={exporting !== null || courses.length === 0}
          variant="outline"
          className="flex items-center gap-2 rounded-xl text-[13px] font-medium"
          style={{
            background: "oklch(0.09 0.018 272 / 0.6)",
            border: "1px solid oklch(0.28 0.04 272 / 0.7)",
            color: "oklch(0.75 0.02 268)",
          }}
        >
          {exporting === "excel" ? (
            <><Loader2 className="h-4 w-4 animate-spin" />Generating Excel...</>
          ) : (
            <><Download size={15} />Export as Excel</>
          )}
        </Button>
      </div>

      {/* Courses Table */}
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{
          background: "linear-gradient(145deg, oklch(0.11 0.022 272 / 0.75), oklch(0.09 0.018 275 / 0.65))",
          border: "1px solid oklch(0.24 0.035 272 / 0.65)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 4px 24px oklch(0 0 0 / 0.25), inset 0 1px 0 oklch(1 0 0 / 0.03)",
        }}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-3 text-[11px] font-semibold uppercase tracking-wider px-4">Course Name</TableHead>
              <TableHead className="py-3 text-[11px] font-semibold uppercase tracking-wider">University</TableHead>
              <TableHead className="py-3 text-[11px] font-semibold uppercase tracking-wider">Country</TableHead>
              <TableHead className="py-3 text-[11px] font-semibold uppercase tracking-wider">Level</TableHead>
              <TableHead className="py-3 text-[11px] font-semibold uppercase tracking-wider">Duration</TableHead>
              <TableHead className="py-3 text-[11px] font-semibold uppercase tracking-wider">Fees</TableHead>
              <TableHead className="py-3 text-[11px] font-semibold uppercase tracking-wider">Match</TableHead>
              <TableHead className="py-3 text-[11px] font-semibold uppercase tracking-wider">Status</TableHead>
              <TableHead className="py-3 text-[11px] font-semibold uppercase tracking-wider text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((saved) => (
              <TableRow key={saved.id} className="group">
                <TableCell className="font-semibold py-3.5 px-4" style={{ color: "oklch(0.88 0.012 268)" }}>
                  {saved.course.name}
                </TableCell>
                <TableCell className="py-3.5" style={{ color: "oklch(0.68 0.015 268)" }}>
                  {saved.course.university.name}
                </TableCell>
                <TableCell className="py-3.5" style={{ color: "oklch(0.60 0.015 268)" }}>
                  {saved.course.university.country.name}
                </TableCell>
                <TableCell className="py-3.5" style={{ color: "oklch(0.60 0.015 268)" }}>
                  {saved.course.studyLevel.replace("_", " ")}
                </TableCell>
                <TableCell className="py-3.5" style={{ color: "oklch(0.60 0.015 268)" }}>
                  {saved.course.duration} mo
                </TableCell>
                <TableCell className="py-3.5" style={{ color: "oklch(0.60 0.015 268)" }}>
                  {saved.course.currency} {saved.course.tuitionFees.toLocaleString()}
                </TableCell>
                <TableCell className="py-3.5">
                  <span className="font-bold text-[13px]" style={{ color: "oklch(0.68 0.22 290)" }}>
                    {saved.score.toFixed(0)}%
                  </span>
                </TableCell>
                <TableCell className="py-3.5">
                  {getStatusBadge(saved.status)}
                </TableCell>
                <TableCell className="py-3.5 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(saved.courseId)}
                    className="h-8 w-8 p-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "oklch(0.60 0.22 27)" }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary Card */}
      <div
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, oklch(0.65 0.18 160 / 0.08), oklch(0.62 0.20 195 / 0.06))",
          border: "1px solid oklch(0.65 0.18 160 / 0.2)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* top glow */}
        <div
          className="absolute top-0 inset-x-0 h-[1px] pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, oklch(0.65 0.18 160 / 0.5), oklch(0.62 0.20 195 / 0.3), transparent)" }}
        />
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: "Total Saved", value: courses.length, color: "oklch(0.68 0.22 290)" },
            { label: "Eligible", value: courses.filter(c => c.status === "ELIGIBLE").length, color: "oklch(0.65 0.18 160)" },
            { label: "Borderline", value: courses.filter(c => c.status === "BORDERLINE").length, color: "oklch(0.72 0.18 80)" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: "oklch(0.45 0.03 270)" }}>
                {s.label}
              </p>
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
