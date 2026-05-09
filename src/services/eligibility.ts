"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getEligibilityRule(courseId: string) {
  return await prisma.eligibilityRule.findFirst({
    where: { courseId },
  });
}

export async function saveEligibilityRule(courseId: string, data: any) {
  const existing = await prisma.eligibilityRule.findFirst({
    where: { courseId },
  });

  if (existing) {
    await prisma.eligibilityRule.update({
      where: { id: existing.id },
      data,
    });
  } else {
    await prisma.eligibilityRule.create({
      data: {
        ...data,
        courseId,
      },
    });
  }
  
  revalidatePath("/admin/courses");
  return { success: true };
}
