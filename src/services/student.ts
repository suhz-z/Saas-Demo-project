"use server";

import { prisma } from "@/lib/prisma";
import { StudyLevel } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getStudents(search?: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const where = search
    ? { 
        OR: [
          { firstName: { contains: search, mode: "insensitive" as const } },
          { lastName: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } }
        ]
      }
    : {};

  const [data, total] = await Promise.all([
    prisma.studentProfile.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.studentProfile.count({ where }),
  ]);

  return { data, total, page, totalPages: Math.ceil(total / limit) };
}

export async function createStudent(data: {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  highestLevel: any;
  gradMarks?: number;
  ieltsOverall?: number;
}) {
  const student = await prisma.studentProfile.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      highestLevel: data.highestLevel,
      gradMarks: data.gradMarks,
      ieltsOverall: data.ieltsOverall,
    },
  });

  revalidatePath("/counselor/students");
  return student;
}

export async function deleteStudent(id: string) {
  await prisma.studentProfile.delete({ where: { id } });
  revalidatePath("/counselor/students");
}

export async function saveCourseToStudent(studentId: string, courseId: string, score: number) {
  await prisma.savedCourse.upsert({
    where: { userId_courseId: { userId: "some-user", courseId } }, // Wait, schema uses userId but actually it should be studentProfileId. Let me check the schema.
  });
}
