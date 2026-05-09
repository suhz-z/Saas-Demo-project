"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/hash";
import { revalidatePath } from "next/cache";

export async function getUsers(search?: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const where = search
    ? { email: { contains: search, mode: "insensitive" as const } }
    : {};

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  return { data, total, page, totalPages: Math.ceil(total / limit) };
}

export async function createUser(data: {
  email: string;
  name: string;
  password: string;
  role: "ADMIN" | "COUNSELOR";
}) {
  // Check if user already exists
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    throw new Error("User with this email already exists");
  }

  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      passwordHash,
      role: data.role,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  revalidatePath("/admin/users");
  return user;
}

export async function updateUserStatus(userId: string, isActive: boolean) {
  await prisma.user.update({
    where: { id: userId },
    data: { isActive },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(userId: string) {
  // Don't allow deletion, just deactivate
  await prisma.user.update({
    where: { id: userId },
    data: { isActive: false },
  });

  revalidatePath("/admin/users");
  return { success: true };
}
