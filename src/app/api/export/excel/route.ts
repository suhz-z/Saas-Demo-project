import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getSavedCourses } from "@/services/shortlist";
import { Workbook } from "exceljs";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courses = await getSavedCourses(user.userId);

    // Create Excel workbook
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Courses");

    // Add headers
    const headerRow = worksheet.addRow([
      "Course Name",
      "University",
      "Country",
      "Study Level",
      "Domain",
      "Duration (Months)",
      "Tuition Fees",
      "Currency",
      "Intake",
      "Match Score (%)",
      "Status",
    ]);

    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF10B981" },
    };

    // Add course data
    courses.forEach(saved => {
      worksheet.addRow([
        saved.course.name,
        saved.course.university.name,
        saved.course.university.country.name,
        saved.course.studyLevel.replace("_", " "),
        saved.course.domain?.name || "N/A",
        saved.course.duration,
        saved.course.tuitionFees,
        saved.course.currency,
        saved.course.intake,
        saved.score.toFixed(0),
        saved.status.replace("_", " "),
      ]);
    });

    // Adjust column widths
    worksheet.columns = [
      { width: 30 },
      { width: 25 },
      { width: 15 },
      { width: 15 },
      { width: 20 },
      { width: 15 },
      { width: 15 },
      { width: 10 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
    ];

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();

    // Return file as response
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="saved-courses-${Date.now()}.xlsx"`,
      },
    });
  } catch (err) {
    console.error("Excel export error:", err);
    return NextResponse.json({ error: "Failed to generate Excel file" }, { status: 500 });
  }
}
