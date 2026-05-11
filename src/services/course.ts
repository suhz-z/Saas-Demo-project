"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { unstable_cache } from "next/cache";

export const getCourses = unstable_cache(
  async (search?: string, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const where = search
      ? { name: { contains: search, mode: "insensitive" as const } }
      : {};

    const [data, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: { university: true, domain: true },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.course.count({ where }),
    ]);

    return { data, total, page, totalPages: Math.ceil(total / limit) };
  },
  ["courses-list"],
  { tags: ["courses"], revalidate: 60 }
);

export async function createCourse(data: {
  name: string;
  universityId: string;
  studyLevel: any;
  domainName: string;
  degreeType: string;
  duration: number;
  tuitionFees: number;
  currency: string;
  intake: string;
  description?: string;
}) {
  const domain = await prisma.domain.upsert({
    where: { name: data.domainName },
    update: {},
    create: { name: data.domainName },
  });

  const course = await prisma.course.create({
    data: {
      name: data.name,
      studyLevel: data.studyLevel,
      degreeType: data.degreeType,
      duration: data.duration,
      tuitionFees: data.tuitionFees,
      currency: data.currency,
      intake: data.intake,
      description: data.description,
      universityId: data.universityId,
      domainId: domain.id,
    },
  });

  revalidatePath("/admin/courses");
  revalidateTag("courses", "max");
  return course;
}

export async function deleteCourse(id: string) {
  await prisma.course.delete({ where: { id } });
  revalidatePath("/admin/courses");
  revalidateTag("courses", "max");
}

export const getUniversityOptions = unstable_cache(
  async () => {
    return await prisma.university.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" }
    });
  },
  ["university-options"],
  { tags: ["universities"], revalidate: 3600 }
);

export async function bulkCreateCourses(records: any[]) {
  if (!records || records.length === 0) {
    throw new Error("No records to upload");
  }

  const errors: Array<{ row: number; error: string }> = [];
  const created: Array<{ name: string; university: string }> = [];
  const skipped: Array<{ row: number; reason: string }> = [];
  const seenCourses = new Set<string>();

  // Get all universities to validate universityId
  const universities = await prisma.university.findMany({
    select: { id: true, name: true },
  });
  const universityMap = new Map(universities.map((u) => [u.id, u.name]));

  for (let i = 0; i < records.length; i++) {
    const data = records[i];
    const row = i + 2; // +2 because rows are 1-indexed and there's a header

    // Validate mandatory fields
    if (!data.name?.trim()) {
      errors.push({ row, error: "Missing required field: name" });
      continue;
    }
    if (!data.universityId?.trim()) {
      errors.push({ row, error: "Missing required field: universityId" });
      continue;
    }
    if (!data.studyLevel?.trim()) {
      errors.push({ row, error: "Missing required field: studyLevel" });
      continue;
    }
    if (!data.domainName?.trim()) {
      errors.push({ row, error: "Missing required field: domainName" });
      continue;
    }
    if (!data.tuitionFees) {
      errors.push({ row, error: "Missing required field: tuitionFees" });
      continue;
    }

    // Validate universityId exists
    if (!universityMap.has(data.universityId.trim())) {
      errors.push({
        row,
        error: `University ID not found: ${data.universityId}`,
      });
      continue;
    }

    // Check for duplicates within this upload
    const uniqueKey = `${data.name.trim()}_${data.universityId.trim()}`;
    if (seenCourses.has(uniqueKey)) {
      skipped.push({
        row,
        reason: `Duplicate found in this batch (${data.name})`,
      });
      continue;
    }
    seenCourses.add(uniqueKey);

    try {
      // Check for duplicates in the database
      const existing = await prisma.course.findFirst({
        where: {
          name: { equals: data.name.trim(), mode: "insensitive" },
          universityId: data.universityId.trim(),
        },
      });

      if (existing) {
        skipped.push({
          row,
          reason: `Course already exists: ${data.name}`,
        });
        continue;
      }

      // Upsert domain
      const domain = await prisma.domain.upsert({
        where: { name: data.domainName.trim() },
        update: {},
        create: { name: data.domainName.trim() },
      });

      // Create course
      await prisma.course.create({
        data: {
          name: data.name.trim(),
          studyLevel: data.studyLevel.trim(),
          degreeType: data.degreeType?.trim() || "Unknown",
          duration: data.duration ? Number(data.duration) : 12,
          tuitionFees: Number(data.tuitionFees),
          currency: data.currency?.trim() || "USD",
          intake: data.intake?.trim() || "Fall",
          description: data.description?.trim() || undefined,
          universityId: data.universityId.trim(),
          domainId: domain.id,
        },
      });

      created.push({
        name: data.name.trim(),
        university: universityMap.get(data.universityId.trim()) || "Unknown",
      });
    } catch (err) {
      errors.push({
        row,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  revalidatePath("/admin/courses");
  revalidateTag("courses", "max");

  return {
    success: errors.length === 0,
    created: created.length,
    skipped: skipped.length,
    errors,
    skippedRecords: skipped,
    message: `Processed ${records.length} records: ${created.length} created, ${skipped.length} skipped${
      errors.length > 0 ? `, ${errors.length} errors` : ""
    }`,
  };
}
