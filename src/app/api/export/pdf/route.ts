import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getSavedCourses } from "@/services/shortlist";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courses = await getSavedCourses(user.userId);

    // Create HTML content for PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { color: #333; }
    .metadata { color: #666; font-size: 12px; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background-color: #10B981; color: white; font-weight: bold; }
    tr:nth-child(even) { background-color: #f9fafb; }
    .course-section { page-break-inside: avoid; margin-bottom: 30px; border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; }
    .course-name { font-size: 18px; font-weight: bold; color: #1f2937; }
    .course-detail { margin: 8px 0; color: #4b5563; }
    .label { font-weight: bold; color: #6b7280; }
    .status-eligible { background-color: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 4px; display: inline-block; }
    .status-borderline { background-color: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 4px; display: inline-block; }
    .status-not-eligible { background-color: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 4px; display: inline-block; }
  </style>
</head>
<body>
  <h1>Study Abroad Course Recommendations</h1>
  <div class="metadata">
    <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
    <p><strong>Total Courses:</strong> ${courses.length}</p>
  </div>

  <table>
    <thead>
      <tr>
        <th>Course Name</th>
        <th>University</th>
        <th>Country</th>
        <th>Study Level</th>
        <th>Duration</th>
        <th>Fees</th>
        <th>Match %</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${courses.map(saved => `
        <tr>
          <td>${saved.course.name}</td>
          <td>${saved.course.university.name}</td>
          <td>${saved.course.university.country.name}</td>
          <td>${saved.course.studyLevel.replace("_", " ")}</td>
          <td>${saved.course.duration} months</td>
          <td>${saved.course.currency} ${saved.course.tuitionFees.toLocaleString()}</td>
          <td>${saved.score.toFixed(0)}%</td>
          <td><span class="status-${saved.status.toLowerCase().replace("_", "-")}">${saved.status.replace("_", " ")}</span></td>
        </tr>
      `).join("")}
    </tbody>
  </table>

  <div>
    ${courses.map(saved => `
      <div class="course-section">
        <div class="course-name">${saved.course.name}</div>
        <div class="course-detail">
          <span class="label">University:</span> ${saved.course.university.name}, ${saved.course.university.country.name}
        </div>
        <div class="course-detail">
          <span class="label">Study Level:</span> ${saved.course.studyLevel.replace("_", " ")}
        </div>
        <div class="course-detail">
          <span class="label">Domain:</span> ${saved.course.domain?.name || "N/A"}
        </div>
        <div class="course-detail">
          <span class="label">Duration:</span> ${saved.course.duration} months
        </div>
        <div class="course-detail">
          <span class="label">Fees:</span> ${saved.course.currency} ${saved.course.tuitionFees.toLocaleString()}
        </div>
        <div class="course-detail">
          <span class="label">Intake:</span> ${saved.course.intake}
        </div>
        <div class="course-detail">
          <span class="label">Match Score:</span> ${saved.score.toFixed(0)}%
        </div>
        <div class="course-detail">
          <span class="label">Status:</span> <span class="status-${saved.status.toLowerCase().replace("_", "-")}">${saved.status.replace("_", " ")}</span>
        </div>
      </div>
    `).join("")}
  </div>
</body>
</html>
    `;

    // Convert HTML to PDF using a simple approach - return as HTML that can be printed to PDF
    return new NextResponse(htmlContent, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (err) {
    console.error("PDF export error:", err);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
