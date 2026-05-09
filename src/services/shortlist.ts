"use server";

import { prisma } from "@/lib/prisma";
import { EligibilityStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function saveCourse(
  userId: string,
  courseId: string,
  matchScore: number
) {
  // Determine status based on match score
  let status: EligibilityStatus;
  if (matchScore === 100) {
    status = "ELIGIBLE";
  } else if (matchScore >= 70) {
    status = "BORDERLINE";
  } else {
    status = "NOT_ELIGIBLE";
  }

  // Upsert the saved course
  await prisma.savedCourse.upsert({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    update: {
      status,
      score: matchScore,
    },
    create: {
      userId,
      courseId,
      status,
      score: matchScore,
    },
  });

  revalidatePath("/counselor/search");
  return { success: true, status };
}

export async function removeSavedCourse(courseId: string) {
  // Get the current user's ID from the session
  const { getCurrentUser } = await import("@/lib/auth");
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("Unauthorized");
  }

  await prisma.savedCourse.delete({
    where: {
      userId_courseId: {
        userId: user.userId,
        courseId,
      },
    },
  });

  revalidatePath("/counselor/search");
  revalidatePath("/counselor/saved-courses");
  return { success: true };
}

export async function getSavedCourses(userId: string) {
  return await prisma.savedCourse.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          university: {
            include: { country: true },
          },
          domain: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
