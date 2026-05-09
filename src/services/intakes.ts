"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAcademicCycles() {
  return await prisma.academicCycle.findMany({
    orderBy: [
      { year: "desc" },
      { month: "desc" }
    ]
  });
}

export async function createAcademicCycle(data: {
  intakeName: string;
  month: number;
  year: number;
  applicationDeadline: Date;
}) {
  const result = await prisma.academicCycle.create({
    data: {
      ...data,
      applicationDeadline: new Date(data.applicationDeadline),
    }
  });
  revalidatePath("/admin/intakes");
  return result;
}

export async function deleteAcademicCycle(id: string) {
  const result = await prisma.academicCycle.delete({
    where: { id }
  });
  revalidatePath("/admin/intakes");
  return result;
}
