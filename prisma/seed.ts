import { PrismaClient, Role, StudyLevel, EligibilityStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@sacdms.com';
  const counselorEmail = 'counselor@sacdms.com';
  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Users
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

  const counselor = await prisma.user.upsert({
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

  // 2. Countries
  const countries = [
    { name: 'United States', code: 'US' },
    { name: 'United Kingdom', code: 'UK' },
    { name: 'Canada', code: 'CA' },
    { name: 'Australia', code: 'AU' },
  ];

  for (const c of countries) {
    await prisma.country.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
  }

  // 3. Domains
  const domains = ['Computer Science', 'Business Administration', 'Data Science', 'Mechanical Engineering', 'Nursing'];
  for (const d of domains) {
    await prisma.domain.upsert({
      where: { name: d },
      update: {},
      create: { name: d },
    });
  }

  const us = await prisma.country.findUnique({ where: { code: 'US' } });
  const uk = await prisma.country.findUnique({ where: { code: 'UK' } });
  const ca = await prisma.country.findUnique({ where: { code: 'CA' } });

  const csDomain = await prisma.domain.findUnique({ where: { name: 'Computer Science' } });
  const businessDomain = await prisma.domain.findUnique({ where: { name: 'Business Administration' } });

  // 4. Universities
  if (us && uk && ca) {
    const unisToCreate = [
      {
        name: 'Harvard University',
        countryId: us.id,
        city: 'Cambridge',
        ranking: 1,
        website: 'https://harvard.edu',
        partnerStatus: true,
      },
      {
        name: 'Massachusetts Institute of Technology',
        countryId: us.id,
        city: 'Cambridge',
        ranking: 2,
        website: 'https://mit.edu',
        partnerStatus: false,
      },
      {
        name: 'University of Oxford',
        countryId: uk.id,
        city: 'Oxford',
        ranking: 3,
        website: 'https://ox.ac.uk',
        partnerStatus: true,
      },
      {
        name: 'University of Toronto',
        countryId: ca.id,
        city: 'Toronto',
        ranking: 21,
        website: 'https://utoronto.ca',
        partnerStatus: true,
      }
    ];

    for (const u of unisToCreate) {
      const exists = await prisma.university.findFirst({ where: { name: u.name } });
      if (!exists) {
        await prisma.university.create({ data: u });
      }
    }
  }

  // 5. Courses
  const harvard = await prisma.university.findFirst({ where: { name: 'Harvard University' } });
  const oxford = await prisma.university.findFirst({ where: { name: 'University of Oxford' } });
  
  if (harvard && oxford && csDomain && businessDomain) {
    const coursesToCreate = [
      {
        name: 'B.Sc Computer Science',
        universityId: harvard.id,
        studyLevel: StudyLevel.BACHELORS,
        domainId: csDomain.id,
        degreeType: 'Bachelor of Science',
        duration: 48,
        tuitionFees: 54000,
        currency: 'USD',
        intake: 'Fall',
      },
      {
        name: 'MBA Business Administration',
        universityId: harvard.id,
        studyLevel: StudyLevel.MASTERS,
        domainId: businessDomain.id,
        degreeType: 'Master of Business Administration',
        duration: 24,
        tuitionFees: 73000,
        currency: 'USD',
        intake: 'Fall/Spring',
      },
      {
        name: 'M.Sc Data Science',
        universityId: oxford.id,
        studyLevel: StudyLevel.MASTERS,
        domainId: csDomain.id,
        degreeType: 'Master of Science',
        duration: 12,
        tuitionFees: 32000,
        currency: 'GBP',
        intake: 'Fall',
      }
    ];

    for (const c of coursesToCreate) {
      const exists = await prisma.course.findFirst({ where: { name: c.name, universityId: c.universityId } });
      if (!exists) {
        await prisma.course.create({ data: c });
      }
    }
  }

  // 6. Students
  const studentsToCreate = [
    {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice.smith@example.com',
      phone: '+1 555-0100',
      highestLevel: StudyLevel.BACHELORS,
      gradMarks: 3.8,
      ieltsOverall: 7.5,
      counselorId: counselor.id
    },
    {
      firstName: 'Bob',
      lastName: 'Jones',
      email: 'bob.jones@example.com',
      phone: '+44 7700 900000',
      highestLevel: StudyLevel.DIPLOMA,
      marks12th: 85.5,
      ieltsOverall: 6.5,
      counselorId: counselor.id
    },
    {
      firstName: 'Charlie',
      lastName: 'Brown',
      email: 'charlie.b@example.com',
      phone: '+61 400 000 000',
      highestLevel: StudyLevel.MASTERS,
      gradMarks: 3.2,
      ieltsOverall: 7.0,
      counselorId: counselor.id
    }
  ];

  for (const s of studentsToCreate) {
    const exists = await prisma.studentProfile.findFirst({ where: { email: s.email } });
    if (!exists) {
      await prisma.studentProfile.create({ data: s });
    }
  }

  console.log('Seeding complete! Data generated.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
