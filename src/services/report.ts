"use server";

import { Document, Packer, Paragraph, Table as DocTable, TableRow, TableCell, WidthType, TextRun } from "docx";
import { Workbook } from "exceljs";

export async function generatePDFReport(courses: any[]) {
  try {
    const sections = courses.map((saved) => [
      new Paragraph({
        children: [
          new TextRun({
            text: saved.course.name,
            bold: true,
            size: 28,
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `${saved.course.university.name} - ${saved.course.university.country.name}`,
            italics: true,
            size: 20,
          }),
        ],
        spacing: { after: 100 },
      }),
      new DocTable({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Study Level")] }),
              new TableCell({ children: [new Paragraph(saved.course.studyLevel.replace("_", " "))] }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Duration")] }),
              new TableCell({ children: [new Paragraph(`${saved.course.duration} months`)] }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Fees")] }),
              new TableCell({
                children: [new Paragraph(`${saved.course.currency} ${saved.course.tuitionFees.toLocaleString()}`)],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Intake")] }),
              new TableCell({ children: [new Paragraph(saved.course.intake)] }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Domain")] }),
              new TableCell({ children: [new Paragraph(saved.course.domain?.name || "N/A")] }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Match Score")] }),
              new TableCell({ children: [new Paragraph(`${saved.score.toFixed(0)}%`)] }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Status")] }),
              new TableCell({ children: [new Paragraph(saved.status.replace("_", " "))] }),
            ],
          }),
        ],
      }),
      new Paragraph({ text: "\n\n" }),
    ]);

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Study Abroad Course Recommendations",
                  bold: true,
                  size: 32,
                }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Generated on: ${new Date().toLocaleDateString()}`,
                  size: 20,
                }),
              ],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Total Courses: ${courses.length}`,
                  size: 20,
                }),
              ],
              spacing: { after: 300 },
            }),
            ...sections.flat(),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    const filename = `saved-courses-${Date.now()}.docx`;

    return { success: true, buffer, filename };
  } catch (err) {
    console.error("PDF generation error:", err);
    throw err;
  }
}

export async function generateExcelReport(courses: any[]) {
  try {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Courses");

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
      "Description",
    ]);

    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF10B981" },
    };

    courses.forEach((saved) => {
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
        saved.course.description || "",
      ]);
    });

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
      { width: 30 },
    ];

    const buffer = await workbook.xlsx.writeBuffer();
    const filename = `saved-courses-${Date.now()}.xlsx`;

    return { success: true, buffer, filename };
  } catch (err) {
    console.error("Excel generation error:", err);
    throw err;
  }
}
