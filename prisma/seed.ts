import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@sacdms.com';
  const counselorEmail = 'counselor@sacdms.com';
  const passwordHash = await bcrypt.hash('password123', 10);

  // Admin
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'System Admin',
      passwordHash,
      role: Role.ADMIN,
      isActive: true,
    },
  });

  // Counselor
  await prisma.user.upsert({
    where: { email: counselorEmail },
    update: {},
    create: {
      email: counselorEmail,
      name: 'Test Counselor',
      passwordHash,
      role: Role.COUNSELOR,
      isActive: true,
    },
  });

  console.log('Seeding complete! Users created:');
  console.log('- admin@sacdms.com / password123');
  console.log('- counselor@sacdms.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
