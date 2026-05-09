"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAcademicCycles(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.academicCycle.findMany({
      skip,
      take: limit,
      orderBy: { year: "desc", month: "desc" },
    }),
    prisma.academicCycle.count(),
  ]);

  return { data, total, page, totalPages: Math.ceil(total / limit) };
}

export async function createAcademicCycle(data: {
  intakeName: string;
  month: number;
  year: number;
  applicationDeadline: Date;
}) {
  // Validate month
  if (data.month < 1 || data.month > 12) {
    throw new Error("Month must be between 1 and 12");
  }

  // Check for duplicates
  const existing = await prisma.academicCycle.findFirst({
    where: {
      intakeName: data.intakeName,
      month: data.month,
      year: data.year,
    },
  });

  if (existing) {
    throw new Error("Academic cycle already exists for this intake");
  }

  const cycle = await prisma.academicCycle.create({
    data: {
      intakeName: data.intakeName,
      month: data.month,
      year: data.year,
      applicationDeadline: new Date(data.applicationDeadline),
    },
  });

  revalidatePath("/admin/cycles");
  return cycle;
}

export async function updateAcademicCycle(
  cycleId: string,
  data: {
    intakeName?: string;
    month?: number;
    year?: number;
    applicationDeadline?: Date;
  }
) {
  const cycle = await prisma.academicCycle.update({
    where: { id: cycleId },
    data: {
      intakeName: data.intakeName,
      month: data.month,
      year: data.year,
      applicationDeadline: data.applicationDeadline ? new Date(data.applicationDeadline) : undefined,
    },
  });

  revalidatePath("/admin/cycles");
  return cycle;
}

export async function deleteAcademicCycle(cycleId: string) {
  await prisma.academicCycle.delete({
    where: { id: cycleId },
  });

  revalidatePath("/admin/cycles");
  return { success: true };
}
