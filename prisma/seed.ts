import { PrismaClient, Role, StudyLevel, EligibilityStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Clean the database
  console.log('Cleaning database...');
  const tablenames = [
    'SavedCourse', 'SearchHistory', 'EligibilityRule', 'Course', 
    'University', 'AcademicCycle', 'StudentProfile', 'Domain', 
    'Country', 'User'
  ];

  for (const tablename of tablenames) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tablename}" CASCADE;`);
  }

  const passwordHash = await bcrypt.hash('password123', 10);

  // 2. Create Users
  console.log('Creating users...');
  await prisma.user.create({
    data: {
      email: 'admin@sacdms.com',
      name: 'System Admin',
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const counselor = await prisma.user.create({
    data: {
      email: 'counselor@sacdms.com',
      name: 'Test Counselor',
      passwordHash,
      role: Role.COUNSELOR,
    },
  });

  const counselors = [counselor];
  for (let i = 1; i <= 10; i++) {
    const c = await prisma.user.create({
      data: {
        email: `counselor${i}@sacdms.com`,
        name: faker.person.fullName(),
        passwordHash,
        role: Role.COUNSELOR,
      },
    });
    counselors.push(c);
  }

  // 3. Create Countries
  console.log('Creating countries...');
  const countryData = [
    { name: 'United States', code: 'US' },
    { name: 'United Kingdom', code: 'UK' },
    { name: 'Canada', code: 'CA' },
    { name: 'Australia', code: 'AU' },
    { name: 'Germany', code: 'DE' },
    { name: 'Ireland', code: 'IE' },
    { name: 'New Zealand', code: 'NZ' },
    { name: 'France', code: 'FR' },
    { name: 'Singapore', code: 'SG' },
    { name: 'Netherlands', code: 'NL' },
  ];
  const countries = [];
  for (const c of countryData) {
    const country = await prisma.country.create({ data: c });
    countries.push(country);
  }

  // 4. Create Domains
  console.log('Creating domains...');
  const domainNames = [
    'Computer Science', 'Business Administration', 'Data Science', 'Mechanical Engineering',
    'Nursing', 'Psychology', 'Artificial Intelligence', 'Cyber Security', 'Finance',
    'Marketing', 'Electrical Engineering', 'Civil Engineering', 'Architecture',
    'Biotechnology', 'Public Health', 'Law', 'Environmental Science', 'Education'
  ];
  const domains = [];
  for (const name of domainNames) {
    const domain = await prisma.domain.create({ data: { name } });
    domains.push(domain);
  }

  // 5. Create Universities
  console.log('Creating universities...');
  const universities = [];
  for (let i = 0; i < 60; i++) {
    const country = faker.helpers.arrayElement(countries);
    const uni = await prisma.university.create({
      data: {
        name: `${faker.company.name()} University`,
        countryId: country.id,
        city: faker.location.city(),
        ranking: faker.number.int({ min: 1, max: 1000 }),
        website: faker.internet.url(),
        partnerStatus: faker.datatype.boolean(0.3),
      },
    });
    universities.push(uni);
  }

  // 6. Create Courses & Eligibility Rules
  console.log('Creating courses...');
  const studyLevels = [
    StudyLevel.BACHELORS, StudyLevel.MASTERS, StudyLevel.DIPLOMA,
    StudyLevel.ADVANCED_DIPLOMA, StudyLevel.PG_DIPLOMA
  ];
  const intakes = ['Fall', 'Spring', 'Summer', 'Fall/Spring', 'Rolling'];

  const courseBatch = [];
  for (let i = 0; i < 400; i++) {
    const uni = faker.helpers.arrayElement(universities);
    const domain = faker.helpers.arrayElement(domains);
    const level = faker.helpers.arrayElement(studyLevels);

    courseBatch.push({
      name: `${faker.hacker.adjective()} ${domain.name} ${level === StudyLevel.MASTERS ? 'Master' : 'Bachelor'}`,
      universityId: uni.id,
      studyLevel: level,
      domainId: domain.id,
      degreeType: level === StudyLevel.MASTERS ? 'M.Sc' : level === StudyLevel.BACHELORS ? 'B.Sc' : 'Diploma',
      duration: level === StudyLevel.MASTERS ? 12 + (faker.number.int({ min: 0, max: 2 }) * 6) : 36 + (faker.number.int({ min: 0, max: 2 }) * 12),
      tuitionFees: faker.number.float({ min: 10000, max: 60000, fractionDigits: 2 }),
      currency: uni.countryId === countries.find(c => c.code === 'US')?.id ? 'USD' : uni.countryId === countries.find(c => c.code === 'UK')?.id ? 'GBP' : 'EUR',
      intake: faker.helpers.arrayElement(intakes),
      description: faker.lorem.paragraph(),
    });
  }

  // Use createMany if the provider supports it (PostgreSQL does)
  await prisma.course.createMany({ data: courseBatch });

  console.log('Creating eligibility rules...');
  const allCourses = await prisma.course.findMany({ select: { id: true, studyLevel: true } });
  const ruleBatch = allCourses.map(course => ({
    courseId: course.id,
    min10thMarks: faker.number.float({ min: 50, max: 90, fractionDigits: 1 }),
    min12thMarks: faker.number.float({ min: 50, max: 90, fractionDigits: 1 }),
    minGradMarks: course.studyLevel === StudyLevel.MASTERS || course.studyLevel === StudyLevel.PG_DIPLOMA ? faker.number.float({ min: 2.0, max: 4.0, fractionDigits: 1 }) : null,
    minIeltsOverall: faker.helpers.arrayElement([6.0, 6.5, 7.0, 7.5]),
    minIeltsReading: 6.0,
    minIeltsWriting: 6.0,
    minIeltsSpeaking: 6.0,
    minIeltsListening: 6.0,
    minExperience: faker.datatype.boolean(0.2) ? faker.number.int({ min: 12, max: 36 }) : 0,
    maxBacklogs: faker.number.int({ min: 0, max: 10 }),
  }));

  await prisma.eligibilityRule.createMany({ data: ruleBatch });

  // 7. Academic Cycles
  console.log('Creating academic cycles...');
  const years = [2024, 2025, 2026];
  const intakeNames = ['September', 'January', 'May'];
  for (const year of years) {
    for (let j = 0; j < intakeNames.length; j++) {
      await prisma.academicCycle.create({
        data: {
          intakeName: intakeNames[j],
          year: year,
          month: j === 0 ? 9 : j === 1 ? 1 : 5,
          applicationDeadline: new Date(`${year}-${j === 0 ? '07-01' : j === 1 ? '11-01' : '03-01'}`),
        },
      });
    }
  }

  // 8. Student Profiles
  console.log('Creating student profiles...');
  for (let i = 0; i < 400; i++) {
    const counselor = faker.helpers.arrayElement(counselors);
    const level = faker.helpers.arrayElement(studyLevels);

    await prisma.studentProfile.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        highestLevel: level,
        marks10th: faker.number.float({ min: 60, max: 98, fractionDigits: 1 }),
        marks12th: faker.number.float({ min: 60, max: 98, fractionDigits: 1 }),
        marks12thEnglish: faker.number.float({ min: 60, max: 98, fractionDigits: 1 }),
        gradMarks: level === StudyLevel.BACHELORS || level === StudyLevel.MASTERS ? faker.number.float({ min: 2.5, max: 4.0, fractionDigits: 1 }) : null,
        gradDegree: level === StudyLevel.BACHELORS || level === StudyLevel.MASTERS ? faker.helpers.arrayElement(['B.Tech', 'B.Sc', 'B.Com', 'B.A']) : null,
        ieltsOverall: faker.helpers.arrayElement([6.0, 6.5, 7.0, 7.5, 8.0]),
        ieltsReading: 6.5,
        ieltsWriting: 6.0,
        ieltsSpeaking: 6.5,
        ieltsListening: 7.0,
        experienceMonths: faker.number.int({ min: 0, max: 60 }),
        backlogs: faker.number.int({ min: 0, max: 5 }),
        counselorId: counselor.id,
      },
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
