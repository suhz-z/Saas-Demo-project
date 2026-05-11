"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";

import { unstable_cache } from "next/cache";

export const getUniversities = unstable_cache(
  async (search?: string, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const where = search
      ? { name: { contains: search, mode: "insensitive" as const } }
      : {};

    const [data, total] = await Promise.all([
      prisma.university.findMany({
        where,
        include: { country: true },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.university.count({ where }),
    ]);

    return { data, total, page, totalPages: Math.ceil(total / limit) };
  },
  ["universities-list"],
  { tags: ["universities"], revalidate: 60 } // Cache for 60 seconds and tag for revalidation
);


export async function createUniversity(data: {
  name: string;
  countryName: string;
  city: string;
  ranking?: number;
  website?: string;
  partnerStatus: boolean;
}) {
  const country = await prisma.country.upsert({
    where: { name: data.countryName },
    update: {},
    create: {
      name: data.countryName,
      code: data.countryName.substring(0, 3).toUpperCase(),
    },
  });

  const uni = await prisma.university.create({
    data: {
      name: data.name,
      city: data.city,
      ranking: data.ranking,
      website: data.website,
      partnerStatus: data.partnerStatus,
      countryId: country.id,
    },
  });

  revalidatePath("/admin/universities");
  revalidateTag("universities");
  return uni;
}

export async function deleteUniversity(id: string) {
  await prisma.university.delete({ where: { id } });
  revalidatePath("/admin/universities");
  revalidateTag("universities");
}

export async function bulkCreateUniversities(records: any[]) {
  if (!records || records.length === 0) {
    throw new Error("No records to upload");
  }

  const errors: Array<{ row: number; error: string }> = [];
  const created: Array<{ name: string; country: string }> = [];
  const skipped: Array<{ row: number; reason: string }> = [];
  const seenNames = new Set<string>();

  for (let i = 0; i < records.length; i++) {
    const data = records[i];
    const row = i + 2; // +2 because rows are 1-indexed and there's a header

    // Validate mandatory fields
    if (!data.name?.trim()) {
      errors.push({ row, error: "Missing required field: name" });
      continue;
    }
    if (!data.countryName?.trim()) {
      errors.push({ row, error: "Missing required field: countryName" });
      continue;
    }
    if (!data.city?.trim()) {
      errors.push({ row, error: "Missing required field: city" });
      continue;
    }

    // Check for duplicates within this upload
    const uniqueKey = `${data.name.trim()}_${data.countryName.trim()}`;
    if (seenNames.has(uniqueKey)) {
      skipped.push({ row, reason: `Duplicate found in this batch (${data.name})` });
      continue;
    }
    seenNames.add(uniqueKey);

    try {
      // Check for duplicates in the database
      const existing = await prisma.university.findFirst({
        where: {
          name: { equals: data.name.trim(), mode: "insensitive" },
        },
      });

      if (existing) {
        skipped.push({ row, reason: `University already exists: ${data.name}` });
        continue;
      }

      // Upsert country
      const country = await prisma.country.upsert({
        where: { name: data.countryName.trim() },
        update: {},
        create: {
          name: data.countryName.trim(),
          code: data.countryName.trim().substring(0, 3).toUpperCase(),
        },
      });

      // Create university
      await prisma.university.create({
        data: {
          name: data.name.trim(),
          city: data.city.trim(),
          ranking: data.ranking ? Number(data.ranking) : undefined,
          website: data.website?.trim() || undefined,
          partnerStatus: String(data.partnerStatus).toLowerCase() === "true",
          countryId: country.id,
        },
      });

      created.push({ name: data.name.trim(), country: data.countryName.trim() });
    } catch (err) {
      errors.push({
        row,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  revalidatePath("/admin/universities");
  revalidateTag("universities");

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
