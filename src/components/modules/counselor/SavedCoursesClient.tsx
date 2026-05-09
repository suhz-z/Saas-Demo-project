"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Trash2, FileText, AlertCircle, Loader2 } from "lucide-react";
import { removeSavedCourse } from "@/services/shortlist";

export function SavedCoursesClient({ courses }: { courses: any[] }) {
  const [loading, setLoading] = useState(false);
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
      const response = await fetch("/api/export/pdf", {
        method: "POST",
      });
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
      const response = await fetch("/api/export/excel", {
        method: "POST",
      });
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
        return <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-bold">Eligible ✅</span>;
      case "BORDERLINE":
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">Borderline ⚠️</span>;
      case "NOT_ELIGIBLE":
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">Not Eligible ❌</span>;
      default:
        return null;
    }
  };

  if (courses.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Saved Courses</h3>
          <p className="text-gray-500 text-center">You haven't saved any courses yet. Go to the search page to find and save matching courses.</p>
          <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">
            <a href="/counselor/search">Search Courses</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Export Buttons */}
      <Card>
        <CardContent className="p-4 flex gap-2">
          <Button
            onClick={handleExportPDF}
            disabled={exporting !== null || courses.length === 0}
            className="flex items-center gap-2"
            variant="outline"
          >
            {exporting === "pdf" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <FileText size={16} />
                Export as PDF
              </>
            )}
          </Button>
          <Button
            onClick={handleExportExcel}
            disabled={exporting !== null || courses.length === 0}
            className="flex items-center gap-2"
            variant="outline"
          >
            {exporting === "excel" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating Excel...
              </>
            ) : (
              <>
                <Download size={16} />
                Export as Excel
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Courses Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Name</TableHead>
                <TableHead>University</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Study Level</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Fees</TableHead>
                <TableHead>Match Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((saved) => (
                <TableRow key={saved.id}>
                  <TableCell className="font-medium">{saved.course.name}</TableCell>
                  <TableCell>{saved.course.university.name}</TableCell>
                  <TableCell>{saved.course.university.country.name}</TableCell>
                  <TableCell>{saved.course.studyLevel.replace("_", " ")}</TableCell>
                  <TableCell>{saved.course.duration} months</TableCell>
                  <TableCell>{saved.course.currency} {saved.course.tuitionFees.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className="font-semibold text-emerald-600">{saved.score.toFixed(0)}%</span>
                  </TableCell>
                  <TableCell>{getStatusBadge(saved.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(saved.courseId)}
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="bg-emerald-50 border-emerald-200">
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Saved</p>
              <p className="text-2xl font-bold text-emerald-700">{courses.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Eligible</p>
              <p className="text-2xl font-bold text-emerald-700">
                {courses.filter(c => c.status === "ELIGIBLE").length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Borderline</p>
              <p className="text-2xl font-bold text-yellow-600">
                {courses.filter(c => c.status === "BORDERLINE").length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
